import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import PageWrapper from '@/components/layout/PageWrapper'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { promotionSchema, type PromotionFormData } from '@/utils/validators'
import { createPromotion, getPromotion, updatePromotion } from '@/services/promotions'
import { uploadImage } from '@/services/storage'
import imageCompression from 'browser-image-compression'
import { categoriesForForm } from '@/constants/categories'
import { formatCEP, cleanCEP } from '@/utils/formatters'
import { searchByCEP, geocodeAddress, reverseGeocode, getCurrentLocation } from '@/services/geolocation'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Capitaliza a primeira letra de cada palavra */
function capitalize(value: string): string {
  return value.replace(/(^|\s)\S/g, (char) => char.toUpperCase())
}

// ─── Toast simples ───────────────────────────────────────────────────────────

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-success text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium z-50 animate-bounce">
      ✅ {message}
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function CreatePromotion() {
  const { id } = useParams<{ id?: string }>()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [loadingPromotion, setLoadingPromotion] = useState(isEditMode)
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PromotionFormData>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: '',
      price: 0,
      store: '',
      category: '',
      address: '',
      city: '',
      state: '',
      cep: '',
    },
  })

  const cepValue = watch('cep', '')
  const categoryValue = watch('category', '')

  // ─── Buscar endereço quando CEP mudar ──────────────────────────────────────

  useEffect(() => {
    if (!cepValue || cepValue.length < 8) return

    async function fetchAddressByCEP() {
      try {
        setGeoError(null)
        const geo = await searchByCEP(cepValue || '')
        setValue('address', geo.address || '')
        setValue('city', geo.city || '')
        setValue('state', geo.state || '')
        
        // Geocodificar para obter coordenadas
        try {
          const coords = await geocodeAddress(geo.address, geo.city, geo.state)
          setCoordinates(coords)
        } catch {
          // Silencioso se não conseguir geocodificar
        }
      } catch (err) {
        setGeoError(err instanceof Error ? err.message : 'Erro ao buscar CEP')
      }
    }

    const timer = setTimeout(fetchAddressByCEP, 500) // Debounce de 500ms
    return () => clearTimeout(timer)
  }, [cepValue, setValue])

  // ─── Carregar dados no modo edição ────────────────────────────────────────

  useEffect(() => {
    if (!isEditMode || !id) return
    async function load() {
      try {
        const promotion = await getPromotion(id!)
        reset({
          title: promotion.title,
          price: promotion.price ?? undefined,
          store: promotion.store,
          category: promotion.category,
          address: promotion.address || '',
          city: promotion.city || '',
          state: promotion.state || '',
          cep: promotion.cep || '',
          expiresAt: promotion.expires_at ? promotion.expires_at.split('T')[0] : '',
        })
        if (promotion.latitude && promotion.longitude) {
          setCoordinates({ latitude: promotion.latitude, longitude: promotion.longitude })
        }
        if (promotion.image_url) {
          setExistingImageUrl(promotion.image_url)
          setImagePreview(promotion.image_url)
        }
      } catch {
        setSubmitError('Erro ao carregar promoção para edição')
      } finally {
        setLoadingPromotion(false)
      }
    }
    load()
  }, [id, isEditMode, reset])

  // ─── Seleção de imagem ────────────────────────────────────────────────────

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setSubmitError('Formato inválido. Use JPEG, PNG ou WebP')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('Imagem muito grande. Máximo 5MB')
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setSubmitError(null)
  }

  // ─── Geolocalização ───────────────────────────────────────────────────────

  async function handleUseLocation() {
    setGeoLoading(true)
    setGeoError(null)

    try {
      const coords = await getCurrentLocation()
      setCoordinates(coords)
      const geo = await reverseGeocode(coords.latitude, coords.longitude)
      setValue('address', geo.address)
      setValue('city', geo.city)
      setValue('state', geo.state.slice(0, 2))
      setValue('cep', geo.cep)
    } catch (err) {
      setGeoError(err instanceof Error ? err.message : 'Erro ao obter localização')
    } finally {
      setGeoLoading(false)
    }
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  async function onSubmit(data: PromotionFormData) {
    try {
      setSubmitError(null)
      let imageUrl = existingImageUrl || undefined

      // Upload da imagem se houver arquivo novo
      if (imageFile) {
        setUploadingImage(true)
        try {
          // Comprimir imagem antes do upload
          const compressed = await imageCompression(imageFile, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1200,
            useWebWorker: true,
          })
          imageUrl = await uploadImage(compressed)
        } catch {
          setSubmitError('Erro ao fazer upload da imagem. Tente novamente.')
          setUploadingImage(false)
          return
        }
        setUploadingImage(false)
      }

      const payload = {
        title: data.title,
        price: data.price ? Number(data.price) : null,
        store: data.store,
        category: data.category,
        image_url: imageUrl,
        address: data.address || undefined,
        city: data.city || undefined,
        state: data.state || undefined,
        cep: data.cep ? cleanCEP(data.cep) : undefined,
        latitude: coordinates?.latitude || undefined,
        longitude: coordinates?.longitude || undefined,
        expires_at: data.expiresAt || null,
      }

      if (isEditMode && id) {
        await updatePromotion(id, payload)
        setToast('Promoção atualizada com sucesso!')
      } else {
        await createPromotion(payload)
        setToast('Promoção criada com sucesso!')
      }

      setTimeout(() => navigate('/'), 1500)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Erro ao salvar promoção. Tente novamente.',
      )
    }
  }

  // ─── Loading do modo edição ───────────────────────────────────────────────

  if (loadingPromotion) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center py-20 text-muted">
          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-3" />
          Carregando promoção...
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-muted hover:text-foreground transition-colors text-xl sm:text-2xl flex-shrink-0"
          aria-label="Voltar"
        >
          ←
        </button>
        <h1 className="text-foreground font-bold text-lg sm:text-xl">
          {isEditMode ? 'Editar promoção' : 'Nova promoção'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
        {/* Erro global */}
        {submitError && (
          <div className="bg-danger/10 border border-danger/30 text-danger rounded-lg p-3 text-sm" role="alert">
            {submitError}
          </div>
        )}

        {/* ── Upload de imagem ── */}
        <Card className="p-4">
          <h2 className="text-foreground font-semibold text-sm mb-3">Imagem da promoção</h2>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative cursor-pointer rounded-xl overflow-hidden border-2 border-dashed border-border hover:border-primary transition-colors w-full aspect-[4/3] sm:aspect-[16/9] max-h-[250px] sm:max-h-[300px]"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted gap-2">
                <span className="text-4xl">📷</span>
                <p className="text-sm">Clique para selecionar uma imagem</p>
                <p className="text-xs">JPEG, PNG ou WebP — máx. 5MB</p>
              </div>
            )}

            {uploadingImage && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Selecionar imagem"
          />

          {imagePreview && (
            <button
              type="button"
              onClick={() => {
                setImageFile(null)
                setImagePreview(null)
                setExistingImageUrl(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
              }}
              className="mt-2 text-xs text-danger hover:text-red-400 transition-colors"
            >
              Remover imagem
            </button>
          )}
        </Card>

        {/* ── Informações básicas ── */}
        <Card className="p-4 flex flex-col gap-4">
          <h2 className="text-foreground font-semibold text-sm">Informações da promoção</h2>

          <Input
            label="Título da promoção"
            placeholder="Ex: Pizza grande por R$ 29,90"
            error={errors.title?.message}
            {...register('title')}
            onChange={(v) => setValue('title', capitalize(v))}
          />

          {/* Preço */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Preço (R$)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">R$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                className={[
                  'w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-foreground',
                  'bg-surface border transition-colors',
                  'placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background',
                  errors.price ? 'border-danger' : 'border-border hover:border-slate-400',
                ].join(' ')}
                {...register('price', { valueAsNumber: true })}
              />
            </div>
            {errors.price && (
              <p className="text-xs text-danger">{errors.price.message}</p>
            )}
          </div>

          <Input
            label="Nome do estabelecimento"
            placeholder="Ex: Pizzaria do João"
            error={errors.store?.message}
            {...register('store')}
            onChange={(v) => setValue('store', capitalize(v))}
          />

          {/* Categoria */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Categoria</label>
            <select
              value={categoryValue}
              onChange={(e) => setValue('category', e.target.value, { shouldValidate: true })}
              className={[
                'w-full px-3 py-2.5 rounded-lg text-sm text-foreground',
                'bg-surface border transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background',
                errors.category ? 'border-danger' : 'border-border hover:border-slate-400',
              ].join(' ')}
            >
              <option value="" disabled>Selecione uma categoria</option>
              {categoriesForForm.map((cat) => (
                <option key={cat.name} value={cat.name}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-danger">{errors.category.message}</p>
            )}
          </div>
        </Card>

        {/* ── Localização ── */}
        <Card className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground font-semibold text-sm">📍 Localização</h2>
            <Button
              type="button"
              title={geoLoading ? 'Obtendo...' : 'Usar minha localização'}
              variant="secondary"
              loading={geoLoading}
              onClick={handleUseLocation}
              className="text-xs py-1.5 px-3"
            />
          </div>

          {geoError && (
            <p className="text-xs text-danger">{geoError}</p>
          )}

          <Input
            label="Endereço"
            placeholder="Rua, número"
            error={errors.address?.message}
            {...register('address')}
            onChange={(v) => setValue('address', capitalize(v))}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Cidade"
              placeholder="São Paulo"
              error={errors.city?.message}
              {...register('city')}
              onChange={(v) => setValue('city', v)}
            />
            <Input
              label="Estado (UF)"
              placeholder="SP"
              maxLength={2}
              error={errors.state?.message}
              {...register('state')}
              onChange={(v) => setValue('state', v.toUpperCase().slice(0, 2))}
            />
          </div>

          <Input
            label="CEP"
            placeholder="00000-000"
            value={cepValue ? formatCEP(cepValue) : ''}
            onChange={(v) => setValue('cep', cleanCEP(v))}
            error={errors.cep?.message}
            inputMode="numeric"
            maxLength={9}
          />

          {/* Validade */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">Validade da promoção</label>
            <input
              type="date"
              {...register('expiresAt')}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-foreground bg-surface border border-border transition-colors placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:ring-offset-background"
            />
            <p className="text-[10px] text-muted">Opcional — deixe vazio se não tem data de expiração</p>
          </div>
        </Card>

        {/* ── Botão salvar ── */}
        <Button
          type="submit"
          title={isEditMode ? 'Salvar alterações' : 'Publicar promoção'}
          loading={isSubmitting || uploadingImage}
          className="w-full"
        />
      </form>
    </PageWrapper>
  )
}
