# Guia de Instalação — App Promoções

## Pré-requisitos

- Node.js 20+
- npm 9+
- Conta no [Supabase](https://supabase.com) (gratuito)

## 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/app-promocoes.git
cd app-promocoes
```

## 2. Configurar Supabase

1. Crie um novo projeto em [app.supabase.com](https://app.supabase.com)
2. Acesse **SQL Editor** e execute o conteúdo de `database/schema.sql`
3. Execute `database/storage.sql` para criar o bucket de imagens
4. Copie as credenciais do projeto (Settings → API):
   - Project URL
   - anon/public key
   - service_role key

## 3. Configurar variáveis de ambiente

### Backend

```bash
cp backend/.env.example backend/.env
```

Edite `backend/.env`:
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
PORT=3333
```

### Frontend

```bash
cp frontend/.env.example frontend/.env
```

Edite `frontend/.env`:
```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
VITE_API_URL=http://localhost:3333
```

## 4. Instalar dependências

```bash
cd backend && npm install
cd ../frontend && npm install
```

## 5. Rodar em desenvolvimento

Terminal 1 (backend):
```bash
cd backend
npm run dev
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```

Acesse: http://localhost:5173

## 6. Verificar funcionamento

- Frontend: http://localhost:5173 (deve exibir a tela de login)
- Backend: http://localhost:3333/api/promotions (deve retornar JSON)

## Troubleshooting

| Problema | Solução |
|----------|---------|
| `ECONNREFUSED` no frontend | Verifique se o backend está rodando na porta 3333 |
| Erro de autenticação Supabase | Confira as chaves no `.env` |
| Imagens não carregam | Execute `database/storage.sql` no Supabase |
| Mapa não exibe marcadores | Cadastre promoções com CEP ou GPS |
