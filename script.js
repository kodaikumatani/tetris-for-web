var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const Tetriminos = [
// [[row,column],[...],[...],[...]]
    [[0,0],[0,0],[0,0],[0,0]],  //EMPTY
    [[1,0],[1,1],[1,2],[1,3]],  //TETRIS
    [[0,0],[0,1],[1,0],[1,1]],  //SQUARE
    [[0,0],[0,1],[1,1],[1,2]],  //KEY1
    [[0,2],[0,1],[1,1],[1,0]],  //KEY2
    [[0,0],[0,1],[0,2],[1,0]],  //L1
    [[0,0],[0,1],[0,2],[1,2]],  //L2
    [[0,0],[0,1],[0,2],[1,1]],  //T
];

ROW = 10;
COLUMN = 6;

//field setting
let field = (new Array(ROW + 6)).fill(0);
field.forEach((_, i) => {field[i] = (new Array(COLUMN+4)).fill(0);});

for(let i = 2; i < COLUMN + 2; i++)    {
    field[0][i] = 9;
    field[1][i] = 9;
    field[ROW + 4][i] = 9;
    field[ROW + 5][i] = 9;
}
for(let i = 0; i < ROW + 6; i++)    {
    field[i][0] = 9;
    field[i][1] = 9;
    field[i][COLUMN + 2] = 9;
    field[i][COLUMN + 3] = 9;
}

for (let i = 0; i < ROW + 6; i++)   {
    console.log(field[i]);
}