import {Entity} from './Entity'
import {Episode} from './Episode'
import {AStar} from './AStar'
import {Heuristic} from './AStar'
import {GraphNode} from './AStar'

class GameEntity extends Entity
{
    private board : Board;
    private idle : boolean;
    private currentPathIndex : number;
    private nextPathIndex : number;
    public speedFactor: number;
    constructor(board : Board ,cellX :number, cellY: number )
    {
        super(0,0);
        let p = board.cellToWorld(cellX,cellY);
        this.board = board;
        this.x = p.x;
        this.y = p.y;
        this.idle = true;
        this.speedFactor = Math.random();
        //this.dx = Math.random()*10 - 5;
        //this.dy = Math.random()*10 - 5;
    }
    
    public getIdle( ) : boolean
    {
        return this.idle;
    }

    private mPath : GraphNode[];
    public walkThePath(path : GraphNode[])
    {
        this.mPath = path;
        this.idle = false;
        this.currentPathIndex = 0;
        this.nextPathIndex = 1;
        let next = this.mPath[this.nextPathIndex];    
        let p = this.board.cellToWorld(next.x,next.y);
        this.x = p.x;
        this.y = p.y;
    }
    
    protected UpdateInternal(dt : number) {
        if ( this.idle )
            return;
       let speed = 20 * this.speedFactor;
        if ( this.currentPathIndex < 0 || this.nextPathIndex < 0 )
            return;
        let next = this.mPath[this.nextPathIndex];    
        let p = this.board.cellToWorld(next.x,next.y);

        if ( this.x < p.x )
            this.x += speed * dt;
        
        if ( this.x > p.x )
            this.x -= speed * dt;

        if ( this.y < p.y )
            this.y += speed * dt;
        
        if ( this.y > p.y )
            this.y -= speed * dt;

        if ( this.y < p.y + 1 && this.y > p.y - 1 && 
            this.x < p.x + 1 && this.x > p.x - 1)
        {
            this.nextPathIndex++;
            if ( this.nextPathIndex == this.mPath.length )
            {
                this.idle = true;
            }
        }
    }
}


class Cell
{
    public mBusy : boolean;
    public getResource() : string{
        return this.mBusy?"busy.png":"free.png";
    }
}

class Point 
{
    constructor(x : number,y : number)
    {
        this.x = x;
        this.y = y;
    }
    public x : number;
    public y : number;
}
class Board
{
    private mAStar : AStar;
    private mBoard: Cell[][];

    private mCachePoint : Point;
    private mCellSize : Point;
    private mStartPos : Point;
    public getAStar() : AStar
    {
        return this.mAStar;
    }
    public getCellSize() : Point
    {
        return this.mCellSize;
    }
    public cellToWorld(x : number,y:number ) :Point
    {
        this.mCachePoint.x = x * 0.5 * this.mCellSize.x;
        this.mCachePoint.y = x * -0.5 * this.mCellSize.y;

        this.mCachePoint.x += y * -0.5 * this.mCellSize.x + this.mStartPos.x;
        this.mCachePoint.y += y * -0.5 * this.mCellSize.y + this.mStartPos.y;
        return new Point(this.mCachePoint.x,this.mCachePoint.y); 
    } 
   /* public init(width : number, height :number)
    {
        this.mBoard = Array();
        for ( let y = 0 ; y < height ; y++ )
        {
            this.mBoard[y] = Array();
            for ( let x = 0 ; x < width ; x++ )
            {
                let cell = new Cell();
                cell.mBusy = Math.random() > 0.5;        
                this.mBoard[y][x] = cell;
            }
        }    
    }

    public initWithArray(arr : string[])
    {
        this.mBoard = Array();
        let y1 = 0;
        for ( let y = arr.length - 1 ; y >= 0 ; y-- )
        {
            this.mBoard[y1] = Array();
            let x1 = 0;
            for ( let x = 0 ; x < arr[y].length  ; x++ )
            {
                if ( arr[y].charAt(x) == ' ')
                    continue;
                let cell = new Cell();
                cell.mBusy = arr[y].charAt(x) == 'x';
                this.mBoard[y1][x1++] = cell;
            }
            y1++;
        }
    }*/
    public initWithArrayOfNumbers(arr : number[][])
    {
        this.mCachePoint = new Point(0,0);
        this.mCellSize = new Point(132,83 - 15);
        this.mStartPos = new Point(1024 / 2,768 - this.mCellSize.y);
        this.mAStar = new AStar(new Heuristic());
        this.mBoard = Array();
        let y1 = 0;
        for ( let y = arr.length - 1 ; y >= 0 ; y-- )
        {
            this.mBoard[y1] = Array();
            let x1 = 0;
            for ( let x = 0 ; x < arr[y].length  ; x++ )
            {
                let cell = new Cell();
                cell.mBusy = arr[y][x] != 0;
                this.mBoard[y1][x1++] = cell;
            }
            y1++;
        }
        this.mAStar.load(arr.reverse());
    }
    public render()
    {
        for ( let y = this.mBoard.length - 1 ; y >=0   ; y-- )
        {
            for ( let x = this.mBoard[y].length - 1; x >= 0  ; x-- )
            {
                let p = this.cellToWorld(x,y);
                Graphics.drawImage(p.x,p.y,this.mBoard[y][x].getResource());
            }
        }
    }
}

class Game
{
    public updateFrame()
    {
        this.episode.update(0.0166);
        Graphics.beginDraw();
        this.board.render();
        let as = this.board.getAStar();
        let model = this.episode.getModel();
        let cellSize = this.board.getCellSize();
        for ( let i = 0 ; i < model.entities.length ; i++ ){
            let ent = <GameEntity>model.entities[i]; 
            if ( ent.getIdle() )
            {
                let rnd = Math.random() * 4;
                var path : GraphNode[];
                if ( rnd < 1 )
                    path = as.path(as.getNode(0,0), as.getNode(9,0));
                else if ( rnd < 2 )
                    path = as.path(as.getNode(0,0), as.getNode(9,8));
                else if ( rnd < 3 )
                    path = as.path(as.getNode(0,0), as.getNode(0,8));
                else
                    path = as.path(as.getNode(0,0), as.getNode(9,4));

                ent.walkThePath(path);
            }
            Graphics.drawRect(ent.x + cellSize.x/2,ent.y + cellSize.y/2,ent.speedFactor*255,(ent.speedFactor/2)*255,(1-ent.speedFactor)*255,255);
            //Graphics.drawImage(ent.x,ent.y,"free.png");
        }
        Graphics.endDraw();
        Graphics.processEvents();
    }
    public init()
    {
        this.board = new Board();
       /* this.board.initWithArray(
            [
                "o o o o o o o o o o",        
                "x x x o o o x x x x",        
                "o o x x x x x o o o",        
                "o o o o o x o o o o",        
                "o o o o o x o o o o",        
                "o o o o o x x x x x",        
                "o o x x x x o o o o",        
                "o o x o o o o o o o",        
                "o x x o o o o o o o",        
                "x x o o o o o o o o",        
            ]
        );*/

        this.board.initWithArrayOfNumbers( [
            [5,5,5,5,5,5,5,5,5,5],
            [0,0,0,5,5,5,0,0,0,0],
            [5,5,0,0,0,0,0,5,5,5],
            [5,5,5,5,5,0,5,5,5,5],
            [5,5,5,5,5,0,5,5,5,5],
            [5,5,5,5,5,0,0,0,0,0],
            [5,5,0,0,0,0,5,5,5,5],
            [5,5,0,5,5,0,0,0,5,5],
            [5,0,0,5,5,5,5,0,0,5],
            [0,0,5,5,5,5,5,5,0,0],
        ]);



        this.episode = new Episode();
        this.episode.init();
        for ( let i = 0 ; i < 1000 ; i++ ) {
            let e = new GameEntity(this.board,0,0);
            this.episode.getModel().AddEntity(e);
        }

    }
    private episode : Episode;
    private board : Board; 
}

namespace Testing{
function main() {
    Graphics.init();
    Graphics.setResourcesPath("./images/");
    Graphics.loadTexture("free.png");
    Graphics.loadTexture("busy.png");

    let game = new Game();
    game.init();
    while ( true )
    {
        Graphics.update();
        game.updateFrame();
        if (Graphics.quiting())
            break;
    }
    Graphics.terminate();
}
main();
}