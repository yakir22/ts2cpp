class TSPoint
{
    private mX : number = 0;
    private mY : number = 0;
	static Zero : TSPoint = new TSPoint(0,0);
    constructor(x : number,y:number)
    {
        this.mX = x;
        this.mY = y;
    }

    public toString() : string
    {
        return "(" + this.mX + "," + this.mY + ")";
    }


    static distance(p0 : TSPoint,p1 : TSPoint) : number
    {
        return Math.sqrt(Math.pow(p0.mX - p1.mX,2) + Math.pow(p0.mY - p1.mY,2));
    }
}

namespace Testing
{
    function main()
    {
        let p0 = new TSPoint(10,20);
        console.log(p0.toString());
        let p1 = new TSPoint(20,30);
        let distance = TSPoint.distance(p0,p1);
		console.log("Distance between " + p0.toString() + " to " + p1.toString() + " = " + distance);
		distance = TSPoint.distance(p0,TSPoint.Zero);
		console.log("Distance between " + p0.toString() + " to " + TSPoint.Zero.toString() + " = " + distance);
    }
    main();
}