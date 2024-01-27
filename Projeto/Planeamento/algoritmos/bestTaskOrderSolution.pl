get_best_solution_for_task_order_brute_force(Tasks, Cost):-
    generate_all_combinations_of_tasks(L),
    evaluate_population(L, L1),
    order_population(L1, R1),
    R1 = [P|_],
    P = Tasks*Cost.

generate_all_combinations_of_tasks(R):-
    findall(
        X, 
        task(X), 
        L1
    ),
    findall(
        L,
        my_permutation(L1, L),
        R
    ).

my_permutation([], []).
my_permutation(L, [X|L1]):-
    member(X, L),
    delete(L, X, LR),
    my_permutation(LR, L1).
