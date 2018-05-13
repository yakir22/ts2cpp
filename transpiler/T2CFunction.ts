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
import {T2CVariable} from "./T2CVariable";
import { T2CUtils } from "./T2CUtils";

export class T2CFunction{
	public name 		: string;
	public returns 		: T2CVariable = new T2CVariable();
	public access 		: string = "";
	public parameters 	: T2CVariable[] = [];
	public body 		: ts.Node = null;
	public decorators 	: string[] = [];

	public getCppAccess() 
	{
		if ( this.access.length == 0  )
			return "public";
		return this.access;
	}

	public isConstructor() : boolean
	{
		return this.name == "constructor";
	}

	public hasBody() : boolean 
	{
		return this.body != null;
	}

	public detectReturnTypeIfNeeded() 
	{
		if ( !this.hasBody() || this.returns.type != "")
			return;
		
		let tokens = T2CUtils.buildTokenList(this.body);
		let t : ts.Node = T2CUtils.getNextToken(tokens);
		while ( t != null )
		{
			if ( t.kind == ts.SyntaxKind.ReturnKeyword )
			{
				t = T2CUtils.getNextToken(tokens);
				if ( t.kind  == ts.SyntaxKind.NumericLiteral)
				{
					this.returns.type = "number";
					break;
				}
				else if ( t.kind  == ts.SyntaxKind.StringLiteral)
				{
					this.returns.type = "string";
					break;
				}
				else if ( t.kind  == ts.SyntaxKind.TrueKeyword ||  t.kind  == ts.SyntaxKind.FalseKeyword )
				{
					this.returns.type = "boolean";
					break;
				}
				else if ( t.kind  == ts.SyntaxKind.NewKeyword )
				{
					this.returns.type = T2CUtils.ExtractFirstIdentifier(t.parent).getText();
					break;
				}
			}
			t = T2CUtils.getNextToken(tokens);
		}
	}
}