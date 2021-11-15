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

const ROW = 20;
const COLUMN = 10;

const dump_on = true;

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


let randoms = [];
let end = Tetriminos.length;

let sw_power = true;

const row_shift = 1;
const column_shift = Math.ceil(COLUMN/2) + 1;

//BlockInfoの設定
let BlockInfo = new Object();
BlockInfo.type = 0;
BlockInfo.addr = Tetriminos[EMPTY];

//field setting
let field = (new Array(ROW + 5)).fill(0);
field.forEach((_, i) => {field[i] = (new Array(COLUMN + 4)).fill(0);});

setting();

let count = 0;
const countUp = () => {
    count++;
    const timeoutId = setTimeout(countUp, 1000);

    document.addEventListener('keydown', keyevent);
    
    drop_block();

    if(count > 30){　
        clearTimeout(timeoutId);
    }
}
countUp();

function　shuffle() {
    //ブロックの順番を決める
    randoms = [];
    for(i = 1; i < end; i++){
        while(true){
            var tmp = Math.floor(Math.random() * (end - 1)) + 1;
            if(!randoms.includes(tmp)){
                randoms.push(tmp);
                break;
            }
        }
    }
}

function keyevent(e) {
    if (sw_power) {
        switch (e.key) {
            case 'ArrowUp':
                //console.log('↑');
                break;
            case 'ArrowDown':
                //console.log('↓');
                break;
            case 'ArrowLeft':
                //console.log('←');
                move_left();
                break;
            case 'ArrowRight':
                //console.log('→');
                move_right();
                break;
            case 'x':
                //console.log('x');
                rotate_clockwise();
                break;
            case 'z':
                //console.log('z);
                rotate_counter_clockwise();
                break
        }
    }
}

function setting()  {
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

    shuffle();
    
    BlockInfo.type = randoms[0];
    for (let i = 0; i < 7; i++) {
        randoms[i] = randoms[i+1];
    }

    //最初のブロックを保存
    for (let i = 0; i < 4; i++) {
        BlockInfo.addr[i][0] = Tetriminos[BlockInfo.type][i][0] + row_shift;
        BlockInfo.addr[i][1] = Tetriminos[BlockInfo.type][i][1] + column_shift;
    }
    dump()
}

function new_block()   {
    if (randoms[1] === undefined) {
        BlockInfo.type = randoms[0];
        shuffle();
        while (randoms[0] == BlockInfo.type)   {
            shuffle();
        }
        //draw_next_block(randoms[0]);
    } else {
        BlockInfo.type = randoms[0];
        //draw_next_block(randoms[1]);
        for (let i = 0; i < 7; i++) {
            randoms[i] = randoms[i+1];
        }
    }
    
    for (let i = 0; i < 4; i++) {
        BlockInfo.addr[i][0] = Tetriminos[BlockInfo.type][i][0] + row_shift;
        BlockInfo.addr[i][1] = Tetriminos[BlockInfo.type][i][1] + column_shift;
    }

    dump();
}

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
        new_block();
    }
    dump();
}

function move_left()    {
    let row, column;
    let collision = 0;

    //衝突の検査
    for(let i = 0; i < 4; i++)  {
        row = BlockInfo.addr[i][0];
        column = BlockInfo.addr[i][1] - 1;
        collision += field[row][column];
    }

    if(collision == 0)    {
        //アドレスを更新
        for(let i = 0; i < 4; i++)  {
            BlockInfo.addr[i][1] -= 1;
        }
    }

    dump();
}

function move_right()   {
    let row, column;
    let collision = 0;

    //衝突の検査
    for(let i = 0; i < 4; i++)  {
        row = BlockInfo.addr[i][0];
        column = BlockInfo.addr[i][1] + 1;
        collision += field[row][column];
    }

    if(collision == 0)    {
        //アドレスを更新
        for(let i = 0; i < 4; i++)  {
            BlockInfo.addr[i][1] += 1;
        }
    }

    dump();
}

function rotate_clockwise() {
    let entry;
    let row_trance, column_trance;
    let collision = 0;
    let row_addr = new Array(4);
    let column_addr = new Array(4);

    //衝突の検査
    if (BlockInfo.type == TETRIS)   {
        for (let i = 0; i < 4; i++) {
            row_addr[i] = BlockInfo.addr[i][1];
            column_addr[i] = BlockInfo.addr[i][0];
        }

        if (BlockInfo.rotate == 0 || BlockInfo.rotate == 3) entry = 1;
        if (BlockInfo.rotate == 1 || BlockInfo.rotate == 2) entry = 2;

        row_trance = BlockInfo.addr[entry][0] - BlockInfo.addr[entry][1];
        if (BlockInfo.rotate == 0)   {
            //初期位置の場合
            column_trance = -row_trance + 1;
        } else if (BlockInfo.rotate == 2)   {
            //初期位置から２回転させた場合
            column_trance = -row_trance - 1;
        } else  {
            column_trance = -row_trance;
        }

        for (let i = 0; i < 4; i++) {
            row_addr[i] += row_trance;
            column_addr[i] += column_trance;
            collision += field[row_addr[i]][column_addr[i]];
        }
        BlockInfo.rotate += 1;
        if (BlockInfo.rotate == 4) BlockInfo.rotate = 0;

    } else  {
        //テトリミノがTETRIS以外の場合
        for(let i = 0;i < 4;i++)    {
            row_addr[i] = BlockInfo.addr[1][0] - BlockInfo.addr[1][1] + BlockInfo.addr[i][1];
            column_addr[i] = BlockInfo.addr[1][1] + BlockInfo.addr[1][0] - BlockInfo.addr[i][0];
            collision += field[row_addr[i]][column_addr[i]];
        }
    }

    //衝突
    if(collision == 0)  {
        //アドレスの更新
        if (BlockInfo.type != SQUARE)    {
            // SQUAREは回転させない
            for(let i = 0; i < 4; i++)  {
                BlockInfo.addr[i][0] = row_addr[i];
                BlockInfo.addr[i][1] = column_addr[i];
            }
        }
    }
    dump();
}

function rotate_counter_clockwise() {
    let entry;
    let row_trance, column_trance;
    let collision = 0;
    let row_addr = new Array(4);
    let column_addr = new Array(4);

    //衝突の検査
    if (BlockInfo.type == TETRIS)   {
        for (let i = 0; i < 4; i++) {
            row_addr[i] = BlockInfo.addr[i][1];
            column_addr[i] = BlockInfo.addr[i][0];
        }

        if (BlockInfo.rotate == 0 || BlockInfo.rotate == 3) entry = 1;
        if (BlockInfo.rotate == 1 || BlockInfo.rotate == 2) entry = 2;

        column_trance = BlockInfo.addr[entry][1] - BlockInfo.addr[entry][0];

        if (BlockInfo.rotate == 1)   {
            //初期位置から1回転させた場合
            row_trance = -column_trance - 1;
        } else if (BlockInfo.rotate == 3)   {
            //初期位置から3回転させた場合
            row_trance = -column_trance + 1;
        } else  {
            row_trance = -column_trance;
        }

        for (let i = 0; i < 4; i++) {
            row_addr[i] += row_trance;
            column_addr[i] += column_trance;
            collision += field[row_addr[i]][column_addr[i]];
        }
        BlockInfo.rotate -= 1;
        if (BlockInfo.rotate == -1) BlockInfo.rotate = 3;

    } else  {
        //テトリミノがTETRIS以外の場合
        for(let i = 0;i < 4;i++)    {
            row_addr[i] = BlockInfo.addr[1][1] + BlockInfo.addr[1][0] - BlockInfo.addr[i][1];
            column_addr[i] = BlockInfo.addr[1][1] - BlockInfo.addr[1][0] + BlockInfo.addr[i][0];
            collision += field[row_addr[i]][column_addr[i]];
        }
    }

    if(collision == 0)  {
        //アドレスの更新
        if (BlockInfo.type != SQUARE)    {
            // SQUAREは回転させない
            for(let i = 0; i < 4; i++)  {
                BlockInfo.addr[i][0] = row_addr[i];
                BlockInfo.addr[i][1] = column_addr[i];
            }
        }
    }
    dump();
}

function dump()    {
    if (dump_on)    {
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
}