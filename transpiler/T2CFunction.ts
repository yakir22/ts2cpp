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