# US 1050

Este documento contém a documentação relativa à *User Story (US)* 1050.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer a implementação da UI para permitir ao gestor de campus criar um edifício através de um ambiente mais bonito e agradável.
Esta *US* faz parte do módulo "Gestão de Campus" e pertence à unidade curricular de **ARQSI**.

## 2. Requisitos

***US 1050*** - Como gestor de Campus pretendo criar um Edifício indicando

A respeito deste requisito, entendemos que o gestor de campus deve ter ao seu dispor uma UI para criar um edifício, em que esta UI irá ser a "ponte" entre o gestor e a API criada no *sprint* passado.

### 2.1. Dependências encontradas

- **US 150** - Criar um edifício.

	**Explicação:** A API já deve suportar o pedido *POST* para a criação de um edifício.

### 2.2. Critérios de aceitação

**CA 1:** Deve ser feito o uso da API desenvolvida no *sprint* anterior, para que os dados sejam persistidos. Mais específicamente, a funcionalidade desenvolvida na *US* 150.

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

Para esta US foram realizados testes ao componente e aos serviços utilizados.

## 5. Implementação

Na realização desta *US* foi criada a UI (e respetivos estilos) que interage com o utilizador, o componente *BuildingCreateComponent*, o *model Building* e o serviço *BuildingService*.

**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/S50-27)

## 6. Integração/Demonstração

Para aceder a esta funcionalidade na WebApp, deve-se selecionar o tipo de utilizador "Campus Manager" e através do menu temos que aceder a Campus -> Building -> Create.

![Opção do menu para esta funcionalidade](IMG/menu_option.PNG)

Após aceder a este local, o gestor de campus tem à sua disposição um formulário onde pode introduzir os dados para criar um novo edifício no sistema.

![Vista inicial do formulário para criar um edifício](IMG/initial_view.PNG)

Quando o gestor de campus insere algum valor inválido nos campos, ele ao tentar criar o edifício irá ser avisado de que algo está errado e a operação é cancelada. De seguida temos um exemplo em que o campo *code* não está válido e o gestor de campus tenta criar o edifício.

![Erro ao tentar criar edifício com o campo code inválido](IMG/building_code_error.PNG)

Por fim, quando todos os dados introduzidos estão válidos, o edifício é criado com sucesso, e uma mensagem aparece a informar o gestor de campus dessa mesma ocorrência.

![Sucesso ao criar um novo edifício](IMG/successful_create.PNG)

## 7. Observações

Não existem observações relevantes a acrescentar.
