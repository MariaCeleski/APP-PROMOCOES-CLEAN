-- ============================================================
-- App Promoções — Dados de exemplo para desenvolvimento
-- Execute APÓS o schema.sql
-- ATENÇÃO: requer um usuário criado via Supabase Auth
-- Substitua o UUID abaixo pelo ID real do seu usuário de teste
-- ============================================================

-- Exemplo de inserção direta (substitua o user_id pelo UUID real):
--
-- INSERT INTO profiles (id, name, email, cpf, role) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'Loja Teste', 'loja@teste.com', '12345678901', 'establishment'),
--   ('00000000-0000-0000-0000-000000000002', 'João Silva', 'joao@teste.com', '98765432100', 'user');
--
-- INSERT INTO promotions (title, price, store, category, image_url, city, state, user_id) VALUES
--   ('Pizza Grande por R$ 29,90', 29.90, 'Pizzaria do João', 'Pizza', NULL, 'São Paulo', 'SP', '00000000-0000-0000-0000-000000000001'),
--   ('Hambúrguer Artesanal', 24.90, 'Burger House', 'Hambúrguer', NULL, 'São Paulo', 'SP', '00000000-0000-0000-0000-000000000001'),
--   ('Sushi Combo 20 peças', 49.90, 'Sushi Express', 'Sushi', NULL, 'Rio de Janeiro', 'RJ', '00000000-0000-0000-0000-000000000001'),
--   ('Frango Grelhado + Acompanhamentos', 19.90, 'Frango & Cia', 'Frango', NULL, 'Belo Horizonte', 'MG', '00000000-0000-0000-0000-000000000001'),
--   ('Cesta de Hortifruti Orgânico', 35.00, 'Feira Verde', 'Hortifruti', NULL, 'Curitiba', 'PR', '00000000-0000-0000-0000-000000000001');

SELECT 'Seed file pronto. Descomente e ajuste os UUIDs para inserir dados de exemplo.' AS info;
