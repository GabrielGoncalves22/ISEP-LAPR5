# US 1100

Este documento contém a documentação relativa à *User Story (US)* 1100.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer a implementação da UI para permitir ao gestor de campus listar todos os 
piso de um edifício através de um ambiente mais bonito e agradável.
Esta *US* faz parte do módulo "Gestão de Campus" e pertence à unidade curricular de **ARQSI**.

## 2. Requisitos

***US 1100*** - Como gestor de campus pretendo criar um piso indicando [...].

A respeito deste requisito, entendemos que o gestor de campus deve ter ao seu dispor uma UI para listar pisos,
em que esta UI irá ser a "ponte" entre o gestor e a API criada no *sprint* passado.

### 2.1. Dependências encontradas

- **US 150** - Criar edifício.

  **Explicação:** A API já deve suportar o pedido *POST* para a criação de um edifício, pois se não existir um edifício 
não é possível criar um piso de um edifício.

- **US 190** - Criar piso de edifício.

	**Explicação:** A API já deve suportar o pedido *POST* para a criação de um piso de um edifício.

- **US 210** - Listar pisos.

	**Explicação:** A API já deve suportar o pedido *GET* para listar um piso.

### 2.2. Critérios de aceitação

**CA 1:** Deve ser feito o uso da API desenvolvida no *sprint* anterior, para que os dados sejam persistidos. Mais específicamente, a funcionalidade desenvolvida na *US* 190.

**CA 2:** Se a operação falhar, deve ser dito ao utilizador o que está mal na informação inserida.

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

Na realização desta *US* foi criada a UI (e respetivos estilos) que interage com o utilizador, o componente *FloorCreateComponent* 
e o serviço *FloorService*, além disso utilizou-se o servico *BuildingService* criado por outra *US*.

**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/S50-9)

## 6. Integração/Demonstração

Para aceder a esta funcionalidade na *WebApp*, deve-se selecionar o tipo de utilizador "Campus Manager" e através do menu
temos que aceder a Campus -> Floor -> List.

![Opção do menu para esta funcionalidade](IMG/menu_option.png)

Após aceder a este local, o gestor de campus tem à sua disposição duas opções, na primeira, um campo onde pode introduzir para que edifício quer os pisos listados.

![Vista do formulário para listar um piso](IMG/initial_view.png)

Quando o gestor de campus insere um valor inválido no campo, ele ao tentar listar os pisos irá ser avisado de que algo está errado e a operação é cancelada. 
De seguida temos um exemplo em que o campo *Building* está inválido e o gestor de campus tenta listar os piso.

![Erro ao tentar listar piso com o campo buidling inválido](IMG/non_existing_buiding_error.png)

Por fim, quando o edificio introduzido é válido, os pisos do edifício são listados com sucesso.

![Sucesso ao listar um piso de um edifício](IMG/successfull_list.png)

## 7. Observações

Não existem observações relevantes a acrescentar.
