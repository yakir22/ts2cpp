class Point
{
    private mX : number = 0;
    private mY : number = 0;
	
    constructor(x : number,y:number)
    {
        this.mX = x;
        this.mY = y;
    }

    public toString() : string
    {
        return "(" + this.mX + "," + this.mY + ")";
    }


    public testAny(anyVar : any)
    {
        console.log(anyVar.x as number);
        //console.log(anyVar[0] as string);
    }
}

namespace Testing
{
    function main()
    {
        let p = new Point(10,20);
        p.testAny({x : 33});
        console.log(p.toString());
    }
    main();
}