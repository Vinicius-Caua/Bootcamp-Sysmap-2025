# 🚀 Desafio Técnico - API Back-End

API para gerenciamento de atividades, participantes e conquistas com funcionalidades completas de CRUD, autenticação e integração com AWS S3 (LocalStack).

## 📑 Sumário

| Seção                          | Descrição                                                                 |
|--------------------------------|---------------------------------------------------------------------------|
| [🚀 Desafio Técnico](#-desafio-técnico---engenheiro-back-end) | Introdução ao projeto e seus objetivos.                                  |
| [🛠 Tecnologias utilizadas](#-tecnologias-utilizadas)         | Tecnologias e ferramentas usadas no desenvolvimento.                     |
| [🏗 Estrutura do Projeto](#-estrutura-do-projeto)             | Organização dos diretórios e arquivos do projeto.                        |
| [🚀 Execução](#-execução)                                     | Passos para configurar e executar o projeto localmente ou via Docker.    |
| [🐳 Docker Compose File](#-docker-compose-file)               | Configuração do Docker Compose para o ambiente do projeto.               |
| [📜 Scripts (package.json)](#-scripts-packagejson)            | Scripts disponíveis no arquivo `package.json`.                           |
| [🔐 Variáveis de Ambiente](#-variáveis-de-ambiente-env)       | Configuração das variáveis de ambiente necessárias para o projeto.        |
| [📚 Documentação da API](#-documentação-da-api)               | Detalhes sobre a documentação interativa da API (Swagger).               |
| [🧪 Testes](#-testes)                                         | Comandos para executar os testes do projeto.                             |
| [🧪 Cobertura de Testes](#-cobertura-de-testes)               | Resumo da cobertura de testes da aplicação.                              |
| [🏆 Conquistas](#-conquistas)                                 | Lista de conquistas e condições para desbloqueá-las.                     |
| [📦 Dependências](#-dependências)                             | Lista de dependências e devDependencies do projeto.                      |
| [🐳 Dockerfile](#-dockerfile)                                 | Configuração do Dockerfile para o projeto.                               |
| [📊 Diagrama de Entidades (ERD)](#-diagrama-de-entidades-erd)                                           | Diagrama de Entidades Relacionamento.                                    |
| [🤖 Autor](#-autor)                                           | Informações sobre o autor do projeto.                                    |

## 🛠 Tecnologias utilizadas

- **Runtime**: Node.js 22.14.0
- **Linguagem**: TypeScript 5.8
- **Framework**: Express 4.21
- **ORM**: Prisma 6.5
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT + bcryptjs
- **Validação**: Zod 3.24
- **Testes**: Jest 29 + Supertest
- **Documentação**: Swagger UI
- **Infraestrutura**: Docker + LocalStack
- **Armazenamento**: AWS S3 (simulado com LocalStack)

## 🏗 Estrutura do Projeto

```
backend/
├── prisma/                # Configuração do Prisma e migrações
├── src/
│   ├── controllers/       # Controladores da API
│   ├── middlewares/       # Middlewares (ex.: autenticação)
│   ├── repository/        # Repositórios para acesso ao banco de dados
│   ├── service/           # Lógica de negócios
│   ├── swagger/           # Documentação Swagger
│   ├── tests/             # Testes unitários e de integração
│   ├── types/             # Tipos TypeScript
│   ├── validations/       # Validações de entrada
├── README.md
```

## 🚀 Execução

### Pré-requisitos

- Node.js 22.x
- PostgreSQL (caso rode sem docker)
- Docker (opcional)

### 🔧 Configuração (Local)

```bash
git clone <url-repositorio>
cd backend
npm install
npx prisma migrate dev
npm run seed 
npm run dev
```

### 🔧 Configuração (Docker Compose)

```bash
cd backend
npm install
docker compose up -d 
```

Após rodar o docker compose up, veja o guia no tópico **[📚 Documentação da API](#-documentação-da-api)**.


## 🔐 Variáveis de Ambiente (.env) - Execução Docker Compose

```env
## Database
DATABASE_URL="postgresql://desafio:desafio@bootcampPostgres:5432/desafio?schema=public"

## Index API
API_PORT="3000"

## JWT
JWT_SECRET=asjhfbauicneuan34643645fhuhasibicasfaahuuawncuscn2317237423hubngf9435y3fh3723hdf

## LocalStack
BUCKET_NAME=bootcamp
S3_ENDPOINT=http://localstack:4566
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```
### Caso rode a aplicação sem dockerizer a API, deve alterar os campos:
- DATABASE_URL="postgresql://desafio:desafio@localhost:5432/desafio?schema=public"
- S3_ENDPOINT=http://localhost:4566

## 🐳 Docker Compose File

```yaml
services:
  postgresql:
    image: postgres
    container_name: bootcampPostgres
    environment:
      POSTGRES_USER: desafio
      POSTGRES_PASSWORD: desafio
      POSTGRES_DB: desafio
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U desafio -d desafio"]
      interval: 5s
      timeout: 5s
      retries: 5

  localstack:
    image: localstack/localstack
    container_name: localstack_desafio_sysmap
    ports:
      - "4566:4566"
    environment:
      - SERVICES=s3
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=desafio
      - AWS_SECRET_ACCESS_KEY=desafio

  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    depends_on:
      postgresql:
        condition: service_healthy
      localstack:
        condition: service_started
```

## 📜 Scripts (package.json)

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc --project tsconfig.json",
    "seed": "ts-node prisma/seed.ts",
    "start": "prisma migrate deploy && npm run seed && npm run build && node dist/index.js",
    "test": "jest"
  }
}
```

## 📚 Documentação da API

A API possui uma documentação interativa utilizando o **Swagger UI**, que pode ser acessada em:

**[http://localhost:3000/docs](http://localhost:3000/docs)**

### Recursos Disponíveis na Documentação:

- **🔐 Autenticação JWT**: Teste endpoints protegidos fornecendo seu token JWT diretamente no Swagger.
- **📄 Schemas de Entidades**: Visualize os modelos de dados utilizados na API.
- **📤 Exemplos de Requests/Responses**: Veja exemplos detalhados de requisições e respostas para cada endpoint.
- **🛠 Testes Interativos**: Execute chamadas diretamente na interface do Swagger para testar os endpoints.

### Ferramentas Recomendadas:

⚠️ Caso esteja enfrentando problemas com o swagger, recomendo o uso de ferramentas como:

- **Postman**
- **Insomnia**

## 🧪 Testes

```bash
npm test
```

```bash
npx jest --coverage
```

## 🧪 Cobertura de Testes

Abaixo está o resumo da cobertura de testes atual da aplicação:

| Arquivo                          | % Statements | % Branches | % Functions | % Lines | Linhas Não Cobertas       |
| -------------------------------- | ------------ | ---------- | ----------- | ------- | ------------------------- |
| **Todos os Arquivos**            | 48.59%       | 6.94%      | 30.68%      | 49.47%  | -                         |
| `controllers/activityController` | 36.69%       | 0%         | 33.33%      | 36.89%  | 377-397, 404-418, 432-433 |
| `controllers/authController`     | 87.5%        | 66.66%     | 100%        | 87.5%   | 26-27, 52-53              |
| `controllers/userController`     | 55.81%       | 0%         | 53.84%      | 57.31%  | 91-92, 102-115, 121-131   |
| `middlewares/errorHandler`       | 28.57%       | 0%         | 0%          | 28.57%  | 10-15                     |

### 📊 Observações:

- A cobertura geral está em **49.47%** para linhas de código.
- O arquivo `authController` apresenta a melhor cobertura, com **87.5%** de statements e **100%** de funções.
- O arquivo `activityController` e o middleware `errorHandler` precisam de mais atenção, com cobertura abaixo de **40%**.

## 🏆 Conquistas

| Badge                             | Condição                                            |
| --------------------------------- | --------------------------------------------------- |
| 🎮 **Primeiro Login**             | Primeiro login no sistema                           |
| 📍 **Primeiro Check-in**          | Primeira confirmação de presença em atividade       |
| 🏗 **A Primeira de Muitas**        | Criou uma atividade pela primeira vez               |
| 🏗 **Criador de Atividades**       | Criou 3 atividades diferentes                       |
| ✅ **Tudo que Começa tem um Fim** | Encerrou (concluiu) uma atividade pela primeira vez |
| 🏅 **Nível 5**                    | Alcançou o nível 5 de experiência                   |
| 🏅 **Nível 10**                   | Alcançou o nível 10 de experiência                  |
| 🔄 **Participante Frequente**     | Fez o check-in em 5 atividades                      |
| 🖼 **Estou bonito hoje**           | Atualizou o avatar pela primeira vez                |
| 🎯 **Sou exigente**               | Definiu a sua primeira preferência                  |
| 👑 **Rei das Conquistas**         | Já tem mais de 5 conquistas                         |

## 📦 Dependências

```json
{
  "dependencies": {
    "@prisma/client": "^6.5.0",
    "aws-sdk": "^3.772.0",
    "bcryptjs": "^3.0.2",
    "express": "^5.0.1",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/jest": "^29.5.14",
    "jest": "^29.7.0",
    "prisma": "^6.5.0",
    "supertest": "^7.1.0"
  }
}
```

## 🐳 Dockerfile

```dockerfile
FROM node:22.11.0
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Diagrama de Entidades (ERD)

Abaixo está o diagrama de entidades do banco de dados utilizado na aplicação:

```mermaid
erDiagram
    UserAchievements {
        UUID id
        UUID achievementId
        UUID userId
    }

    Users {
        UUID id
        String name
        String email
        String cpf
        String password
        String avatar
        Integer xp
        Integer level
        Date deletedAt
    }

    Achievements {
        UUID id
        String name
        String criterion
    }

    Preferences {
        UUID id
        UUID userId
        UUID typeId
    }

    ActivityAddresses {
        UUID id
        UUID activityId
        Double latitude
        Double longitude
    }

    Activities {
        UUID id
        String title
        String description
        ActivityType type
        String confirmationCode
        String image
        Date scheduledDate
        Date createdAt
        Date deletedAt
        Date completedAt
        Boolean private
        UUID creatorId
    }

    ActivityParticipants {
        UUID id
        UUID activityId
        UUID userId
        Boolean approved
        Date confirmedAt
    }

    ActivityTypes {
        UUID id
        String name
        String description
        String image
    }

    Users ||--o{ UserAchievements : "has"
    Users ||--o{ Preferences : "has"
    Achievements ||--o{ UserAchievements : "has"
    Activities ||--o{ ActivityAddresses : "has"
    Activities ||--o{ ActivityParticipants : "has"
    ActivityTypes ||--o{ Activities : "has"
    ActivityParticipants ||--o{ Users : "has"
    Preferences ||--o{ Users : "belongs to"
    ActivityAddresses ||--o{ Activities : "belongs to"
    ActivityParticipants ||--o{ Activities : "belongs to"
```

## 🤖 Autor

`Vinicius Cauã Oliveira Gonzaga`
