:- consult('http_handler.pl').
:- consult('factos.pl').
:- consult('cria_grafo.pl').
:- consult('algoritmos/caminho_pisos.pl').
:- consult('algoritmos/dfs.pl').
:- consult('algoritmos/bfs.pl').
:- consult('algoritmos/aStar.pl').
:- consult('algoritmos/genetic_algorithm_improved.pl').
:- consult('algoritmos/bestTaskOrderSolution.pl').

% Iniciar o servidor na porta 5000
:- http_server(http_dispatch, [port(5000)]).

:- http_get_passageway.
:- http_get_floors.
:- http_get_elevators.
:- http_get_map3.
:- create_con.

path_finder(CelAtual, CelFinal, PisoOr, PisoDest, LLigMelhor, TotalCusto, AllPaths) :-
    melhor_caminho_pisos(PisoOr, PisoDest, LLigMelhor),
    !,
    path_finder2(CelAtual, CelFinal, PisoDest, LLigMelhor, TotalCusto, AllPaths).

path_finder2(CelAtual, CelFinal, PisoDest, [], TotalCusto, [Cam]) :-
    aStar(CelAtual, CelFinal, Cam, Custo, PisoDest),
    TotalCusto is Custo,
    !.

path_finder2(CelAtual, CelFinal, PisoDest, LLigMelhor, TotalCusto, [Cam|RestPaths]) :-
    LLigMelhor = [CorTerm|LLigMelhor_T],
    CorTerm =.. [A,_,_],
    A = 'cor',
    arg(1, CorTerm, PisoOr2),
    arg(2, CorTerm, PisoDest2),
    (corredor(_, _, PisoOr2, PisoDest2, CelCorOr, CelCorDest);corredor(_, _, PisoDest2, PisoOr2, CelCorDest, CelCorOr)),
    aStar(CelAtual, CelCorOr, Cam, Custo, PisoOr2),
    path_finder2(CelCorDest, CelFinal, PisoDest, LLigMelhor_T, RestCusto, RestPaths),
    TotalCusto is Custo + RestCusto,
    !.

path_finder2(CelAtual, CelFinal, PisoDest, LLigMelhor, TotalCusto, [Cam|RestPaths]) :-
    LLigMelhor = [CorTerm|LLigMelhor_T],
    CorTerm =.. [A,_,_],
    A = 'elev',
    arg(1, CorTerm, PisoOr2),
    elevador(Elevator, ElevadorList, _),
    member(PisoOr2, ElevadorList),
    elevador(Elevator, _, ElevatorCell),
    aStar(CelAtual, ElevatorCell, Cam, Custo, PisoOr2),
    path_finder2(ElevatorCell, CelFinal, PisoDest, LLigMelhor_T, RestCusto, RestPaths),
    TotalCusto is Custo + RestCusto,
    !. 