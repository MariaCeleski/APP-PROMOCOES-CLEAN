import { Router, Request, Response, NextFunction } from 'express'
import { supabaseAdmin } from '../services/supabase'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

// Todas as rotas de favoritos requerem autenticação
router.use(authMiddleware)

// ─── GET /api/favorites ──────────────────────────────────────────────────────

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('favorites')
      .select('promotion_id')
      .eq('user_id', req.user!.id)

    if (error) throw error

    const promotionIds = data.map((f) => f.promotion_id)

    res.json({ favoriteIds: promotionIds })
  } catch (err) {
    next(err)
  }
})

// ─── POST /api/favorites/:promotionId ────────────────────────────────────────

router.post('/:promotionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { promotionId } = req.params

    // Verificar se promoção existe
    const { data: promotion } = await supabaseAdmin
      .from('promotions')
      .select('id')
      .eq('id', promotionId)
      .single()

    if (!promotion) {
      res.status(404).json({ error: 'Promoção não encontrada', code: 'PROMOTION_NOT_FOUND' })
      return
    }

    const { error } = await supabaseAdmin
      .from('favorites')
      .insert({ user_id: req.user!.id, promotion_id: promotionId })

    if (error) {
      // Ignorar erro de duplicata (já favoritado)
      if (error.code === '23505') {
        res.status(200).json({ message: 'Já está nos favoritos' })
        return
      }
      throw error
    }

    res.status(201).json({ message: 'Adicionado aos favoritos' })
  } catch (err) {
    next(err)
  }
})

// ─── DELETE /api/favorites/:promotionId ──────────────────────────────────────

router.delete('/:promotionId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { promotionId } = req.params

    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', req.user!.id)
      .eq('promotion_id', promotionId)

    if (error) throw error

    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

export default router
