# 🔥 App Promoções

Marketplace de promoções locais que conecta estabelecimentos comerciais a consumidores.

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| Mapa | react-leaflet + OpenStreetMap |

## Funcionalidades

- Cadastro e login (email ou CPF)
- Publicação de promoções com imagens
- Geolocalização automática (GPS ou CEP)
- Mapa interativo com marcadores
- Favoritos
- Filtro por categoria
- Design responsivo (mobile-first)

## Início Rápido

```bash
# Clonar
git clone https://github.com/seu-usuario/app-promocoes.git
cd app-promocoes

# Configurar ambiente
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# Edite os .env com suas credenciais Supabase

# Instalar
cd backend && npm install
cd ../frontend && npm install

# Rodar
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd frontend && npm run dev
```

Acesse: http://localhost:5173

## Variáveis de Ambiente

### Backend (`backend/.env`)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PORT=3333
```

### Frontend (`frontend/.env`)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_URL=http://localhost:3333
```

## Estrutura

```
app-promocoes/
├── frontend/          # React + Vite
├── backend/           # Node.js + Express
├── database/          # SQL schemas
├── docs/              # Documentação
└── .github/workflows/ # CI/CD
```

## Documentação

- [Instalação detalhada](docs/INSTALLATION.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Diagramas de API](docs/diagrams/api-flow.md)
- [Checklist de revisão](docs/CHECKLIST.md)
- [OpenAPI Spec](backend/docs/openapi.yaml)

## Scripts

### Frontend
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run lint     # Verificar código
```

### Backend
```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Compilar TypeScript
npm run lint     # Verificar código
```

## Licença

MIT
