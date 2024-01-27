# US 1180

Este documento contém a documentação relativa à *User Story (US)* 1180.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer a implementação da UI para permitir ao gestor de campus edite uma passageway de dois edifícios através de um ambiente mais bonito e agradável.
Esta *US* faz parte do módulo "Gestão de Campus" e pertence à unidade curricular de **ARQSI**.

## 2. Requisitos

***US 1180*** - Como gestor de Campus pretendo editar uma Passagem entre 2 Edifícios.

A respeito deste requisito, entendemos que o gestor de campus deve ter ao seu dispor uma UI para editar uma passageway de dois edifícios, em que esta UI irá ser a "ponte" entre o gestor e a API criada no *sprint* passado.

### 2.1. Dependências encontradas

- **US 240** - Criar passagem entre edifícios

  **Explicação:** A API já deve suportar o pedido *POST* para a criação de uma passageway.

- **US 250** - Editar informação de piso de edifício.

  **Explicação:** A API já deve suportar o pedido *PUT/PATCH* para a edição de uma passageway.

### 2.2. Critérios de aceitação

**CA 1:** Deve ser feito o uso da API desenvolvida no *sprint* anterior, para que os dados sejam persistidos. Mais específicamente, a funcionalidade desenvolvida na *US* 250.

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

### 4.3. Testes

Para esta *US* foram realizados testes ao componente e aos serviços utilizados.

## 5. Implementação

Na realização desta *US* foi criada a UI (e respetivos estilos) que interage com o utilizador, o componente *ElevatorCreateComponent*
e o serviço *ElevatorService*, além disso utilizou-se o servico *BuildingService* criado por outra *US*.

**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/S50-8)

## 6. Integração/Demonstração

Para aceder a esta funcionalidade na *WebApp*, deve-se selecionar o tipo de utilizador "Campus Manager" e através do menu temos que aceder a Campus -> Passageway -> Edit.

![Opção do menu para esta funcionalidade](IMG/menu_option.png)

Após aceder a este local, o gestor de campus tem à sua disposição um formulário onde pode escolher uma das passageways já criados, depois de selecionar a passageway os campos "Building 1", "Building 2", "Floor 1" e "Floor 2" serão preenchidos com o valor atual e poderão ser substituidos pelos valores pretendidos.

![Vista do formulário para editar um piso](IMG/initial_view.png)

Quando o gestor de campus insere um edificio não existente a edição não será possivel, aparecendo a mensagem de erro: "Couldn't find building by code ...".

![Erro ao tentar editar piso com o campo building code inválido](IMG/non_existing_buiding_error.png)

Por fim, quando todos os dados introduzidos estão válidos, a passageway será atualizado na base de dados, aparecendo a seguinte mensagem: "The building was successfully edited".

![Sucesso ao editar um piso de um edifício](IMG/successfull_edit.png)

## 7. Observações

Não existem observações relevantes a acrescentar.