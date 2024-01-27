% depth first search
dfs(Orig, Dest, Cam, Piso):-
    dfs2(Orig, Dest, [Orig], Cam, Piso).

dfs2(Dest, Dest, LA, Cam, _):-
    reverse(LA, Cam).

dfs2(Act, Dest, LA, Cam, Piso):-
    ligacel(Act, X, Piso, 1),
    \+ member(X, LA),
    dfs2(X, Dest, [X|LA], Cam, Piso).

all_dfs(Orig, Dest, LCam, Piso):- 
    findall(Cam, dfs(Orig, Dest, Cam, Piso), LCam).

better_dfs(Orig, Dest, Cam, Piso):- 
    all_dfs(Orig, Dest, LCam, Piso), 
    shortlist(LCam, Cam, _).

shortlist([L], L, N):- 
    !, 
    length(L, N).

shortlist([L|LL], Lm, Nm):- 
    shortlist(LL, Lm1, Nm1),
    length(L, NL),
    ((NL < Nm1, !, Lm = L, Nm is NL); (Lm = Lm1, Nm is Nm1)).
