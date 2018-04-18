import {Entity} from './Entity'

export class Episode
{
    private mModel : Entity;

    public init() : void
    {
        this.mModel = new Entity(0,0);
    }

    public update(dt: number) : void
    {
        this.mModel.Update(dt);
    }

    public getModel() : Entity
    {
        return this.mModel;
    }
}




namespace Testing 
{
    function main()
    {
        let e = new Episode();
        e.init();
        console.log(e.getModel().toString());
    }
    main();
}