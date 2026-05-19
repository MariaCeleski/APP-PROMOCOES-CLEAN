# Prompts de Reconstrução — App Promoções

Prompts com React + Vite + TypeScript (frontend) e Node (backend)

---

## Prompt 1 — Setup e estrutura do projeto

Crie a estrutura inicial de um projeto fullstack com:

### FRONTEND:
- React 18 + Vite + TypeScript
- React Router DOM v6 para navegação
- Tailwind CSS para estilização
- React Hook Form + Zod para formulários e validação
- Axios para chamadas HTTP

**Estrutura de pastas:**
```
src/
  components/
    ui/       → Button, Input, Card, Skeleton
    layout/   → Header, Footer, PageWrapper
    features/ → PromotionCard, StoriesBar, CategoryFilter, HeroBanner, MapView
  pages/      → Home, Login, Register, PromotionDetail, CreatePromotion, Map
  services/   → api.ts, auth.ts, promotions.ts, favorites.ts, storage.ts
  contexts/   → AuthContext.tsx
  hooks/      → useAuth.ts, usePromotions.ts, useFavorites.ts
  types/      → auth.ts, promotion.ts
  utils/      → validators.ts, formatters.ts
  constants/  → categories.ts
```

### BACKEND:
- Node.js + Express + TypeScript

**Estrutura de pastas:**
```
src/
  routes/      → auth.ts, promotions.ts, favorites.ts, upload.ts
  controllers/
  middlewares/ → authMiddleware.ts, errorHandler.ts
  services/
  types/
```

- Supabase como banco de dados (PostgreSQL via @supabase/supabase-js)
- Multer para upload de imagens
- dotenv para variáveis de ambiente

Gere o `package.json` de ambos, `tsconfig.json`, `vite.config.ts`, `tailwind.config.ts` e a estrutura de pastas vazia com arquivos `index.ts` de barril.

---

## Prompt 2 — Modelos de dados e tipos TypeScript

Crie os tipos TypeScript compartilhados entre frontend e backend para o sistema de promoções locais:

### `types/auth.ts`:
- `UserRole`: `'user' | 'establishment'`
- `UserProfile`: `{ id, name, email, cpf, role, created_at }`
- `AuthContextType` com `user, profile, role, loading, isEstablishment, signOut`

### `types/promotion.ts`:
- `Promotion`: `{ id, title, price, store, category, image_url, image_urls, user_id, created_at, address, city, state, cep, latitude, longitude }`

### `constants/categories.ts`:
Array de 20 categorias com `name` e `icon` emoji:

| Categoria | Ícone |
|-----------|-------|
| Todos | 🔥 |
| Pizza | 🍕 |
| Hambúrguer | 🍔 |
| Carnes | 🥩 |
| Frango | 🍗 |
| Frutos do Mar | 🦐 |
| Sushi | 🍣 |
| Hortifruti | 🥦 |
| Padaria | 🥖 |
| Supermercado | 🛒 |
| Farmácia | 💊 |
| Restaurante | 🍽️ |
| Lanchonete | 🥪 |
| Sorveteria | 🍦 |
| Cafeteria | ☕ |
| Bebidas | 🍺 |
| Eletrônicos | 📱 |
| Loja | 🛍️ |
| Conveniência | 🏪 |
| Outros | 📦 |

Exportar também `categoriesForForm` (sem "Todos").

### `utils/validators.ts` com Zod:
- `loginSchema`: campo `"identifier"` (email válido OU CPF com 11 dígitos), `password` mínimo 8 chars
- `registerSchema`: `name` (min 3), `email`, `cpf` (com validação de dígitos verificadores), `password` (min 8, maiúscula, número, especial), `confirmPassword` com `refine` de igualdade
- `promotionSchema`: `title`, `price` (number positivo), `store`, `category` (enum das categorias), `address`, `city`, `state` (2 chars), `cep` (8 dígitos)

---

## Prompt 3 — Backend: autenticação e rotas de promoções

Implemente o backend Node + Express + TypeScript com Supabase:

### 1. Configuração do Supabase (`src/services/supabase.ts`):
- `createClient` com `SUPABASE_URL` e `SUPABASE_ANON_KEY` do `.env`
- Exportar `supabaseAdmin` com `SERVICE_ROLE_KEY` para operações privilegiadas

### 2. Middleware de autenticação (`src/middlewares/authMiddleware.ts`):
- Extrair Bearer token do header `Authorization`
- Verificar com `supabase.auth.getUser(token)`
- Anexar `user` ao `req` e chamar `next()`, ou retornar 401

### 3. Rotas de autenticação (`POST /api/auth/login`, `POST /api/auth/register`):
- **Login**: aceitar email OU CPF — se CPF, buscar email na tabela `profiles`, depois `signInWithPassword`
- **Register**: `signUp` no Supabase Auth + `insert` na tabela `profiles` com `{ id, name, email, cpf, role }`
- Tratar erros: `USER_NOT_FOUND`, `WRONG_PASSWORD`, `EMAIL_ALREADY_EXISTS`, `CPF_NOT_FOUND`, `EMAIL_NOT_CONFIRMED`, `TOO_MANY_REQUESTS`
- Retornar `{ user, session, profile }` no sucesso

### 4. Rotas de promoções (`src/routes/promotions.ts`):
- `GET /api/promotions` — listar todas, ordenadas por `created_at desc`
- `GET /api/promotions?category=Pizza` — filtrar por categoria (`ilike`)
- `GET /api/promotions?city=SaoPaulo` — filtrar por cidade
- `GET /api/promotions/map` — apenas promoções com `latitude` e `longitude` não nulos
- `GET /api/promotions/:id` — buscar por id
- `POST /api/promotions` — criar (requer auth + `role === 'establishment'`)
- `PUT /api/promotions/:id` — editar (requer auth + ser dono)
- `DELETE /api/promotions/:id` — deletar (requer auth + ser dono)

### 5. Rotas de favoritos (`src/routes/favorites.ts`):
- `GET /api/favorites` — listar `promotion_ids` favoritados pelo usuário autenticado
- `POST /api/favorites/:promotionId` — adicionar favorito
- `DELETE /api/favorites/:promotionId` — remover favorito

### 6. Middleware de erro global (`src/middlewares/errorHandler.ts`):
- Capturar erros, logar e retornar `{ error: message }` com status adequado

---

## Prompt 4 — Backend: upload de imagens

Implemente o endpoint de upload de imagens no backend Node + Express:

### `POST /api/upload/image` (requer autenticação):
- Usar Multer com storage em memória (`memStorage`) para receber o arquivo
- Aceitar apenas `image/jpeg`, `image/png`, `image/webp` — rejeitar outros com 400
- Limite de 5MB por arquivo
- Fazer upload para o Supabase Storage no bucket `"promotions"`:
  - Path: `{userId}/{timestamp}-{filename}`
  - Usar `supabaseAdmin.storage` para bypass de RLS
- Retornar `{ url }` com a URL pública do arquivo

### `DELETE /api/upload/image`:
- Receber `{ path }` no body
- Remover o arquivo do bucket via `supabaseAdmin.storage.remove([path])`
- Verificar se o `path` pertence ao `userId` autenticado antes de deletar

---

## Prompt 5 — Frontend: AuthContext e serviços

Implemente o AuthContext e os serviços de API no frontend React + TypeScript:

### 1. `src/services/api.ts`:
- Instância do Axios com `baseURL` do `.env` (`VITE_API_URL`)
- Interceptor de request: adicionar `Authorization: Bearer {token}` se existir no `localStorage`
- Interceptor de response: se 401, limpar token e redirecionar para `/login`

### 2. `src/services/auth.ts`:
- `signIn(identifier, password)`: `POST /api/auth/login` — tratar erros por código (`USER_NOT_FOUND`, `WRONG_PASSWORD`, etc.)
- `signUp(email, password, name, cpf, role)`: `POST /api/auth/register`
- `signOut()`: limpar token do `localStorage`
- `getSession()`: retornar token e user do `localStorage`

### 3. `src/contexts/AuthContext.tsx`:
- Estado: `user, profile, role, loading, isEstablishment`
- No mount: verificar token no `localStorage`, buscar perfil via `GET /api/auth/me`
- `signOut`: limpar estado e `localStorage`, redirecionar para `/`
- Exportar `useAuth()` hook

### 4. `src/services/promotions.ts`:
- `getPromotions(filters?: { category?, city? })`: `GET /api/promotions`
- `getPromotionsWithLocation()`: `GET /api/promotions/map`
- `getPromotion(id)`: `GET /api/promotions/:id`
- `createPromotion(data)`: `POST /api/promotions`
- `updatePromotion(id, data)`: `PUT /api/promotions/:id`
- `deletePromotion(id)`: `DELETE /api/promotions/:id`

### 5. `src/services/favorites.ts`:
- `getFavorites()`: `GET /api/favorites`
- `addFavorite(promotionId)`: `POST /api/favorites/:promotionId`
- `removeFavorite(promotionId)`: `DELETE /api/favorites/:promotionId`

### 6. `src/services/storage.ts`:
- `uploadImage(file: File)`: `POST /api/upload/image` com `FormData` — retornar URL

---

## Prompt 6 — Frontend: componentes UI base

Crie os componentes UI base em React + TypeScript + Tailwind CSS com tema escuro (fundo `#0F172A`, texto `#F8FAFC`, azul `#1E5FD8`, laranja `#F97316`):

### 1. `Input.tsx`:
- Props: `label, placeholder, value, onChange, error, type, disabled`
- Label acima, input com borda que fica vermelha se `error`, mensagem de erro abaixo
- Suporte a `type="password"` com botão de mostrar/ocultar senha

### 2. `Button.tsx`:
- Props: `title, onClick, loading, disabled, variant ('primary' | 'secondary' | 'danger')`
- Loading: spinner no lugar do texto
- Animação de scale no hover/active via Tailwind transition

### 3. `Card.tsx`:
- Container com fundo `#1E293B`, border-radius, sombra sutil
- Props: `children, className`

### 4. `Skeleton.tsx`:
- Animação de pulse (`Tailwind animate-pulse`)
- Props: `width, height, rounded`

### 5. `PromotionCard.tsx`:
- Imagem com fallback, título, preço formatado (`R$ X,XX`), nome da loja, badge de categoria
- Botões de editar e deletar condicionais (só para dono + establishment)
- `onClick` para navegar ao detalhe
- Skeleton enquanto carrega

### 6. `CategoryFilter.tsx`:
- Scroll horizontal de chips com ícone + nome
- Chip selecionado com fundo azul, demais com fundo semitransparente
- Props: `selected, onSelect`

### 7. `HeroBanner.tsx`:
- Imagem de fundo full-width com gradiente escuro na base
- Título e preço sobrepostos
- Botão "Ver promoção" que navega ao detalhe

---

## Prompt 7 — Frontend: páginas principais

Implemente as páginas principais do app de promoções em React + TypeScript + Tailwind:

### 1. `pages/Home.tsx`:
- Buscar promoções com `usePromotions()` hook (loading state + error state)
- HeroBanner com a primeira promoção
- StoriesBar: scroll horizontal de avatares circulares com imagem e nome da loja
- Seção "Recomendado": 10 promoções com maior preço que têm imagem, em scroll horizontal estilo Netflix
- CategoryFilter para filtrar a lista principal
- Botão "Ver no mapa" que navega para `/map`
- Lista de PromotionCards filtrados pela categoria selecionada
- Pull-to-refresh (botão de recarregar no topo)
- FAB (botão flutuante `+`) visível apenas para `role === 'establishment'`

### 2. `pages/PromotionDetail.tsx`:
- Receber `id` via `useParams`
- Buscar promoção por id
- Galeria de imagens (`image_urls`) com navegação
- Título, preço, loja, categoria, endereço completo
- Botão favoritar (coração) — requer login
- Mapa embutido com o pin da localização se `latitude/longitude` existirem
- Botões editar/deletar se o usuário for dono

### 3. `pages/Map.tsx`:
- Usar `react-leaflet` (Leaflet.js) para exibir mapa
- Buscar promoções com localização via `getPromotionsWithLocation()`
- Marker para cada promoção com Popup mostrando título, preço e link para detalhe
- Centralizar mapa na média das coordenadas ou na localização do usuário

### 4. `pages/Login.tsx` e `pages/Register.tsx`:
- Formulários com React Hook Form + Zod (`loginSchema` e `registerSchema`)
- Exibir erros de validação inline
- Exibir erros de autenticação em caixa de erro acima do formulário com mensagens amigáveis
- Login: campo "Email ou CPF" + senha
- Register: nome, email, CPF (com máscara `XXX.XXX.XXX-XX`), senha, confirmar senha, seletor de role (usuário / estabelecimento)
- Redirect para `/` após sucesso

---

## Prompt 8 — Frontend: página de criação/edição de promoção

Implemente a página `CreatePromotion.tsx` em React + TypeScript + Tailwind:

- Rota `/promotions/new` (criar) e `/promotions/:id/edit` (editar)
- Protegida: redirecionar para `/login` se não autenticado ou `role !== 'establishment'`
- Formulário com React Hook Form + Zod (`promotionSchema`):
  - Upload de imagem: input file com preview, enviar via `uploadImage()` e armazenar URL
  - Título da promoção
  - Preço (input numérico com formatação R$)
  - Nome do estabelecimento
  - Seletor de categoria (dropdown com ícones das 20 categorias)
  - Seção de localização:
    - Botão "Usar minha localização" via `navigator.geolocation.getCurrentPosition()`
    - Reverse geocoding via API pública (`nominatim.openstreetmap.org`) para preencher endereço
    - Campos manuais: endereço, cidade, estado (2 chars), CEP
- Botão salvar com loading state
- No modo edição: pré-popular todos os campos com os dados existentes
- Após salvar: redirecionar para `/` com toast de sucesso
- Tratamento de erros com mensagem inline

---

## Prompt 9 — Banco de dados Supabase

Crie o schema SQL completo para o Supabase do app de promoções:

### 1. Tabela `profiles`:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'establishment')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2. Tabela `promotions`:
```sql
CREATE TABLE promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  store TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  image_urls TEXT[],
  address TEXT,
  city TEXT,
  state CHAR(2),
  cep TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 3. Tabela `favorites`:
```sql
CREATE TABLE favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, promotion_id)
);
```

### 4. Políticas RLS (Row Level Security):
- **profiles**: SELECT público, INSERT/UPDATE apenas pelo próprio usuário
- **promotions**: SELECT público, INSERT apenas para `role='establishment'`, UPDATE/DELETE apenas pelo dono (`user_id = auth.uid()`)
- **favorites**: SELECT/INSERT/DELETE apenas pelo próprio usuário

### 5. Storage bucket `"promotions"`:
- Público para leitura
- Upload permitido apenas para usuários autenticados
- Path policy: arquivos só podem ser deletados pelo próprio uploader

### Índices:
```sql
CREATE INDEX ON promotions(category);
CREATE INDEX ON promotions(city);
CREATE INDEX ON promotions(user_id);
CREATE INDEX ON promotions(latitude, longitude);
CREATE INDEX ON favorites(user_id);
```

---

> Esses 9 prompts cobrem o projeto do zero ao completo. Cada um é independente e pode ser executado em sequência ou em paralelo por módulo.
