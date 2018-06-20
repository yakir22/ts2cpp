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

import {T2CFile} 		from "./T2CFile"
import {T2CParser} 		from "./T2CParser"
import {T2CCodeBuilder} from "./T2CCodeBuilder"
import {T2CExeBuilder} 	from "./T2CExeBuilder"
import {T2CVariable} 	from "./T2CVariable";
import { T2CClass } from "./T2CClass";

export class T2CRoot{

	public 	rootDirectory 		: string;
	public 	forwardDeclarations : string[] = [] 
    private mFiles 				: T2CFile[] = [];
	private mCustomBuilder 		: T2CCodeBuilder = null;

	constructor(customBuilder : T2CCodeBuilder = null){
		this.mCustomBuilder = customBuilder;
	}


	// TODO :: if two namespaces has the same class in them this will return the last one it find
	// need to refine search by namespace usage
	public getClassByName(name : string) : T2CClass
	{
		let ret = null;
		this.mFiles.forEach(f => {
			f.namespaces.forEach(ns =>{
				ns.classes.forEach(cls => {
					if ( cls.name == name )
						ret = cls;
				});
				ns.interfaces.forEach(i => {
					if ( i.name == name )
						ret = i;
				});
			});
		});
		return ret;
	}

	public isEnum(name : string){
		let ret = false;
		this.mFiles.forEach(f => {
			f.namespaces.forEach(ns =>{
				ns.enums.forEach(enm =>{
					if ( enm.name == name )
						ret = true;
				})
			})
		})
		return ret;
	}

	public isInterface(v : T2CVariable)
	{
		let ret = false;
		this.mFiles.forEach(f => {
			f.namespaces.forEach(ns =>{
				ns.interfaces.forEach(i => {
					if ( i.name == v.type )
						ret = true;
				});
			});
		});
		return ret;
	}

	public processFile(filename : string){
		let file = this.getFile(filename);
		this.rootDirectory = filename.substring(0,filename.lastIndexOf("/") + 1);
		this.processFileInternal(file);
	}

	private processFileInternal(file : T2CFile ){
		console.log("processing " + file.name);
		file.processed = true;
		if ( T2CParser.parseFile(file) ){
			this.mFiles.push(file);
			file.imports.forEach(impt => {
				let importedFile = this.getFile(impt);
				if ( ! importedFile.processed )
					this.processFileInternal(importedFile);
			});
		}
	}

	public getFiles(): T2CFile[]{
		return this.mFiles;
	}


	public getFile(name : string) : T2CFile{
		let ret = null;
		this.mFiles.forEach(file => {
			if ( file.name == name )
				ret = file; 
		});
		if ( ret == null )
			ret = new T2CFile(name);
		return ret;
	}

	public createCppCode(outDir : string = "./"){
		T2CCodeBuilder.createCode(this,outDir,this.mCustomBuilder);
    }
    
    public build(){
        T2CExeBuilder.build(this);
    }
}