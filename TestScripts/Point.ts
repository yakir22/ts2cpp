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
}

namespace Testing
{
    function main()
    {
        let p = new Point(10,20);
        console.log(p.toString());
    }
    main();
}