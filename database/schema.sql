-- ============================================================
-- App Promoções — Schema SQL completo para Supabase
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================================

-- ─── Extensões ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Tabela: profiles ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL UNIQUE,
  cpf        TEXT        NOT NULL UNIQUE,
  role       TEXT        NOT NULL DEFAULT 'user'
               CHECK (role IN ('user', 'establishment')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  profiles       IS 'Perfis de usuários do app';
COMMENT ON COLUMN profiles.role  IS 'user = consumidor | establishment = lojista';
COMMENT ON COLUMN profiles.cpf   IS 'Apenas dígitos, sem formatação';

-- ─── Tabela: promotions ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS promotions (
  id         UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT           NOT NULL,
  price      NUMERIC(10,2),
  store      TEXT           NOT NULL,
  category   TEXT           NOT NULL,
  image_url  TEXT,
  image_urls TEXT[],
  address    TEXT,
  city       TEXT,
  state      CHAR(2),
  cep        TEXT,
  latitude   DOUBLE PRECISION,
  longitude  DOUBLE PRECISION,
  expires_at TIMESTAMPTZ,
  user_id    UUID           NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  promotions           IS 'Promoções cadastradas pelos estabelecimentos';
COMMENT ON COLUMN promotions.image_url IS 'URL da imagem principal';
COMMENT ON COLUMN promotions.image_urls IS 'URLs de imagens adicionais';
COMMENT ON COLUMN promotions.cep       IS 'Apenas dígitos, sem formatação';

-- ─── Tabela: favorites ───────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS favorites (
  user_id      UUID        NOT NULL REFERENCES profiles(id)   ON DELETE CASCADE,
  promotion_id UUID        NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, promotion_id)
);

COMMENT ON TABLE favorites IS 'Promoções favoritadas por usuários';

-- ─── Índices ─────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_promotions_category
  ON promotions(category);

CREATE INDEX IF NOT EXISTS idx_promotions_city
  ON promotions(city);

CREATE INDEX IF NOT EXISTS idx_promotions_user_id
  ON promotions(user_id);

CREATE INDEX IF NOT EXISTS idx_promotions_location
  ON promotions(latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_promotions_created_at
  ON promotions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id
  ON favorites(user_id);

-- ─── Row Level Security (RLS) ────────────────────────────────────────────────

ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites  ENABLE ROW LEVEL SECURITY;

-- ── profiles ──────────────────────────────────────────────────────────────────

-- Qualquer pessoa pode ver perfis (necessário para exibir nome da loja)
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (true);

-- Usuário só pode inserir o próprio perfil
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Usuário só pode atualizar o próprio perfil
CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── promotions ────────────────────────────────────────────────────────────────

-- Qualquer pessoa pode ver promoções
CREATE POLICY "promotions_select_public"
  ON promotions FOR SELECT
  USING (true);

-- Apenas establishments podem criar promoções
CREATE POLICY "promotions_insert_establishment"
  ON promotions FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND (
      SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'establishment'
  );

-- Apenas o dono pode editar
CREATE POLICY "promotions_update_owner"
  ON promotions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Apenas o dono pode deletar
CREATE POLICY "promotions_delete_owner"
  ON promotions FOR DELETE
  USING (auth.uid() = user_id);

-- ── favorites ─────────────────────────────────────────────────────────────────

-- Usuário só vê os próprios favoritos
CREATE POLICY "favorites_select_own"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Usuário só pode favoritar para si mesmo
CREATE POLICY "favorites_insert_own"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Usuário só pode desfavoritar os próprios
CREATE POLICY "favorites_delete_own"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ─── Trigger: criar perfil automaticamente após signup ───────────────────────
-- Opcional: use se quiser criar o perfil via trigger em vez do backend

-- CREATE OR REPLACE FUNCTION handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO profiles (id, name, email, cpf, role)
--   VALUES (
--     NEW.id,
--     COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
--     NEW.email,
--     COALESCE(NEW.raw_user_meta_data->>'cpf', ''),
--     COALESCE(NEW.raw_user_meta_data->>'role', 'user')
--   );
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE OR REPLACE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();
