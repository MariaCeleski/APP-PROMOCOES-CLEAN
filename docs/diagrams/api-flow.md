# Diagramas de Fluxo da API

## Signup (Cadastro)

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant A as Supabase Auth
    participant D as Database

    C->>B: POST /api/auth/signup {name, email, cpf, password, role}
    B->>B: Validar campos
    B->>A: supabase.auth.signUp({email, password, metadata})
    A-->>B: {user, session}
    B->>D: INSERT INTO profiles (id, name, email, cpf, role)
    D-->>B: profile
    B-->>C: 201 {user, profile, token}
```

## Login

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant A as Supabase Auth
    participant D as Database

    C->>B: POST /api/auth/login {identifier, password}
    alt identifier é CPF
        B->>D: SELECT email FROM profiles WHERE cpf = ?
        D-->>B: {email}
    end
    B->>A: supabase.auth.signInWithPassword({email, password})
    A-->>B: {user, session}
    B->>D: SELECT * FROM profiles WHERE id = user.id
    D-->>B: profile
    B-->>C: 200 {user, profile, token}
```

## Criar Promoção

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant S as Storage
    participant D as Database

    C->>B: POST /api/promotions (multipart/form-data)
    B->>B: Validar JWT
    B->>B: Verificar role = establishment
    alt tem imagem
        B->>S: Upload imagem
        S-->>B: public URL
    end
    B->>D: INSERT INTO promotions {..., image_url, latitude, longitude}
    D-->>B: promotion
    B-->>C: 201 {promotion}
```

## Upload de Imagem

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant S as Supabase Storage

    C->>B: POST /api/upload (file)
    B->>B: Validar JWT
    B->>B: Validar tipo (JPEG/PNG/WebP)
    B->>B: Validar tamanho (max 5MB)
    B->>S: storage.upload(bucket, path, file)
    S-->>B: {path}
    B->>S: storage.getPublicUrl(path)
    S-->>B: {publicUrl}
    B-->>C: 201 {url: publicUrl}
```

## Buscar Promoções

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant D as Database

    C->>B: GET /api/promotions?category=Restaurantes
    B->>D: SELECT * FROM promotions WHERE category = ? ORDER BY created_at DESC
    D-->>B: [promotions]
    B-->>C: 200 {promotions}
```

## Buscar Promoções com Localização (Mapa)

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant D as Database

    C->>B: GET /api/promotions/map
    B->>D: SELECT * FROM promotions WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    D-->>B: [promotions com coordenadas]
    B-->>C: 200 {promotions}
```

## Favoritar/Desfavoritar

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant D as Database

    C->>B: POST /api/favorites/:promotionId
    B->>B: Validar JWT
    B->>D: SELECT FROM favorites WHERE user_id AND promotion_id
    alt não existe
        B->>D: INSERT INTO favorites (user_id, promotion_id)
        B-->>C: 201 "Adicionado"
    else já existe
        B-->>C: 409 "Já favoritado"
    end
```

## Geolocalização (CEP)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant V as ViaCEP
    participant N as Nominatim

    U->>F: Digita CEP (8 dígitos)
    F->>F: Debounce 500ms
    F->>V: GET viacep.com.br/ws/{cep}/json
    V-->>F: {logradouro, localidade, uf}
    F->>F: Preenche campos de endereço
    F->>N: GET nominatim/search?q={endereço}
    N-->>F: [{lat, lon}]
    F->>F: Salva coordenadas no estado
```

## Geolocalização (GPS)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant G as Browser Geolocation
    participant N as Nominatim

    U->>F: Clica "Usar minha localização"
    F->>G: navigator.geolocation.getCurrentPosition()
    G->>U: Solicita permissão
    U-->>G: Permite
    G-->>F: {latitude, longitude}
    F->>F: Salva coordenadas
    F->>N: GET nominatim/reverse?lat={lat}&lon={lon}
    N-->>F: {address, city, state, postcode}
    F->>F: Preenche campos de endereço
```

## Deletar Promoção

```mermaid
sequenceDiagram
    participant C as Cliente
    participant B as Backend
    participant D as Database
    participant S as Storage

    C->>B: DELETE /api/promotions/:id
    B->>B: Validar JWT
    B->>D: SELECT user_id FROM promotions WHERE id = ?
    D-->>B: {user_id}
    B->>B: Verificar user_id == JWT user
    alt é dono
        B->>D: DELETE FROM promotions WHERE id = ?
        D-->>B: OK
        B-->>C: 204 No Content
    else não é dono
        B-->>C: 403 Forbidden
    end
```
