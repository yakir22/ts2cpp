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


    static distance(p0 : Point,p1 : Point) : number
    {
        return Math.sqrt(Math.pow(p0.mX - p1.mX,2) + Math.pow(p0.mY - p1.mY,2));
    }
}

namespace Testing
{
    function main()
    {
        let p0 = new Point(10,20);
        console.log(p0.toString());
        let p1 = new Point(20,30);
        let distance = Point.distance(p0,p1);
        console.log("Distance between " + p0.toString() + " to " + p1.toString() + " = " + distance);
    }
    main();
}