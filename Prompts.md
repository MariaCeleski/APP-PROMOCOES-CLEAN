# Prompts Reutilizáveis para Desenvolvimento Full-Stack

Coleção de prompts testados e refinados durante o desenvolvimento do App Promoções. Adapte substituindo os termos entre `[colchetes]`.

---

## 🏗️ Setup de Projeto

### Criar projeto full-stack do zero
```
Crie um projeto full-stack com:
- Frontend: React + Vite + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: Supabase (PostgreSQL + Auth + Storage)

Estrutura de pastas: frontend/, backend/, database/
Inclua: .env.example, .gitignore, README.md, package.json configurado
```

### Configurar Supabase
```
Configure o Supabase para o projeto:
1. Crie o schema SQL com as tabelas: [listar tabelas]
2. Configure RLS (Row Level Security) para cada tabela
3. Crie o bucket de storage para [tipo de arquivo]
4. Adicione índices nas colunas mais consultadas
```

### Configurar variáveis de ambiente
```
Crie os arquivos .env.example para frontend e backend com todas as variáveis necessárias para [Supabase/Firebase/outro]. Inclua comentários explicando cada variável.
```

---

## 🎨 Frontend — Componentes

### Criar componente responsivo
```
Crie o componente [NomeComponente].tsx com:
- Design responsivo (mobile-first: 320px até 1920px)
- Breakpoints: xs(375px), sm(640px), md(768px), lg(1024px), xl(1280px)
- Tailwind CSS para estilização
- TypeScript com interface de props tipada
- Estados de loading e erro
- Acessibilidade (aria-labels, roles)
```

### Criar página com formulário
```
Crie a página [NomePagina].tsx com:
- Formulário usando React Hook Form + Zod para validação
- Campos: [listar campos com tipos]
- Mensagens de erro em português
- Estado de loading no submit
- Toast de sucesso/erro
- Layout responsivo
- Navegação de volta
```

### Criar lista com filtros
```
Crie uma lista de [items] com:
- Grid responsivo (2 colunas mobile, 3 tablet, 4 desktop)
- Filtro por [categoria/tipo/status]
- Estado vazio com mensagem amigável
- Loading skeleton
- Pull-to-refresh ou botão de atualizar
- Scroll infinito ou paginação
```

### Criar carrossel horizontal (estilo Netflix)
```
Crie um carrossel horizontal de [cards/items] com:
- Scroll por toque em mobile (sem scrollbar visível)
- Setas de navegação visíveis apenas em desktop (no hover)
- Scroll suave ao clicar nas setas
- Cards com largura fixa responsiva
- Título da seção acima
```

### Criar mapa interativo
```
Crie uma página de mapa usando react-leaflet com:
- OpenStreetMap tiles (gratuito, sem API key)
- Marcadores para cada [item] com coordenadas
- Popup ao clicar no marcador com [título, preço, botão]
- Centro padrão em [cidade/coordenadas]
- Layout responsivo (min-height adaptável)
- Fix de ícones do Leaflet para Vite
```

---

## 🔧 Frontend — Serviços

### Criar serviço de geolocalização
```
Crie um serviço de geolocalização (geolocation.ts) com:
- Busca por CEP via ViaCEP (gratuito)
- Geocoding (endereço → coordenadas) via Nominatim/OpenStreetMap
- Reverse geocoding (coordenadas → endereço) via Nominatim
- Obter localização atual do navegador (GPS)
- Tratamento de erros (permissão negada, timeout, indisponível)
- Sem dependência de API key
```

### Criar serviço de API
```
Crie um serviço HTTP (api.ts) com:
- Axios ou fetch configurado
- Base URL via variável de ambiente
- Interceptor para injetar JWT no header Authorization
- Interceptor para tratar erros (401 → redirect login)
- Métodos: get, post, put, delete tipados com generics
```

### Criar serviço de autenticação
```
Crie um serviço de auth (auth.ts) com:
- Signup com [campos]
- Login com [email/CPF/username] + senha
- Logout
- Refresh token automático
- Persistência de sessão (localStorage)
- Integração com [Supabase/Firebase/JWT próprio]
```

---

## 🖥️ Backend

### Criar CRUD completo
```
Crie as rotas Express para [recurso] com:
- GET /api/[recurso] — listar (com filtros por query params)
- GET /api/[recurso]/:id — buscar por ID
- POST /api/[recurso] — criar (autenticado, validar campos)
- PUT /api/[recurso]/:id — atualizar (apenas dono)
- DELETE /api/[recurso]/:id — deletar (apenas dono)
- Middleware de autenticação JWT
- Verificação de ownership
- Tratamento de erros padronizado
```

### Criar middleware de autenticação
```
Crie um middleware de autenticação (authMiddleware.ts) que:
- Extrai o token do header Authorization: Bearer <token>
- Valida o JWT via [Supabase/jsonwebtoken]
- Adiciona user ao req (req.user = { id, email })
- Retorna 401 se token inválido ou ausente
- TypeScript com tipagem do Request estendida
```

### Criar upload de imagens
```
Crie a rota de upload de imagens com:
- Multer para processar multipart/form-data
- Validação de tipo (JPEG, PNG, WebP)
- Validação de tamanho (máx [X]MB)
- Upload para [Supabase Storage/S3/Cloudinary]
- Retornar URL pública da imagem
- Tratamento de erros
```

---

## 📱 Responsividade

### Tornar página responsiva
```
Ajuste [componente/página] para ser totalmente responsivo:
- Mobile (320px-639px): [descrever layout]
- Tablet (640px-1023px): [descrever layout]
- Desktop (1024px+): [descrever layout]
- Use classes Tailwind com breakpoints (sm:, md:, lg:, xl:)
- Textos: text-xs em mobile, text-sm em tablet, text-base em desktop
- Padding: px-3 em mobile, px-4 em tablet, px-6 em desktop
- Não cortar conteúdo em nenhum tamanho
```

### Criar grid responsivo de cards
```
Crie um grid de cards que:
- 2 colunas em mobile (< 640px)
- 2-3 colunas em tablet (640px-1023px)
- 3-4 colunas em desktop (1024px+)
- Gap responsivo (gap-2 mobile, gap-3 desktop)
- Cards com altura consistente (flex + h-full)
- Imagens com aspect-ratio fixo
```

---

## 🗄️ Database

### Criar schema SQL
```
Crie o schema SQL para [Supabase/PostgreSQL] com:
- Tabelas: [listar tabelas e campos]
- Constraints: unique, check, foreign keys
- Índices nas colunas mais consultadas
- RLS policies para cada tabela
- Comentários nas tabelas e colunas
- CASCADE delete onde apropriado
```

---

## 📄 Documentação

### Criar README.md
```
Crie um README.md profissional com:
- Descrição do projeto (1-2 frases)
- Stack tecnológica (tabela)
- Funcionalidades principais (lista)
- Início rápido (clone, configure, instale, rode)
- Variáveis de ambiente necessárias
- Estrutura de diretórios
- Links para documentação adicional
- Scripts disponíveis
```

### Criar OpenAPI spec
```
Crie um arquivo openapi.yaml (OpenAPI 3.0) documentando todos os endpoints:
- Info (title, version, description)
- Servers (dev, prod)
- Paths com todos os endpoints, métodos, parâmetros, responses
- Components/schemas para todos os modelos
- Security schemes (Bearer JWT)
- Exemplos de request/response
```

### Criar diagramas de fluxo
```
Crie diagramas Mermaid para os fluxos:
- [Autenticação/Signup/Login]
- [CRUD de recurso]
- [Upload de arquivo]
- [Integração com API externa]
Use sequenceDiagram com participantes: Cliente, Backend, Database, [Serviço externo]
```

---

## 🔄 CI/CD

### Criar GitHub Actions workflow
```
Crie um workflow de GitHub Actions (.github/workflows/ci.yml) que:
- Roda em push e pull_request para branch main
- Jobs paralelos: backend, frontend, docs
- Backend: npm ci → lint → test → build → validar openapi
- Frontend: npm ci → lint → test → build
- Docs: verificar existência dos arquivos de documentação
- Node.js 20, cache de npm habilitado
```

---

## 🐛 Debug e Correção

### Diagnosticar problema
```
O [componente/funcionalidade] não está funcionando:
- Comportamento esperado: [descrever]
- Comportamento atual: [descrever]
- Erro no console: [se houver]

Analise o fluxo completo de dados desde [origem] até [destino], identifique onde o problema está e corrija.
```

### Corrigir responsividade
```
O [componente] está cortando/quebrando em telas [pequenas/grandes]:
- Em [Xpx] o [elemento] fica [cortado/sobreposto/fora da tela]
- Ajuste para que fique totalmente dentro do container
- Mantenha funcional em todos os tamanhos (320px a 1920px)
```

---

## 🧪 Testes

### Criar testes para serviço
```
Crie testes unitários para [serviço] usando [Vitest/Jest]:
- Teste de sucesso para cada função
- Teste de erro (input inválido, rede, timeout)
- Mock de dependências externas (fetch, supabase)
- Cobertura dos edge cases
```

### Criar testes E2E
```
Crie testes end-to-end para o fluxo de [funcionalidade]:
1. [Passo 1]
2. [Passo 2]
3. [Verificação]
Use [Playwright/Cypress] com seletores acessíveis (role, label).
```

---

## 💡 Dicas de Uso

1. **Seja específico**: Quanto mais detalhes, melhor o resultado
2. **Dê contexto**: Mencione a stack, bibliotecas já instaladas, padrões do projeto
3. **Itere**: Se o resultado não ficou bom, peça ajustes específicos
4. **Valide**: Sempre peça para rodar `npm run build` após mudanças
5. **Responsividade**: Sempre mencione os breakpoints desejados
6. **Acessibilidade**: Peça aria-labels e navegação por teclado
