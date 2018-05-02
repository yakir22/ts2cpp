class SomeType
{
    constructor(x : number)
    {

    }
}

class TestClass
{
    constructor()
    {
    }

    public functionVariable(n = 5,s = "lala", b = true,t = new SomeType(33))
    {

    }

    public inFunctionVariables()
    {
        let n = 3.3;
        let s = "lalala";
        let b = true;
        let t = new SomeType(55);
    }

    public returnString()
    {
        return "";
    }

    public returnNumber()
    {
        return 44;
    }

    public returnBool()
    {
        return false;
    }



    public returnSomeType() 
    {
        return new SomeType(44);
    }
}


namespace Testing
{
    function main()
    {

    }
}