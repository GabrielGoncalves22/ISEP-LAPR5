% % Ligação entre edifícios
% liga(a, h).
% liga(b, g).
% liga(b, i).
% liga(g, h).
% liga(h, i).
% liga(i, j).

% % Pisos
% pisos(a, [a1]).
% pisos(b, [b1, b2, b3, b4]).
% pisos(g, [g2, g3, g4]).
% pisos(h, [h1, h2, h3, h4]).
% pisos(i, [i1, i2, i3, i4]).
% pisos(j, [j1, j2, j3, j4]).

% % Elevadores
% elevador(b, [b1, b2, b3, b4], cel(7,5)).
% elevador(g, [g2, g3, g4], cel(7,5)).
% elevador(i, [i1, i2, i3, i4], cel(5,6)).
% elevador(j, [j1, j2, j3, j4], cel(7,5)).

% % Corredores
% corredor(a, h, a1, h2, cel(7,5), cel(3,2)).
% corredor(b, g, b2, g2, cel(7,5), cel(3,2)).
% corredor(b, g, b3, g3, cel(7,5), cel(3,2)).
% corredor(g, h, g2, h2, cel(7,5), cel(3,2)).
% corredor(g, h, g3, h3, cel(7,5), cel(3,2)).
% corredor(h, i, h2, i2, cel(7,5), cel(3,2)).
% corredor(i, j, i1, j1, cel(7,5), cel(3,2)).
% corredor(i, j, i2, j2, cel(7,5), cel(3,2)).
% corredor(b, i, b3, i3, cel(7,5), cel(3,2)).
% corredor(i, j, i3, j3, cel(7,5), cel(3,2)).

% % Matriz piso
% % m(col, lin, valor, piso)

% % a1
% m(1, 1, 1, a1).
% m(2, 1, 1, a1).
% m(3, 1, 1, a1).
% m(4, 1, 1, a1).
% m(5, 1, 1, a1).
% m(6, 1, 1, a1).
% m(7, 1, 1, a1).
% m(8, 1, 1, a1).

% m(1, 2, 0, a1).
% m(2, 2, 0, a1).
% m(3, 2, 0, a1).
% m(4, 2, 0, a1).
% m(5, 2, 0, a1).
% m(6, 2, 0, a1).
% m(7, 2, 0, a1).
% m(8, 2, 1, a1).

% m(1, 3, 0, a1).
% m(2, 3, 0, a1).
% m(3, 3, 0, a1).
% m(4, 3, 0, a1).
% m(5, 3, 0, a1).
% m(6, 3, 0, a1).
% m(7, 3, 0, a1).
% m(8, 3, 1, a1).

% m(1, 4, 0, a1).
% m(2, 4, 0, a1).
% m(3, 4, 0, a1).
% m(4, 4, 0, a1).
% m(5, 4, 0, a1).
% m(6, 4, 0, a1).
% m(7, 4, 0, a1).
% m(8, 4, 1, a1).

% m(1, 5, 1, a1).
% m(2, 5, 1, a1).
% m(3, 5, 1, a1).
% m(4, 5, 1, a1).
% m(5, 5, 0, a1).
% m(6, 5, 0, a1).
% m(7, 5, 0, a1).
% m(8, 5, 1, a1).

% m(1, 6, 1, a1).
% m(2, 6, 1, a1).
% m(3, 6, 1, a1).
% m(4, 6, 1, a1).
% m(5, 6, 0, a1).
% m(6, 6, 0, a1).
% m(7, 6, 0, a1).
% m(8, 6, 1, a1).

% m(1, 7, 1, a1).
% m(2, 7, 1, a1).
% m(3, 7, 1, a1).
% m(4, 7, 1, a1).
% m(5, 7, 0, a1).
% m(6, 7, 0, a1).
% m(7, 7, 0, a1).
% m(8, 7, 1, a1).

% %h2
% m(1, 1, 1, h2).
% m(2, 1, 1, h2).
% m(3, 1, 1, h2).
% m(4, 1, 1, h2).
% m(5, 1, 1, h2).
% m(6, 1, 1, h2).
% m(7, 1, 1, h2).
% m(8, 1, 1, h2).

% m(1, 2, 0, h2).
% m(2, 2, 0, h2).
% m(3, 2, 0, h2).
% m(4, 2, 0, h2).
% m(5, 2, 0, h2).
% m(6, 2, 0, h2).
% m(7, 2, 0, h2).
% m(8, 2, 1, h2).

% m(1, 3, 0, h2).
% m(2, 3, 0, h2).
% m(3, 3, 0, h2).
% m(4, 3, 0, h2).
% m(5, 3, 0, h2).
% m(6, 3, 0, h2).
% m(7, 3, 0, h2).
% m(8, 3, 1, h2).

% m(1, 4, 0, h2).
% m(2, 4, 0, h2).
% m(3, 4, 0, h2).
% m(4, 4, 0, h2).
% m(5, 4, 0, h2).
% m(6, 4, 0, h2).
% m(7, 4, 0, h2).
% m(8, 4, 1, h2).

% m(1, 5, 1, h2).
% m(2, 5, 1, h2).
% m(3, 5, 1, h2).
% m(4, 5, 1, h2).
% m(5, 5, 0, h2).
% m(6, 5, 0, h2).
% m(7, 5, 0, h2).
% m(8, 5, 1, h2).

% m(1, 6, 1, h2).
% m(2, 6, 1, h2).
% m(3, 6, 1, h2).
% m(4, 6, 1, h2).
% m(5, 6, 0, h2).
% m(6, 6, 0, h2).
% m(7, 6, 0, h2).
% m(8, 6, 1, h2).

% m(1, 7, 1, h2).
% m(2, 7, 1, h2).
% m(3, 7, 1, h2).
% m(4, 7, 1, h2).
% m(5, 7, 0, h2).
% m(6, 7, 0, h2).
% m(7, 7, 0, h2).
% m(8, 7, 1, h2).

% % i2
% m(1, 1, 1, i2).
% m(2, 1, 1, i2).
% m(3, 1, 1, i2).
% m(4, 1, 1, i2).
% m(5, 1, 1, i2).
% m(6, 1, 1, i2).
% m(7, 1, 1, i2).
% m(8, 1, 1, i2).

% m(1, 2, 0, i2).
% m(2, 2, 0, i2).
% m(3, 2, 0, i2).
% m(4, 2, 0, i2).
% m(5, 2, 0, i2).
% m(6, 2, 0, i2).
% m(7, 2, 0, i2).
% m(8, 2, 1, i2).

% m(1, 3, 0, i2).
% m(2, 3, 0, i2).
% m(3, 3, 0, i2).
% m(4, 3, 0, i2).
% m(5, 3, 0, i2).
% m(6, 3, 0, i2).
% m(7, 3, 0, i2).
% m(8, 3, 1, i2).

% m(1, 4, 0, i2).
% m(2, 4, 0, i2).
% m(3, 4, 0, i2).
% m(4, 4, 0, i2).
% m(5, 4, 0, i2).
% m(6, 4, 0, i2).
% m(7, 4, 0, i2).
% m(8, 4, 1, i2).

% m(1, 5, 1, i2).
% m(2, 5, 1, i2).
% m(3, 5, 1, i2).
% m(4, 5, 1, i2).
% m(5, 5, 0, i2).
% m(6, 5, 0, i2).
% m(7, 5, 0, i2).
% m(8, 5, 1, i2).

% m(1, 6, 1, i2).
% m(2, 6, 1, i2).
% m(3, 6, 1, i2).
% m(4, 6, 1, i2).
% m(5, 6, 0, i2).
% m(6, 6, 0, i2).
% m(7, 6, 0, i2).
% m(8, 6, 1, i2).

% m(1, 7, 1, i2).
% m(2, 7, 1, i2).
% m(3, 7, 1, i2).
% m(4, 7, 1, i2).
% m(5, 7, 0, i2).
% m(6, 7, 0, i2).
% m(7, 7, 0, i2).
% m(8, 7, 1, i2).

% % i3
% m(1, 1, 1, i3).
% m(2, 1, 1, i3).
% m(3, 1, 1, i3).
% m(4, 1, 1, i3).
% m(5, 1, 1, i3).
% m(6, 1, 1, i3).
% m(7, 1, 1, i3).
% m(8, 1, 1, i3).

% m(1, 2, 0, i3).
% m(2, 2, 0, i3).
% m(3, 2, 0, i3).
% m(4, 2, 0, i3).
% m(5, 2, 0, i3).
% m(6, 2, 0, i3).
% m(7, 2, 0, i3).
% m(8, 2, 1, i3).

% m(1, 3, 0, i3).
% m(2, 3, 0, i3).
% m(3, 3, 0, i3).
% m(4, 3, 0, i3).
% m(5, 3, 0, i3).
% m(6, 3, 0, i3).
% m(7, 3, 0, i3).
% m(8, 3, 1, i3).

% m(1, 4, 0, i3).
% m(2, 4, 0, i3).
% m(3, 4, 0, i3).
% m(4, 4, 0, i3).
% m(5, 4, 0, i3).
% m(6, 4, 0, i3).
% m(7, 4, 0, i3).
% m(8, 4, 1, i3).

% m(1, 5, 1, i3).
% m(2, 5, 1, i3).
% m(3, 5, 1, i3).
% m(4, 5, 1, i3).
% m(5, 5, 0, i3).
% m(6, 5, 0, i3).
% m(7, 5, 0, i3).
% m(8, 5, 1, i3).

% m(1, 6, 1, i3).
% m(2, 6, 1, i3).
% m(3, 6, 1, i3).
% m(4, 6, 1, i3).
% m(5, 6, 0, i3).
% m(6, 6, 0, i3).
% m(7, 6, 0, i3).
% m(8, 6, 1, i3).

% m(1, 7, 1, i3).
% m(2, 7, 1, i3).
% m(3, 7, 1, i3).
% m(4, 7, 1, i3).
% m(5, 7, 0, i3).
% m(6, 7, 0, i3).
% m(7, 7, 0, i3).
% m(8, 7, 1, i3).

% % j3
% m(1, 1, 1, j3).
% m(2, 1, 1, j3).
% m(3, 1, 1, j3).
% m(4, 1, 1, j3).
% m(5, 1, 1, j3).
% m(6, 1, 1, j3).
% m(7, 1, 1, j3).
% m(8, 1, 1, j3).

% m(1, 2, 0, j3).
% m(2, 2, 0, j3).
% m(3, 2, 0, j3).
% m(4, 2, 0, j3).
% m(5, 2, 0, j3).
% m(6, 2, 0, j3).
% m(7, 2, 0, j3).
% m(8, 2, 1, j3).

% m(1, 3, 0, j3).
% m(2, 3, 0, j3).
% m(3, 3, 0, j3).
% m(4, 3, 0, j3).
% m(5, 3, 0, j3).
% m(6, 3, 0, j3).
% m(7, 3, 0, j3).
% m(8, 3, 1, j3).

% m(1, 4, 0, j3).
% m(2, 4, 0, j3).
% m(3, 4, 0, j3).
% m(4, 4, 0, j3).
% m(5, 4, 0, j3).
% m(6, 4, 0, j3).
% m(7, 4, 0, j3).
% m(8, 4, 1, j3).

% m(1, 5, 1, j3).
% m(2, 5, 1, j3).
% m(3, 5, 1, j3).
% m(4, 5, 1, j3).
% m(5, 5, 0, j3).
% m(6, 5, 0, j3).
% m(7, 5, 0, j3).
% m(8, 5, 1, j3).

% m(1, 6, 1, j3).
% m(2, 6, 1, j3).
% m(3, 6, 1, j3).
% m(4, 6, 1, j3).
% m(5, 6, 0, j3).
% m(6, 6, 0, j3).
% m(7, 6, 0, j3).
% m(8, 6, 1, j3).

% m(1, 7, 1, j3).
% m(2, 7, 1, j3).
% m(3, 7, 1, j3).
% m(4, 7, 1, j3).
% m(5, 7, 0, j3).
% m(6, 7, 0, j3).
% m(7, 7, 0, j3).
% m(8, 7, 1, j3).