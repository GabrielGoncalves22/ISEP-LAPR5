% Criar ligações
:-dynamic ligacel/4.

cria_grafo(_, -1, _):- !.

cria_grafo(Col, Lin, Piso):- 
    cria_grafo_lin(Col, Lin, Piso), 
    Lin1 is Lin - 1, 
    cria_grafo(Col, Lin1, Piso).

cria_grafo_lin(-1, _, _):- !.

cria_grafo_lin(Col, Lin, Piso):- 
    m(Col, Lin, 0, Piso), 
    !,
    ColS is Col + 1, 
    ColA is Col - 1, 
    LinS is Lin + 1, 
    LinA is Lin - 1,
    ((m(ColS, Lin, 0, Piso), assertz(ligacel(cel(Col, Lin), cel(ColS, Lin), Piso, 1))); true),
    ((m(ColA, Lin, 0, Piso), assertz(ligacel(cel(Col, Lin), cel(ColA, Lin), Piso, 1))); true),
    ((m(Col, LinS, 0, Piso), assertz(ligacel(cel(Col, Lin), cel(Col, LinS), Piso, 1))); true),
    ((m(Col, LinA, 0, Piso), assertz(ligacel(cel(Col, Lin), cel(Col, LinA), Piso, 1))); true),
    ((m(ColS, LinS, 0, Piso), assertz(ligacel(cel(Col, Lin), cel(ColS, LinS), Piso, sqrt(2)))); true),
    ((m(ColA, LinA, 0, Piso), assertz(ligacel(cel(Col, Lin), cel(ColA, LinA), Piso, sqrt(2)))); true),
    ((m(ColS, LinA, 0, Piso), assertz(ligacel(cel(Col, Lin), cel(ColS, LinA), Piso, sqrt(2)))); true),
    ((m(ColA, LinS, 0, Piso), assertz(ligacel(cel(Col, Lin), cel(ColA, LinS), Piso, sqrt(2)))); true),
    Col1 is Col - 1,
    cria_grafo_lin(Col1, Lin, Piso).

cria_grafo_lin(Col, Lin, Piso):- 
    Col1 is Col - 1, 
    cria_grafo_lin(Col1, Lin, Piso).
