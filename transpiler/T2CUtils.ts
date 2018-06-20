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
import * as child from "child_process";
import { T2CKindHelper } from "./T2CKindHelper";

export class T2CUtils
{
    static ExtractFirstIdentifier(node : ts.Node) : ts.Node
    {
        let ret : ts.Node= null;
        function ExtractFirstIdentifierInternal(node1 : ts.Node)
        {
            if ( node1.kind == ts.SyntaxKind.Identifier )
            {
                ret = node1;
                return;
            }
            for ( var i = 0 ;i < node1.getChildCount() ; i++ )
            {
                ExtractFirstIdentifierInternal(node1.getChildAt(i));
                if ( ret != null )
                    return;
            }
        }
        ExtractFirstIdentifierInternal(node);
        return ret;
    }

	
	static ArrayIdentifier = 10000;
	static LengthIdentifier = 10001;
	static ForEachIdentifier = 10002;

    // TODO :: move to T2CTokenizer
	static buildTokenList(node : ts.Node) : ts.Node[]{
		let ret : ts.Node[] = [];
		function tokenize(node : ts.Node){
			let nt = T2CKindHelper.getNodeText(node);
			if ( (node.kind >= ts.SyntaxKind.OpenBraceToken && node.kind <= ts.SyntaxKind.GlobalKeyword) || ( node.kind >= T2CUtils.ArrayIdentifier ) ){
				if ( node.kind == ts.SyntaxKind.Identifier && node.getText() == "Array" )
					node.kind = T2CUtils.ArrayIdentifier;
				else if ( node.kind == ts.SyntaxKind.Identifier && node.getText() == "length" )
					node.kind = T2CUtils.LengthIdentifier;
				else if ( node.kind == ts.SyntaxKind.Identifier && node.getText() == "forEach" )
					node.kind = T2CUtils.ForEachIdentifier;
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
	
	
	static peekNextToken(tokens : ts.Node[]) : ts.Node 
	{
		if ( tokens.length == 0 )
			return null;
		return tokens[0];
	}
	static getNextToken(tokens : ts.Node[], ...valids: ts.SyntaxKind[]) : ts.Node 
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
    

    
	
	static assert(exp : boolean){
		if ( exp == false)
			exp = false;
	}



	static isWindows() : boolean{
		// TODO :: PATCH :: find a better way.
		return child.execSync("cd",{"encoding" : "utf8"}).trim().length > 0;
	}


	static isAlphaNumeric(ch) : boolean {
		  if (!(ch > 47 && ch < 58) && // numeric (0-9)
			  !(ch > 64 && ch < 91) && // upper alpha (A-Z)
			  !(ch > 96 && ch < 123)) { // lower alpha (a-z)
				return false;
			  }
		return true;
	}
}