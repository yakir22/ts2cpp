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
	
	public toCppType(): string
	{
		return T2CVariable.getCppType(this.type,this.size)
	}

	public toCppArrayItemType(): string
	{
		if ( this.size == 0 )
			throw "bad usage";
		this.size--;
		let ret =  T2CVariable.getCppType(this.type,this.size)
		this.size++;
		return ret;
	}

	static getCppType(type : string,size : number) : string
	{
		let typeString  = "";
		if (type == "!~")				typeString = ""; // constructor
		else if (type == "number")		typeString = "double";
		else if (type == "auto")		typeString = "auto";
		else if (type == "boolean")	typeString = "bool";
		else if (type == "string")		typeString = "JSString";
		else if (type == "void" || type == "")	typeString = "void";
		else typeString = type + "Ref";
	
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