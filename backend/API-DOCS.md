# API Backend - Desafio HCTech

## Descrição
API REST desenvolvida com NestJS para gerenciamento de carros com autenticação JWT.

## Funcionalidades
- ✅ Autenticação JWT com usuário mockado
- ✅ CRUD completo de carros
- ✅ Visualização pública de carros (sem autenticação)
- ✅ Rotas de gerenciamento protegidas por autenticação
- ✅ Validações apropriadas
- ✅ Mensagens de erro/sucesso adequadas

## Configuração

### Usuário Mockado
- **Username:** `admin`
- **Password:** `admin123`

### Variáveis de Ambiente
```
JWT_SECRET=your-super-secret-jwt-key
PORT=8080
```

## Endpoints

### Autenticação

#### POST /auth/login
Fazer login e obter token JWT

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin"
  }
}
```

### Carros

#### GET /cars (Público)
Listar todos os carros - Não requer autenticação

**Response:**
```json
[
  {
    "id": 1,
    "modelo": "Civic",
    "marca": "Honda",
    "imagemUrl": "https://example.com/civic.jpg",
    "cor": "Prata",
    "valor": 120000
  }
]
```

#### GET /cars/:id (Público)
Obter um carro específico - Não requer autenticação

### Carros - Gerenciamento (Rotas Protegidas - Requer Token)

Para todas as rotas de gerenciamento abaixo, incluir o header:
```
Authorization: Bearer {token}
```

#### POST /cars
Criar um novo carro

**Body:**
```json
{
  "modelo": "Civic",
  "marca": "Honda",
  "imagemUrl": "https://example.com/civic.jpg",
  "cor": "Prata",
  "valor": 120000
}
```

#### PATCH /cars/:id
Atualizar um carro

**Body:**
```json
{
  "modelo": "Civic Si",
  "valor": 135000
}
```

#### DELETE /cars/:id
Remover um carro

**Response:**
```json
{
  "message": "Carro removido com sucesso"
}
```

## Como Usar

### Visualização Pública
1. Inicie o servidor: `npm run start:dev`
2. Acesse `GET /cars` ou `GET /cars/:id` diretamente - não é necessário autenticação

### Gerenciamento (Requer Autenticação)
1. Inicie o servidor: `npm run start:dev`
2. Faça login em `POST /auth/login` para obter o token
3. Use o token no header `Authorization: Bearer {token}` para acessar as rotas de gerenciamento (POST, PATCH, DELETE)

## Validações

### Login
- Username e password são obrigatórios

### Carros
- Modelo: string obrigatória
- Marca: string obrigatória
- ImagemUrl: URL válida obrigatória
- Cor: string obrigatória
- Valor: número >= 0 obrigatório

## Tratamento de Erros

- **401 Unauthorized:** Token inválido ou expirado
- **404 Not Found:** Carro não encontrado
- **400 Bad Request:** Dados de entrada inválidos
