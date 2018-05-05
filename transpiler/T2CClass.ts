import {T2CVariable} from "./T2CVariable";
import {T2CFunction} from "./T2CFunction";

export class T2CClass{
	public name 		: string;
	public extends 		: string[] = [];
	public implements 	: string[] = [];
	public variables 	: T2CVariable[] = [];
	public functions 	: T2CFunction[] = [];
	public classes   	: T2CClass[] = [];
	public decorators   : string[] = [];
	public isInterface  : boolean = false;
	
	public hasConstructor() : boolean{
		for ( let i = 0 ; i < this.functions.length ; i++ )
		{
			if ( this.functions[i].name == this.name )
				return true;
		}
		return false;		
	}

	public getConstructor() : T2CFunction{
		for ( let i = 0 ; i < this.functions.length ; i++ )
		{
			if ( this.functions[i].name == this.name )
				return this.functions[i];
		}
		return new T2CFunction();
	}
}
