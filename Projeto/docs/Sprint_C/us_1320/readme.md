# US 1320

Este documento contém a documentação relativa à *User Story (US)* 1320.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer que todos os serviços do *backend* validem as permissões do utilizador 
para executar determinada operação.
Esta *US* faz parte do módulo "Gestão de Utilizadores" e pertence à unidade curricular de **LAPR5**.

## 2. Requisitos

***US 1320*** - Como arquiteto da solução pretendo que todos os serviços de backend validem as permissões do utilizador para executar determinada operação.

Relativamente a este requisito, entendemos que antes de executar cada serviço, é necessário passar por um *middleware* para 
verificar se a autenticação está devidamente validada (realizado na *US* 1310) e após isso verificar o utilizador contém 
as permissões para executar determinada operação.

### 2.1. Dependências encontradas

- **US 1310** - Como arquiteto da solução pretendo que todos os serviços de backend sejam autenticados.

  **Explicação:** Se os serviços do *backend* não forem autenticados, não é validar as permissões do utilizador para executar 
uma determinada operação.

### 2.2. Critérios de aceitação

**CA 1:** Todos os serviços devem passar por um *middleware* que após verificar se a autenticação está devidamente validada, 
valida as permissões do utilizador.

## 3. Análise

### 3.1. Respostas do cliente

>**Questão:** "Será que podia especificar melhor o momento em que deve ser feita a verificação das autorizações? Deve ser 
> feita no momento do login onde será demonstrado o menu de acordo com o utilizador (com a us 1300), ou deve ser feita apenas 
> no backend?"
>
>**Resposta:** "No momento de login deve ser verificado se o utilizador tem acesso à aplicação. Em caso afirmativo o menu 
> de opções deve ser ajustado às suas permissões. Por uma questão de segurança, todas as operações de serviços devem novamente 
> validar se o pedido é efetuado por um utilizador com permissões para executar essa operação."

>**Questão:** "Na US1320 é pedido para que todos os serviços do backend validem as permissões do utilizador para determinada operação.
> Gostaria de saber se o cliente já tem uma lista de permissões/cargos definidos (ex.: gestor de campus; gestor de frota; etc...) 
> e quais as ações que são permitidas por cada permissão/cargo. Gostaria também de saber quais as ações que são permitidas 
> a todos os utilizadores, independentemente do cargo."
>
>**Resposta:** "Os requisitos indicam qual o tipo de utilizador que tem acesso a essa funcionalidade, ex., "como gestor de tarefas pretendo ..."
se existirem situações em que tal informação não é indicada, coloquem aqui explicitamente qual o requisito em causa."

## 4. Implementação

Na realização desta *US* foi utilizado no *MD* o *middleware* *isAuth* já disponibilizado no projeto base e criou-se o *middleware* 
*verifyUser* que contêm várias métodos que permitem validar as permissões do utilizador dependo do papel necessário para 
executar determinada operação.

**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/S50-88)

## 5. Integração/Demonstração

Ao realizar um pedido na rota *.../buildings/...*, *.../devices/...*, *.../users/me* e *.../users/signup/ (Para a criação
de um utilizador com um determinado papel) é necessária que a autenticação esteja devidamente valida e o utilizador contenha 
permissões para executar a operação. Por exemplo a rota *.../buildings/...* só pode ser executado por um utilizador que contenha 
a permissão de *Gestor de Campus*.

Para isso é necessário colocar o *token* gerado ao realizar signin no sistema no atributo *Authorizarion* do tipo *Bearer
Token* da requisição.

## 6. Observações

Não existem observações relevantes a acrescentar.
