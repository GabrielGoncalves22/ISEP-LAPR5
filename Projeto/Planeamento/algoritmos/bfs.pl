bfs(Orig,Dest,Cam,Piso):-bfs2(Dest,[[Orig]],Cam,Piso).

bfs2(Dest,[[Dest|T]|_],Cam,_):-
	reverse([Dest|T],Cam).

bfs2(Dest,[LA|Outros],Cam,Piso):-
	LA=[Act|_],
	findall([X|LA],
		(Dest\==Act,ligacel(Act,X, Piso,1),\+ member(X,LA)),
		Novos),
	append(Outros,Novos,Todos),
	bfs2(Dest,Todos,Cam,Piso).