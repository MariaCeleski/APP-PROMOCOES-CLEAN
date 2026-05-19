-- ============================================================
-- App Promoções — Storage bucket e políticas
-- Execute no SQL Editor do Supabase APÓS criar o bucket
-- manualmente em Storage > New Bucket > "promotions" (public)
-- ============================================================

-- ─── Políticas do bucket "promotions" ────────────────────────────────────────

-- Leitura pública — qualquer pessoa pode ver as imagens
CREATE POLICY "storage_promotions_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'promotions');

-- Upload apenas para usuários autenticados
CREATE POLICY "storage_promotions_insert_auth"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'promotions'
    AND auth.uid() IS NOT NULL
  );

-- Atualização apenas pelo próprio uploader
-- O path deve começar com o userId do usuário autenticado
CREATE POLICY "storage_promotions_update_owner"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'promotions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Deleção apenas pelo próprio uploader
CREATE POLICY "storage_promotions_delete_owner"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'promotions'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
