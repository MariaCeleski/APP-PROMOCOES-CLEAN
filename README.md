# App Promoções

Marketplace de promoções locais que conecta estabelecimentos comerciais a consumidores.

## Stack

### Frontend
- React 18 + Vite + TypeScript
- React Router DOM v6
- Tailwind CSS
- React Hook Form + Zod
- Axios
- React Leaflet (mapa)

### Backend
- Node.js + Express + TypeScript
- Supabase (Auth, PostgreSQL, Storage)
- Multer (upload de imagens)

## Funcionalidades

- **Autenticação** — login com email ou CPF, cadastro com dois papéis: `user` (consumidor) e `establishment` (lojista)
- **Home** — hero banner, stories horizontais, seção "Recomendado" estilo Netflix, filtro por categoria, lista de promoções
- **Promoções** — cards com imagem/título/preço/loja, tela de detalhe, criação/edição/exclusão (exclusivo para lojistas), upload de múltiplas imagens, geolocalização automática
- **Mapa** — visualização de promoções com coordenadas via Leaflet.js
- **Favoritos** — adicionar/remover promoções favoritas por usuário

## Banco de Dados (Supabase)

| Tabela | Campos principais |
|--------|-------------------|
| `profiles` | id, name, email, cpf, role |
| `promotions` | id, title, price, store, category, image_url, image_urls, address, city, state, cep, latitude, longitude, user_id |
| `favorites` | user_id, promotion_id |

## Estrutura do Projeto

```
Promo/
├── frontend/          # React + Vite
│   └── src/
│       ├── components/
│       │   ├── ui/        # Button, Input, Card, Skeleton
│       │   ├── layout/    # Header, Footer, PageWrapper
│       │   └── features/  # PromotionCard, StoriesBar, CategoryFilter, HeroBanner
│       ├── pages/         # Home, Login, Register, PromotionDetail, CreatePromotion, Map
│       ├── services/      # api, auth, promotions, favorites, storage
│       ├── contexts/      # AuthContext
│       ├── hooks/         # useAuth, usePromotions, useFavorites
│       ├── types/         # auth, promotion
│       ├── utils/         # validators, formatters
│       └── constants/     # categories
└── backend/           # Node + Express
    └── src/
        ├── routes/        # auth, promotions, favorites, upload
        ├── middlewares/   # authMiddleware, errorHandler
        ├── services/      # supabase
        └── types/
```

## Variáveis de Ambiente

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3333
```

### Backend (`.env`)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
PORT=3333
```

## Como Rodar

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Categorias

20 categorias disponíveis: Todos 🔥, Pizza 🍕, Hambúrguer 🍔, Carnes 🥩, Frango 🍗, Frutos do Mar 🦐, Sushi 🍣, Hortifruti 🥦, Padaria 🥖, Supermercado 🛒, Farmácia 💊, Restaurante 🍽️, Lanchonete 🥪, Sorveteria 🍦, Cafeteria ☕, Bebidas 🍺, Eletrônicos 📱, Loja 🛍️, Conveniência 🏪, Outros 📦

## Prompts de Reconstrução

Consulte o arquivo [Prompts.md](./Prompts.md) para os 9 prompts que cobrem o projeto do zero ao completo.
