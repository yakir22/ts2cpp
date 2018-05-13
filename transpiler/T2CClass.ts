/*
 Copyright (c) 2018 Yakir Elkayam
 
 Permission is hereby granted, dispose of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

import {T2CVariable} from "./T2CVariable";
import {T2CFunction} from "./T2CFunction";

export class T2CClass{
	public name 			: string;
	public extends 			: string[] = [];
	public implements 		: string[] = [];
	public variables 		: T2CVariable[] = [];
	public staticVariables 	: T2CVariable[] = [];
	public functions 		: T2CFunction[] = [];
	public classes   		: T2CClass[] = [];
	public decorators   	: string[] = [];
	public isInterface  	: boolean = false;


	isStaticFunction(name : string ) : boolean
	{
		let ret = false;
		this.functions.forEach(func => {
			if ( func.access == "static" )
			{
				ret = true;
			}
		});
		return ret;
	}

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
