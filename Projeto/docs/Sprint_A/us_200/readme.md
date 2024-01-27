# US 200

Este documento contém a documentação relativa à *User Story (US)* 200.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer a funcionalidade de haver a possibilidade de alterar a informação de um piso de um edificio.
Esta *US* faz parte do módulo "1.2 Módulo Gestão de Campus".
Esta *US* pertence à unidade curricular de **ARQSI**.

## 2. Requisitos

***US 200*** - Quero editar a informação de um piso de um edificio.
__Observações:__ Pedido PUT/PATCH.

A respeito deste requisito, entendemos que deverá ser possível editar a informação de um piso de um edificio 
no sistema a desenvolver.

### 2.1. Dependências encontradas

- **US 190** - Como gestor de campus, quero criar um piso de um edificio.

	**Explicação:** Se não existir um piso, não é possível editá-lo.

### 2.2. Critérios de aceitação

**CA 1:** O numero do piso é obrigatorio;

**CA 2:** A descrição do piso é opcional e pode ter no máximo 255 caracteres alfanuméricos;

## 3. Análise

### 3.1. Respostas do cliente

>**Questão:** "Em relação às User Stories de edição, temos já uma ideia das informações que são opcionais, mas queremos 
> ter a certeza daquilo que é editável ou não. Posto isto, poderia indicar que informações pretende editar nas US200...?"
> 
>**Resposta:** "requisito 200 - editar piso - todas as informações à exceção do edificio a que o piso se refere..."

### 3.2. Diagrama de Sequência do Sistema (Nível 1 - Vista de Processos)

![Diagrama de Sequência do Sistema](IMG/system-sequence-diagram-level-1.svg)

### 3.3. Diagrama de Sequência do Sistema (Nível 2 - Vista de Processos)

![Diagrama de Sequência do Sistema](IMG/system-sequence-diagram-level-2.svg)

### 3.4. Classes de Domínio

![Diagrama de Classes de Domínio](IMG/domain-classes.svg)

## 4. Design

### 4.1. Diagrama de Sequência (Nível 3 - Vista de Processos)

![Diagrama de Sequência](IMG/sequence-diagram-level-3.svg)

### 4.2. Testes

Para esta *US* foram realizados testes unitários (com isolamento por duplos), testes de integração (com isolamento por duplos)
e testes de sistema/end-to-end (sem isolamento) através do *Postman*.

## 5. Implementação

## 5.1. Arquitetura Onion

### Camada de Domínio

Utilizou-se a entidade *Building* e os respetivos *value object* que já tinham sido criados por outra *US*.

### Camada de Aplicação

Utilizou-se o serviço *BuildingService*.

### Camada de Adaptadores de *Interface*

Utilizou-se o controlador *BuildingController* e o repositório *BuildingRepo*.

### Camada de *Frameworks* e *Drivers*

utilizou-se a persistência *IBuildingPersistence* e o *router* *BuildingRoute*.

## 5.2. Commits Relevantes

[Listagem dos Commits realizados](https://github.com/sem5pi/sem5pi-23-24-50/issues/6)

## 6. Integração/Demonstração

Para editar um edifício foi adicionada a rota **../buildings/:code/floors/:code** do tipo *PUT* ou *PATCH*.

Ao realizar o pedido *PUT* deve ser indicado obrigatoriamente o campo *number* que corresponde ao numero do floor, opcionalmente pode ser indicado o campo *description*.

Além disso deve ser indicado no *url* o código do edifício pretendido e do floor.

![Demonstração](SVG/demonstration.png)

## 7. Observações

Não existem observações relevantes a acrescentar.