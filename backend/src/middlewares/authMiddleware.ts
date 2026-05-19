import { Request, Response, NextFunction } from 'express'
import { supabase } from '../services/supabase'

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token de autenticação não fornecido' })
    return
  }

  const token = authHeader.split(' ')[1]

  const { data, error } = await supabase.auth.getUser(token)

  if (error || !data.user) {
    res.status(401).json({ error: 'Token inválido ou expirado' })
    return
  }

  req.user = {
    id: data.user.id,
    email: data.user.email,
  }

  next()
}
