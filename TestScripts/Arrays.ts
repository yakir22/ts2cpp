
class ArrayItem
{
    constructor(x : number)
    {
        this.x = x;
    }
    public x: number;
    public toString() : string{
        return "{" + this.x + "}";
    }
}
class Arrays
{
    public numbersArray2 : number[][] = [];
    public numbersArray : number[] = [];

    
    public stringsArray : string[];
    public stringsArray2 : string[][];

    public arrayItemsArray : ArrayItem[];
    public arrayItemsArray2 : ArrayItem[][];


    constructor( size : number)
    {
        this.stringsArray = Array();
        this.arrayItemsArray = Array();

        this.stringsArray2 = Array();
        this.arrayItemsArray2 = Array();
        
        for ( let i = 0; i < size ; i++ )
        {
            this.numbersArray2[i] = Array();
            this.stringsArray2[i] = Array();
            this.arrayItemsArray2[i] = Array();
            for ( let j = 0; j < size ; j++ )
            {
                let ai = new ArrayItem(j*i);
                this.arrayItemsArray2[i][j] = ai;
                this.stringsArray2[i][j] = "str-" + (i+j);
                this.numbersArray2[i][j] = i+j;
            }
            this.stringsArray[i] = "str-" + i;
            this.numbersArray[i] = i;
            this.arrayItemsArray[i]  = new ArrayItem(i * 10);
        }

    }

    public toString() : string
    {
        let ret = "";

        for ( let i = 0 ; i < this.stringsArray.length ; i++ ){
            ret += this.stringsArray[i] + ",";
            ret += this.arrayItemsArray[i].toString() +  ",";
            ret += this.numbersArray[i] +  ",";
            for ( let j = 0 ; j < this.stringsArray2[i].length ; j++ ){
                ret += this.stringsArray2[i][j] + ",";
                ret += this.arrayItemsArray2[i][j].toString() +  ",";
                ret += this.numbersArray2[i][j] +  ",";
           }
        }
        return ret;
    }
}




namespace Testing
{
    function main()
    {
        let arrs = new Arrays(5);
        console.log(arrs.toString());
    }
    main();
}