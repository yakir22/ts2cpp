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
import {T2CClass} from "./T2CClass";
import {T2CFile} from "./T2CFile";

export class T2CNamespace{
	public name 		: string = "";
	public interfaces 	: T2CClass[] = [];
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

    public nameClean(file : T2CFile) {
        return file.name.replace(/\//g,"_") + "_" + this.name;
    } 
    private startStringClean(file : T2CFile){
        if ( this.name == "Testing" ) 
            return "namespace " + this.nameClean(file); 
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