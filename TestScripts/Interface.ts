interface IPoint {
    x: number;
    y: number;
    print();
}



class UsePoint{
    public useIt(p : IPoint){
        console.log("useIt:" + p.x + "," + p.y);
    }
}


class ImplementsPoint implements IPoint {
    public x: number;
    public y: number;
    constructor(x = 0,y = 0)
    {
        this.x = x;
        this.y = y;
    }
    
    public print(){
        console.log("print:" + this.x + "," + this.y);
    }
}



namespace Testing
{
    function main()
    {
        let p = new ImplementsPoint(10,10);
        let u = new UsePoint();
        u.useIt(p);
        p.print();
    }
}