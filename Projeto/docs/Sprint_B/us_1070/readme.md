# US 1070

Este documento contém a documentação relativa à *User Story (US)* 1070.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer a implementação da UI para permitir ao gestor de campus editar um 
edifício através de um ambiente mais bonito e agradável.
Esta *US* faz parte do módulo "Gestão de Campus" e pertence à unidade curricular de **ARQSI**.

## 2. Requisitos

***US 1070*** - Como gestor de campus pretendo editar a informação (total ou parcial) de edifício.

A respeito deste requisito, entendemos que o gestor de campus deve ter ao seu dispor uma UI para editar a informação de 
um edifício, em que esta UI irá ser a "ponte" entre o gestor e a API criada no *sprint* passado.

### 2.1. Dependências encontradas

- **US 160** - Editar edifício.

	**Explicação:** A API já deve suportar o pedido *PUT/PATCH* para editar um edifício.

### 2.2. Critérios de aceitação

**CA 1:** Deve ser feito o uso da API desenvolvida no *sprint* anterior, para que os dados sejam persistidos. Mais específicamente, a funcionalidade desenvolvida na *US* 160.

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

Na realização desta *US* foi criada a UI (e respetivos estilos) que interage com o utilizador e o componente *BuildingEditComponent*,
além disso utilizou-se o servico *BuildingService* criado por outra *US*.

**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/S50-1)

## 6. Integração/Demonstração

Para aceder a esta funcionalidade na *WebApp*, deve-se selecionar o tipo de utilizador "Campus Manager" e através do menu
temos que aceder a Campus -> Building -> Edit.

![Opção do menu para esta funcionalidade](IMG/menu_option.png)

Após aceder a este local, o gestor de campus tem à sua disposição um formulário onde pode selecionar o edifício e editar
os dados de um edifício no sistema.

![Vista do formulário para editar um edifício](IMG/initial_view.png)

Quando o gestor de campus insere algum valor inválido nos campos, ele ao tentar editar o edifício irá ser avisado de que 
algo está errado e a operação é cancelada. De seguida temos um exemplo em que o campo *numXCells* não está válido e o gestor 
de campus tenta editar o edifício.

![Erro ao tentar editar edifício com o campo numXCells inválido](IMG/building_numXCells_error.png)

Por fim, quando todos os dados introduzidos estão válidos, o edifício é editado com sucesso, e uma mensagem aparece a informar 
o gestor de campus dessa mesma ocorrência.

![Sucesso ao editar um novo edifício](IMG/successful_edit.png)

## 7. Observações

Não existem observações relevantes a acrescentar.
