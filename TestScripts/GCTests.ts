export class MemObject
{
    constructor(value : number )
    {
        this.value = value;
    }
    public value : number;
    public other : MemObject;
}

export class GCTests
{
    cyclicReferencingTest() : void
    {
        let a = new MemObject(5);
        let b = new MemObject(33);
        a.other = b;
        b.other = a;
    }
}



namespace Testing
{
    function main()
    {
        let gc = new GCTests();
        gc.cyclicReferencingTest();
    }
}