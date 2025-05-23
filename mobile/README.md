# Fit Meet Mobile - Plataforma de Atividades Físicas

![Feet Meet Logo](assets/images/Logo.png)

## 📋 Sumário

| Seção                          | Descrição                                                                 |
|--------------------------------|---------------------------------------------------------------------------|
| [📖 Apresentação do Projeto](#-apresentação-do-projeto)               | Introdução ao projeto e seus objetivos.                                  |
| [⚙️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)               | Tecnologias e ferramentas usadas no desenvolvimento.                     |
| [📂 Estrutura do Projeto](#-estrutura-do-projeto)                     | Organização dos diretórios e arquivos do projeto.                        |
| [🚀 Como Instalar e Rodar o Projeto](#-como-instalar-e-rodar-o-projeto) | Passos para configurar e executar o projeto.    |
| [⚠️ Notas Importantes](#️-notas-importantes)                          | Configurações necessárias para o funcionamento correto.                  |

---

## 📖 Apresentação do Projeto

O **Feet Meet Mobile** é uma aplicação móvel desenvolvida para conectar pessoas interessadas em atividades físicas. A aplicação permite que usuários criem, gerenciem e participem de atividades esportivas, promovendo um estilo de vida saudável e colaborativo.

### Principais Recursos:
- **Criação de Atividades**: Crie eventos com título, descrição, data, local e tipo de atividade.
- **Gerenciamento de Participantes**: Aprove ou rejeite solicitações de participação.
- **Check-in**: Sistema de códigos para confirmação de presença.
- **Recomendações Personalizadas**: Sugestões de atividades com base nas preferências do usuário.
- **Mapas Interativos**: Localização precisa das atividades usando Google Maps.
- **Perfil de Usuário**: Visualize conquistas, nível e histórico de atividades.

### Alguns Diferenciais:
- **Sistema de Notificações**: Toast notifications para melhor experiência do usuário.
- **Easter Egg**: Pequena surpresa interativa na tela inicial.
- **Pull-to-refresh**: Atualização de dados ao puxar a tela para baixo (Somente na página home).

---

## ⚙️ Tecnologias Utilizadas

### **Mobile**
- **Linguagens**: TypeScript, JavaScript
- **Frameworks e Bibliotecas**:
  - React Native 0.79.1
  - React 19.0.0
  - React Navigation 7
  - Phosphor React Native (Ícones)
  - React Native Maps
  - React Native Toast Message
  - React Native Keychain (Armazenamento seguro)
  - Axios (Comunicação com API)
  - React Native Gesture Handler
  - React Native DateTimePicker
  - React Native Image Picker

### **Ferramentas de Build e Desenvolvimento**
- ESLint
- TypeScript
- Android Studio / Xcode (para emuladores)

## 📂 Estrutura do Projeto

```
mobile/
├── android/               # Configurações específicas do Android
├── ios/                   # Configurações específicas do iOS
├── assets/                # Fontes e recursos estáticos
│   └── fonts/             # Fontes personalizadas (Bebas Neue, DMSans)
├── src/
│   ├── api/               # Configuração de API e endpoints
│   ├── assets/            # Assets da aplicação (imagens, temas)
│   │   └── themes/        # Definições de cores e estilos
│   ├── components/        # Componentes React Native reutilizáveis
│   │   ├── activityCardComponent/     # Card de atividades
│   │   ├── activityCreateModalComponent/ # Modal de criação de atividades
│   │   ├── datePickerComponent/       # Seletor de data personalizado
│   │   ├── dialogComponent/           # Componentes de diálogo
│   │   ├── mapsComponent/             # Integração com mapas
│   │   └── participantsListComponent/ # Lista de participantes
│   ├── context/           # Gerenciamento de estado global
│   │   ├── reducer/       # Reducers para o estado
│   │   └── state/         # Definições de estado
│   ├── hooks/             # Hooks personalizados
│   ├── interfaces/        # Interfaces e tipos TypeScript
│   │   └── routes/        # Definições de rotas
│   ├── models/            # Modelos de dados da aplicação
│   │   ├── activities/    # Modelos de atividades
│   │   └── user/          # Modelos de usuário
│   ├── routes/            # Configuração de rotas da aplicação
│   ├── screens/           # Telas principais
│   │   ├── ActivitiesViews/  # Visualizações de atividades
│   │   ├── home/             # Tela inicial
│   │   ├── login/            # Tela de login
│   │   ├── register/         # Tela de registro
│   │   └── userProfile/      # Perfil do usuário
│   ├── toast/             # Configuração de notificações toast
│   └── utils/             # Funções utilitárias 
```

## 🚀 Como Instalar e Rodar o Projeto

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:
- **Node.js** (v16+)
- **npm** ou **yarn**
- **React Native CLI**
- **Android Studio** (para desenvolvimento Android)
- **Xcode** (para desenvolvimento iOS - apenas macOS)
- **Git**

### Instalação e Configuração

1. Clone o repositório:
```bash
git clone https://github.com/username/Vinicius-Cau-Oliveira-Gonzaga.git
cd Vinicius-Cau-Oliveira-Gonzaga/mobile
```

2. Instale as dependências:
```bash
npm install
```

3. Configuração da api:
- Para emuladores Android:
```bash
const baseURL = 'http://10.0.2.2:3000';
```

- Para dispositivos físicos:
```bash
const baseURL = 'http://192.168.x.x:3000';
```

Para descobrir seu IP local, execute no prompt de comando:
```bash
ipconfig
```

5. Configure a chave da API do Google Maps no `AndroidManifest.xml` (para a funcionalidade de mapas)

6. Comando de execução:

```bash
npm run android

ou

npm run android --legacy-peer-deps
```

7. Rodar o backend via Docker:
- Na pasta do projeto, execute:

```
docker compose up -d
```

## ⚠️ Notas Importantes
Qualquer erro com os comandos citados 👆, por favor, faça uma limpeza de caches.
- Apague a pasta `build` do android;
- Apague a pasta `node_modules`;
- Apague a `package-lock.json`;
Depois:

```bash
cd android
./gradlew clean
cd ..
```

[⬆️ Voltar ao Topo](#fit-meet-mobile---plataforma-de-atividades-físicas)
