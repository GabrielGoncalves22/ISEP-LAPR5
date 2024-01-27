:-dynamic ligacel/4.
:-dynamic m/4.
:-dynamic nlin/1.
:-dynamic cria_grafo/2.
%:-set_prolog_stack(global, limit(15000000000)).

cria_matriz:-
    retractall(m(_,_,_,_)),
    retractall(ligacel(_,_,_,_)),
    write('Numero de Colunas: '),
    read(NCol),
    nl,
    write('Numero de Linhas: '),
    read(NLin),
    nl,
    asserta(nlin(NLin)),
    cria_matriz_0(NCol,NLin),
    cria_grafo(NCol,NLin),
    retract(nlin(_)).

cria_matriz_0(1,1):-
    !,
    asserta(m(1,1,0,a1)).

cria_matriz_0(NCol,1):-
    !,
    asserta(m(NCol,1,0,a1)),
    NCol1 is NCol-1,
    nlin(NLin),
    cria_matriz_0(NCol1,NLin).

cria_matriz_0(NCol,NLin):-
    asserta(m(NCol,NLin,0,a1)),
    NLin1 is NLin-1,
    cria_matriz_0(NCol,NLin1).

% consult('cria_matriz.pl'), consult('algoritmos/bfs.pl'), consult('algoritmos/dfs.pl'), consult('algoritmos/aStar.pl').
% cria_matriz.
% consult('cria_grafo.pl').
% cria_grafo(7, 7, a1).
% findall(_,ligacel(_,_,_,_),L),length(L,Length).
% call_a().
% call_b().
% call_c().
% call_d().

call_a():-
    get_time(Ti),
    dfs(cel(1,1), cel(4,4), L, a1),
    get_time(Tf),
    TSol is Tf - Ti,
    write('Tempo: '), write(TSol), write(' segundos\n'),
    length(L, NumCels),
    write('Custo: '), write(NumCels), nl,
    write('Resultado: '), write(L), nl.

call_b():-
    get_time(Ti),
    bfs(cel(1,1), cel(4,4), L, a1),
    get_time(Tf),
    TSol is Tf - Ti,
    write('Tempo: '), write(TSol), write(' segundos\n'),
    length(L, NumCels),
    write('Custo: '), write(NumCels), nl,
    write('Resultado: '), write(L), nl.

call_c():-
    get_time(Ti),
    better_dfs(cel(1,1), cel(4,4), L, a1),
    get_time(Tf),
    TSol is Tf - Ti,
    write('Tempo: '), write(TSol), write(' segundos\n'),
    length(L, NumCels),
    write('Custo: '), write(NumCels), nl,
    write('Resultado: '), write(L), nl.

call_d():-
    get_time(Ti),
    aStar(cel(1,1), cel(4,4), a1, L, D),
    get_time(Tf),
    TSol is Tf - Ti,
    write('Tempo decorrido: '), write(TSol), write(' segundos\n'),
    write('Caminho: '), write(L),
    write('Custo: '), write(D), nl.
