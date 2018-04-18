import { ECHILD } from "constants";
import * as child from "child_process";
import * as ts from "typescript";
import * as shell from "shelljs";
import * as fs from "fs"
import * as path from "path"

import {T2CClass} from "./T2CClass"
import {T2CNamespace} from "./T2CNamespace"
import {T2CFile} from "./T2CFile"
import {T2CFunction} from "./T2CFunction"
import {T2CVariable} from "./T2CVariable"
import {T2CParser} from "./T2CParser"
import {T2CRoot} from "./T2CRoot"
import {T2CKindHelper} from "./T2CKindHelper"

export class T2CCodeBuilder{
	private mRoot 				: T2CRoot;
	private mCodeBufferArray 	: string[] = [];
	private mOutDir 			: string;
	
	protected appendCustomCodeH(cls : T2CClass){
	}

	protected appendCustomCodeCpp(cls : T2CClass){
	}

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
    
    private craeteForwardDeclarationFile(){
        this.clearCodeBuffer();
        this.append("#pragma once");
        this.newLine();
        this.mRoot.forwardDeclarations.forEach(fd => {
            this.append("typedef std::shared_ptr<class " + fd + "> " + fd + "Ref;");                
            this.newLine();
        });
        this.flushCodeBuffer("forwardDeclarations.h");
    }


	private createHeaderFile(file : T2CFile){
		this.clearCodeBuffer();
        this.appendIncludesH(file);
        file.namespaces.forEach(ns => {
            this.append(ns.startString(file));
            this.newLine();
            ns.classes.forEach(cls => {
                this.appendClassCppH(cls);
            });
            ns.functions.forEach(func => {
                this.appendGlobalFunctionCppH(func);
            });
            this.append(ns.endString(file));
            this.newLine();
        });
		this.flushCodeBuffer(file.hName);
	}
	protected clearCodeBuffer(){
		this.mCodeBufferArray = [];
	}
	private appendIncludesH(file : T2CFile ){
		this.append("#pragma once\n");
		this.append("#include \"js2cpp_engine.h\"\n");
		this.append("#include \"forwardDeclarations.h\"\n");
	
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

	private appendClassCppH(cls : T2CClass){
        this.mRoot.forwardDeclarations.push(cls.name);
        this.newLine();
		this.append("class " + cls.name);
		let first = true;

		if ( cls.extends.length > 0 || cls.implements.length > 0 ) {
			let first = true;
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

		// TODO :: sort by modifier
		cls.variables.forEach(v => {
			this.appendClassVariable(v);
		});

		cls.functions.forEach(func => {
			this.appendClassFunctionH(func);
        });
        
        this.appendCustomCodeH(cls);

        this.append("};");
        this.newLine();
        this.newLine();
	}




    protected  appendX(...strings: string[]) {
        for (var i = 0; i <  strings.length; i++) {
          this.append(strings[i]);
          this.newLine();
        }
    };


	private appendClassFunctionH(func : T2CFunction){
		// TODO :: maybe inline some short functions
		this.append(func.getCppAccess() + ": ");
		if (func.returns.type != "!~")
			this.append("virtual ");
		this.appendFunctionSignature(func);
		this.append(";\n");
	}

	private appendFunctionSignature(func : T2CFunction,memberOfClass : string = ""){
		this.append(func.returns.toCppType() + " " + (memberOfClass.length == 0?"":(memberOfClass +"::" ))+ func.name + "(");
		let count = 0;
		func.parameters.forEach(param => {
			this.append(param.toCppType() + " " + param.name);
			if (count++ < func.parameters.length - 1)
				this.append(",");
		});
		this.append(")");
	}

	private appendClassVariable(v : T2CVariable){
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
	private flushCodeBuffer(filename : string ){
        let buf = "";
        for ( let i = 0; i < this.mCodeBufferArray.length - 1 ; i++)
        {
            let token = this.mCodeBufferArray[i];
            let next = this.mCodeBufferArray[i + 1];
            if ( next.indexOf(".clear") == 0 || this.NS(token,next,"->") ||
                //this.NS(token,next,"this") ||
                this.IN(token,next,".(){}[]=<>;")) {
                    buf += token;
            }
            else {
                buf += token + " ";
            }
        }
		buf += this.mCodeBufferArray[this.mCodeBufferArray.length -1];
		
		let dest = this.mOutDir + filename;
		let destDir = dest.substring(0,dest.lastIndexOf("/"));

		try {shell.mkdir("-p",destDir);} catch (error) {}
		
		fs.writeFileSync(dest,buf); // don't try catch it. want it to fail on error for now

		try {
			// TODO :: better path for AStyle binary
			let astylePath = __dirname + "/../externals/AStyle.exe"; 
			astylePath = path.normalize(astylePath).replace("\\out","");
			// need to call twice for better results ( there should be a way to do it in one command but didn't want to spend too much time on it)
			child.execSync(astylePath + " " + dest);
			child.execSync(astylePath + " " + "--style=allman --indent=tab --attach-namespaces --attach-classes --attach-inlines --attach-extern-c --indent-modifiers --indent-switches --indent-cases --indent-namespaces --indent-preproc-block --indent-preproc-define --indent-preproc-cond --indent-col1-comments --max-instatement-indent=100 --break-blocks=all --pad-oper --pad-header --fill-empty-lines --align-pointer=name --align-reference=name --break-closing-brackets --add-brackets --add-one-line-brackets --add-braces --mode=c  "+ dest);
		} catch (error) {}
	}

	private createCppFile(file : T2CFile ){

		this.clearCodeBuffer();
        this.appendIncludesCpp(file);
        file.namespaces.forEach(ns => {
            this.append(ns.startString(file));
            this.newLine();
            ns.classes.forEach(cls => {
                this.appendClassCpp(cls);
            });
            ns.functions.forEach(func => {
                this.appendGlobalFunctionCpp(func);
            })
            this.append(ns.endString(file));
            this.newLine();
        });
		this.flushCodeBuffer(file.cppName);
	}

	private appendIncludesCpp(file : T2CFile){
        this.append("#include \"" + file.hName.substr(file.name.lastIndexOf("/") + 1) + "\"");
        this.newLine();

        file.imports.forEach(impt => {
            this.append("#include \"" + impt + ".h\"");
            this.newLine();
        });

        this.newLine();
	}

	private appendClassCpp(cls : T2CClass){
		cls.functions.forEach(func => {
			this.appendFunctionSignature(func, cls.name);
			this.newLine();
			this.appendFunctionBody(func,cls);
		});
        this.newLine();
        
        this.appendCustomCodeCpp(cls);
	}

	protected newLine(count = 1){
		while ( count-- > 0 )
        	this.append("\n"); // TODO :: handle tabbing?? or use some 2rd party code prettyfier
	}

	private appendGlobalFunctionCpp(func){
        this.appendFunctionSignature(func);
        this.newLine();
        this.appendFunctionBody(func,null);
	}
	private mIgnoreNext : boolean = false;
	private ignoreNext(){
		this.mIgnoreNext = true;
	}

	static ArrayIdentifier = 10000;
	static LengthIdentifier = 10001;

	private buildTokenList(node : ts.Node) : ts.Node[]{
		let ret : ts.Node[] = [];
		function tokenize(node : ts.Node){
			if ( node.kind >= ts.SyntaxKind.OpenBraceToken && node.kind <= ts.SyntaxKind.GlobalKeyword ){
				if ( node.kind == ts.SyntaxKind.Identifier && node.getText() == "Array" )
					node.kind = T2CCodeBuilder.ArrayIdentifier;
				else if ( node.kind == ts.SyntaxKind.Identifier && node.getText() == "length" )
					node.kind = T2CCodeBuilder.LengthIdentifier;
				ret.push(node);
				//console.log(J2CKindHelper.getNodeText(node));
			}
			if ( node.kind == ts.SyntaxKind.NumericLiteral || 
				node.kind == ts.SyntaxKind.StringLiteral )
			{
				ret.push(node);
				//console.log(J2CKindHelper.getNodeText(node));
			}
			for ( let i = 0 ; i < node.getChildCount() ; i++ )
			{
				let child = node.getChildAt(i);
				tokenize(child);
			}
		}
		tokenize(node);
		return ret;
	}


	protected  getNextToken(tokens : ts.Node[], ...valids: ts.SyntaxKind[]) : ts.Node 
	{
		if ( tokens.length == 0 )
			return null;
	
		if ( valids.length == 0 )
		{
			let ret = tokens[0];
			tokens.splice(0,1);
			return ret;
		}
		for (var i = 0; i <  valids.length; i++) 
		{
			if ( tokens[0].kind == valids[i] )
			{
				let ret = tokens[0];
				tokens.splice(0,1);
				return ret;
			}	
		}
	}
	
	private assert(exp : boolean){
		if ( exp == false)
			exp = false;
	}



	private appendFunctionBody(func : T2CFunction,cls : T2CClass){
		let tokens = this.buildTokenList(func.body);
		let token = this.getNextToken(tokens);
		let prevToken = token;
		let inNewStatement = false;
		let inInitialisationList = 0;
		if ( cls != null )
		{
			// handle calling constructor super before body function
			let maybeSuper = this.getNextToken(tokens,ts.SyntaxKind.SuperKeyword);
			if (maybeSuper != null && func.name == cls.name)
			{
				this.append(": ");
				this.append(cls.extends[0]);
				while ( true )
				{
					token = this.getNextToken(tokens);
					if (token.kind == ts.SyntaxKind.SemicolonToken)
						break;
					this.append(token.getText());
				}
				this.append("{");
			}
		}

		while ( token != null )
		{
			switch(token.kind)
			{
				case ts.SyntaxKind.NewKeyword:
					this.append("std::make_shared<");
					inNewStatement = true;
					break;
				case ts.SyntaxKind.Identifier:
					if ( inNewStatement )
					{
						if ( token.getText() == "Array"){
							this.popLast();
							this.append("JSArray");
							inNewStatement = false;
						}
						else 
						{
							this.append(token.getText() + ">");
							inNewStatement = false;
						}
					}
					else 
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
					this.append(v.toCppType());
					this.append(v.name);					
					break;
				}
				case ts.SyntaxKind.DotToken:
				{
					this.append("->");
					break;
				}
				case ts.SyntaxKind.EqualsToken:
				{
					let token2 = this.getNextToken(tokens,ts.SyntaxKind.NewKeyword);
					if ( token2 != null )
					{
						let token3 = this.getNextToken(tokens,T2CCodeBuilder.ArrayIdentifier);
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
					token2 = this.getNextToken(tokens, T2CCodeBuilder.ArrayIdentifier,
						ts.SyntaxKind.OpenBracketToken);
					if (token2 != null)
					{
						if ( token2.kind == ts.SyntaxKind.OpenBracketToken )
						{						
							let token3  = this.getNextToken(tokens,ts.SyntaxKind.CloseBracketToken);;
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
				case T2CCodeBuilder.ArrayIdentifier:
				{
					let token2 = this.getNextToken(tokens, ts.SyntaxKind.LessThanToken);
					if (token2 != null)
					{
						let v = new T2CVariable();
						token2 = this.getNextToken(tokens);
						v.type  = token2.getText();
						v.size = 1;// TODO :: handle 2 dimmensions array
						this.append(v.toCppType()); 
						token2 = this.getNextToken(tokens, ts.SyntaxKind.GreaterThanToken);
					}
					break;
				}
				case T2CCodeBuilder.LengthIdentifier:
				{
					if ( prevToken.kind == ts.SyntaxKind.DotToken )
					{
						this.append("length()");
					}
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
			token = this.getNextToken(tokens);
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
