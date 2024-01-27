:- use_module(library(http/http_client)).
:- use_module(library(http/json)).
:- use_module(library(http/thread_httpd)).
:- use_module(library(http/http_dispatch)).
:- use_module(library(http/http_json)).
:- use_module(library(http/json_convert)).
:- use_module(library(http/http_parameters)).
:- use_module(library(http/http_open)).
:- use_module(library(xpath)).
:- use_module(library(sgml)).
:- use_module(library(uri)).

:-dynamic liga/2.
:-dynamic pisos/2.
:-dynamic elevador/3.
:-dynamic corredor/6.
:-dynamic m/4.

map_value(0, 0).
map_value(1, 1).
map_value(2, 1).
map_value(3, 1).

passageway_url("http://localhost:4000/api/buildings/passageways").
buildings_url("http://localhost:4000/api/buildings").
floor_url("http://localhost:4000/api/buildings/~w/floors").
elevador_url("http://localhost:4000/api/buildings/~w/elevators").
map_url("http://localhost:4000/api/buildings/~w/floors/~w/map").
task_url("http://localhost:5281/api/tasks/deliveries").
token("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ4MDk3MjhmLTQ0NDctNDZiZS05MGVhLTkwZDAyODBjZTBkNSIsIm5hbWUiOiJDcmlzdGlhbm8gUm9uYWxkbyIsImVtYWlsIjoiY2FtcHVzQGlzZXAuaXBwLnB0IiwidGVsZXBob25lIjoiOTIzNDA0MzMxIiwicm9sZSI6IkNhbXB1cyBNYW5hZ2VyIiwiZXhwIjoxNzA1MDU0NjM5NDc3LCJpYXQiOjE3MDI0NjI2Mzl9.taoWVHqARJpE5EWrU3zpYXTFd5aZdvWjTcl1Dis4nSw").

% liga/2
% corredor/6
http_get_passageway() :-
    passageway_url(URL),
    token(Token),
    http_open(URL, In,  [authorization(bearer(Token))]),
    json_read_dict(In, Data),
    assert_liga(Data),
    close(In).

assert_liga([]).
assert_liga([H|T]) :-
    map_url(URLMap),
    map_url(URLMap2),
    token(Token),

    Building1 = H.get(building1),
    Floor1 = H.get(floor1),

    format(atom(URL), URLMap, [Building1, Floor1]),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, Data),
    close(In),

    Building2 = H.get(building2),
    Floor2 = H.get(floor2),

    format(atom(URL2), URLMap2, [Building2, Floor2]),
    http_open(URL2, In2, [authorization(bearer(Token))]),
    json_read_dict(In2, Data2),
    close(In2),

    Temp = Data.get(floor).get(passageways),
    Temp = [Passageway1|_],

    Temp2 = Data2.get(floor).get(passageways),
    Temp2 = [Passageway2|_],

    concat_atom([Building1, Floor1], '_', ConcatenatedCodeNumber1),
    concat_atom([Building2, Floor2], '_', ConcatenatedCodeNumber2),
    (\+ (corredor(H.get(building1), H.get(building2), ConcatenatedCodeNumber1, ConcatenatedCodeNumber2, _,_); corredor(H.get(building2), H.get(building1), ConcatenatedCodeNumber2, ConcatenatedCodeNumber1, _,_)), asserta(corredor(H.get(building1), H.get(building2), ConcatenatedCodeNumber1, ConcatenatedCodeNumber2, cel(Passageway1.get(xStartCell),Passageway1.get(yStartCell)), cel(Passageway2.get(xStartCell),Passageway2.get(yStartCell)))); true),
    (\+ (liga(H.get(building1), H.get(building2)); liga(H.get(building2), H.get(building1))), asserta(liga(H.get(building1), H.get(building2))); true),
    assert_liga(T).

%%

% pisos/2
http_get_floors() :-
    buildings_url(URL),
    token(Token),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, Buildings),
    close(In),
    http_get_floors_2(Buildings).

http_get_floors_2([]).
http_get_floors_2([H|T]) :-
    Code = H.get(code),
    floor_url(URLfloor),
    format(atom(URL), URLfloor, [Code]),
    token(Token),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, FloorData),
    assert_pisos(FloorData, Code, _),
    close(In),
    http_get_floors_2(T).


assert_pisos([], Code, Floors) :-
    reverse(Floors, ReversedFloors),
    asserta(pisos(Code, ReversedFloors)).

assert_pisos([H|T], Code, Floors) :-
    H1 is H.get(number),
    concat_atom([Code, H1], '_', ConcatenatedCodeNumber),
    assert_pisos(T, Code, [ConcatenatedCodeNumber|Floors]).

%%

% elevador/3
http_get_elevators() :-
    buildings_url(URL),
    token(Token),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, Buildings),
    http_get_elevators_2(Buildings),
    close(In).

http_get_elevators_2([]).
http_get_elevators_2([H|T]) :-
    Code = H.get(code),
    elevador_url(URLelevator),
    format(atom(URL), URLelevator, [Code]),
    token(Token),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, Data),
    assert_elevador(Data, Code),
    close(In),
    http_get_elevators_2(T).

assert_elevador(Data, Code) :-
    get_floor_numbers(Data, Code, Numbers, Cel),
    asserta(elevador(Code, Numbers, Cel)).

get_floor_numbers(Data, ElevatorCode, Numbers, Cel) :-
    Floors = Data.floors,
    Floors1 = Data.floors,
    Floors1 = [H|_],
    H1 = H.number,
    map_url(URLMap),
    format(atom(URL), URLMap, [ElevatorCode, H1]),
    token(Token),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, Map),
    Rounded1 is ceiling(Map.get(floor).get(elevator).get(xStartCell)),
    Rounded2 is ceiling(Map.get(floor).get(elevator).get(yStartCell)),
    Cel = cel(Rounded1  , Rounded2),
    close(In),
    maplist(get_floor_number(ElevatorCode), Floors, Numbers).

get_floor_number(ElevatorCode, Floor, ConcatenatedCodeNumber) :-
    Number is Floor.number,
    atomic_list_concat([ElevatorCode, Number], '_', ConcatenatedCodeNumber).

%%

http_get_map3() :-
    buildings_url(URL),
    token(Token),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, Buildings),
    close(In),
    http_get_map4(Buildings).

http_get_map4([]).
http_get_map4([H|T]) :-
    Code = H.get(code),
    floor_url(URLfloor),
    format(atom(URL), URLfloor, [Code]),
    token(Token),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, XD),
    http_get_map(Code,XD),
    http_get_map4(T).

http_get_map(_, []).

http_get_map(Building, [H|T]) :-
    OLA is H.get(number),
    concat_atom([Building, OLA], '_', ConcatenatedCodeNumber),
    map_url(URLmap),
    format(atom(URL), URLmap, [Building, OLA]),
    token(Token),
    http_open(URL, In, [authorization(bearer(Token))]),
    json_read_dict(In, Data),
    close(In),
    assert_map(Data.floor.map, 0, 0, ConcatenatedCodeNumber),
    http_get_map(Building, T).

assert_map([], _, _,_).
assert_map([Row|Rows], X, Y, ConcatenatedCodeNumber) :-
    assert_row(Row, X, Y, ConcatenatedCodeNumber),
    NewY is Y + 1,
    assert_map(Rows, X, NewY, ConcatenatedCodeNumber).

assert_row([], _, _,_).
assert_row([Cell|Cells], X, Y, ConcatenatedCodeNumber) :-
    map_value(Cell, MappedValue),
    asserta(m(X, Y, MappedValue, ConcatenatedCodeNumber)),
    NewX is X + 1,
    assert_row(Cells, NewX, Y, ConcatenatedCodeNumber).


%%

create_con() :-
    findall(pisos(X, Y), pisos(X, Y), Pisos),
    create_con2(Pisos).

create_con2([]).
create_con2([H|T]) :-
    H =.. [_, _, Pisos],
    create_con3(Pisos),
    create_con2(T).

create_con3([]).
create_con3([H|T]) :-
    max_values(H, MaxA, MaxB),
    NewMaxA is MaxA + 1,
    NewMaxB is MaxB + 1,
    cria_grafo(NewMaxA, NewMaxB, H),
    create_con3(T).

max_values(Floor, MaxA, MaxB) :-
    findall(A-B, m(A, B, _, Floor), ABList),
    extract_values(ABList, AList, BList),
    max_list(AList, MaxA),
    max_list(BList, MaxB).

extract_values([], [], []).
extract_values([A-B|Rest], [A|AList], [B|BList]) :-
    extract_values(Rest, AList, BList).


% ###############################################################

default_time_between(1).

http_get_task2([json(Properties)|T]) :-
    member(id=Id, Properties),
    atom_string(IdAtom, Id),
    asserta(task(IdAtom)),
    http_get_task2(T).
http_get_task2([]).

generate_time_between :-
    findall(time_between(T1, T2, DefaultTime), (task(T1), task(T2), T1 @< T2, default_time_between(DefaultTime)), TimeBetweenFacts),
    assert_all(TimeBetweenFacts).

assert_all([]).
assert_all([Fact|Rest]) :-
    assertz(Fact),
    assert_all(Rest).


%%

:- http_handler('/api/planning', planning_handler, []).
:- http_handler('/api/planning/tasks', planning_tasks_handler, []).

planning_tasks_handler(Request) :-
    member(method(options), Request), !,
    % Handle preflight request
    format('Access-Control-Allow-Origin: *~n'),
    format('Access-Control-Allow-Methods: GET~n'),
    format('Access-Control-Allow-Headers: Content-Type, Authorization~n'),
    format('Content-type: text/plain~n'),
    format('Content-Length: 0~n~n').

planning_tasks_handler(Request) :-
    member(method(get), Request),
    format('Access-Control-Allow-Origin: *~n'),
    format('Access-Control-Allow-Methods: GET~n'),

    tasks(N),
    (N =< 7 ->
        get_best_solution_for_task_order_brute_force(Tasks, _),
        reply_json_dict(Tasks)
    ;
        generate_time,
        result(Result),
        Result=.. [_,B,_],
        reply_json_dict(B)
    ).


planning_tasks_handler(Request) :-
    member(method(post), Request),
    retractall(task(_)),
    retractall(tasks(_)),
    retractall(time_between(_)),
    http_read_data(Request, Tasks, []),
    http_get_task2(Tasks),
    findall(Task, task(Task), Tasks2),
    length(Tasks2, N),
    asserta(tasks(N)),
    generate_time_between.

%% 

planning_handler(Request) :-
    member(method(options), Request), !,
    % Handle preflight request
    format('Access-Control-Allow-Origin: *~n'),
    format('Access-Control-Allow-Methods: GET~n'),
    format('Access-Control-Allow-Headers: Content-Type, Authorization~n'),
    format('Content-type: text/plain~n'),
    format('Content-Length: 0~n~n').

planning_handler(Request) :-
    member(method(get), Request), !,
    http_parameters(Request, [origin(Origem, []), destination(Destino, []), sNode(SNodeAtom, []), eNode(ENodeAtom, [])]),
    term_to_atom(SNode, SNodeAtom),
    term_to_atom(ENode, ENodeAtom),
    path_finder(SNode, ENode, Origem, Destino, CamEd, Custo, CamPiso),
    % Enable CORS
    format('Access-Control-Allow-Origin: *~n'),
    format('Access-Control-Allow-Methods: GET~n'),
    format('Content-type: application/json~n~n'),
    format('{"caminhos": ['),
    format_results(CamEd, CamPiso),
    format('], "Custo": ~w}', [Custo]).


format_results([], []).
format_results([], [Path | Paths]) :-
    format('{"path": ['),
    format_path(Path),
    format(']}'),
    (Paths = [] -> true ; format(',')),
    format_results([], Paths).

format_results([Result|Results], [Path|Paths]) :-
    format_single_result(Result, Path),
    % (Results = [] -> true ; format(',')),
    format_results(Results, Paths).

format_single_result(Result, Path) :-
    Result =.. [Action, Arg1, Arg2],
    format('{"~w": ["~w", "~w"], "path": [', [Action, Arg1, Arg2]),
    format_path(Path),
    format(']},').

format_path([]).
format_path([cel(X, Y)|Tail]) :-
    format('[~w,~w]', [X, Y]),
    (Tail = [] -> true ; format(',')),
    format_path(Tail).