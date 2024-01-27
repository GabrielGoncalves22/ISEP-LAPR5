# US 1310

Este documento contém a documentação relativa à *User Story (US)* 1310.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer que todos os serviços do *backend* sejam autenticados.
Esta *US* faz parte do módulo "Gestão de Utilizadores" e pertence à unidade curricular de **LAPR5**.

## 2. Requisitos

***US 1310*** - Como arquiteto da solução pretendo que todos os serviços de backend sejam autenticados.

Relativamente a este requisito, entendemos que antes de executar cada serviço, é necessário passar por um *middleware* para 
verificar se a autenticação está devidamente validada.

### 2.1. Dependências encontradas

Esta *US* não possui nenhuma dependência.

### 2.2. Critérios de aceitação

**CA 1:** Todos os serviços devem passar por um *middleware* para verificar se a autenticação está devidamente validada.

## 3. Análise

### 3.1. Respostas do cliente

>**Questão:** "Será que podia especificar melhor o momento em que deve ser feita a verificação das autorizações? Deve ser 
> feita no momento do login onde será demonstrado o menu de acordo com o utilizador (com a us 1300), ou deve ser feita apenas 
> no backend?"
>
>**Resposta:** "No momento de login deve ser verificado se o utilizador tem acesso à aplicação. Em caso afirmativo o menu 
> de opções deve ser ajustado às suas permissões. Por uma questão de segurança, todas as operações de serviços devem novamente 
> validar se o pedido é efetuado por um utilizador com permissões para executar essa operação."

## 4. Implementação

Na realização desta *US* foi utilizado no *MD* o *middleware* *isAuth* já disponibilizado no projeto base. 

**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/S50-87)

## 5. Integração/Demonstração

Ao realizar um pedido na rota *.../buildings/...*, *.../devices/...*, *.../users/me* e *.../users/signup/ (Para a criação 
de um utilizador com um determinado papel) é necessária que a autenticação esteja devidamente valida.

Para isso é necessário colocar o *token* gerado ao realizar signin no sistema no atributo *Authorizarion* do tipo *Bearer 
Token* da requisição.

## 6. Observações

Não existem observações relevantes a acrescentar.
