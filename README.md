# Gestus: Seu Gerenciador de Assinaturas 💰📊

## 💡 Sobre o Projeto

O **Gestus** é um aplicativo móvel desenvolvido em React Native/Expo com o objetivo principal de fornecer aos usuários uma ferramenta simples e eficiente para **gerenciar e monitorar seus gastos com assinaturas** (streaming, software, educação, etc.).

o projeto ainda não possui um backend dedicado, ele utiliza o [AsyncStorage] para persistir todos os dados, incluindo credenciais de usuário e informações de assinaturas, diretamente no dispositivo.

---

## ✨ Principais Funcionalidades

O aplicativo tem como principais funcionalidades:

* **Autenticação Local:** Cadastro, Login e Fluxo de Recuperação de Senha simulados, com dados persistidos localmente.
* **Visão Geral (Home):** Exibição imediata do gasto mensal total, progresso em relação às metas de gastos e lista dos próximos vencimentos.
* **Gestão Completa de Assinaturas:**
    * **Cadastro:** Adição de novas assinaturas com nome, valor, recorrência e categoria.
    * **Edição/Detalhes:** Visualização de detalhes e modificação de qualquer campo diretamente da lista.
    * **Controle de Status:** Inativação e reativação de assinaturas.
* **Metas de Gastos por Categoria:** Permite ao usuário definir limites de gastos por categoria, exibindo o progresso através de barras visuais na tela Home.
* **Notificações Reais:** Agendamento local de lembretes de pagamento usando a API nativa da Expo.
* **Relatórios:** Visualizações gráficas de gastos mensais e anuais por categoria.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e dependências principais:

| Categoria | Tecnologia | Versão/Detalhe |
| :--- | :--- | :--- |
| **Framework** | React Native | `0.81.5` |
| **Plataforma** | Expo | `~54.0.23` |
| **Estado/Persistência** | Context API & AsyncStorage | Gerenciamento de estado global de assinaturas |
| **Navegação** | React Navigation | Stack e Drawer Navigators |
| **Notificações** | expo-notifications | Para agendamento de lembretes de pagamento |
| **Gráficos** | react-native-chart-kit & react-native-svg | Utilizado nas telas de Relatórios. |

---

## 🚀 Como Executar o Projeto

Para rodar o Gestus em seu ambiente de desenvolvimento local, siga os passos abaixo:

### Pré-requisitos

1.  **Node.js (LTS)**: Instale a versão estável mais recente.
2.  **Yarn ou npm**: Gerenciador de pacotes.
3.  **Expo Go App**: Instale o aplicativo **Expo Go** em seu dispositivo móvel (Android ou iOS).

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/samelafarias/gestus.git](https://github.com/samelafarias/gestus.git)
    cd gestus/Frontend
    ```

2.  **Instale as dependências:**
    ```bash
    # Usando npm
    npm install
    
    # Ou, se preferir Yarn
    # yarn install 
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npx expo start
    ```
    Isso abrirá o Metro Bundler.

4.  **Execute no seu dispositivo:**
    * Escaneie o **QR Code** exibido no terminal (ou no navegador) usando o aplicativo **Expo Go** em seu celular.

---

## 🧠 Detalhes da Implementação

### 1. Arquitetura de Dados (Context API + AsyncStorage)

A ausência de um backend é gerenciada pela **Context API** do React, que atua como um sistema de estado global (Store).

* **Persistência (`*Service.ts`):** Os arquivos de serviço (`AuthService.ts`, `SubscriptionStorage.ts`) encapsulam toda a lógica de leitura e escrita no [AsyncStorage].
* **Estado Central (`SubscriptionProvider`):** O provedor de contexto carrega os dados iniciais do `AsyncStorage`, armazena as listas de assinaturas (`activeSubscriptions`, `inactiveSubscriptions`) e expõe funções para que qualquer componente possa ler ou modificar os dados, garantindo que a interface seja sempre atualizada.

### 2. Fluxo de Notificações 

A cada vez que o aplicativo é iniciado ou uma assinatura é salva/editada, o `SubscriptionContext` chama a função `scheduleAllReminders`. Esta função:
1.  Solicita permissão de notificação.
2.  Cancela todos os lembretes antigos agendados no sistema operacional.
3.  Calcula a data de **3 dias antes** da `firstChargeDate` para cada assinatura ativa.
4.  Agenda uma notificação local (`expo-notifications`) no sistema do dispositivo para aquela data futura.

---

## 👤 Autor

Desenvolvido por **samelafarias**.

## 📜 Licença

Este projeto foi feito com fiins acadêmicos.

---
