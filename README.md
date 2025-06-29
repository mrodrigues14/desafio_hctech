# 🚗 HCTech Cars - Sistema de Catálogo de Carros

Um sistema web completo para visualização e gerenciamento de catálogo de carros, desenvolvido com Next.js e NestJS.

## 📋 Sobre o Projeto

Este projeto foi desenvolvido como parte de um desafio técnico, implementando um sistema web para venda de carros onde qualquer usuário pode visualizar a listagem de carros, mas apenas usuários autenticados (administradores) podem gerenciar o catálogo.

### ✨ Funcionalidades Principais

- 🔍 **Listagem Pública de Carros** - Visualização de todos os carros sem necessidade de login
- 🔐 **Sistema de Autenticação JWT** - Login seguro com controle de sessão
- 👤 **Controle de Acesso por Roles** - Diferenciação entre usuário comum e administrador
- ⚙️ **CRUD Completo** - Gerenciamento completo de carros (apenas para admins)
- 📱 **Interface Responsiva** - Experiência otimizada para desktop e mobile
- 🖼️ **Upload de Imagens** - Suporte a múltiplas imagens por carro
- 📊 **Dashboard Analytics** - Métricas e estatísticas do catálogo
- 🔔 **Notificações** - Mensagens de sucesso e erro para todas as operações
- ⏰ **Sessão Controlada** - Expiração automática em 1 hora com avisos

## 🛠️ Tecnologias Utilizadas

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

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd desafio-hctech
```

### 2. Backend (NestJS)
```bash
# Navegar para a pasta do backend
cd backend

# Instalar dependências
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run start:dev
```
O backend estará rodando em: `http://localhost:8080`

### 3. Frontend (Next.js)
```bash
# Em outro terminal, navegar para a pasta do frontend
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run dev
```
O frontend estará rodando em: `http://localhost:3000`

### 4. Executar Testes
```bash
# No frontend
cd frontend
npm test

# Para executar testes em modo watch
npm run test:watch
```

## 👤 Credenciais de Acesso

O sistema possui usuários mockados para teste:

### Administrador
- **Usuário:** `admin`
- **Senha:** `admin123`
- **Permissões:** Acesso completo ao sistema (CRUD de carros, dashboard, gestão de usuários)

### Usuário Comum
- **Usuário:** `usuario`
- **Senha:** `usuario123`
- **Permissões:** Visualização do catálogo apenas

## 🗂️ Estrutura do Projeto

```
desafio-hctech/
├── backend/                 # API NestJS
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

## 📱 Páginas e Funcionalidades

### Públicas (Sem autenticação)
- **Página Inicial** (`/`) - Hero section e carros em destaque
- **Catálogo** (`/catalogo`) - Lista completa com filtros
- **Detalhes do Carro** (`/carros/[id]`) - Visualização individual
- **Login** (`/login`) - Formulário de autenticação

### Protegidas (Apenas Admins)
- **Gestão** (`/gestao`) - CRUD de carros e usuários
- **Dashboard** (`/gestao/dashboard`) - Analytics e métricas

## 🔧 Recursos Implementados

### Sistema de Carros
- ✅ Listagem com todos os atributos (modelo, marca, imagem, cor, valor)
- ✅ Filtros por marca, preço e cor
- ✅ Busca por texto
- ✅ Ordenação customizada
- ✅ Upload de múltiplas imagens
- ✅ Galeria de imagens responsiva

### Autenticação e Segurança
- ✅ JWT com expiração de 1 hora
- ✅ Middleware de autenticação no backend
- ✅ Proteção de rotas no frontend
- ✅ Controle de acesso por roles
- ✅ Sessão sempre inicia deslogada
- ✅ Avisos de sessão prestes a expirar

### Interface e UX
- ✅ Design responsivo e moderno
- ✅ Componentes reutilizáveis
- ✅ Loading states e error handling
- ✅ Navegação intuitiva
- ✅ Mensagens de feedback
- ✅ Breadcrumbs e navegação

### Testes
- ✅ 55 testes automatizados passando
- ✅ Cobertura de componentes principais
- ✅ Testes de integração de autenticação
- ✅ Validação de fluxos de navegação

## 📊 Endpoints da API

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

## 🧪 Validações e Tratamento de Erros

### Backend
- Validação de dados de entrada
- Autenticação obrigatória para operações sensíveis
- Tratamento de erros HTTP apropriados
- Validação de tipos de arquivo para upload

### Frontend
- Validação de formulários
- Estados de loading e error
- Mensagens de feedback para o usuário
- Proteção de rotas baseada em autenticação

## 🎯 Diferenciais Implementados

- **Sistema de Roles**: Controle granular de permissões
- **Upload de Múltiplas Imagens**: Galeria rica para cada carro
- **Dashboard Analytics**: Métricas e estatísticas do negócio
- **Filtros Avançados**: Busca e filtros intuitivos
- **Sessão Inteligente**: Controle automático de expiração
- **Testes Abrangentes**: 55 testes cobrindo cenários críticos
- **Design Responsivo**: Experiência otimizada para todos os dispositivos

## 📈 Métricas de Qualidade

- ✅ **100% dos requisitos** do desafio implementados
- ✅ **55/55 testes** passando
- ✅ **TypeScript** em todo o projeto
- ✅ **Responsividade** completa
- ✅ **Segurança** com JWT e proteção de rotas
- ✅ **Performance** otimizada com Next.js

---

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido seguindo as melhores práticas de desenvolvimento web moderno, com foco em:

- **Código limpo e organizad**
- **Componentes reutilizáveis**
- **Separação de responsabilidades**
- **Testes automatizados**
- **Documentação clara**
- **Experiência do usuário**

Para dúvidas ou sugestões, entre em contato!