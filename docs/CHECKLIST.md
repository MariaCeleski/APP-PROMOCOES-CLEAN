# Checklist de Revisão — CI/CD e Documentação

## 📋 GitHub Actions Workflow

### Configuração Geral
- [ ] Workflow roda em `push` para branch `main`
- [ ] Workflow roda em `pull_request` para branch `main`
- [ ] Jobs rodam em paralelo (backend, frontend, docs)
- [ ] Node.js versão 20 configurada
- [ ] Cache de npm habilitado para performance

### Backend Pipeline
- [ ] `npm ci` instala dependências
- [ ] `npm run lint` — código segue padrões ESLint
- [ ] `npm run test` — testes unitários passam
- [ ] `npm run build` — TypeScript compila sem erros
- [ ] `openapi.yaml` validado com Redocly CLI

### Frontend Pipeline
- [ ] `npm ci` instala dependências
- [ ] `npm run lint` — código segue padrões ESLint
- [ ] `npm run test` — testes unitários passam
- [ ] `npm run build` — Vite build sem erros (inclui tsc)

### Documentação Pipeline
- [ ] `README.md` existe na raiz
- [ ] `docs/ARCHITECTURE.md` existe
- [ ] `docs/INSTALLATION.md` existe
- [ ] `docs/diagrams/api-flow.md` existe
- [ ] Links em markdown são válidos (sem 404)

---

## 📄 Arquivos de Documentação

### README.md
- [ ] Descrição do projeto
- [ ] Badges de CI status
- [ ] Pré-requisitos (Node.js, npm, Supabase)
- [ ] Instruções de instalação rápida
- [ ] Variáveis de ambiente necessárias
- [ ] Como rodar em desenvolvimento
- [ ] Como rodar testes
- [ ] Como fazer build de produção
- [ ] Estrutura de diretórios
- [ ] Link para documentação completa

### docs/INSTALLATION.md
- [ ] Requisitos do sistema (OS, Node.js, npm)
- [ ] Clonar repositório
- [ ] Instalar dependências (frontend e backend)
- [ ] Configurar Supabase (criar projeto, rodar schema)
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Criar bucket de storage
- [ ] Rodar migrations/seeds
- [ ] Iniciar servidores de desenvolvimento
- [ ] Verificar que tudo funciona (health check)
- [ ] Troubleshooting de problemas comuns

### docs/ARCHITECTURE.md
- [ ] Visão geral da arquitetura (3 camadas)
- [ ] Diagrama de componentes (Mermaid)
- [ ] Stack tecnológica (frontend, backend, BaaS)
- [ ] Fluxo de dados (request/response)
- [ ] Modelo de dados (tabelas e relações)
- [ ] Autenticação e autorização (JWT, RLS)
- [ ] Estrutura de diretórios do código
- [ ] Decisões arquiteturais (ADRs)
- [ ] Padrões utilizados (services, hooks, contexts)

### docs/diagrams/api-flow.md
- [ ] Diagrama de sequência: Signup
- [ ] Diagrama de sequência: Login
- [ ] Diagrama de sequência: Criar promoção
- [ ] Diagrama de sequência: Upload de imagem
- [ ] Diagrama de sequência: Buscar promoções
- [ ] Diagrama de sequência: Favoritar
- [ ] Diagrama de fluxo: Geolocalização (CEP + GPS)
- [ ] Todos os diagramas em formato Mermaid

### openapi.yaml (Backend)
- [ ] Info (title, version, description)
- [ ] Servers (development, production)
- [ ] Paths para todos os endpoints:
  - [ ] POST /api/auth/signup
  - [ ] POST /api/auth/login
  - [ ] POST /api/auth/logout
  - [ ] GET /api/promotions
  - [ ] GET /api/promotions/:id
  - [ ] GET /api/promotions/map
  - [ ] POST /api/promotions
  - [ ] PUT /api/promotions/:id
  - [ ] DELETE /api/promotions/:id
  - [ ] GET /api/favorites
  - [ ] POST /api/favorites/:promotionId
  - [ ] DELETE /api/favorites/:promotionId
  - [ ] POST /api/upload
- [ ] Schemas (Promotion, Profile, Favorite, Error)
- [ ] Security schemes (Bearer JWT)
- [ ] Responses com códigos HTTP corretos
- [ ] Exemplos de request/response

---

## 🔍 Checklist de Revisão de PR

### Código
- [ ] Build passa sem erros
- [ ] Lint passa sem warnings
- [ ] Testes passam
- [ ] Sem console.log em produção
- [ ] Sem credenciais hardcoded
- [ ] Tratamento de erros adequado
- [ ] Tipos TypeScript corretos (sem `any`)

### Segurança
- [ ] JWT validado em rotas protegidas
- [ ] Ownership verificada antes de editar/deletar
- [ ] Input sanitizado
- [ ] File upload validado (tipo e tamanho)
- [ ] CORS configurado corretamente
- [ ] Variáveis sensíveis em .env (não commitadas)

### Performance
- [ ] Imagens com lazy loading
- [ ] Queries com índices adequados
- [ ] Sem N+1 queries
- [ ] Bundle size razoável (< 500KB gzip)

### Acessibilidade
- [ ] aria-labels em botões de ícone
- [ ] Contraste de cores adequado
- [ ] Navegação por teclado funcional
- [ ] Textos alternativos em imagens

### Responsividade
- [ ] Funciona em 320px (iPhone SE)
- [ ] Funciona em 375px (iPhone)
- [ ] Funciona em 768px (Tablet)
- [ ] Funciona em 1024px (Desktop)
- [ ] Funciona em 1440px+ (Desktop grande)

---

## 🚀 Checklist de Deploy

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Build de produção sem erros
- [ ] Testes passando
- [ ] Database migrations aplicadas
- [ ] Storage bucket configurado
- [ ] RLS policies ativas
- [ ] CORS apontando para domínio de produção
- [ ] SSL/HTTPS configurado
- [ ] Monitoramento de erros ativo
- [ ] Backup de banco configurado
