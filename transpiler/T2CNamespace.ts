import {T2CVariable} from "./T2CVariable";
import {T2CFunction} from "./T2CFunction";
import {T2CClass} from "./T2CClass";
import {T2CFile} from "./T2CFile";

export class T2CNamespace{
	public name 		: string = "";
	public interfaces 	: T2CFunction[] = [];
	public classes 		: T2CClass[] = [];
	public variables 	: T2CVariable[] = [];
	public functions 	: T2CFunction[] = [];
    public dependencis	: T2CFile[] = [];
    
    public printState(){
        console.log("namespace name : " + this.name);
        console.log("dependencis : " + this.dependencis.length);
        console.log("interfaces : " + this.interfaces.length);
        console.log("classes : " + this.classes.length);
        console.log("variables : " + this.variables.length);
        console.log("functions : " + this.functions.length);
    }

    private startStringClean(file : T2CFile){
        if ( this.name == "Testing" ) 
            return "namespace " + file.name.replace("/","_") + "_" + this.name; 
        return "namespace " + this.name;
    }
    
    public startString(file : T2CFile) 
    {
        if ( this.name.length == 0 ) 
            return "";
        return this.startStringClean(file) + "{";
    }

    public endString(file : T2CFile) 
    {
        if ( this.name.length == 0 )
            return "";
        return "} // " + this.startStringClean(file);
    }


}