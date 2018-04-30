class Animal {
    name: string;
    constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number = 0) {
        console.log(this.name + " moved " + distanceInMeters + " m");
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    public move(distanceInMeters : number = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) { super(name); }
    public move(distanceInMeters : number= 45) {
        console.log("Galloping...");
        super.move(distanceInMeters);
    }
}



namespace Testing
{
    function main()
    {
        let sam : Snake = new Snake("Sammy the Python");
        let tom: Animal = new Horse("Tommy the Palomino");
        sam.move();
        tom.move(34);
    }
}
