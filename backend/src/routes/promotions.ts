import { Router, Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../services/supabase'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

// ─── GET /api/promotions/map ─────────────────────────────────────────────────
// Deve vir ANTES de /:id para não ser capturado como id

router.get('/map', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('promotions')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ promotions: data })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/promotions ─────────────────────────────────────────────────────

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, city } = req.query

    let query = supabaseAdmin
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })

    if (category && category !== 'Todos') {
      query = query.ilike('category', String(category))
    }

    if (city) {
      query = query.ilike('city', `%${String(city)}%`)
    }

    const { data, error } = await query

    if (error) throw error

    res.json({ promotions: data })
  } catch (err) {
    next(err)
  }
})

// ─── GET /api/promotions/:id ─────────────────────────────────────────────────

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseAdmin
      .from('promotions')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      res.status(404).json({ error: 'Promoção não encontrada', code: 'PROMOTION_NOT_FOUND' })
      return
    }

    res.json({ promotion: data })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/promotions ────────────────────────────────────────────────────

router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar se é establishment
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.user!.id)
      .single()

    if (!profile || profile.role !== 'establishment') {
      res.status(403).json({ error: 'Apenas estabelecimentos podem criar promoções', code: 'FORBIDDEN' })
      return
    }

    const {
      title, price, store, category,
      image_url, image_urls,
      address, city, state, cep,
      latitude, longitude,
    } = req.body

    if (!title || !store || !category) {
      res.status(400).json({ error: 'Campos obrigatórios: title, store, category', code: 'MISSING_FIELDS' })
      return
    }

    const { data, error } = await supabaseAdmin
      .from('promotions')
      .insert({
        title,
        price: price || null,
        store,
        category,
        image_url: image_url || null,
        image_urls: image_urls || null,
        address: address || null,
        city: city || null,
        state: state || null,
        cep: cep || null,
        latitude: latitude || null,
        longitude: longitude || null,
        user_id: req.user!.id,
      })
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ promotion: data })
  } catch (err) {
    next(err)
  }
})

// ─── PUT /api/promotions/:id ─────────────────────────────────────────────────

router.put('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Verificar se é dono
    const { data: existing } = await supabaseAdmin
      .from('promotions')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing) {
      res.status(404).json({ error: 'Promoção não encontrada', code: 'PROMOTION_NOT_FOUND' })
      return
    }

    if (existing.user_id !== req.user!.id) {
      res.status(403).json({ error: 'Sem permissão para editar esta promoção', code: 'FORBIDDEN' })
      return
    }

    const {
      title, price, store, category,
      image_url, image_urls,
      address, city, state, cep,
      latitude, longitude,
    } = req.body

    const { data, error } = await supabaseAdmin
      .from('promotions')
      .update({
        ...(title !== undefined && { title }),
        ...(price !== undefined && { price }),
        ...(store !== undefined && { store }),
        ...(category !== undefined && { category }),
        ...(image_url !== undefined && { image_url }),
        ...(image_urls !== undefined && { image_urls }),
        ...(address !== undefined && { address }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(cep !== undefined && { cep }),
        ...(latitude !== undefined && { latitude }),
        ...(longitude !== undefined && { longitude }),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ promotion: data })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/promotions/:id ──────────────────────────────────────────────

router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params

    // Verificar se é dono
    const { data: existing } = await supabaseAdmin
      .from('promotions')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existing) {
      res.status(404).json({ error: 'Promoção não encontrada', code: 'PROMOTION_NOT_FOUND' })
      return
    }

    if (existing.user_id !== req.user!.id) {
      res.status(403).json({ error: 'Sem permissão para deletar esta promoção', code: 'FORBIDDEN' })
      return
    }

    const { error } = await supabaseAdmin
      .from('promotions')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default router
