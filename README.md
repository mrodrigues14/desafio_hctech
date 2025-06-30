# HCTech Cars - Sistema de Catálogo de Carros

Um sistema web completo para visualização e gerenciamento de catálogo de carros, desenvolvido com Next.js e NestJS.

## Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico, implementando um sistema web para venda de carros onde qualquer usuário pode visualizar a listagem de carros, mas apenas usuários autenticados (administradores) podem gerenciar o catálogo.

## Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js para APIs REST
- **TypeScript** - Linguagem principal
- **JWT** - Autenticação e autorização
- **Multer** - Upload de arquivos
- **Passport** - Estratégias de autenticação

### Frontend
- **Next.js 15** - Framework React com App Router
- **TypeScript** - Linguagem principal
- **Tailwind CSS** - Estilização e design system
- **React Hooks** - Gerenciamento de estado
- **Context API** - Estado global de autenticação

### Testes
- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes
- **55 testes automatizados** - Cobertura completa dos componentes principais

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Execução Simplificada 

```bash
# 1. Clone o repositório
git clone https://github.com/mrodrigues14/desafio_hctech
cd desafio-hctech

# 2. Instale as dependências 
npm run install:frontend
npm run install:backend

# 3. Execute o comando único para rodar frontend e backend
npm run dev
```

Este comando irá:
- Iniciar o backend em `http://localhost:8080`
- Iniciar o frontend em `http://localhost:3000`
- Executar ambos simultaneamente em terminais separados

### Execução Manual (Alternativa)

#### 1. Backend (NestJS)
```bash
# Navegar para a pasta do backend
cd backend

# Instalar dependências
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run start:dev
```
O backend estará rodando em: `http://localhost:8080`

#### 2. Frontend (Next.js)
```bash
# Em outro terminal, navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run dev
```
O frontend estará rodando em: `http://localhost:3000`

### 3. Executar Testes
```bash
# Testes do Frontend
cd frontend
npm test

# Para executar testes em modo watch (frontend)
npm run test:watch

# Testes do Backend
cd backend
npm test

# Para executar testes em modo watch (backend)
npm run test:watch
```

### Scripts Disponíveis na Raiz do Projeto

```bash
# Instalar dependências apenas do frontend
npm run install:frontend

# Instalar dependências apenas do backend
npm run install:backend

# Executar frontend e backend simultaneamente
npm run dev
```

## Credenciais de Acesso

O sistema possui usuários mockados para teste:

### Administrador
- **Usuário:** `admin`
- **Senha:** `admin123`
- **Permissões:** Acesso completo ao sistema (CRUD de carros, dashboard, gestão de usuários)

### Usuário Comum
- **Usuário:** `usuario`
- **Senha:** `usuario123`
- **Permissões:** Visualização do catálogo apenas

## Estrutura do Projeto

```
desafio-hctech/
├── backend/                 
│   ├── src/
│   │   ├── auth/           # Módulo de autenticação
│   │   ├── cars/           # Módulo de carros
│   │   ├── users/          # Módulo de usuários
│   │   └── main.ts         # Ponto de entrada
│   └── uploads/            # Arquivos de upload
├── frontend/               # Aplicação Next.js
│   ├── src/
│   │   ├── app/            # Pages (App Router)
│   │   ├── components/     # Componentes React
│   │   ├── contexts/       # Context providers
│   │   ├── services/       # Serviços de API
│   │   └── types/          # Definições TypeScript
└── README.md
```

## Páginas e Funcionalidades

### Públicas (Sem autenticação)
- **Página Inicial** (`/`) - Hero section e carros em destaque
- **Catálogo** (`/catalogo`) - Lista completa com filtros
- **Detalhes do Carro** (`/carros/[id]`) - Visualização individual
- **Login** (`/login`) - Formulário de autenticação

### Protegidas (Apenas Admins)
- **Gestão** (`/gestao`) - CRUD de carros e usuários
- **Dashboard** (`/gestao/dashboard`) - Analytics e métricas

## Recursos Implementados

### Sistema de Carros
- Listagem com todos os atributos (modelo, marca, imagem, cor, valor)
- Filtros por marca, preço e cor
- Busca por texto
- Ordenação customizada
- Upload de múltiplas imagens
- Galeria de imagens responsiva

### Autenticação e Segurança
- JWT com expiração de 1 hora
- Middleware de autenticação no backend
- Proteção de rotas no frontend
- Controle de acesso por roles
- Sessão sempre inicia deslogada
- Avisos de sessão prestes a expirar

### Testes
- 55 testes automatizados passando
- Cobertura de componentes principais
- Testes de integração de autenticação
- Validação de fluxos de navegação

## Endpoints da API

### Públicos
- `GET /cars` - Listar todos os carros
- `GET /cars/:id` - Obter carro específico
- `POST /auth/login` - Fazer login

### Protegidos (Requer token JWT)
- `POST /cars` - Criar carro
- `PATCH /cars/:id` - Atualizar carro
- `DELETE /cars/:id` - Remover carro
- `GET /users` - Listar usuários
- `POST /cars/upload` - Upload de imagem


## Diferenciais Implementados

- **Sistema de Roles**: Controle granular de permissões
- **Upload de Múltiplas Imagens**: Galeria rica para cada carro
- **Dashboard Analytics**: Métricas e estatísticas do negócio
- **Filtros Avançados**: Busca e filtros intuitivos
- **Sessão Inteligente**: Controle automático de expiração
- **Testes Abrangentes**: 55 testes cobrindo cenários críticos
- **Design Responsivo**: Experiência otimizada para todos os dispositivos

## Métricas de Qualidade

- **100% dos requisitos** do desafio implementados
- **55/55 testes** passando
- **TypeScript** em todo o projeto
- **Responsividade** completa
- **Segurança** com JWT e proteção de rotas
- **Performance** otimizada com Next.js
