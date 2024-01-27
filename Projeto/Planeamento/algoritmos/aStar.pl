aStar(Orig,Dest,Cam,Custo,Piso):-
    aStar2(Dest,[(_,0,[Orig])],Cam,Custo, Piso).

aStar2(Dest,[(_,Custo,[Dest|T])|_],Cam,Custo, _):-
	reverse([Dest|T],Cam).

aStar2(Dest,[(_,Ca,LA)|Outros],Cam,Custo, Piso):-
	LA=[Act|_],
	findall((CEX,CaX,[X|LA]),
		((Dest==Act;!),(ligacel(Act,X,Piso,CustoX);ligacel(X,Act,Piso,CustoX)),\+ member(X,LA),
        CaX is CustoX + Ca, estimativa(X,Dest,  EstX),
		CEX is CaX +EstX),Novos),
	append(Outros,Novos,Todos),
	sort(Todos,TodosOrd),
	aStar2(Dest,TodosOrd,Cam,Custo,Piso).

estimativa(cel(X1,Y1),cel(X2,Y2),Estimativa):-
    Estimativa is sqrt((X1-X2)^2+(Y1-Y2)^2).