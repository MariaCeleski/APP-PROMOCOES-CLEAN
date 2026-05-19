import { Router, Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { supabaseAdmin } from '../services/supabase'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

// ─── Multer config — memória ─────────────────────────────────────────────────

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('INVALID_MIME_TYPE'))
    }
  },
})

// ─── Middleware para tratar erros do Multer ──────────────────────────────────

function handleMulterError(
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Arquivo muito grande. Máximo 5MB', code: 'FILE_TOO_LARGE' })
      return
    }
    res.status(400).json({ error: err.message, code: err.code })
    return
  }

  if (err instanceof Error && err.message === 'INVALID_MIME_TYPE') {
    res.status(400).json({
      error: 'Formato inválido. Use JPEG, PNG ou WebP',
      code: 'INVALID_MIME_TYPE',
    })
    return
  }

  next(err)
}

// ─── POST /api/upload/image ──────────────────────────────────────────────────

router.post(
  '/image',
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('image')(req, res, (err) => handleMulterError(err, req, res, next))
  },
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Nenhum arquivo enviado', code: 'NO_FILE' })
        return
      }

      const userId = req.user!.id
      const timestamp = Date.now()
      const sanitizedFilename = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${userId}/${timestamp}-${sanitizedFilename}`

      const { error } = await supabaseAdmin.storage
        .from('promotions')
        .upload(path, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false,
        })

      if (error) {
        console.error('[Upload] Supabase storage error:', error.message)
        res.status(500).json({ error: 'Erro ao fazer upload da imagem', code: 'UPLOAD_ERROR' })
        return
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from('promotions')
        .getPublicUrl(path)

      res.status(201).json({ url: publicUrlData.publicUrl, path })
    } catch (err) {
      next(err)
    }
  },
)

// ─── DELETE /api/upload/image ────────────────────────────────────────────────

router.delete(
  '/image',
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path } = req.body

      if (!path) {
        res.status(400).json({ error: 'Informe o path do arquivo', code: 'MISSING_PATH' })
        return
      }

      const userId = req.user!.id

      // Verificar se o path pertence ao usuário autenticado
      // O path deve começar com o userId
      if (!path.startsWith(`${userId}/`)) {
        res.status(403).json({
          error: 'Sem permissão para deletar este arquivo',
          code: 'FORBIDDEN',
        })
        return
      }

      const { error } = await supabaseAdmin.storage
        .from('promotions')
        .remove([path])

      if (error) {
        console.error('[Upload] Delete error:', error.message)
        res.status(500).json({ error: 'Erro ao deletar imagem', code: 'DELETE_ERROR' })
        return
      }

      res.status(204).send()
    } catch (err) {
      next(err)
    }
  },
)

export default router
