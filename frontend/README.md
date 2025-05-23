# Fit Meet - Plataforma de Atividades Físicas

![Feet Meet Logo](src/assets/complete-logo.svg)

## 📋 Sumário

| Seção                          | Descrição                                                                 |
|--------------------------------|---------------------------------------------------------------------------|
| [📖 Apresentação do Projeto](#-apresentação-do-projeto)               | Introdução ao projeto e seus objetivos.                                  |
| [⚙️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)               | Tecnologias e ferramentas usadas no desenvolvimento.                     |
| [📂 Estrutura do Projeto](#-estrutura-do-projeto)                     | Organização dos diretórios e arquivos do projeto.                        |
| [🚀 Como Instalar e Rodar o Projeto](#-como-instalar-e-rodar-o-projeto) | Passos para configurar e executar o projeto localmente ou via Docker.    |
| [📌 Funcionalidades](#-funcionalidades)                               | Lista de funcionalidades principais da aplicação.                        |

---

## 📖 Apresentação do Projeto

O **Fit Meet** é uma plataforma web desenvolvida para conectar pessoas interessadas em atividades físicas. A aplicação permite que usuários criem, gerenciem e participem de atividades esportivas, promovendo um estilo de vida saudável e colaborativo.

### Principais Recursos:
- **Criação de Atividades**: Crie eventos com título, descrição, data, local e tipo de atividade.
- **Gerenciamento de Participantes**: Aprove ou rejeite solicitações de participação.
- **Check-in**: Sistema de códigos para confirmação de presença.
- **Recomendações Personalizadas**: Sugestões de atividades com base nas preferências do usuário.
- **Mapas Interativos**: Localização precisa das atividades usando Leaflet.
- **Perfil de Usuário**: Visualize conquistas, nível e histórico de atividades.

### Alguns Diferenciais:
- **Uso de Toasts (Sonner)**: Para melhor visualização de respostas das ações do usuário ou API.
- **Botão de LogOut**: Botão para melhorar a dinâmica de LogOut, facilitado testes manuais.

---

## ⚙️ Tecnologias Utilizadas

### **Frontend**
- **Linguagens**: TypeScript, JavaScript, CSS
- **Frameworks e Bibliotecas**:
  - React 19
  - React Router 7
  - Tailwind CSS 4
  - Shadcn UI / Radix UI
  - Leaflet (Mapas Interativos)
  - Embla Carousel (Carrossel de conquistas)
  - Axios (Comunicação com API)
  - Zod (Validação de dados)
  - React Hook Form (Formulários)
  - Lucide React (Ícones)
  - Sonner (Notificações)

### **Backend**
- **Docker**: Gerenciamento de contêineres para o backend.

### **Ferramentas de Build**
- Vite
- ESLint
- TypeScript ESLint

---

## 🚀 Como Instalar e Rodar o Projeto

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (v16+)
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **Git**

### Instalando o Backend (Docker)

1. Clone o repositório:
```bash
git clone https://github.com/username/Vinicius-Cau-Oliveira-Gonzaga.git
cd Vinicius-Cau-Oliveira-Gonzaga/frontend
```
2. Inicie o contêiner Docker:
```bash
docker-compose up -d
```

3. Verifique se o backend está rodando:
```bash
docker ps
```

O backend estará disponível em: `http://localhost:3000`.

### Instalando o Frontend

1. Navegue para a pasta do frontend:
```bash
cd ../frontend
```
2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Acesse a aplicação no navegador:
O frontend estará disponível em: `http://localhost:5173/` (Vite).

**Inicie o seu acesso em:** `http://localhost:5173/login` ou `http://localhost:5173/register`.
## 📂 Estrutura do Projeto
```
frontend/
├── src/
│   ├── api/                 # Configuração e rotas de API
│   ├── assets/              # Imagens e recursos estáticos
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── ActivitiesComponents/    # Componentes relacionados a atividades
│   │   ├── DialogComponents/        # Modais (Dialogs)
│   │   ├── HomeComponents/          # Componentes da página inicial
│   │   ├── MapsComponents/          # Componentes de mapas
│   │   ├── ui/                      # Componentes de UI básicos
│   │   └── UserProfileComponents/   # Componentes de perfil de usuário
│   ├── contexts/            # Contextos React (ex.: userDataApi)
│   ├── lib/                 # Funções utilitárias
│   ├── Routes/              # Definições de rotas da aplicação
│   ├── screens/             # Páginas principais
│   ├── types/               # Definições de tipos TypeScript
│   └── zodSchemas/          # Esquemas de validação Zod
├── public/                  # Arquivos públicos acessíveis diretamente
└──                # Arquivo HTML principal
```

## 📌 Funcionalidades
- Criação de Atividades: Crie eventos com informações detalhadas.
- Gerenciamento de Participantes: Aprove ou rejeite inscrições.
- Check-in: Confirme presença com códigos únicos.
- Recomendações Personalizadas: Sugestões baseadas nas preferências do usuário.
- Mapas Interativos: Localização precisa das atividades.
- Perfil de Usuário: Histórico, conquistas e nível.

[⬆️ Voltar ao Topo](#feet-meet---plataforma-de-atividades-físicas)
