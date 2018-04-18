import * as ts from "typescript";
import {T2CVariable} from "./T2CVariable";

export class T2CFunction{
	public name 		: string;
	public returns 		: T2CVariable = new T2CVariable();
	public access 		: string = "";
	public parameters 	: T2CVariable[] = [];
	public body 		: ts.Node = null;
	public decorators 	: string[] = [];

	public getCppAccess() {
		if ( this.access.length == 0  )
			return "public";
		return this.access;
	}

	public hasBody() : boolean {
		return this.body != null;
	}
}