:-dynamic generations/1.
:-dynamic population/1.
:-dynamic prob_crossover/1.
:-dynamic prob_mutation/1.
:-dynamic result/1.

:-dynamic task/1.
:-dynamic tasks/1.
:-dynamic time_between/3.

% task(Id,ProcessTime).
% task(t1).
% task(t2).
% task(t3).
% task(t4).
% task(t5).

result([]*9999).

% time_between(Task1, Task2, TimeBetween).
% time_between(t1, t2, 6).
% time_between(t1, t3, 9).
% time_between(t1, t4, 10).
% time_between(t1, t5, 2).

% time_between(t2, t3, 5).
% time_between(t2, t4, 7).
% time_between(t2, t5, 2).

% time_between(t3, t4, 17).
% time_between(t3, t5, 13).

% time_between(t4, t5, 4).

% tasks(NTasks).
% tasks(6).

% parameters initialization
initialize:-write('Number of new generations: '),read(NG), 			
    (retract(generations(_));true), asserta(generations(NG)),
	write('Population size: '),read(PS),
	(retract(population(_));true), asserta(population(PS)),
	write('Probability of crossover (%):'), read(P1),
	PC is P1/100, 
	(retract(prob_crossover(_));true), 	asserta(prob_crossover(PC)),
	write('Probability of mutation (%):'), read(P2),
	PM is P2/100, 
	(retract(prob_mutation(_));true), asserta(prob_mutation(PM)).

initialize_time:-write('Execution time: '),read(T),			
    (retract(exec_time(_));true), asserta(exec_time(T)),
    write('Population size: '),read(PS),
	(retract(population(_));true), asserta(population(PS)),
	write('Probability of crossover (%):'), read(P1),
	PC is P1/100, 
	(retract(prob_crossover(_));true), 	asserta(prob_crossover(PC)),
	write('Probability of mutation (%):'), read(P2),
	PM is P2/100, 
	(retract(prob_mutation(_));true), asserta(prob_mutation(PM)).

generate:-
    initialize,
    generate_population(Pop),
    write('Pop='),write(Pop),nl,
    evaluate_population(Pop,PopValue),
    write('PopValue='),write(PopValue),nl,
    order_population(PopValue,PopOrd),
    generations(NG),
    generate_generation(0,NG,PopOrd).

generate_time:-
    % initialize_time,
    (retract(exec_time(_));true), asserta(exec_time(1)),
    (retract(population(_));true), asserta(population(10)),
    (retract(prob_crossover(_));true), 	asserta(prob_crossover(0.007)),
    (retract(prob_mutation(_));true), asserta(prob_mutation(0.0001)),
    (retract(exec_limit(_));true), asserta(exec_limit(20)),
    get_time(TI),
    generate_population(Pop),
    % write('Pop='),write(Pop),nl,
    evaluate_population(Pop,PopValue),
    % write('PopValue='),write(PopValue),nl,
    order_population(PopValue,PopOrd),
    generate_generation_time(0,TI,PopOrd),!.

generate_population(Pop):-
    population(PopSize),
    tasks(NumT),
    findall(Task,task(Task),TasksList),
    generate_population(PopSize,TasksList,NumT,Pop).

generate_population(0,_,_,[]):-!.
generate_population(PopSize,TasksList,NumT,[Ind|Rest]):-
    PopSize1 is PopSize-1,
    generate_population(PopSize1,TasksList,NumT,Rest),
    generate_individual(TasksList,NumT,Ind),
    not(member(Ind,Rest)).
generate_population(PopSize,TasksList,NumT,L):-
    generate_population(PopSize,TasksList,NumT,L).
    


generate_individual([G],1,[G]):-!.

generate_individual(TasksList,NumT,[G|Rest]):-
    NumTemp is NumT + 1, % to use with random
    random(1,NumTemp,N),
    remove(N,TasksList,G,NewList),
    NumT1 is NumT-1,
    generate_individual(NewList,NumT1,Rest).

remove(1,[G|Rest],G,Rest).
remove(N,[G1|Rest],G,[G1|Rest1]):- N1 is N-1,
            remove(N1,Rest,G,Rest1).


evaluate_population([],[]).
evaluate_population([Ind|Rest],[Ind*V|Rest1]):-
    evaluate(Ind,V),
    evaluate_population(Rest,Rest1).

evaluate([_], 0).

evaluate([T1, T2|Rest], TotalCost) :-
    (time_between(T1, T2, Cost);time_between(T2, T1, Cost)),
    evaluate([T2|Rest], RestCost),
    TotalCost is Cost + RestCost.

order_population(PopValue,PopValueOrd):-
    bsort(PopValue,PopValueOrd).

bsort([X],[X]):-!.
bsort([X|Xs],Ys):-
    bsort(Xs,Zs),
    bchange([X|Zs],Ys).


bchange([X],[X]):-!.

bchange([X*VX,Y*VY|L1],[Y*VY|L2]):-
    VX>VY,!,
    bchange([X*VX|L1],L2).

bchange([X|L1],[X|L2]):-bchange(L1,L2).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

generate_generation(G,G,Pop):-!,
	write('Generation '), write(G), write(':'), nl, write(Pop), nl.
generate_generation(N, G, Pop):-
    write('Generation '), write(N), write(':'), nl, write(Pop), nl,
    random_permutation(Pop, PopRandom),
    crossover(PopRandom, NPop1),
    mutation(NPop1, NPop),
    evaluate_population(NPop, NPopValue),
    append(NPopValue, Pop, AllPop),
    remove_duplicates(AllPop, UniqueAllPop),
    order_population(UniqueAllPop, UniqueAllPopOrd),
    population(PopSize),
    roulette_wheel_selection(PopSize, UniqueAllPopOrd, SelectedPop),
    order_population(SelectedPop, SelectedPopOrd),
    N1 is N + 1,
    generate_generation(N1, G, SelectedPopOrd).

remove_duplicates(List, UniqueList):-
    sort(List, UniqueList).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

generate_generation_time(N, TI, Pop):-
    get_time(TA),
    exec_time(TE),
    T is TA - TI,
    TE > T,
    % write('Generation '), write(N), write(':'), nl, write(Pop), nl,
    random_permutation(Pop, PopRandom),
    crossover(PopRandom, NPop1),
    mutation(NPop1, NPop),
    evaluate_population(NPop, NPopValue),
    append(NPopValue, Pop, AllPop),
    remove_duplicates(AllPop, UniqueAllPop),
    order_population(UniqueAllPop, UniqueAllPopOrd),
    assert_first_element(UniqueAllPopOrd),
    evaluate_stop(UniqueAllPopOrd),
    population(PopSize),
    roulette_wheel_selection(PopSize, UniqueAllPopOrd, SelectedPop),
    order_population(SelectedPop, SelectedPopOrd),
    N1 is N + 1,
    generate_generation_time(N1, TI, SelectedPopOrd).
generate_generation_time(_, _, _).

assert_first_element([FirstElement|_]) :-
    result(Best),
    extract_fitness(Best, BF),
    extract_fitness(FirstElement, CF),
    CF < BF,
    retract(result(Best)),
    asserta(result(FirstElement)),
    !.
assert_first_element([FirstElement|_]):-
    !.

evaluate_stop([FirstElement|_]) :-
    exec_limit(Limit),
    extract_fitness(FirstElement, FT),
    Limit < FT.


%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

extract_fitness(_*FitnessValue, FitnessValue).

:- discontiguous roulette_wheel_selection/3.

roulette_wheel_selection(N, Pop, SelectedPop):-
    roulette_wheel_selection(N, N, Pop, SelectedPop).

roulette_wheel_selection(0, _, _, []) :- !.

roulette_wheel_selection(N, Pop, [SelectedInd*Fitness|Rest]):-
    N > 0,
    roulette_wheel_select_individual(Pop, Pop, SelectedInd, Fitness, RemainingPop),
    N1 is N - 1,
    roulette_wheel_selection(N1, RemainingPop, Rest).

roulette_wheel_select_individual(Pop, NPopOrd, SelectedInd, Fitness, RemainingPop):-
    sum_inverse_cost(Pop, NPopOrd, TotalInverseCost),
    random(0.0, TotalInverseCost, RandomValue),
    roulette_wheel_find_individual(Pop, NPopOrd, RandomValue, SelectedInd, Fitness, RemainingPop).

roulette_wheel_find_individual([Ind*Fitness|Rest], _, RandomValue, Ind, Fitness, Rest):-
    RandomValue =< Fitness, !.

roulette_wheel_find_individual([_|Rest], NPopOrd, RandomValue, SelectedInd, Fitness, RemainingPop):-
    roulette_wheel_find_individual(Rest, NPopOrd, RandomValue, SelectedInd, Fitness, RemainingPop).

sum_inverse_cost([], _, 0).
sum_inverse_cost([_*Cost|Rest], NPopOrd, TotalInverseCost):-
    sum_inverse_cost(Rest, NPopOrd, RestTotal),
    TotalInverseCost is RestTotal + (1 / Cost).


generate_crossover_points(P1,P2):- generate_crossover_points1(P1,P2).

generate_crossover_points1(P1,P2):-
	tasks(N),
	NTemp is N+1,
	random(1,NTemp,P11),
	random(1,NTemp,P21),
	P11\==P21,!,
	((P11<P21,!,P1=P11,P2=P21);P1=P21,P2=P11).
generate_crossover_points1(P1,P2):-
	generate_crossover_points1(P1,P2).


crossover([ ],[ ]).
crossover([Ind*_],[Ind]).
crossover([Ind1*_,Ind2*_|Rest],[NInd1,NInd2|Rest1]):-
	generate_crossover_points(P1,P2),
	prob_crossover(Pcruz),random(0.0,1.0,Pc),
	((Pc =< Pcruz,!,
        cross(Ind1,Ind2,P1,P2,NInd1),
	  cross(Ind2,Ind1,P1,P2,NInd2))
	;
	(NInd1=Ind1,NInd2=Ind2)),
	crossover(Rest,Rest1).

fillh([ ],[ ]).

fillh([_|R1],[h|R2]):-
	fillh(R1,R2).

sublist(L1,I1,I2,L):-I1 < I2,!,
    sublist1(L1,I1,I2,L).

sublist(L1,I1,I2,L):-sublist1(L1,I2,I1,L).

sublist1([X|R1],1,1,[X|H]):-!, fillh(R1,H).

sublist1([X|R1],1,N2,[X|R2]):-!,N3 is N2 - 1,
	sublist1(R1,1,N3,R2).

sublist1([_|R1],N1,N2,[h|R2]):-N3 is N1 - 1,
		N4 is N2 - 1,
		sublist1(R1,N3,N4,R2).

rotate_right(L,K,L1):- tasks(N),
	T is N - K,
	rr(T,L,L1).

rr(0,L,L):-!.

rr(N,[X|R],R2):- N1 is N - 1,
	append(R,[X],R1),
	rr(N1,R1,R2).

remove([],_,[]):-!.

remove([X|R1],L,[X|R2]):- not(member(X,L)),!,
        remove(R1,L,R2).

remove([_|R1],L,R2):-
    remove(R1,L,R2).

insert([],L,_,L):-!.
insert([X|R],L,N,L2):-
    tasks(T),
    ((N>T,!,N1 is N mod T);N1 = N),
    insert1(X,N1,L,L1),
    N2 is N + 1,
    insert(R,L1,N2,L2).


insert1(X,1,L,[X|L]):-!.
insert1(X,N,[Y|L],[Y|L1]):-
    N1 is N-1,
    insert1(X,N1,L,L1).

cross(Ind1,Ind2,P1,P2,NInd11):-
    sublist(Ind1,P1,P2,Sub1),
    tasks(NumT),
    R is NumT-P2,
    rotate_right(Ind2,R,Ind21),
    remove(Ind21,Sub1,Sub2),
    P3 is P2 + 1,
    insert(Sub2,Sub1,P3,NInd1),
    removeh(NInd1,NInd11).


removeh([],[]).

removeh([h|R1],R2):-!,
    removeh(R1,R2).

removeh([X|R1],[X|R2]):-
    removeh(R1,R2).

mutation([],[]).
mutation([Ind|Rest],[NInd|Rest1]):-
	prob_mutation(Pmut),
	random(0.0,1.0,Pm),
	((Pm < Pmut,!,mutacao1(Ind,NInd));NInd = Ind),
	mutation(Rest,Rest1).

mutacao1(Ind,NInd):-
	generate_crossover_points(P1,P2),
	mutacao22(Ind,P1,P2,NInd).

mutacao22([G1|Ind],1,P2,[G2|NInd]):-
	!, P21 is P2-1,
	mutacao23(G1,P21,Ind,G2,NInd).
mutacao22([G|Ind],P1,P2,[G|NInd]):-
	P11 is P1-1, P21 is P2-1,
	mutacao22(Ind,P11,P21,NInd).

mutacao23(G1,1,[G2|Ind],G2,[G1|Ind]):-!.
mutacao23(G1,P,[G|Ind],G2,[G|NInd]):-
	P1 is P-1,
	mutacao23(G1,P1,Ind,G2,NInd).