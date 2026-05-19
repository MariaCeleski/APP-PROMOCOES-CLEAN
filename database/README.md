# Database — App Promoções

## Como configurar o Supabase

### 1. Criar o projeto no Supabase
Acesse [supabase.com](https://supabase.com), crie um novo projeto e anote:
- `Project URL`
- `anon public key`
- `service_role key` (Settings > API)

### 2. Executar o schema
No **SQL Editor** do Supabase, execute o conteúdo de `schema.sql`.  
Isso cria as tabelas, índices e políticas RLS.

### 3. Criar o bucket de storage
1. Vá em **Storage > New Bucket**
2. Nome: `promotions`
3. Marque **Public bucket** ✅
4. Clique em **Create bucket**

### 4. Aplicar políticas de storage
No **SQL Editor**, execute o conteúdo de `storage.sql`.

### 5. Configurar variáveis de ambiente

**Backend** (`backend/.env`):
```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
PORT=3333
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3333
```

---

## Estrutura das tabelas

### `profiles`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | FK para `auth.users` |
| name | TEXT | Nome completo |
| email | TEXT | Email único |
| cpf | TEXT | CPF (só dígitos) |
| role | TEXT | `user` ou `establishment` |
| created_at | TIMESTAMPTZ | Data de criação |

### `promotions`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | PK gerado automaticamente |
| title | TEXT | Título da promoção |
| price | NUMERIC(10,2) | Preço (> 0) |
| store | TEXT | Nome do estabelecimento |
| category | TEXT | Categoria |
| image_url | TEXT | URL da imagem principal |
| image_urls | TEXT[] | URLs de imagens adicionais |
| address | TEXT | Endereço |
| city | TEXT | Cidade |
| state | CHAR(2) | UF |
| cep | TEXT | CEP (só dígitos) |
| latitude | DOUBLE PRECISION | Coordenada |
| longitude | DOUBLE PRECISION | Coordenada |
| user_id | UUID | FK para `profiles` |
| created_at | TIMESTAMPTZ | Data de criação |

### `favorites`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| user_id | UUID | FK para `profiles` |
| promotion_id | UUID | FK para `promotions` |
| created_at | TIMESTAMPTZ | Data de criação |

---

## Políticas RLS

| Tabela | Operação | Regra |
|--------|----------|-------|
| profiles | SELECT | Público |
| profiles | INSERT/UPDATE | Apenas o próprio usuário |
| promotions | SELECT | Público |
| promotions | INSERT | Apenas `role = 'establishment'` |
| promotions | UPDATE/DELETE | Apenas o dono (`user_id = auth.uid()`) |
| favorites | SELECT/INSERT/DELETE | Apenas o próprio usuário |
| storage/promotions | SELECT | Público |
| storage/promotions | INSERT | Autenticado |
| storage/promotions | UPDATE/DELETE | Apenas o uploader (path começa com userId) |
