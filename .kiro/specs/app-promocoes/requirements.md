# Requirements Document

## Introduction

App Promoções é um marketplace de promoções locais que conecta estabelecimentos comerciais a consumidores. A plataforma permite que lojistas (role: establishment) publiquem promoções com imagens, preços, localização e categoria, enquanto consumidores (role: user) navegam, favoritam e visualizam promoções em lista ou mapa. O sistema é construído com React + Vite + TypeScript no frontend, Node.js + Express + TypeScript no backend, e Supabase como BaaS (autenticação, banco de dados PostgreSQL e armazenamento de arquivos).

---

## Glossary

- **System**: O App Promoções como um todo (frontend + backend + Supabase).
- **Auth_Service**: Módulo de autenticação baseado no Supabase Auth.
- **User**: Consumidor autenticado com role `user`.
- **Establishment**: Lojista autenticado com role `establishment`.
- **Promotion**: Entidade que representa uma promoção publicada por um Establishment.
- **Promotion_Card**: Componente visual que exibe resumo de uma Promotion (imagem, título, preço, loja, categoria).
- **Promotion_Detail**: Tela que exibe todos os dados de uma Promotion.
- **Home_Screen**: Tela principal do aplicativo, visível após autenticação.
- **Map_Screen**: Tela de visualização de promoções georreferenciadas em mapa interativo.
- **Favorites_Screen**: Tela que lista as promoções favoritadas pelo User.
- **Category_Filter**: Componente de filtragem de promoções por categoria.
- **Stories_Bar**: Componente horizontal com miniaturas de imagens de promoções recentes, estilo Instagram Stories.
- **Netflix_Row**: Componente horizontal com promoções recomendadas ordenadas por preço.
- **Hero_Banner**: Componente que exibe a promoção mais recente em destaque no topo da Home_Screen.
- **Promotion_Form**: Formulário de criação e edição de Promotion, exclusivo para Establishment.
- **Image_Uploader**: Componente de upload de múltiplas imagens via input file.
- **Geolocation_Service**: Serviço que obtém coordenadas GPS do dispositivo e realiza reverse geocoding para obter endereço.
- **Favorites_Service**: Serviço que gerencia adição e remoção de promoções favoritas na tabela `favorites` do Supabase.
- **API**: Backend Node.js + Express que intermedia operações entre o frontend e o Supabase.
- **Storage**: Supabase Storage, utilizado para armazenar imagens de promoções.
- **CPF**: Cadastro de Pessoa Física — identificador único do usuário brasileiro.
- **JWT**: JSON Web Token emitido pelo Supabase Auth para autenticação de sessão.
- **Pull-to-Refresh**: Gesto de arrastar a lista para baixo para recarregar os dados.

---

## Requirements

### Requirement 1: Cadastro de Usuário

**User Story:** Como visitante, quero me cadastrar informando nome, email, CPF e senha, para que eu possa acessar o marketplace como consumidor ou lojista.

#### Acceptance Criteria

1. THE Auth_Service SHALL exigir os campos nome, email, CPF e senha no formulário de cadastro.
2. WHEN o visitante submete o formulário de cadastro com todos os campos válidos, THE Auth_Service SHALL criar uma conta no Supabase Auth e um registro correspondente na tabela `profiles` com os campos `name`, `email`, `cpf` e `role`.
3. WHEN o visitante submete o formulário de cadastro, THE Auth_Service SHALL validar que o email possui formato válido (contém `@` e domínio).
4. WHEN o visitante submete o formulário de cadastro, THE Auth_Service SHALL validar que o CPF possui exatamente 11 dígitos numéricos.
5. WHEN o visitante submete o formulário de cadastro, THE Auth_Service SHALL validar que a senha possui no mínimo 6 caracteres.
6. IF o email informado já estiver cadastrado, THEN THE Auth_Service SHALL exibir a mensagem "E-mail já cadastrado".
7. IF o CPF informado já estiver cadastrado, THEN THE Auth_Service SHALL exibir a mensagem "CPF já cadastrado".
8. THE Auth_Service SHALL atribuir o role `user` por padrão ao novo cadastro, salvo quando o visitante selecionar explicitamente o role `establishment`.

---

### Requirement 2: Login de Usuário

**User Story:** Como usuário cadastrado, quero fazer login com email ou CPF e senha, para que eu possa acessar minha conta e as funcionalidades do marketplace.

#### Acceptance Criteria

1. THE Auth_Service SHALL aceitar email ou CPF como identificador no formulário de login.
2. WHEN o usuário submete o formulário de login com email e senha válidos, THE Auth_Service SHALL autenticar a sessão via Supabase Auth e redirecionar para a Home_Screen.
3. WHEN o usuário submete o formulário de login com CPF, THE Auth_Service SHALL consultar a tabela `profiles` para obter o email associado ao CPF e então autenticar via Supabase Auth.
4. IF as credenciais informadas forem inválidas, THEN THE Auth_Service SHALL exibir a mensagem "Credenciais inválidas".
5. WHEN a autenticação for bem-sucedida, THE Auth_Service SHALL persistir a sessão via JWT do Supabase Auth de modo que o usuário permaneça autenticado após recarregar a página.
6. THE Auth_Service SHALL disponibilizar uma opção de logout que encerra a sessão ativa e redireciona para a tela de login.

---

### Requirement 3: Sessão Persistente

**User Story:** Como usuário autenticado, quero que minha sessão seja mantida entre visitas, para que eu não precise fazer login toda vez que abrir o aplicativo.

#### Acceptance Criteria

1. WHILE a sessão JWT do Supabase Auth for válida, THE Auth_Service SHALL manter o usuário autenticado sem solicitar novo login.
2. WHEN o JWT expirar, THE Auth_Service SHALL tentar renovar o token automaticamente via refresh token do Supabase Auth.
3. IF o refresh token for inválido ou expirado, THEN THE Auth_Service SHALL encerrar a sessão e redirecionar o usuário para a tela de login.

---

### Requirement 4: Home Screen — Hero Banner

**User Story:** Como usuário autenticado, quero ver a promoção mais recente em destaque ao abrir o aplicativo, para que eu seja informado imediatamente sobre a oferta mais nova.

#### Acceptance Criteria

1. WHEN a Home_Screen é carregada, THE Hero_Banner SHALL exibir a Promotion com o maior valor de `created_at` da tabela `promotions`.
2. THE Hero_Banner SHALL exibir a imagem principal, o título, o preço e o nome da loja da Promotion selecionada.
3. WHEN o usuário toca no Hero_Banner, THE System SHALL navegar para a Promotion_Detail da Promotion exibida.
4. IF não houver nenhuma Promotion cadastrada, THEN THE Hero_Banner SHALL exibir uma mensagem "Nenhuma promoção disponível".

---

### Requirement 5: Home Screen — Stories Bar

**User Story:** Como usuário autenticado, quero visualizar miniaturas horizontais das promoções recentes no estilo Stories, para que eu possa navegar rapidamente pelas ofertas mais novas.

#### Acceptance Criteria

1. WHEN a Home_Screen é carregada, THE Stories_Bar SHALL exibir as 10 Promotions mais recentes ordenadas por `created_at` decrescente.
2. THE Stories_Bar SHALL exibir cada Promotion como uma miniatura circular com a imagem principal e o nome da loja abaixo.
3. THE Stories_Bar SHALL ser rolável horizontalmente sem exibir barra de rolagem visível.
4. WHEN o usuário toca em uma miniatura da Stories_Bar, THE System SHALL navegar para a Promotion_Detail da Promotion correspondente.

---

### Requirement 6: Home Screen — Netflix Row

**User Story:** Como usuário autenticado, quero ver uma linha horizontal de promoções recomendadas ordenadas por preço, para que eu possa identificar rapidamente as melhores ofertas.

#### Acceptance Criteria

1. WHEN a Home_Screen é carregada, THE Netflix_Row SHALL exibir as Promotions ordenadas pelo campo `price` em ordem crescente.
2. THE Netflix_Row SHALL exibir cada Promotion como um Promotion_Card com imagem, título, preço e nome da loja.
3. THE Netflix_Row SHALL ser rolável horizontalmente sem exibir barra de rolagem visível.
4. WHEN o usuário toca em um Promotion_Card da Netflix_Row, THE System SHALL navegar para a Promotion_Detail da Promotion correspondente.

---

### Requirement 7: Home Screen — Filtro por Categoria

**User Story:** Como usuário autenticado, quero filtrar as promoções por categoria usando ícones, para que eu encontre rapidamente ofertas do tipo que me interessa.

#### Acceptance Criteria

1. WHEN a Home_Screen é carregada, THE Category_Filter SHALL exibir as 20 categorias disponíveis: Restaurantes, Farmácias, Serviços, Supermercado, Lojas, Pizza, Hambúrguer, Carnes, Frango, Sushi, Hortifruti, Padaria, Sorveteria, Cafeteria, Bebidas, Eletrônicos, Conveniência, Lanchonete, Frutos do Mar, Outros.
2. THE Category_Filter SHALL exibir um ícone representativo e o nome de cada categoria.
3. WHEN o usuário seleciona uma categoria no Category_Filter, THE System SHALL filtrar a lista de Promotions exibindo apenas as Promotions com o campo `category` igual à categoria selecionada.
4. WHEN o usuário seleciona uma categoria já selecionada, THE System SHALL remover o filtro e exibir todas as Promotions.
5. THE Category_Filter SHALL ser rolável horizontalmente.

---

### Requirement 8: Home Screen — Lista de Promoções com Pull-to-Refresh

**User Story:** Como usuário autenticado, quero ver a lista completa de promoções e poder recarregá-la com um gesto de arrastar, para que eu tenha acesso às ofertas mais atualizadas.

#### Acceptance Criteria

1. WHEN a Home_Screen é carregada, THE System SHALL buscar e exibir todas as Promotions da tabela `promotions` ordenadas por `created_at` decrescente.
2. THE System SHALL exibir cada Promotion como um Promotion_Card contendo imagem, título, preço, nome da loja e categoria.
3. WHEN o usuário executa o gesto de Pull-to-Refresh na lista de Promotions, THE System SHALL recarregar os dados da tabela `promotions` do Supabase.
4. WHILE os dados estão sendo carregados, THE System SHALL exibir um indicador de carregamento visível.
5. IF a busca de Promotions falhar, THEN THE System SHALL exibir a mensagem "Erro ao carregar promoções. Tente novamente."

---

### Requirement 9: Detalhe de Promoção

**User Story:** Como usuário autenticado, quero visualizar todos os detalhes de uma promoção, para que eu possa decidir se tenho interesse na oferta.

#### Acceptance Criteria

1. WHEN o usuário navega para a Promotion_Detail, THE System SHALL exibir: todas as imagens da Promotion em carrossel, título, preço, nome da loja, categoria, endereço completo (logradouro, cidade, estado, CEP) e data de criação.
2. THE Promotion_Detail SHALL exibir um botão de favoritar visível para usuários com role `user`.
3. WHEN o usuário com role `establishment` e `user_id` igual ao `user_id` da Promotion acessa a Promotion_Detail, THE System SHALL exibir botões de editar e excluir a Promotion.
4. IF a Promotion não for encontrada, THEN THE System SHALL exibir a mensagem "Promoção não encontrada" e um botão para retornar à Home_Screen.

---

### Requirement 10: Criação de Promoção

**User Story:** Como lojista (establishment), quero criar novas promoções com imagens, preço, localização e categoria, para que eu possa divulgar minhas ofertas aos consumidores.

#### Acceptance Criteria

1. THE System SHALL exibir o Promotion_Form apenas para usuários com role `establishment`.
2. THE Promotion_Form SHALL conter os campos: título (obrigatório), preço (obrigatório, numérico positivo), nome da loja (obrigatório), categoria (obrigatório, seleção entre as 20 categorias), endereço, cidade, estado, CEP e imagens.
3. WHEN o Establishment acessa o Promotion_Form de criação, THE Geolocation_Service SHALL solicitar permissão de acesso ao GPS do dispositivo.
4. WHEN o Geolocation_Service obtém as coordenadas GPS, THE System SHALL preencher automaticamente os campos `latitude` e `longitude` da Promotion e realizar reverse geocoding para preencher os campos de endereço, cidade, estado e CEP.
5. IF o Geolocation_Service não obtiver permissão de GPS, THEN THE System SHALL permitir que o Establishment preencha o endereço manualmente.
6. WHEN o Establishment submete o Promotion_Form com todos os campos obrigatórios válidos, THE API SHALL salvar a Promotion na tabela `promotions` com o `user_id` do Establishment autenticado.
7. WHEN o Establishment submete o Promotion_Form com imagens selecionadas, THE Image_Uploader SHALL enviar as imagens ao Storage do Supabase e salvar as URLs resultantes nos campos `image_url` (primeira imagem) e `image_urls` (todas as imagens) da Promotion.
8. IF o Promotion_Form for submetido sem o campo título, preço ou categoria, THEN THE System SHALL exibir mensagens de validação indicando os campos obrigatórios não preenchidos.

---

### Requirement 11: Edição de Promoção

**User Story:** Como lojista (establishment), quero editar as promoções que criei, para que eu possa corrigir informações ou atualizar os dados da oferta.

#### Acceptance Criteria

1. THE System SHALL permitir a edição de uma Promotion apenas ao Establishment cujo `user_id` seja igual ao `user_id` da Promotion.
2. WHEN o Establishment acessa a edição de uma Promotion, THE Promotion_Form SHALL ser pré-preenchido com os dados atuais da Promotion.
3. WHEN o Establishment submete o Promotion_Form de edição com dados válidos, THE API SHALL atualizar o registro correspondente na tabela `promotions`.
4. WHEN o Establishment adiciona novas imagens no Promotion_Form de edição, THE Image_Uploader SHALL enviar as novas imagens ao Storage e atualizar os campos `image_url` e `image_urls` da Promotion.
5. IF o Promotion_Form de edição for submetido sem o campo título, preço ou categoria, THEN THE System SHALL exibir mensagens de validação indicando os campos obrigatórios não preenchidos.

---

### Requirement 12: Exclusão de Promoção

**User Story:** Como lojista (establishment), quero excluir promoções que criei, para que eu possa remover ofertas encerradas ou incorretas.

#### Acceptance Criteria

1. THE System SHALL permitir a exclusão de uma Promotion apenas ao Establishment cujo `user_id` seja igual ao `user_id` da Promotion.
2. WHEN o Establishment solicita a exclusão de uma Promotion, THE System SHALL exibir um diálogo de confirmação com as opções "Confirmar" e "Cancelar".
3. WHEN o Establishment confirma a exclusão, THE API SHALL remover o registro da tabela `promotions` e as imagens associadas do Storage.
4. WHEN a exclusão for concluída com sucesso, THE System SHALL redirecionar o Establishment para a Home_Screen e exibir a mensagem "Promoção excluída com sucesso".
5. IF a exclusão falhar, THEN THE System SHALL exibir a mensagem "Erro ao excluir promoção. Tente novamente."

---

### Requirement 13: Upload de Imagens

**User Story:** Como lojista (establishment), quero fazer upload de múltiplas imagens para uma promoção, para que os consumidores possam visualizar os produtos ou serviços oferecidos.

#### Acceptance Criteria

1. THE Image_Uploader SHALL aceitar seleção de múltiplos arquivos de imagem via input file.
2. THE Image_Uploader SHALL aceitar arquivos nos formatos JPEG, PNG e WebP.
3. THE Image_Uploader SHALL exibir uma pré-visualização de cada imagem selecionada antes do envio.
4. WHEN o Establishment submete o Promotion_Form, THE Image_Uploader SHALL enviar cada imagem ao Storage do Supabase e retornar as URLs públicas correspondentes.
5. IF um arquivo selecionado não for do tipo JPEG, PNG ou WebP, THEN THE Image_Uploader SHALL exibir a mensagem "Formato de arquivo não suportado. Use JPEG, PNG ou WebP."
6. IF o upload de uma imagem falhar, THEN THE Image_Uploader SHALL exibir a mensagem "Erro ao enviar imagem. Tente novamente."

---

### Requirement 14: Geolocalização Automática

**User Story:** Como lojista (establishment), quero que o endereço da promoção seja preenchido automaticamente via GPS, para que eu não precise digitar o endereço manualmente.

#### Acceptance Criteria

1. WHEN o Establishment acessa o Promotion_Form, THE Geolocation_Service SHALL solicitar permissão de acesso à localização do dispositivo via API de Geolocalização do navegador.
2. WHEN a permissão de localização é concedida, THE Geolocation_Service SHALL obter as coordenadas de latitude e longitude do dispositivo.
3. WHEN as coordenadas são obtidas, THE Geolocation_Service SHALL realizar uma requisição de reverse geocoding para converter as coordenadas em endereço, cidade, estado e CEP.
4. WHEN o reverse geocoding retornar resultado válido, THE System SHALL preencher automaticamente os campos de endereço, cidade, estado, CEP, latitude e longitude no Promotion_Form.
5. IF o reverse geocoding não retornar resultado válido, THEN THE System SHALL manter os campos de endereço em branco para preenchimento manual pelo Establishment.

---

### Requirement 15: Mapa de Promoções

**User Story:** Como usuário autenticado, quero visualizar as promoções em um mapa interativo, para que eu possa encontrar ofertas próximas à minha localização.

#### Acceptance Criteria

1. WHEN o usuário acessa a Map_Screen, THE System SHALL exibir um mapa interativo renderizado via react-leaflet.
2. WHEN a Map_Screen é carregada, THE System SHALL buscar todas as Promotions da tabela `promotions` que possuam valores não nulos nos campos `latitude` e `longitude`.
3. THE System SHALL exibir um marcador no mapa para cada Promotion com coordenadas válidas, posicionado nas coordenadas `latitude` e `longitude` da Promotion.
4. WHEN o usuário toca em um marcador no mapa, THE System SHALL exibir um popup com o título, preço e nome da loja da Promotion correspondente.
5. WHEN o usuário toca no popup de um marcador, THE System SHALL navegar para a Promotion_Detail da Promotion correspondente.
6. THE Map_Screen SHALL exibir um botão de retorno para a Home_Screen.

---

### Requirement 16: Favoritos

**User Story:** Como consumidor (user), quero adicionar e remover promoções dos meus favoritos, para que eu possa acessar rapidamente as ofertas de meu interesse.

#### Acceptance Criteria

1. THE Favorites_Service SHALL permitir que um User adicione uma Promotion aos favoritos inserindo um registro na tabela `favorites` com `user_id` e `promotion_id`.
2. WHEN o User toca no botão de favoritar em uma Promotion_Detail ou Promotion_Card, THE Favorites_Service SHALL verificar se o registro já existe na tabela `favorites`.
3. IF o registro não existir na tabela `favorites`, THEN THE Favorites_Service SHALL inserir o registro e exibir o ícone de favorito preenchido.
4. IF o registro já existir na tabela `favorites`, THEN THE Favorites_Service SHALL remover o registro e exibir o ícone de favorito vazio.
5. WHEN o User acessa a Favorites_Screen, THE System SHALL buscar todas as Promotions cujos `promotion_id` estejam na tabela `favorites` com o `user_id` do User autenticado e exibi-las como Promotion_Cards.
6. IF não houver Promotions favoritadas, THEN THE Favorites_Screen SHALL exibir a mensagem "Você ainda não tem promoções favoritas."
7. THE System SHALL exibir o botão de favoritar apenas para usuários com role `user`.

---

### Requirement 17: Navegação e Roteamento

**User Story:** Como usuário autenticado, quero navegar entre as telas do aplicativo de forma fluida, para que eu possa acessar todas as funcionalidades sem recarregar a página.

#### Acceptance Criteria

1. THE System SHALL implementar roteamento via React Router DOM v6 com as rotas: `/` (Home_Screen), `/promotion/:id` (Promotion_Detail), `/map` (Map_Screen), `/favorites` (Favorites_Screen), `/login` (tela de login), `/register` (tela de cadastro) e `/promotion/new` e `/promotion/:id/edit` (Promotion_Form).
2. WHILE o usuário não estiver autenticado, THE System SHALL redirecionar qualquer acesso a rotas protegidas para a rota `/login`.
3. WHEN o usuário com role `user` tenta acessar as rotas `/promotion/new` ou `/promotion/:id/edit`, THE System SHALL redirecionar para a Home_Screen.
4. THE System SHALL exibir uma barra de navegação inferior com acesso às telas Home_Screen, Map_Screen e Favorites_Screen para usuários autenticados.

---

### Requirement 18: Validação de Formulários

**User Story:** Como usuário, quero receber feedback imediato sobre erros de preenchimento nos formulários, para que eu possa corrigir os dados antes de submeter.

#### Acceptance Criteria

1. THE System SHALL implementar validação de formulários via React Hook Form e Zod em todos os formulários da aplicação.
2. WHEN o usuário submete um formulário com campos inválidos, THE System SHALL exibir mensagens de erro abaixo de cada campo inválido sem recarregar a página.
3. THE System SHALL exibir mensagens de erro em português.
4. WHEN o usuário corrige um campo inválido, THE System SHALL remover a mensagem de erro do campo corrigido imediatamente.

---

### Requirement 19: API Backend

**User Story:** Como desenvolvedor, quero que o backend exponha endpoints RESTful para gerenciar promoções e imagens, para que o frontend possa realizar operações de forma segura e padronizada.

#### Acceptance Criteria

1. THE API SHALL expor os seguintes endpoints: `GET /promotions`, `GET /promotions/:id`, `POST /promotions`, `PUT /promotions/:id`, `DELETE /promotions/:id`.
2. WHEN a API recebe uma requisição nos endpoints `POST /promotions`, `PUT /promotions/:id` e `DELETE /promotions/:id`, THE API SHALL validar o JWT do Supabase Auth presente no header `Authorization: Bearer <token>`.
3. IF o JWT for inválido ou ausente, THEN THE API SHALL retornar status HTTP 401 com a mensagem `{"error": "Unauthorized"}`.
4. THE API SHALL utilizar Multer para processar o upload de imagens recebidas via `multipart/form-data` nos endpoints de criação e edição de Promotions.
5. WHEN a API recebe uma requisição `POST /promotions` com dados válidos, THE API SHALL inserir o registro na tabela `promotions` do Supabase e retornar o registro criado com status HTTP 201.
6. WHEN a API recebe uma requisição `DELETE /promotions/:id`, THE API SHALL verificar que o `user_id` do JWT corresponde ao `user_id` da Promotion antes de executar a exclusão.
7. IF o `user_id` do JWT não corresponder ao `user_id` da Promotion, THEN THE API SHALL retornar status HTTP 403 com a mensagem `{"error": "Forbidden"}`.

---

### Requirement 20: Estrutura do Projeto e Configuração

**User Story:** Como desenvolvedor, quero que o projeto esteja organizado com README, .gitignore e configurações de ambiente, para que eu possa configurar e executar o projeto facilmente.

#### Acceptance Criteria

1. THE System SHALL conter um arquivo `README.md` na raiz do projeto com instruções de instalação, configuração de variáveis de ambiente e execução do frontend e backend.
2. THE System SHALL conter um arquivo `.gitignore` na raiz do projeto que ignore os diretórios `node_modules`, arquivos `.env` e diretórios de build (`dist`, `build`).
3. THE System SHALL utilizar variáveis de ambiente via arquivos `.env` para armazenar as chaves do Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) e a porta do servidor backend.
4. THE System SHALL organizar o código em dois diretórios principais: `frontend/` para o projeto React + Vite e `backend/` para o projeto Node.js + Express.
