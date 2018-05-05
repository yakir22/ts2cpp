import { ECHILD } from "constants";
import * as child from "child_process";
import * as ts from "typescript";
import * as shell from "shelljs";
import * as fs from "fs"
import * as path from "path"

import {T2CUtils} from "./T2CUtils"
import {T2CClass} from "./T2CClass"
import {T2CNamespace} from "./T2CNamespace"
import {T2CFile} from "./T2CFile"
import {T2CFunction} from "./T2CFunction"
import {T2CVariable} from "./T2CVariable"
import {T2CParser} from "./T2CParser"
import {T2CRoot} from "./T2CRoot"
import {T2CKindHelper} from "./T2CKindHelper"

export class T2CCodeBuilder{
	protected mRoot 			: T2CRoot;
	private mCodeBufferArray 	: string[] = [];
	private mOutDir 			: string;
	
	protected appendCustomCodeH(cls : T2CClass){}

	protected appendCustomCodeStartFunctionCpp(func : T2CFunction, cls : T2CClass){}
	protected appendCustomCodeEndFunctionCpp(func : T2CFunction,cls : T2CClass){}
	protected appendCustumCodeAfterFunctionCpp(func : T2CFunction,cls : T2CClass){}
	protected appendCustumCodeAfterFunctionH(func : T2CFunction,cls : T2CClass){}
	protected appendCustomCodeStartClassCpp(cls : T2CClass){}
	protected appendCustomCodeStartClassH(cls : T2CClass){}
	protected appendCustomCodeAfterClassH(cls : T2CClass){}
	protected appendCustomCodeEndClassCpp(cls : T2CClass){}
	protected appendCustomCodeBeforeInterface(cls : T2CClass){}
	protected appendCustomCodeStartOfFileH(file: T2CFile){}
	protected appendCustomCodeEndOfFileH(file: T2CFile){}
	protected appendCustomCodeStartOfFileCpp(file: T2CFile){}
	protected appendCustomCodeEndOfFileCpp(file: T2CFile){}
	protected appendCustomIncludesH(file: T2CFile,first : boolean){}


	static createCode(root : T2CRoot,outDir : string = "./",customBuilder : T2CCodeBuilder = null){
		let builder = customBuilder;
		if ( builder == null )
			builder = new T2CCodeBuilder();
		builder.mOutDir = outDir;
		builder.mRoot = root;
		builder.mRoot.getFiles().forEach(file => {
			try{
				fs.unlinkSync(file.cppName);
				fs.unlinkSync(file.hName);
			}catch(e){}

			builder.createHeaderFile(file);
			builder.createCppFile(file);
        });
        
        builder.craeteForwardDeclarationFile();

    }
    
    protected craeteForwardDeclarationFile(){
        this.clearCodeBuffer();
        this.append("#pragma once");
        this.newLine();
        this.mRoot.forwardDeclarations.forEach(fd => {
            this.append("typedef std::shared_ptr<class " + fd + "> " + fd + "Ref;");                
            this.newLine();
        });
        this.flushCodeBuffer(this.mRoot.rootDirectory + "forwardDeclarations.h");
    }


	private createHeaderFile(file : T2CFile){
		this.clearCodeBuffer();
        this.appendIncludesH(file);
        file.namespaces.forEach(ns => {
			this.appendCustomCodeStartOfFileH(file);
            this.append(ns.startString(file));
            this.newLine();
            ns.interfaces.forEach(cls => {
				this.appendCustomCodeBeforeInterface(cls);
                this.appendClassH(cls,true);
            });
			ns.classes.forEach(cls => {
                this.appendClassH(cls,false);
            });
            ns.functions.forEach(func => {
                this.appendGlobalFunctionCppH(func);
            });
            this.append(ns.endString(file));
			this.newLine();
			this.appendCustomCodeEndOfFileH(file);
        });
		this.flushCodeBuffer(file.hName);
	}
	protected clearCodeBuffer(){
		this.mCodeBufferArray = [];
	}
	private appendIncludesH(file : T2CFile ){
		this.appendX("#pragma once");
		this.appendCustomIncludesH(file,true);
		this.appendX("#include \"ts2cpp_envelope.h\"");
		this.appendX("#include \"forwardDeclarations.h\"");
		this.appendCustomIncludesH(file,false);
		// TODO :: 
		/*for (auto dep : file->dependencies)
		{
			auto hFile = Framework.PathUtils.ReplaceExtension(dep->filename, ".h");
			Append("#include \"" + hFile + "\"\n");
		}*/
	}
    
    protected append(s : string){
		if ( this.mIgnoreNext ){
			this.mIgnoreNext = false;
			return;
		}
		this.mCodeBufferArray.push(s);
    }
    
    protected popLast() : string{
        return this.mCodeBufferArray.pop();
    }

    protected pickLast() : string{
        if ( this.mCodeBufferArray.length == 0 ) 
            return "";
        let ret = this.mCodeBufferArray[this.mCodeBufferArray.length -1]; 
        return ret;
    }

	private appendClassH(cls : T2CClass,isInterface : boolean){
        this.mRoot.forwardDeclarations.push(cls.name);
        this.newLine();
		this.append("class " + cls.name);
		let first = true;

		if ( cls.extends.length > 0 || cls.implements.length > 0 ) {
			let first = true;
			T2CUtils.assert(cls.extends.length <= 1);
			cls.extends.forEach(base => {
				this.append(first ? ":" : ",");
				this.append("public " + base);
			});

			cls.implements.forEach(base => {
				this.append(first ? ":" : ",");
				this.append("public " + base);
			});
		} 

        this.newLine();
		this.append("{");
        this.newLine();

		if ( cls.extends.length > 0 )
		{
			this.appendX("private: typedef " + cls.extends[0] + " super;");
		}

		this.appendCustomCodeStartClassH(cls);
		this.markInterfaceVariables(cls);
		
		// TODO :: sort by modifier
		cls.variables.forEach(v => {
			if ( ! v.interfaceVar)
				this.appendClassVariable(v);
		});

		cls.functions.forEach(func => {
			this.appendClassFunctionH(func,isInterface);
			this.appendCustumCodeAfterFunctionH(func,cls);
        });
		

		

        this.appendCustomCodeH(cls);

		this.append("};");
        this.newLine();
		this.appendCustomCodeAfterClassH(cls);
        this.newLine();
	}

	protected markInterfaceVariables(cls : T2CClass)
	{
		cls.implements.forEach(clsIface =>{
			this.mRoot.getFiles().forEach(file => {
				file.namespaces.forEach(nspace => {
					nspace.interfaces.forEach(iface =>{
						if ( clsIface == iface.name )
						{
							iface.variables.forEach(ifaceVar =>{
								cls.variables.forEach(clsVar =>{
									if ( clsVar.name == ifaceVar.name )
									{
										T2CUtils.assert(clsVar.type == ifaceVar.type);
										T2CUtils.assert(clsVar.access == "public");
										clsVar.interfaceVar = true;
									}
								})
							});	
						}
					});	
				});
			});
		});
	}
    protected  appendX(...strings: string[]) {
        for (var i = 0; i <  strings.length; i++) {
          this.append(strings[i]);
          this.newLine();
        }
    };


	private appendClassFunctionH(func : T2CFunction,isInterface : boolean){
		// TODO :: maybe inline some short functions

		if ( func.getCppAccess() == "static")
		{
			this.append("static ");
			this.appendFunctionSignature(func,false);
			this.appendX(";");
		}
		else
		{
			this.append(func.getCppAccess() + ": ");
			if (func.returns.type != "!~")
				this.append("virtual ");
			this.appendFunctionSignature(func,false);
			if ( isInterface )
				this.append(" = 0");
			this.appendX(";");
		}
	}

	private appendFunctionSignature(func : T2CFunction,inImplementation : boolean,memberOfClass : string = ""){
		this.append(func.returns.toCppType() + " " + (memberOfClass.length == 0?"":(memberOfClass +"::" ))+ func.name + "(");
		let count = 0;
		func.parameters.forEach(param => {
			this.append(param.toCppType() + " " + param.name);
			if ( param.hasValue() && !inImplementation)
				this.append(" = " + param.value);
			if (count++ < func.parameters.length - 1)
				this.append(",");
		});
		this.append(")");
	}

	private appendClassVariable( v : T2CVariable){
		//auto type = ToCppType(var,false);
		this.append(v.access + ": ");
		this.append(v.toCppType() + " ");
		this.append(v.name);
		if (v.size > 0 )
		{
			//Append("= new " + type.substr(0, type.size() - 1) + "()");
		}
		else if (v.value.length > 0)
		{
			this.append("=" + v.value);
		}
		this.append(";\n");
	}
	private appendGlobalFunctionCppH(func : T2CFunction){

    }
    
    private NS(tok: string,next : string,p : string){
        return tok == p || next == p;
    }
    private IN(tok: string,next : string,p : string) {
        if ( tok.length == 1 && p.indexOf(tok) != -1 )
            return true;
        if ( next.length == 1 && p.indexOf(next) != -1 )
            return true;
        return false;
    }
	protected flushCodeBuffer(filename : string ){
        let buf = "";
        for ( let i = 0; i < this.mCodeBufferArray.length - 1 ; i++)
        {
            let token = this.mCodeBufferArray[i];
			let next = this.mCodeBufferArray[i + 1];
			try {
				if ( token == "super" && next == "->" ){
					buf+="super::";
					i++;
				}
				else if ( next.indexOf(".clear") == 0 || this.NS(token,next,"->") ||
                //this.NS(token,next,"this") ||
                	this.IN(token,next,".(){}[]=<>;")) {
                    	buf += token;
            	}
 	            else {
    	            buf += token + " ";
        	    }
			} catch (error) {
				console.log(error);				
			}
        }
		buf += this.mCodeBufferArray[this.mCodeBufferArray.length -1];
		
		let dest = this.mOutDir + filename;
		let destDir = dest.substring(0,dest.lastIndexOf("/"));

		try {shell.mkdir("-p",destDir);} catch (error) {}
		
		fs.writeFileSync(dest,buf); // don't try catch it. want it to fail on error for now

		try {
			let exe = "AStyle" + (T2CUtils.isWindows()?".exe":"");
			// TODO :: better path for AStyle binary
			let astylePath = __dirname + "/../externals/" + exe; 
			astylePath = path.normalize(astylePath).replace("\\out","").replace("/out","");
			// need to call twice for better results ( there should be a way to do it in one command but didn't want to spend too much time on it)
			child.execSync(astylePath + " " + dest);
			child.execSync(astylePath + " " + "--style=allman --indent=tab --attach-namespaces --attach-classes --attach-inlines --attach-extern-c --indent-modifiers --indent-switches --indent-cases --indent-namespaces --indent-preproc-block --indent-preproc-define --indent-preproc-cond --indent-col1-comments --max-instatement-indent=100 --break-blocks=all --pad-oper --pad-header --fill-empty-lines --align-pointer=name --align-reference=name --break-closing-brackets --add-brackets --add-one-line-brackets --add-braces --mode=c  "+ dest);
		} catch (error) {}
		
	}

	private createCppFile(file : T2CFile ){

		this.clearCodeBuffer();
		this.appendCustomCodeStartOfFileCpp(file);
		this.appendIncludesCpp(file);
        file.namespaces.forEach(ns => {
            this.append(ns.startString(file));
            this.newLine();

            ns.interfaces.forEach(cls => {
                this.appendClassCpp(cls);
            });

			ns.classes.forEach(cls => {
                this.appendClassCpp(cls);
            });
            ns.functions.forEach(func => {
                this.appendGlobalFunctionCpp(func);
            })
            this.append(ns.endString(file));
            this.newLine();
        });
		this.appendCustomCodeEndOfFileCpp(file);
		this.flushCodeBuffer(file.cppName);
	}

	private appendIncludesCpp(file : T2CFile){
        this.append("#include \"" + file.hName.substr(file.name.lastIndexOf("/") + 1) + "\"");
        this.newLine();

        file.imports.forEach(impt => {
			if ( impt.indexOf("BindingDecorators") >= 0 )
				return;
            this.append("#include \"" + impt + ".h\"");
            this.newLine();
        });

        this.newLine();
	}

	private appendClassCpp(cls : T2CClass){
        this.appendCustomCodeStartClassCpp(cls);
		cls.functions.forEach(func => {
			if ( func.hasBody() )
			{
				this.appendFunctionSignature(func,true, cls.name);
				this.newLine();
				this.appendFunctionBody(func,cls);
				this.appendCustumCodeAfterFunctionCpp(func,cls);
			}
		});
        this.newLine();
        
        this.appendCustomCodeEndClassCpp(cls);
	}

	protected newLine(count = 1){
		while ( count-- > 0 )
        	this.append("\n"); // TODO :: handle tabbing?? or use some 2rd party code prettyfier
	}

	private appendGlobalFunctionCpp(func){
        this.appendFunctionSignature(func,true);
        this.newLine();
        this.appendFunctionBody(func,null);
	}
	private mIgnoreNext : boolean = false;
	private ignoreNext(){
		this.mIgnoreNext = true;
	}

	





	protected appendNewStatement(tokens : ts.Node[]) {
		this.append("");
		let token = T2CUtils.getNextToken(tokens,ts.SyntaxKind.Identifier);
		T2CUtils.assert ( token != null );
		if ( token.getText() == "Array" )
		{
			this.popLast();
			this.append("JSArray");
		}
		else
		{
			this.append(token.getText() + "Ref( new " + token.getText());
		}

		token = T2CUtils.getNextToken(tokens,ts.SyntaxKind.OpenParenToken);
		let prevToken = token;
		let nextToken = T2CUtils.peekNextToken(tokens);
		let count = 1;
		while ( token != null && count > 0)
		{
			if ( token.kind == ts.SyntaxKind.NewKeyword )
			{
				this.appendNewStatement(tokens);
			}
			else if ( token.kind == ts.SyntaxKind.DotToken )
			{
				T2CUtils.assert(prevToken != null && nextToken != null);
				let cls = this.mRoot.getClassByName(prevToken.getText());
				if ( cls != null && cls.isStaticFunction(nextToken.getText()))
				{
					this.append("::");
				}
				else
				{
					this.append("->");
				}
			}
			else 
			{
				this.append(token.getText());
			}
			prevToken = token
			token = T2CUtils.getNextToken(tokens);
			nextToken = T2CUtils.peekNextToken(tokens);
			if ( token.kind == ts.SyntaxKind.OpenParenToken )
				count++;
			else if ( token.kind == ts.SyntaxKind.CloseParenToken )
				count--
		}
		T2CUtils.assert ( token != null );
		this.append(token.getText());
		this.append(")");
		
	}


	private appendFunctionBody(func : T2CFunction,cls : T2CClass){
		let tokens = T2CUtils.buildTokenList(func.body);
		let token = T2CUtils.getNextToken(tokens);
		let nextToken = T2CUtils.peekNextToken(tokens);
		let prevToken = token;
		let bracesCount = -1;
		//let inNewStatement = false;
		let inInitialisationList = 0;
		if ( cls != null )
		{
			// handle calling constructor super before body function
			let maybeSuper = T2CUtils.getNextToken(tokens,ts.SyntaxKind.SuperKeyword);
			if (maybeSuper != null && func.name == cls.name)
			{
				this.append(": ");
				this.append(cls.extends[0]);
				while ( true )
				{
					token = T2CUtils.getNextToken(tokens);
					if (token.kind == ts.SyntaxKind.SemicolonToken)
						break;
					this.append(token.getText());
				}
				this.append("{");
				this.appendCustomCodeStartFunctionCpp(func,cls);
			}
		}

		while ( token != null )
		{
			switch(token.kind)
			{
				case ts.SyntaxKind.NewKeyword:
					this.appendNewStatement(tokens);
					//this.append("std::make_shared<");
//					inNewStatement = true;
					break;
				case ts.SyntaxKind.Identifier:
/*					if ( inNewStatement )
					{
						if ( token.getText() == "Array"){
							// TODO :: 
							throw "not implemented!";
							//this.popLast();
							//this.append("JSArray");
							//inNewStatement = false;
						}
						else 
						{
							this.append(token.getText() + "Ref( new " + token.getText());
						}
					}
					else */
					{
						let id = token.getText();
						this.append(token.getText());
					}
					break;		
				case ts.SyntaxKind.StringLiteral:
					this.append("JSString(" + token.getText() + ")");
					break;
				case ts.SyntaxKind.VarKeyword:
				case ts.SyntaxKind.LetKeyword:
				{
					let v = new T2CVariable();
					//let token = this.getNextToken(tokens,ts.SyntaxKind.LetKeyword , ts.SyntaxKind.VarKeyword);
					//this.assert(token!=null);
					
					token = T2CUtils.getNextToken(tokens,ts.SyntaxKind.Identifier);
					T2CUtils.assert(token!=null);
					v.name = token.getText();
			
					token = T2CUtils.getNextToken(tokens,ts.SyntaxKind.ColonToken);
					if ( token == null )
					{
						v.type = "auto";
					}
					else 
					{
						token = T2CUtils.getNextToken(tokens,ts.SyntaxKind.TypeReference,ts.SyntaxKind.StringKeyword,
							ts.SyntaxKind.NumberKeyword,ts.SyntaxKind.BooleanKeyword,ts.SyntaxKind.ObjectKeyword,
							ts.SyntaxKind.AnyKeyword,ts.SyntaxKind.Identifier);
						T2CUtils.assert(token!=null);
						v.type = token.getText();
						token = T2CUtils.getNextToken(tokens,ts.SyntaxKind.OpenBracketToken);
						while ( token != null )
						{
							token = T2CUtils.getNextToken(tokens,ts.SyntaxKind.CloseBracketToken);
							T2CUtils.assert(token!=null);
							v.size++;		
							token = T2CUtils.getNextToken(tokens,ts.SyntaxKind.OpenBracketToken);
						}
					}
					this.append(v.toCppType());
					this.append(v.name);					
					break;
				}
				case ts.SyntaxKind.DotToken:
				{
					T2CUtils.assert(prevToken != null && nextToken != null);
					let cls = this.mRoot.getClassByName(prevToken.getText());
					if ( cls != null && cls.isStaticFunction(nextToken.getText()))
					{
						this.append("::");
					}
					else
					{
						this.append("->");
					}
					break;
				}
				case ts.SyntaxKind.EqualsToken:
				{
					let token2 = T2CUtils.getNextToken(tokens,ts.SyntaxKind.NewKeyword);
					if ( token2 != null )
					{
						let token3 = T2CUtils.getNextToken(tokens,T2CUtils.ArrayIdentifier);
						if ( token3 == null )
						{
							tokens.unshift(token2);		
						}
						else
						{
							tokens.unshift(token3);
							this.append(token.getText());
							break;
						}
					}
					token2 = T2CUtils.getNextToken(tokens, T2CUtils.ArrayIdentifier,
						ts.SyntaxKind.OpenBracketToken);
					if (token2 != null)
					{
						if ( token2.kind == ts.SyntaxKind.OpenBracketToken )
						{						
							let token3  = T2CUtils.getNextToken(tokens,ts.SyntaxKind.CloseBracketToken);;
							if ( token3 != null )
							{
								this.append(".clear()");
								break;
							}
							else
							{
								tokens.unshift(token2);
								this.append(token.getText());
								break;
							}
						}
						this.append(".clear");
					}
					else 
					{
						this.append(token.getText());
					}
					break;
				}
				case T2CUtils.ArrayIdentifier:
				{
					let token2 = T2CUtils.getNextToken(tokens, ts.SyntaxKind.LessThanToken);
					if (token2 != null)
					{
						let v = new T2CVariable();
						token2 = T2CUtils.getNextToken(tokens);
						v.type  = token2.getText();
						v.size = 1;// TODO :: handle 2 dimmensions array
						this.append(v.toCppType()); 
						token2 = T2CUtils.getNextToken(tokens, ts.SyntaxKind.GreaterThanToken);
					}
					break;
				}
				case T2CUtils.LengthIdentifier:
				{
					if ( prevToken.kind == ts.SyntaxKind.DotToken )
					{
						this.append("length()");
					}
					break;
				}

				case ts.SyntaxKind.OpenBraceToken:
				{
					this.append(token.getText());
					bracesCount++;
					if ( bracesCount == 0 )
					{
						this.appendCustomCodeStartFunctionCpp(func,cls);
					}
					break;
				}
				case ts.SyntaxKind.CloseBraceToken:
				{
					bracesCount--;
					if ( bracesCount == -1 )
					{
						this.appendCustomCodeEndFunctionCpp(func,cls);
					}
					this.append(token.getText());
					break;
				}

				case ts.SyntaxKind.OpenBracketToken:
					if (inInitialisationList > 0 || prevToken.kind == ts.SyntaxKind.EqualsToken ||
						prevToken.kind == ts.SyntaxKind.OpenParenToken || prevToken.kind == ts.SyntaxKind.CommaToken )
					{
						inInitialisationList++;
						this.append("{");
					}
					else
					{
						this.append(token.getText());
					}
					break;
				case ts.SyntaxKind.CloseBracketToken:
					if (inInitialisationList > 0 )
					{
						inInitialisationList--;
						this.append("}");
					}
					else
					{
						this.append(token.getText());
					}
					break;
				default:
				{
					this.append(token.getText());
				}
			}
			prevToken = token;
			token = T2CUtils.getNextToken(tokens);
			nextToken = T2CUtils.peekNextToken(tokens);
		}
		this.newLine(2);
	}



/*

	private handleVariableDeclarationList(node : ts.Node,builder : J2CCodeBuilder) : boolean {
		let v = new J2CVariable();
		let tokens = this.buildTokenList(node);
		
		let token = this.getNextToken(tokens,ts.SyntaxKind.LetKeyword , ts.SyntaxKind.VarKeyword);
		this.assert(token!=null);
		
		token = this.getNextToken(tokens,ts.SyntaxKind.Identifier);
		this.assert(token!=null);
		v.name = token.getText();

		token = this.getNextToken(tokens,ts.SyntaxKind.ColonToken);
		if ( token == null )
		{
			v.type = "auto";
		}
		else 
		{
			token = this.getNextToken(tokens,ts.SyntaxKind.TypeReference,ts.SyntaxKind.StringKeyword,
				ts.SyntaxKind.NumberKeyword,ts.SyntaxKind.BooleanKeyword,ts.SyntaxKind.ObjectKeyword,
				ts.SyntaxKind.AnyKeyword,ts.SyntaxKind.Identifier);
			this.assert(token!=null);
			v.type = token.getText();
			token = this.getNextToken(tokens,ts.SyntaxKind.OpenBracketToken);
			while ( token != null )
			{
				token = this.getNextToken(tokens,ts.SyntaxKind.CloseBracketToken);
				this.assert(token!=null);
				v.size++;		
				token = this.getNextToken(tokens,ts.SyntaxKind.OpenBracketToken);
			}
		}
		builder.append(v.toCppType());
		builder.append(v.name);

		token = this.getNextToken(tokens,ts.SyntaxKind.EqualsToken);
		if ( token != null )
		{
			builder.handleOneToken(token,builder);
			this.getNextToken(tokens,ts.SyntaxKind.EqualsToken)			
		}


		token = this.getNextToken(tokens);
		while ( token != null )
		{
			builder.handleOneToken(token,builder);
			token = this.getNextToken(tokens);
		}
		return true;
	}




	private appendFunctionBody(func : J2CFunction,cls : J2CClass){
        let builder = this;
		this.inNewStatement = false;
		function handleFunctionBodyTokens(node : ts.Node ){
			builder.handled = false;
			builder.handleOneToken(node,builder);
            if ( !builder.handled ){
                for ( let i = 0 ; i < node.getChildCount() ; i++ )
                {
                    let child = node.getChildAt(i);
                    handleFunctionBodyTokens(child);
                }
            }
		}
		handleFunctionBodyTokens(func.body)
	}

	private handled = false;
	private inNewStatement = false;
	private handleOneToken(node : ts.Node,builder : J2CCodeBuilder) {
		switch ( node.kind ){
			case ts.SyntaxKind.NewKeyword:
				builder.append("std::make_shared<");
				this.inNewStatement = true;
				break;
			case ts.SyntaxKind.Identifier:
				if ( this.inNewStatement ){
					if ( node.getText() == "Array"){
						builder.popLast();
						builder.append("JSArray");
						this.inNewStatement = false;
						for ( let k = 0 ; k < node.parent.getChildCount() ; k++){
							let child2 = node.parent.getChildAt(k);
						}		
					}
					else {
						builder.append(node.getText() + ">");
						this.inNewStatement = false;
					}
				}
				else {
					let id = node.getText();
					builder.append(node.getText());
					if( id == "length") // TODO :: this is a patch for now while using stl as vector container. later need to create own vector class with length property
						builder.append("()");
				}
				break;
				case ts.SyntaxKind.StringLiteral:
				builder.append("JSString(" + node.getText() + ")");
				break;
			case ts.SyntaxKind.DotToken:
				builder.append("->");
				break;
			case ts.SyntaxKind.VariableDeclarationList:
				this.handled = builder.handleVariableDeclarationList(node,builder);
				break;
			case ts.SyntaxKind.NewExpression:
				if (  builder.pickLast() == "=" && node.getText() == "new Array()"  ){
					this.handled = true;
					builder.popLast();
					builder.append(".");
					builder.append("clear()");
				}
				break;
			case ts.SyntaxKind.ArrayLiteralExpression:
				if ( builder.pickLast() == "=" ){
					this.handled = true;
					builder.popLast();
					builder.append(".");
					builder.append("clear()");
				}
				break;
			case ts.SyntaxKind.CallExpression:
				if ( builder.pickLast() == "=" && node.getText() == "Array()"){
					this.handled = true;
					builder.popLast();
					builder.append(".");
					builder.append("clear()");
				}
				break;
			case ts.SyntaxKind.SemicolonToken:
			case ts.SyntaxKind.CloseBraceToken:
			case ts.SyntaxKind.OpenBraceToken:
				builder.append(node.getText());
				builder.newLine();
				break;
			case ts.SyntaxKind.NullKeyword:
				builder.append("NULL");
				break;
			
			// tokens
			case ts.SyntaxKind.ColonToken:
			case ts.SyntaxKind.PlusToken:
			case ts.SyntaxKind.EqualsToken:
			case ts.SyntaxKind.LessThanEqualsToken:
			case ts.SyntaxKind.LessThanToken:
			case ts.SyntaxKind.GreaterThanToken:
			case ts.SyntaxKind.GreaterThanEqualsToken:
			case ts.SyntaxKind.OpenParenToken:
			case ts.SyntaxKind.CloseParenToken:
			case ts.SyntaxKind.OpenBracketToken:
			case ts.SyntaxKind.CloseBracketToken:
			case ts.SyntaxKind.CommaToken:
			case ts.SyntaxKind.QuestionToken:
			case ts.SyntaxKind.PlusEqualsToken:
			case ts.SyntaxKind.ExclamationToken:
			case ts.SyntaxKind.ExclamationEqualsToken:
			case ts.SyntaxKind.MinusMinusToken:
			case ts.SyntaxKind.PlusPlusToken:
			case ts.SyntaxKind.AmpersandAmpersandToken:
			case ts.SyntaxKind.AmpersandToken:
			case ts.SyntaxKind.EqualsEqualsToken:
			case ts.SyntaxKind.BarBarToken:
			case ts.SyntaxKind.BarToken:
			case ts.SyntaxKind.AsteriskToken:
			case ts.SyntaxKind.MinusToken:
			// Literals
			case ts.SyntaxKind.NumericLiteral:
			// keywords
			case ts.SyntaxKind.ReturnKeyword:
			case ts.SyntaxKind.ForKeyword:
			case ts.SyntaxKind.ThisKeyword:
			case ts.SyntaxKind.TrueKeyword:
			case ts.SyntaxKind.FalseKeyword:
			case ts.SyntaxKind.IfKeyword:
			case ts.SyntaxKind.ElseKeyword:
			case ts.SyntaxKind.WhileKeyword:
			case ts.SyntaxKind.BreakKeyword:
			case ts.SyntaxKind.ContinueKeyword:
			case ts.SyntaxKind.CaseKeyword:
				builder.append(node.getText()) ;
				break;
		}
	}

*/

}
