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

import * as ts from "typescript";
import {T2CUtils} from "./T2CUtils";
import {T2CCodeBuilder} from "./T2CCodeBuilder";
export class T2CVariable{
	public name 	: string = "";
	public access 	: string = "";
	public value 	: string = "";
	public type 	: string = "";
	public size  	: number = 0;
	public valueKind: ts.SyntaxKind = ts.SyntaxKind.Unknown;
	public valueNode: ts.Node = null;
	public node		: ts.Node = null;
	public interfaceVar : boolean = false;

	public detectTypeIfNeeded() 
	{
		if ( this.type == "" )
		{
			if ( this.value != "" )
			{
				if ( this.valueKind == ts.SyntaxKind.NumericLiteral)
					this.type = "number";
				else if ( this.valueKind == ts.SyntaxKind.StringLiteral)
					this.type = "string";
				else if ( this.valueKind == ts.SyntaxKind.TrueKeyword ||  this.valueKind == ts.SyntaxKind.FalseKeyword )
					this.type = "boolean";
				else if ( this.valueKind == ts.SyntaxKind.NewExpression )
				{
					let tt = this.valueNode.getText();
					let tokens = T2CUtils.buildTokenList(this.valueNode);
					this.value = "";
					tokens.forEach(t => {
						if ( t.kind == ts.SyntaxKind.NewKeyword )
						{
							this.value += "std::make_shared<";
						}
						else if ( t.kind == ts.SyntaxKind.Identifier && this.type == "")
						{
							this.value += t.getText() + ">";	
							this.type = t.getText() ;	
						}
						else 
						{
							this.value += t.getText() + " ";
						}
					});
				}
			}
		}
	}

	public isVoid() : boolean
	{
		return this.type == "void" || this.type == "";
	}
	
	public toCppType(isMethodSignature : boolean = false): string
	{
		if ( T2CCodeBuilder.getBuilder().getRoot().isEnum(this.type) )
			return this.type;
		return T2CVariable.getCppType(this.type,this.size,this.value,isMethodSignature)
	}

	public toCppArrayItemType(): string
	{
		if ( this.size == 0 )
			throw "bad usage";
		this.size--;
		let ret =  T2CVariable.getCppType(this.type,this.size,this.value)
		this.size++;
		return ret;
	}

	
	static getCppType(type : string,size : number,value: string,isMethodSignature : boolean = false) : string
	{
		let typeString  = "";
		if (type == "!~")				typeString = ""; // constructor
		else if (type == "number")		typeString = "double";
		else if (type == "auto")		typeString = "auto";
		else if (type == "boolean")		typeString = "bool";
		else if (type == "string")		typeString = isMethodSignature?"const JSString& ":"JSString";
		else if (type == "void" )		typeString = "void";
		else if (type == "" ){
			if ( value == "" )
				typeString = "void";
			else {
				// figure out the type or throw
				if ( size > 0 )
					throw "not implemented";
				if ( value.indexOf("new ") == 0 )
				{
					for ( let i = 4 ; i < value.length ;i++ ){
						if( T2CUtils.isAlphaNumeric(value.charCodeAt(i)) )
							typeString += value.charAt(i);
						else
						{
							typeString += "Ref";				
							break;
						}
					}
				}
				if ( !isNaN(parseFloat(value) ) )
					typeString = "double";
				else if ( value == "true" || value == "false" )
					typeString = "bool";
				else
					typeString = isMethodSignature?"const JSString& ":"JSString";
			}
		}
		else{
			typeString = type + "Ref" ;
		} 
	
		if ( size )
		{
			let newTypeString  = "";
			for (let  i = 0; i < size; i++)
				newTypeString += "JSArray<";
			newTypeString += typeString;
			for (let i = 0; i < size; i++)
				newTypeString += ">";
			typeString = newTypeString /*+ (isFunctionSignature?"&":"")*/;
		}
		return typeString;
	}

	public isSimple() : boolean
	{
        if (this.type == "number") return true;
        if (this.type == "boolean")    return true;
		if (this.type == "string")    return true;
		if (this.type == "any")    return true;
        if (this.type == "void" || this.type == "")    return true;
        return false;
	}
	
	public hasValue() : boolean 
	{
        return this.value != "";
    }

}