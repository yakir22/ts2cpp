class JSGraphics
{
    private mContext : CanvasRenderingContext2D;
    private mCanvas :HTMLCanvasElement;
    private mResourcePath : string;
    public init()
    {
        this.mCanvas = <HTMLCanvasElement>document.getElementById("myCanvas");
        this.mContext = this.mCanvas.getContext("2d");
    }
    public setResourcesPath(path : string )
    {
        this.mResourcePath = path;
    }
    public loadTexture(path : string )
    {
        
    }

    public drawFPS()
    {
        
    }
    public update()
    {

    }

    public drawImage( x : number, y: number,resource : string,w?:number, height?:number)
    {
    }
    public beginDraw()
    {
        this.mContext.clearRect(0,0,this.mCanvas.width,this.mCanvas.height);
    }

    public getWidth() : number {
        return this.mCanvas.width;
    }

    public getHeight() : number {
        return this.mCanvas.height;
    }


    public drawText(x :number, y:number, text : string,size:number,r: number,g: number,b: number,a: number)
    {
        // TODO :: implement
    }

    public drawRect(x :number, y:number,w : number, h:number,  r:number, g:number, b:number,a:number)
    {
        this.mContext.fillStyle="#FF00FF";
        this.mContext.fillRect(x, y,w,h);
        this.mContext.stroke();
    }
	public  endDraw(){}
	public  terminate(){}
	public  processEvents(){}
    public  quiting()  : boolean {
         return false; 
        }
}
let Graphics = new JSGraphics();