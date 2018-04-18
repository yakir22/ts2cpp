

function AddNumbers(x : number, y : number ) : number
{
    return x + y;
}

function AddStrings(x : string, y : string ) : string
{
    return x + y;
}

function AddStringNumber(x : string, y : number ) : string
{
    return x + y;
}

namespace Testing
{
    function main()
    {
        console.log("AddNumbers(2,5) = " + AddNumbers(2,5));
        console.log("AddStrings('hello',' world') = " + AddStrings('hello',' world'));
        console.log("AddStringNumber('this is five : ',5) = " + AddStringNumber('this is five : ',5));
        console.log("AddStringNumber('this is five.24 : ',5.24) = " + AddStringNumber('this is five.24 : ',5.24));
    }
    main();
}