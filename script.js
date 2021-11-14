var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const EMPTY = 0;
const TETRIS = 1;
const SQUARE = 2;
const KEY1 = 3;
const KEY2 = 4;
const L1 = 5;
const L2 = 6;
const T = 7;

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

const ROW = 10;
const COLUMN = 6;

const row_shift = 1;

//BlockInfoの設定
let BlockInfo = new Object();
BlockInfo.type = 0;
BlockInfo.addr = Tetriminos[EMPTY];

//field setting
let field = (new Array(ROW + 5)).fill(0);
field.forEach((_, i) => {field[i] = (new Array(COLUMN + 4)).fill(0);});

for(let i = 2; i < COLUMN + 2; i++)    {
    field[0][i] = 9;
    field[ROW + 3][i] = 9;
    field[ROW + 4][i] = 9;
}
for(let i = 0; i < ROW + 5; i++)    {
    field[i][0] = 9;
    field[i][1] = 9;
    field[i][COLUMN + 2] = 9;
    field[i][COLUMN + 3] = 9;
}

type = SQUARE;
BlockInfo.type = type;

for (let i = 0; i < 4; i++) {
    BlockInfo.addr[i][0] = Tetriminos[type][i][0] + row_shift;
    BlockInfo.addr[i][1] = Tetriminos[type][i][1] + 4;
}

dump();

let count = 0;
const countUp = () => {
    count++;
    const timeoutId = setTimeout(countUp, 1000);
    
    drop_block();

    if(count > 20){　
        clearTimeout(timeoutId);
    }
}
countUp();

function drop_block()   {
    let row, column;
    let collision = 0;

    //アドレスの更新
    for(let i = 0; i < 4; i++)  {
        BlockInfo.addr[i][0] += 1;
    }

    //衝突の検査
    for(let i = 0; i < 4; i++)  {
        row = BlockInfo.addr[i][0] + 1;
        column = BlockInfo.addr[i][1];
        collision += field[row][column];
    }

    //衝突
    if(collision != 0)    {
        //ブロックをフィールドに固定
        for(let i = 0; i < 4; i++)  { 
            row = BlockInfo.addr[i][0];
            column = BlockInfo.addr[i][1];
            field[row][column] = BlockInfo.type;
        }

        //BlockInfoの初期化
        type = L2;
        BlockInfo.type = type;
        
        for (let i = 0; i < 4; i++) {
            BlockInfo.addr[i][0] = Tetriminos[type][i][0] + row_shift;
            BlockInfo.addr[i][1] = Tetriminos[type][i][1] + 4;
        }
    }
    dump();
}

function dump()    {
    let row, column;
    let debug = (new Array(ROW+row_shift)).fill(0);
    debug.forEach((_, i) => {debug[i] = (new Array(COLUMN)).fill(0);});

    for (let i = 0; i < ROW + row_shift; i++)   {
        for (let j = 0; j < COLUMN; j++)    {
            debug[i][j] = field[i+2][j+2];
        }
    }

    for (let i = 0; i < 4; i++) {
        row = BlockInfo.addr[i][0] - row_shift;
        column = BlockInfo.addr[i][1] - 2;
        debug[row][column] = BlockInfo.type;
    }

    for (let i = 1; i < ROW+1; i++)   {
        console.log(debug[i])
    }

    console.log("");
}