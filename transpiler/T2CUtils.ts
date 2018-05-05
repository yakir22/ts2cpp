import * as ts from "typescript";
import * as child from "child_process";

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

    // TODO :: move to T2CTokenizer
	static buildTokenList(node : ts.Node) : ts.Node[]{
		let ret : ts.Node[] = [];
		function tokenize(node : ts.Node){
			if ( node.kind >= ts.SyntaxKind.OpenBraceToken && node.kind <= ts.SyntaxKind.GlobalKeyword ){
				if ( node.kind == ts.SyntaxKind.Identifier && node.getText() == "Array" )
					node.kind = T2CUtils.ArrayIdentifier;
				else if ( node.kind == ts.SyntaxKind.Identifier && node.getText() == "length" )
					node.kind = T2CUtils.LengthIdentifier;
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



	static isWindows() {
		// TODO :: PATCH :: find a better way.
		return child.execSync("cd",{"encoding" : "utf8"}).trim().length > 0;
	}

}