# US 608

Este documento contém a documentação relativa à *User Story (US)* 612.

## 1. Contexto

Esta *US* foi introduzida no *sprint* atual, e requer que seja possível ao passar passar o rato numa sala ou elevador que seja criada uma dica flutuante a indicar qual é a sala ou elevador presente.
Esta *US* faz parte do módulo "Visualização 3D" e pertence à unidade curricular de **SGRAI**.

## 2. Requisitos

***US 612*** -Exibir uma tip flutuante que identifique a sala, gabinete ou elevador a que pertence a célula apontada em cada momento pelo cursor do rato

Relativamente a este requisito, entendemos que deve ser necessário exibir uma tip flutuante a indicar qual é a sala em questão quando o rato aponta para uma porta ou para um elevador

### 2.1. Dependências encontradas

Não foram encontradas dependências de outras US para a 612

### 2.2. Critérios de aceitação

**CA 1:** A floating tip deve aparecer apenas ao clicar com o rato numa porta ou elevador

## 3. Análise

### 3.1. Respostas do cliente

O cliente informou que a floating tip pode surgir quando o rato passa na porta que dá acesso a uma sala.

## 4. Implementação

Na realização desta *US* foi utilizada a UI (e respetivos estilos) da visualização 3D que interage com o utilizador,e desenvolvido o método MouseOver na classe thum_raiser
**Commits Relevantes**

[Listagem dos Commits realizados](https://1191296gg.atlassian.net/browse/S50-68)

## 5. Integração/Demonstração

Esta funcionalidade da aplicação está vinculada à visualização do mapa em si. Cada vez que um piso é visualizado pelo utilizador, ao clicar numa porta aparece uma tip flutuante com as informações requeridas

Durante a travessia normal do *robot* pelo mapa nada acontece
![Inicio](/IMG/img.png)
Dependendo da *View* selecionada, a floating tip vai aparecer de forma diferente para ser mais conviniente ao utilizador
Fixed-Perspective:
![Fixed-Perspective](/IMG/img_1.png)
First-Person:
![First-Person](/IMG/img_2.png)
Third-Person:
![Third-Person](/IMG/img_3.png)
Para a floating tip desaparecer basta clicar numa superficie que não representa uma porta ou elevador.

## 6. Observações

Não existem observações relevantes a acrescentar.
