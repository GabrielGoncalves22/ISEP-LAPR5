# US 1020

Este documento contém a documentação relativa à *User Story (US)* 1020.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer a implementação da UI para permitir ao gestor de frota inibir/desinibir
um *robot* através de um ambiente mais bonito e agradável.
Esta *US* faz parte do módulo "Gestão de Frota" e pertence à unidade curricular de **ARQSI**.

## 2. Requisitos

***US 1020*** - Como gestor de frota pretendo inibir um *robot*.

A respeito deste requisito, entendemos que o gestor de frota deve ter ao seu dispor uma UI para inibir/desinibir um *robot*, 
em que esta UI irá ser a "ponte" entre o gestor e a API criada no *sprint* passado.

### 2.1. Dependências encontradas

- **US 370** - Como gestor de frota pretendo inibir um robot.

	**Explicação:** A API já deve suportar o pedido *PATCH* para inibir/desinibir um *robot*.

### 2.2. Critérios de aceitação

**CA 1:** Deve ser feito o uso da API desenvolvida no *sprint* anterior, para que o estado do *robot* seja persistido. Mais específicamente, a funcionalidade desenvolvida na *US* 370.

**CA 2:** O utilizador deve ser informado sobre o sucesso da operação.

**CA 3:** Se a operação falhar, deve ser dito ao utilizador o que está mal na informação inserida.

## 3. Análise

### 3.1. Respostas do cliente

Não foi necessário contactar com o cliente aquando da realização desta *US*.

### 3.2. Diagrama de Sequência do Sistema (Nível 1 - Vista de Processos)

![Diagrama de Sequência do Sistema](IMG/system-sequence-diagram-level-1.svg)

### 3.3. Diagrama de Sequência do Sistema (Nível 2 - Vista de Processos)

![Diagrama de Sequência do Sistema](IMG/system-sequence-diagram-level-2.svg)

## 4. Design

### 4.1. Diagrama de Sequência (Nível 3 - Vista de Processos - UI)

![Diagrama de Sequência](IMG/sequence-diagram-UI-level-3.svg)

### 4.2. Diagrama de Sequência (Nível 3 - Vista de Processos - MD)

![Diagrama de Sequência](IMG/sequence-diagram-MD-level-3.svg)

### 4.2. Testes

Para esta *US* foram realizados testes automáticos unitários (com isolamento via duplos) e testes automáticos E2E (sem
isolamento e com isolamento com o *backend*).

## 5. Implementação

Na realização desta *US* foi criada a UI (e respetivos estilos) que interage com o utilizador, o componente *DeviceInhibitComponent* 
e o serviço *DeviceService*.

**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/S50-16)

## 6. Integração/Demonstração

Para aceder a esta funcionalidade na *WebApp*, deve-se selecionar o tipo de utilizador "Fleet Manager" e através do menu
temos que aceder a Fleet -> Robot -> Inhibit/Disinhibit.

![Opção do menu para esta funcionalidade](IMG/menu_option.png)

Após aceder a este local, o gestor de frota tem à sua disposição um formulário onde pode selecionar o *robot* a inibit/desibinir 
no sistema.

![Vista do formulário para inibir/desinibir robot](IMG/initial_view.png)

Quando o *robot* é selecionado e é inibido ou desinibido, aparece uma mensagem a informar o gestor de frota dessa mesma 
ocorrência.

![Sucesso ao inibir/desinibir robot](IMG/successful.png)

## 7. Observações

O botão de inibir/desinibir muda a sua informação de acordo com o estado atual do *robot*, se o *robot* se encontrar ativo 
o botão ficará com a *label* *Inibir*, caso contrário com *Desibinir*.
