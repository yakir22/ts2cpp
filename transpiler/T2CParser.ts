import * as ts from "typescript";
import {readFileSync, unlink,unlinkSync} from "fs";
import {T2CClass} 		from "./T2CClass"
import {T2CNamespace} 	from "./T2CNamespace"
import {T2CFile} 		from "./T2CFile"
import {T2CFunction} 	from "./T2CFunction"
import {T2CVariable} 	from "./T2CVariable"
import {T2CKindHelper} 	from "./T2CKindHelper"


export class T2CParser{

	private mCurrentFile 		: T2CFile;
	private mCurrentClass 		: T2CClass;
	private mCurrentNamespace 	: T2CNamespace;
	private mCurrentFunction 	: T2CFunction;
	private mCurrentDirectory 	: string;

	static parseFile(file : T2CFile) : boolean {
		let parser = new T2CParser(); 
		parser.mCurrentFile = file;
		parser.mCurrentNamespace = file.namespaces[0]; // default
		parser.mCurrentDirectory = file.tsName.substr(0, file.tsName.lastIndexOf("/"));
		console.log("parser.mCurrentDirectory: " + parser.mCurrentDirectory);
		let tsSourceFile = ts.createSourceFile(file.tsName, readFileSync(file.tsName).toString(), ts.ScriptTarget.ES2015, /*setParentNodes */ true);
		parser.parseSourceFile(tsSourceFile);
		return true;
	}

	private parseSourceFile(node: ts.Node) {
		for ( let i = 0 ; i < node.getChildCount() ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.SyntaxList : 
					this.parseSyntaxList(child);
					break;
			}
		}
		this.mCurrentFile.printState();
	}

	private parseModule(node: ts.Node){ // namespace
		let curNS = this.mCurrentNamespace;
		for ( let i = 0 ; i < node.getChildCount() ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.Identifier :
				{
					let ns : T2CNamespace = null;
					this.mCurrentFile.namespaces.forEach(space => {
						if ( ns != null )
							return;
						if ( space.name == child.getText() )
							ns = space;
					});
					if ( ns == null ) {
						ns = new T2CNamespace();
						ns.name = child.getText();
						this.mCurrentFile.namespaces.push(ns);
					}
					this.mCurrentNamespace = ns;
					break;
				}
				case ts.SyntaxKind.ModuleBlock :
				{
					for ( let j = 0 ; j < child.getChildCount() ; j++ ){
						let child2 = child.getChildAt(j);
						switch (child2.kind) {
							case ts.SyntaxKind.SyntaxList :
								this.parseSyntaxList(child2);
								break;
						}
					}	
					break;
				}
			}
		}
		this.mCurrentNamespace = curNS; // TODO :: support nested namespaces
	}

	private parseImport(node: ts.Node) {
		for ( let i = 0 ; i < node.getChildCount() ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.StringLiteral:
					// TODO :: handle import path properly
					this.mCurrentFile.imports.push(child.getText().replace(/\'/g,"").replace(/\"/g,"").replace("./",this.mCurrentDirectory + "/") + ".ts");
					break;
			}	
		}	
	}

	private parseSyntaxList(node: ts.Node) {
		for ( let i = 0 ; i < node.getChildCount() ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.InterfaceDeclaration:
					this.parseInterface(child);
					break;
				case ts.SyntaxKind.ClassDeclaration : 
					this.parseClass(child);
					break;
				case ts.SyntaxKind.ModuleDeclaration :
					this.parseModule(child); // namespace
					break;
				case ts.SyntaxKind.FunctionDeclaration:
					this.parseFunction(child);
					break;
				case ts.SyntaxKind.ImportDeclaration:
					this.parseImport(child);
					break;
				/*case ts.SyntaxKind.PropertyDeclaration:
					this.parseProperty(child);
					break;*/
			}
		}
	}
	private parseClassHeritage(node: ts.Node) {
		let isInterface = false;
		for ( let i = 0 ; i < node.getChildCount() ; i++ ){
			let child = node.getChildAt(i);
			if ( child.kind == ts.SyntaxKind.ImplementsKeyword )
			{
				isInterface = true;
			}
			else if ( child.kind == ts.SyntaxKind.SyntaxList )
			{
				if ( isInterface )
					this.mCurrentClass.implements.push(child.getText());
				else
					this.mCurrentClass.extends.push(child.getText());
			}
		}
	}
	private parseClassSyntaxList(node: ts.Node) {
		for ( let i = 0 ; i < node.getChildCount() ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.HeritageClause:
					this.parseClassHeritage(child);
					break;
				case ts.SyntaxKind.ClassDeclaration : 
					this.parseClass(child); // TODO :: handle subclasses 
					break;
				case ts.SyntaxKind.PropertyDeclaration:
				case ts.SyntaxKind.PropertySignature:
					let v = this.parseProperty(child);
					this.mCurrentClass.variables.push(v);
					break;
				case ts.SyntaxKind.Constructor:
				case ts.SyntaxKind.MethodDeclaration:
				case ts.SyntaxKind.MethodSignature:
					this.parseFunction(child);
					break;
				case ts.SyntaxKind.Decorator:
					this.mCurrentClass.decorators.push(child.getText());
					break;

				}
		}
	}

	private parseInterface(node: ts.Node){
		this.mCurrentClass = new T2CClass();
		for ( let i = 0 ; i < node.getChildren().length ; i++ )
		{
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.Identifier:
					this.mCurrentClass.name = child.getText();
					break;
				case ts.SyntaxKind.SyntaxList : 
					this.parseClassSyntaxList(child);
					break;
			}
		}
		this.pushInterface(this.mCurrentClass);
	}


	private parseClass(node: ts.Node){
		this.mCurrentClass = new T2CClass();
		for ( let i = 0 ; i < node.getChildren().length ; i++ )
		{
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.Identifier:
					this.mCurrentClass.name = child.getText();
					break;
				case ts.SyntaxKind.SyntaxList : 
					this.parseClassSyntaxList(child);
					break;
			}
		}
		this.pushClass(this.mCurrentClass);
	}


	private pushInterface(cls : T2CClass){
		this.mCurrentNamespace.interfaces.push(this.mCurrentClass);
		this.mCurrentClass = null;
	}


	private pushClass(cls : T2CClass){
		this.mCurrentNamespace.classes.push(this.mCurrentClass);
		this.mCurrentClass = null;
	}

	private pushFunction(func : T2CFunction){
		if ( this.mCurrentClass != null )
			this.mCurrentClass.functions.push(this.mCurrentFunction);
		else 
			this.mCurrentNamespace.functions.push(this.mCurrentFunction);
	}

	
	private parseFunctionBody(node: ts.Node){
		this.mCurrentFunction.body = node; // conversion will happen when creating the c++ files
		this.mCurrentFunction.detectReturnTypeIfNeeded();
	}

	static parseArrayType(node: ts.Node,v : T2CVariable){
		v.size++;
		for ( let i = 0 ; i < node.getChildren().length ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.TypeReference:
				case ts.SyntaxKind.StringKeyword:
				case ts.SyntaxKind.NumberKeyword:
				case ts.SyntaxKind.BooleanKeyword:
				case ts.SyntaxKind.ObjectKeyword:
				case ts.SyntaxKind.AnyKeyword:
					v.type = child.getText();
					break;
				case ts.SyntaxKind.ArrayType:
					T2CParser.parseArrayType(child,v);
					break;
			}
		}
	}

	private parseProperty(node: ts.Node) : T2CVariable{
		let ret = new T2CVariable();
		ret.access = "public";
		for ( let i = 0 ; i < node.getChildren().length ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.SyntaxList:
					ret.access = child.getText();
					break;
				case ts.SyntaxKind.Identifier:
					ret.name = child.getText();
					break;
				case ts.SyntaxKind.ArrayType:
					T2CParser.parseArrayType(child,ret);
					break;
				case ts.SyntaxKind.TypeReference:
				case ts.SyntaxKind.StringKeyword:
				case ts.SyntaxKind.NumberKeyword:
				case ts.SyntaxKind.BooleanKeyword:
				case ts.SyntaxKind.ObjectKeyword:
				case ts.SyntaxKind.AnyKeyword:
					ret.type = child.getText();
					break;					
				case ts.SyntaxKind.NumericLiteral:
				case ts.SyntaxKind.StringLiteral:
				case ts.SyntaxKind.TrueKeyword:
				case ts.SyntaxKind.FalseKeyword:
					ret.value = child.getText();
					break;					
			}
		}	
		return ret;
	}
	

	static parseParameter(node: ts.Node) : T2CVariable{
		let ret = new T2CVariable();
		ret.node = node;
		for ( let i = 0 ; i < node.getChildren().length ; i++ ){
			let child = node.getChildAt(i);
			let tt = child.getText();
			switch (child.kind) {
				case ts.SyntaxKind.SyntaxList:
					ret.access = child.getText();
					break;
				case ts.SyntaxKind.Identifier:
					ret.name = child.getText();
					break;
				case ts.SyntaxKind.TypeReference:
				case ts.SyntaxKind.StringKeyword:
				case ts.SyntaxKind.NumberKeyword:
				case ts.SyntaxKind.BooleanKeyword:
				case ts.SyntaxKind.ObjectKeyword:
				case ts.SyntaxKind.AnyKeyword:
					ret.type = child.getText();
					break;					
				case ts.SyntaxKind.NumericLiteral:
				case ts.SyntaxKind.StringLiteral:
				case ts.SyntaxKind.TrueKeyword:
				case ts.SyntaxKind.FalseKeyword:
				case ts.SyntaxKind.NullKeyword:
				case ts.SyntaxKind.NewExpression:
					ret.valueNode = child;
					ret.value = child.getText();
					ret.valueKind = child.kind;
					break;	
				case ts.SyntaxKind.ArrayType:
					T2CParser.parseArrayType(child,ret);
					break;
			}
		}	
		return ret;
	}


	private parseFunctionParameters(node: ts.Node){
		for ( let i = 0 ; i < node.getChildren().length ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.Parameter:
					let v = T2CParser.parseParameter(child);
					v.detectTypeIfNeeded();
					this.mCurrentFunction.parameters.push(v);
					break;
			}
		}
	}

	private parseReturns(node : ts.Node,ret : T2CVariable){
		switch (node.kind) {
			case ts.SyntaxKind.Identifier:
				ret.name = node.getText();
				break;
			case ts.SyntaxKind.ArrayType:
				T2CParser.parseArrayType(node,ret);
				break;
			default:
				ret.type = node.getText();
				break;
		}
	}


	
	private parseFunctionSyntaxList(node: ts.Node){
		for ( let i = 0 ; i < node.getChildren().length ; i++ ){
			let child = node.getChildAt(i);
			if (child.kind == ts.SyntaxKind.Decorator) {
				this.mCurrentFunction.decorators.push(child.getText());
			}
			else{
				this.mCurrentFunction.access = child.getText(); // TODO :: check if always true??
			}
		}
	}

	private parseFunction(node: ts.Node){
		this.mCurrentFunction = new T2CFunction();
		let inSignatureParams = false;
		for ( let i = 0 ; i < node.getChildren().length ; i++ ){
			let child = node.getChildAt(i);
			switch (child.kind) {
				case ts.SyntaxKind.ConstructorKeyword:
					this.mCurrentFunction.name = this.mCurrentClass.name;
					this.mCurrentFunction.returns.type = "!~"; // TODO :: do something about it
					break;
				case ts.SyntaxKind.Identifier:
					this.mCurrentFunction.name = child.getText();
					break;
				case ts.SyntaxKind.OpenParenToken:
					inSignatureParams = true;
					break;
				case ts.SyntaxKind.CloseParenToken:
					inSignatureParams = false;
					break;
				case ts.SyntaxKind.SyntaxList:
					if ( inSignatureParams ){
						this.parseFunctionParameters(child);
					}
					else {
						this.parseFunctionSyntaxList(child);
					}
					break;
				case ts.SyntaxKind.Block:
					this.parseFunctionBody(child);
					break;
				case ts.SyntaxKind.ColonToken:
					i++;
					child = node.getChildAt(i);
					this.parseReturns(child,this.mCurrentFunction.returns);
					//this.mCurrentFunction.returns.type = child.getText();
					break;
			}			
		}
		this.pushFunction(this.mCurrentFunction);
	}
}
