export class Entity
{
    public entities : Entity[];
    public x : number;
    public y : number;

    constructor(x : number,y : number){
        this.entities = new Array(); 
        this.entities = []; 
        this.entities = Array(); 
        this.x = x;
        this.y = y;
    }
    public AddEntity(entity : Entity) : void{
        this.entities.push(entity);
    }

    public Update(dt : number) : void{
        this.UpdateInternal(dt);
        for ( let i  = 0 ; i < this.entities.length ; i++ ){
            this.entities[i].Update(dt);
        }
    }

    protected UpdateInternal(dt : number) {

    }

    public toString() : string
    {
        let s = "(" + this.x + "," + this.y + (this.entities.length?",":"" );
        for ( let i  = 0 ; i < this.entities.length ; i++ ){
            s += this.entities[i].toString();
        }
        return s + ")";
    }
}

namespace Testing
{
    function main()
    {
        let e0 = new Entity(10,20);
        let e1 = new Entity(40,50);
        e0.AddEntity(e1);
        console.log(e0.toString());
    }
    main();
}

