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
export class T2CKindHelper{
	public static getNodeText(node : ts.Node) : string{
		switch (node.kind) {
			case ts.SyntaxKind.Unknown : return ("-" +"Unknown: " + node.getText()); 
			case ts.SyntaxKind.EndOfFileToken : return ("-" +"EndOfFileToken: " + node.getText()); 
			case ts.SyntaxKind.SingleLineCommentTrivia : return ("-" +"SingleLineCommentTrivia: " + node.getText()); 
			case ts.SyntaxKind.MultiLineCommentTrivia : return ("-" +"MultiLineCommentTrivia: " + node.getText()); 
			case ts.SyntaxKind.NewLineTrivia : return ("-" +"NewLineTrivia: " + node.getText()); 
			case ts.SyntaxKind.WhitespaceTrivia : return ("-" +"WhitespaceTrivia: " + node.getText()); 
			case ts.SyntaxKind.ShebangTrivia : return ("-" +"ShebangTrivia: " + node.getText()); 
			case ts.SyntaxKind.ConflictMarkerTrivia : return ("-" +"ConflictMarkerTrivia: " + node.getText()); 
			case ts.SyntaxKind.NumericLiteral : return ("-" +"NumericLiteral: " + node.getText()); 
			case ts.SyntaxKind.StringLiteral : return ("-" +"StringLiteral: " + node.getText()); 
			case ts.SyntaxKind.JsxText : return ("-" +"JsxText: " + node.getText()); 
			case ts.SyntaxKind.JsxTextAllWhiteSpaces : return ("-" +"JsxTextAllWhiteSpaces: " + node.getText()); 
			case ts.SyntaxKind.RegularExpressionLiteral : return ("-" +"RegularExpressionLiteral: " + node.getText()); 
			case ts.SyntaxKind.NoSubstitutionTemplateLiteral : return ("-" +"NoSubstitutionTemplateLiteral: " + node.getText()); 
			case ts.SyntaxKind.TemplateHead : return ("-" +"TemplateHead: " + node.getText()); 
			case ts.SyntaxKind.TemplateMiddle : return ("-" +"TemplateMiddle: " + node.getText()); 
			case ts.SyntaxKind.TemplateTail : return ("-" +"TemplateTail: " + node.getText()); 
			case ts.SyntaxKind.OpenBraceToken : return ("-" +"OpenBraceToken: " + node.getText()); 
			case ts.SyntaxKind.CloseBraceToken : return ("-" +"CloseBraceToken: " + node.getText()); 
			case ts.SyntaxKind.OpenParenToken : return ("-" +"OpenParenToken: " + node.getText()); 
			case ts.SyntaxKind.CloseParenToken : return ("-" +"CloseParenToken: " + node.getText()); 
			case ts.SyntaxKind.OpenBracketToken : return ("-" +"OpenBracketToken: " + node.getText()); 
			case ts.SyntaxKind.CloseBracketToken : return ("-" +"CloseBracketToken: " + node.getText()); 
			case ts.SyntaxKind.DotToken : return ("-" +"DotToken: " + node.getText()); 
			case ts.SyntaxKind.DotDotDotToken : return ("-" +"DotDotDotToken: " + node.getText()); 
			case ts.SyntaxKind.SemicolonToken : return ("-" +"SemicolonToken: " + node.getText()); 
			case ts.SyntaxKind.CommaToken : return ("-" +"CommaToken: " + node.getText()); 
			case ts.SyntaxKind.LessThanToken : return ("-" +"LessThanToken: " + node.getText()); 
			case ts.SyntaxKind.LessThanSlashToken : return ("-" +"LessThanSlashToken: " + node.getText()); 
			case ts.SyntaxKind.GreaterThanToken : return ("-" +"GreaterThanToken: " + node.getText()); 
			case ts.SyntaxKind.LessThanEqualsToken : return ("-" +"LessThanEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.GreaterThanEqualsToken : return ("-" +"GreaterThanEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.EqualsEqualsToken : return ("-" +"EqualsEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.ExclamationEqualsToken : return ("-" +"ExclamationEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.EqualsEqualsEqualsToken : return ("-" +"EqualsEqualsEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.ExclamationEqualsEqualsToken : return ("-" +"ExclamationEqualsEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.EqualsGreaterThanToken : return ("-" +"EqualsGreaterThanToken: " + node.getText()); 
			case ts.SyntaxKind.PlusToken : return ("-" +"PlusToken: " + node.getText()); 
			case ts.SyntaxKind.MinusToken : return ("-" +"MinusToken: " + node.getText()); 
			case ts.SyntaxKind.AsteriskToken : return ("-" +"AsteriskToken: " + node.getText()); 
			case ts.SyntaxKind.AsteriskAsteriskToken : return ("-" +"AsteriskAsteriskToken: " + node.getText()); 
			case ts.SyntaxKind.SlashToken : return ("-" +"SlashToken: " + node.getText()); 
			case ts.SyntaxKind.PercentToken : return ("-" +"PercentToken: " + node.getText()); 
			case ts.SyntaxKind.PlusPlusToken : return ("-" +"PlusPlusToken: " + node.getText()); 
			case ts.SyntaxKind.MinusMinusToken : return ("-" +"MinusMinusToken: " + node.getText()); 
			case ts.SyntaxKind.LessThanLessThanToken : return ("-" +"LessThanLessThanToken: " + node.getText()); 
			case ts.SyntaxKind.GreaterThanGreaterThanToken : return ("-" +"GreaterThanGreaterThanToken: " + node.getText()); 
			case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanToken : return ("-" +"GreaterThanGreaterThanGreaterThanToken: " + node.getText()); 
			case ts.SyntaxKind.AmpersandToken : return ("-" +"AmpersandToken: " + node.getText()); 
			case ts.SyntaxKind.BarToken : return ("-" +"BarToken: " + node.getText()); 
			case ts.SyntaxKind.CaretToken : return ("-" +"CaretToken: " + node.getText()); 
			case ts.SyntaxKind.ExclamationToken : return ("-" +"ExclamationToken: " + node.getText()); 
			case ts.SyntaxKind.TildeToken : return ("-" +"TildeToken: " + node.getText()); 
			case ts.SyntaxKind.AmpersandAmpersandToken : return ("-" +"AmpersandAmpersandToken: " + node.getText()); 
			case ts.SyntaxKind.BarBarToken : return ("-" +"BarBarToken: " + node.getText()); 
			case ts.SyntaxKind.QuestionToken : return ("-" +"QuestionToken: " + node.getText()); 
			case ts.SyntaxKind.ColonToken : return ("-" +"ColonToken: " + node.getText()); 
			case ts.SyntaxKind.AtToken : return ("-" +"AtToken: " + node.getText()); 
			case ts.SyntaxKind.EqualsToken : return ("-" +"EqualsToken: " + node.getText()); 
			case ts.SyntaxKind.PlusEqualsToken : return ("-" +"PlusEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.MinusEqualsToken : return ("-" +"MinusEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.AsteriskEqualsToken : return ("-" +"AsteriskEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.AsteriskAsteriskEqualsToken : return ("-" +"AsteriskAsteriskEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.SlashEqualsToken : return ("-" +"SlashEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.PercentEqualsToken : return ("-" +"PercentEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.LessThanLessThanEqualsToken : return ("-" +"LessThanLessThanEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.GreaterThanGreaterThanEqualsToken : return ("-" +"GreaterThanGreaterThanEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.GreaterThanGreaterThanGreaterThanEqualsToken : return ("-" +"GreaterThanGreaterThanGreaterThanEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.AmpersandEqualsToken : return ("-" +"AmpersandEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.BarEqualsToken : return ("-" +"BarEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.CaretEqualsToken : return ("-" +"CaretEqualsToken: " + node.getText()); 
			case ts.SyntaxKind.Identifier : return ("-" +"Identifier: " + node.getText()); 
			case ts.SyntaxKind.BreakKeyword : return ("-" +"BreakKeyword: " + node.getText()); 
			case ts.SyntaxKind.CaseKeyword : return ("-" +"CaseKeyword: " + node.getText()); 
			case ts.SyntaxKind.CatchKeyword : return ("-" +"CatchKeyword: " + node.getText()); 
			case ts.SyntaxKind.ClassKeyword : return ("-" +"ClassKeyword: " + node.getText()); 
			case ts.SyntaxKind.ConstKeyword : return ("-" +"ConstKeyword: " + node.getText()); 
			case ts.SyntaxKind.ContinueKeyword : return ("-" +"ContinueKeyword: " + node.getText()); 
			case ts.SyntaxKind.DebuggerKeyword : return ("-" +"DebuggerKeyword: " + node.getText()); 
			case ts.SyntaxKind.DefaultKeyword : return ("-" +"DefaultKeyword: " + node.getText()); 
			case ts.SyntaxKind.DeleteKeyword : return ("-" +"DeleteKeyword: " + node.getText()); 
			case ts.SyntaxKind.DoKeyword : return ("-" +"DoKeyword: " + node.getText()); 
			case ts.SyntaxKind.ElseKeyword : return ("-" +"ElseKeyword: " + node.getText()); 
			case ts.SyntaxKind.EnumKeyword : return ("-" +"EnumKeyword: " + node.getText()); 
			case ts.SyntaxKind.ExportKeyword : return ("-" +"ExportKeyword: " + node.getText()); 
			case ts.SyntaxKind.ExtendsKeyword : return ("-" +"ExtendsKeyword: " + node.getText()); 
			case ts.SyntaxKind.FalseKeyword : return ("-" +"FalseKeyword: " + node.getText()); 
			case ts.SyntaxKind.FinallyKeyword : return ("-" +"FinallyKeyword: " + node.getText()); 
			case ts.SyntaxKind.ForKeyword : return ("-" +"ForKeyword: " + node.getText()); 
			case ts.SyntaxKind.FunctionKeyword : return ("-" +"FunctionKeyword: " + node.getText()); 
			case ts.SyntaxKind.IfKeyword : return ("-" +"IfKeyword: " + node.getText()); 
			case ts.SyntaxKind.ImportKeyword : return ("-" +"ImportKeyword: " + node.getText()); 
			case ts.SyntaxKind.InKeyword : return ("-" +"InKeyword: " + node.getText()); 
			case ts.SyntaxKind.InstanceOfKeyword : return ("-" +"InstanceOfKeyword: " + node.getText()); 
			case ts.SyntaxKind.NewKeyword : return ("-" +"NewKeyword: " + node.getText()); 
			case ts.SyntaxKind.NullKeyword : return ("-" +"NullKeyword: " + node.getText()); 
			case ts.SyntaxKind.ReturnKeyword : return ("-" +"ReturnKeyword: " + node.getText()); 
			case ts.SyntaxKind.SuperKeyword : return ("-" +"SuperKeyword: " + node.getText()); 
			case ts.SyntaxKind.SwitchKeyword : return ("-" +"SwitchKeyword: " + node.getText()); 
			case ts.SyntaxKind.ThisKeyword : return ("-" +"ThisKeyword: " + node.getText()); 
			case ts.SyntaxKind.ThrowKeyword : return ("-" +"ThrowKeyword: " + node.getText()); 
			case ts.SyntaxKind.TrueKeyword : return ("-" +"TrueKeyword: " + node.getText()); 
			case ts.SyntaxKind.TryKeyword : return ("-" +"TryKeyword: " + node.getText()); 
			case ts.SyntaxKind.TypeOfKeyword : return ("-" +"TypeOfKeyword: " + node.getText()); 
			case ts.SyntaxKind.VarKeyword : return ("-" +"VarKeyword: " + node.getText()); 
			case ts.SyntaxKind.VoidKeyword : return ("-" +"VoidKeyword: " + node.getText()); 
			case ts.SyntaxKind.WhileKeyword : return ("-" +"WhileKeyword: " + node.getText()); 
			case ts.SyntaxKind.WithKeyword : return ("-" +"WithKeyword: " + node.getText()); 
			case ts.SyntaxKind.ImplementsKeyword : return ("-" +"ImplementsKeyword: " + node.getText()); 
			case ts.SyntaxKind.InterfaceKeyword : return ("-" +"InterfaceKeyword: " + node.getText()); 
			case ts.SyntaxKind.LetKeyword : return ("-" +"LetKeyword: " + node.getText()); 
			case ts.SyntaxKind.PackageKeyword : return ("-" +"PackageKeyword: " + node.getText()); 
			case ts.SyntaxKind.PrivateKeyword : return ("-" +"PrivateKeyword: " + node.getText()); 
			case ts.SyntaxKind.ProtectedKeyword : return ("-" +"ProtectedKeyword: " + node.getText()); 
			case ts.SyntaxKind.PublicKeyword : return ("-" +"PublicKeyword: " + node.getText()); 
			case ts.SyntaxKind.StaticKeyword : return ("-" +"StaticKeyword: " + node.getText()); 
			case ts.SyntaxKind.YieldKeyword : return ("-" +"YieldKeyword: " + node.getText()); 
			case ts.SyntaxKind.AbstractKeyword : return ("-" +"AbstractKeyword: " + node.getText()); 
			case ts.SyntaxKind.AsKeyword : return ("-" +"AsKeyword: " + node.getText()); 
			case ts.SyntaxKind.AnyKeyword : return ("-" +"AnyKeyword: " + node.getText()); 
			case ts.SyntaxKind.AsyncKeyword : return ("-" +"AsyncKeyword: " + node.getText()); 
			case ts.SyntaxKind.AwaitKeyword : return ("-" +"AwaitKeyword: " + node.getText()); 
			case ts.SyntaxKind.BooleanKeyword : return ("-" +"BooleanKeyword: " + node.getText()); 
			case ts.SyntaxKind.ConstructorKeyword : return ("-" +"ConstructorKeyword: " + node.getText()); 
			case ts.SyntaxKind.DeclareKeyword : return ("-" +"DeclareKeyword: " + node.getText()); 
			case ts.SyntaxKind.GetKeyword : return ("-" +"GetKeyword: " + node.getText()); 
			case ts.SyntaxKind.IsKeyword : return ("-" +"IsKeyword: " + node.getText()); 
			case ts.SyntaxKind.KeyOfKeyword : return ("-" +"KeyOfKeyword: " + node.getText()); 
			case ts.SyntaxKind.ModuleKeyword : return ("-" +"ModuleKeyword: " + node.getText()); 
			case ts.SyntaxKind.NamespaceKeyword : return ("-" +"NamespaceKeyword: " + node.getText()); 
			case ts.SyntaxKind.NeverKeyword : return ("-" +"NeverKeyword: " + node.getText()); 
			case ts.SyntaxKind.ReadonlyKeyword : return ("-" +"ReadonlyKeyword: " + node.getText()); 
			case ts.SyntaxKind.RequireKeyword : return ("-" +"RequireKeyword: " + node.getText()); 
			case ts.SyntaxKind.NumberKeyword : return ("-" +"NumberKeyword: " + node.getText()); 
			case ts.SyntaxKind.ObjectKeyword : return ("-" +"ObjectKeyword: " + node.getText()); 
			case ts.SyntaxKind.SetKeyword : return ("-" +"SetKeyword: " + node.getText()); 
			case ts.SyntaxKind.StringKeyword : return ("-" +"StringKeyword: " + node.getText()); 
			case ts.SyntaxKind.SymbolKeyword : return ("-" +"SymbolKeyword: " + node.getText()); 
			case ts.SyntaxKind.TypeKeyword : return ("-" +"TypeKeyword: " + node.getText()); 
			case ts.SyntaxKind.UndefinedKeyword : return ("-" +"UndefinedKeyword: " + node.getText()); 
			case ts.SyntaxKind.UniqueKeyword : return ("-" +"UniqueKeyword: " + node.getText()); 
			case ts.SyntaxKind.FromKeyword : return ("-" +"FromKeyword: " + node.getText()); 
			case ts.SyntaxKind.GlobalKeyword : return ("-" +"GlobalKeyword: " + node.getText()); 
			case ts.SyntaxKind.OfKeyword : return ("-" +"OfKeyword: " + node.getText()); 
			case ts.SyntaxKind.QualifiedName : return ("-" +"QualifiedName: " + node.getText()); 
			case ts.SyntaxKind.ComputedPropertyName : return ("-" +"ComputedPropertyName: " + node.getText()); 
			case ts.SyntaxKind.TypeParameter : return ("-" +"TypeParameter: " + node.getText()); 
			case ts.SyntaxKind.Parameter : return ("-" +"Parameter: " + node.getText()); 
			case ts.SyntaxKind.Decorator : return ("-" +"Decorator: " + node.getText()); 
			case ts.SyntaxKind.PropertySignature : return ("-" +"PropertySignature: " + node.getText()); 
			case ts.SyntaxKind.PropertyDeclaration : return ("-" +"PropertyDeclaration: " + node.getText()); 
			case ts.SyntaxKind.MethodSignature : return ("-" +"MethodSignature: " + node.getText()); 
			case ts.SyntaxKind.MethodDeclaration : return ("-" +"MethodDeclaration: " + node.getText()); 
			case ts.SyntaxKind.Constructor : return ("-" +"Constructor: " + node.getText()); 
			case ts.SyntaxKind.GetAccessor : return ("-" +"GetAccessor: " + node.getText()); 
			case ts.SyntaxKind.SetAccessor : return ("-" +"SetAccessor: " + node.getText()); 
			case ts.SyntaxKind.CallSignature : return ("-" +"CallSignature: " + node.getText()); 
			case ts.SyntaxKind.ConstructSignature : return ("-" +"ConstructSignature: " + node.getText()); 
			case ts.SyntaxKind.IndexSignature : return ("-" +"IndexSignature: " + node.getText()); 
			case ts.SyntaxKind.TypePredicate : return ("-" +"TypePredicate: " + node.getText()); 
			case ts.SyntaxKind.TypeReference : return ("-" +"TypeReference: " + node.getText()); 
			case ts.SyntaxKind.FunctionType : return ("-" +"FunctionType: " + node.getText()); 
			case ts.SyntaxKind.ConstructorType : return ("-" +"ConstructorType: " + node.getText()); 
			case ts.SyntaxKind.TypeQuery : return ("-" +"TypeQuery: " + node.getText()); 
			case ts.SyntaxKind.TypeLiteral : return ("-" +"TypeLiteral: " + node.getText()); 
			case ts.SyntaxKind.ArrayType : return ("-" +"ArrayType: " + node.getText()); 
			case ts.SyntaxKind.TupleType : return ("-" +"TupleType: " + node.getText()); 
			case ts.SyntaxKind.UnionType : return ("-" +"UnionType: " + node.getText()); 
			case ts.SyntaxKind.IntersectionType : return ("-" +"IntersectionType: " + node.getText()); 
			case ts.SyntaxKind.ParenthesizedType : return ("-" +"ParenthesizedType: " + node.getText()); 
			case ts.SyntaxKind.ThisType : return ("-" +"ThisType: " + node.getText()); 
			case ts.SyntaxKind.TypeOperator : return ("-" +"TypeOperator: " + node.getText()); 
			case ts.SyntaxKind.IndexedAccessType : return ("-" +"IndexedAccessType: " + node.getText()); 
			case ts.SyntaxKind.MappedType : return ("-" +"MappedType: " + node.getText()); 
			case ts.SyntaxKind.LiteralType : return ("-" +"LiteralType: " + node.getText()); 
			case ts.SyntaxKind.ObjectBindingPattern : return ("-" +"ObjectBindingPattern: " + node.getText()); 
			case ts.SyntaxKind.ArrayBindingPattern : return ("-" +"ArrayBindingPattern: " + node.getText()); 
			case ts.SyntaxKind.BindingElement : return ("-" +"BindingElement: " + node.getText()); 
			case ts.SyntaxKind.ArrayLiteralExpression : return ("-" +"ArrayLiteralExpression: " + node.getText()); 
			case ts.SyntaxKind.ObjectLiteralExpression : return ("-" +"ObjectLiteralExpression: " + node.getText()); 
			case ts.SyntaxKind.PropertyAccessExpression : return ("-" +"PropertyAccessExpression: " + node.getText()); 
			case ts.SyntaxKind.ElementAccessExpression : return ("-" +"ElementAccessExpression: " + node.getText()); 
			case ts.SyntaxKind.CallExpression : return ("-" +"CallExpression: " + node.getText()); 
			case ts.SyntaxKind.NewExpression : return ("-" +"NewExpression: " + node.getText()); 
			case ts.SyntaxKind.TaggedTemplateExpression : return ("-" +"TaggedTemplateExpression: " + node.getText()); 
			case ts.SyntaxKind.TypeAssertionExpression : return ("-" +"TypeAssertionExpression: " + node.getText()); 
			case ts.SyntaxKind.ParenthesizedExpression : return ("-" +"ParenthesizedExpression: " + node.getText()); 
			case ts.SyntaxKind.FunctionExpression : return ("-" +"FunctionExpression: " + node.getText()); 
			case ts.SyntaxKind.ArrowFunction : return ("-" +"ArrowFunction: " + node.getText()); 
			case ts.SyntaxKind.DeleteExpression : return ("-" +"DeleteExpression: " + node.getText()); 
			case ts.SyntaxKind.TypeOfExpression : return ("-" +"TypeOfExpression: " + node.getText()); 
			case ts.SyntaxKind.VoidExpression : return ("-" +"VoidExpression: " + node.getText()); 
			case ts.SyntaxKind.AwaitExpression : return ("-" +"AwaitExpression: " + node.getText()); 
			case ts.SyntaxKind.PrefixUnaryExpression : return ("-" +"PrefixUnaryExpression: " + node.getText()); 
			case ts.SyntaxKind.PostfixUnaryExpression : return ("-" +"PostfixUnaryExpression: " + node.getText()); 
			case ts.SyntaxKind.BinaryExpression : return ("-" +"BinaryExpression: " + node.getText()); 
			case ts.SyntaxKind.ConditionalExpression : return ("-" +"ConditionalExpression: " + node.getText()); 
			case ts.SyntaxKind.TemplateExpression : return ("-" +"TemplateExpression: " + node.getText()); 
			case ts.SyntaxKind.YieldExpression : return ("-" +"YieldExpression: " + node.getText()); 
			case ts.SyntaxKind.SpreadElement : return ("-" +"SpreadElement: " + node.getText()); 
			case ts.SyntaxKind.ClassExpression : return ("-" +"ClassExpression: " + node.getText()); 
			case ts.SyntaxKind.OmittedExpression : return ("-" +"OmittedExpression: " + node.getText()); 
			case ts.SyntaxKind.ExpressionWithTypeArguments : return ("-" +"ExpressionWithTypeArguments: " + node.getText()); 
			case ts.SyntaxKind.AsExpression : return ("-" +"AsExpression: " + node.getText()); 
			case ts.SyntaxKind.NonNullExpression : return ("-" +"NonNullExpression: " + node.getText()); 
			case ts.SyntaxKind.MetaProperty : return ("-" +"MetaProperty: " + node.getText()); 
			case ts.SyntaxKind.TemplateSpan : return ("-" +"TemplateSpan: " + node.getText()); 
			case ts.SyntaxKind.SemicolonClassElement : return ("-" +"SemicolonClassElement: " + node.getText()); 
			case ts.SyntaxKind.Block : return ("-" +"Block: " + node.getText()); 
			case ts.SyntaxKind.VariableStatement : return ("-" +"VariableStatement: " + node.getText()); 
			case ts.SyntaxKind.EmptyStatement : return ("-" +"EmptyStatement: " + node.getText()); 
			case ts.SyntaxKind.ExpressionStatement : return ("-" +"ExpressionStatement: " + node.getText()); 
			case ts.SyntaxKind.IfStatement : return ("-" +"IfStatement: " + node.getText()); 
			case ts.SyntaxKind.DoStatement : return ("-" +"DoStatement: " + node.getText()); 
			case ts.SyntaxKind.WhileStatement : return ("-" +"WhileStatement: " + node.getText()); 
			case ts.SyntaxKind.ForStatement : return ("-" +"ForStatement: " + node.getText()); 
			case ts.SyntaxKind.ForInStatement : return ("-" +"ForInStatement: " + node.getText()); 
			case ts.SyntaxKind.ForOfStatement : return ("-" +"ForOfStatement: " + node.getText()); 
			case ts.SyntaxKind.ContinueStatement : return ("-" +"ContinueStatement: " + node.getText()); 
			case ts.SyntaxKind.BreakStatement : return ("-" +"BreakStatement: " + node.getText()); 
			case ts.SyntaxKind.ReturnStatement : return ("-" +"ReturnStatement: " + node.getText()); 
			case ts.SyntaxKind.WithStatement : return ("-" +"WithStatement: " + node.getText()); 
			case ts.SyntaxKind.SwitchStatement : return ("-" +"SwitchStatement: " + node.getText()); 
			case ts.SyntaxKind.LabeledStatement : return ("-" +"LabeledStatement: " + node.getText()); 
			case ts.SyntaxKind.ThrowStatement : return ("-" +"ThrowStatement: " + node.getText()); 
			case ts.SyntaxKind.TryStatement : return ("-" +"TryStatement: " + node.getText()); 
			case ts.SyntaxKind.DebuggerStatement : return ("-" +"DebuggerStatement: " + node.getText()); 
			case ts.SyntaxKind.VariableDeclaration : return ("-" +"VariableDeclaration: " + node.getText()); 
			case ts.SyntaxKind.VariableDeclarationList : return ("-" +"VariableDeclarationList: " + node.getText()); 
			case ts.SyntaxKind.FunctionDeclaration : return ("-" +"FunctionDeclaration: " + node.getText()); 
			case ts.SyntaxKind.ClassDeclaration : return ("-" +"ClassDeclaration: " + node.getText()); 
			case ts.SyntaxKind.InterfaceDeclaration : return ("-" +"InterfaceDeclaration: " + node.getText()); 
			case ts.SyntaxKind.TypeAliasDeclaration : return ("-" +"TypeAliasDeclaration: " + node.getText()); 
			case ts.SyntaxKind.EnumDeclaration : return ("-" +"EnumDeclaration: " + node.getText()); 
			case ts.SyntaxKind.ModuleDeclaration : return ("-" +"ModuleDeclaration: " + node.getText()); 
			case ts.SyntaxKind.ModuleBlock : return ("-" +"ModuleBlock: " + node.getText()); 
			case ts.SyntaxKind.CaseBlock : return ("-" +"CaseBlock: " + node.getText()); 
			case ts.SyntaxKind.NamespaceExportDeclaration : return ("-" +"NamespaceExportDeclaration: " + node.getText()); 
			case ts.SyntaxKind.ImportEqualsDeclaration : return ("-" +"ImportEqualsDeclaration: " + node.getText()); 
			case ts.SyntaxKind.ImportDeclaration : return ("-" +"ImportDeclaration: " + node.getText()); 
			case ts.SyntaxKind.ImportClause : return ("-" +"ImportClause: " + node.getText()); 
			case ts.SyntaxKind.NamespaceImport : return ("-" +"NamespaceImport: " + node.getText()); 
			case ts.SyntaxKind.NamedImports : return ("-" +"NamedImports: " + node.getText()); 
			case ts.SyntaxKind.ImportSpecifier : return ("-" +"ImportSpecifier: " + node.getText()); 
			case ts.SyntaxKind.ExportAssignment : return ("-" +"ExportAssignment: " + node.getText()); 
			case ts.SyntaxKind.ExportDeclaration : return ("-" +"ExportDeclaration: " + node.getText()); 
			case ts.SyntaxKind.NamedExports : return ("-" +"NamedExports: " + node.getText()); 
			case ts.SyntaxKind.ExportSpecifier : return ("-" +"ExportSpecifier: " + node.getText()); 
			case ts.SyntaxKind.MissingDeclaration : return ("-" +"MissingDeclaration: " + node.getText()); 
			case ts.SyntaxKind.ExternalModuleReference : return ("-" +"ExternalModuleReference: " + node.getText()); 
			case ts.SyntaxKind.JsxElement : return ("-" +"JsxElement: " + node.getText()); 
			case ts.SyntaxKind.JsxSelfClosingElement : return ("-" +"JsxSelfClosingElement: " + node.getText()); 
			case ts.SyntaxKind.JsxOpeningElement : return ("-" +"JsxOpeningElement: " + node.getText()); 
			case ts.SyntaxKind.JsxClosingElement : return ("-" +"JsxClosingElement: " + node.getText()); 
			case ts.SyntaxKind.JsxFragment : return ("-" +"JsxFragment: " + node.getText()); 
			case ts.SyntaxKind.JsxOpeningFragment : return ("-" +"JsxOpeningFragment: " + node.getText()); 
			case ts.SyntaxKind.JsxClosingFragment : return ("-" +"JsxClosingFragment: " + node.getText()); 
			case ts.SyntaxKind.JsxAttribute : return ("-" +"JsxAttribute: " + node.getText()); 
			case ts.SyntaxKind.JsxAttributes : return ("-" +"JsxAttributes: " + node.getText()); 
			case ts.SyntaxKind.JsxSpreadAttribute : return ("-" +"JsxSpreadAttribute: " + node.getText()); 
			case ts.SyntaxKind.JsxExpression : return ("-" +"JsxExpression: " + node.getText()); 
			case ts.SyntaxKind.CaseClause : return ("-" +"CaseClause: " + node.getText()); 
			case ts.SyntaxKind.DefaultClause : return ("-" +"DefaultClause: " + node.getText()); 
			case ts.SyntaxKind.HeritageClause : return ("-" +"HeritageClause: " + node.getText()); 
			case ts.SyntaxKind.CatchClause : return ("-" +"CatchClause: " + node.getText()); 
			case ts.SyntaxKind.PropertyAssignment : return ("-" +"PropertyAssignment: " + node.getText()); 
			case ts.SyntaxKind.ShorthandPropertyAssignment : return ("-" +"ShorthandPropertyAssignment: " + node.getText()); 
			case ts.SyntaxKind.SpreadAssignment : return ("-" +"SpreadAssignment: " + node.getText()); 
			case ts.SyntaxKind.EnumMember : return ("-" +"EnumMember: " + node.getText()); 
			case ts.SyntaxKind.SourceFile : return ("-" +"SourceFile: " + node.getText()); 
			case ts.SyntaxKind.Bundle : return ("-" +"Bundle: " + node.getText()); 
			case ts.SyntaxKind.JSDocTypeExpression : return ("-" +"JSDocTypeExpression: " + node.getText()); 
			case ts.SyntaxKind.JSDocAllType : return ("-" +"JSDocAllType: " + node.getText()); 
			case ts.SyntaxKind.JSDocUnknownType : return ("-" +"JSDocUnknownType: " + node.getText()); 
			case ts.SyntaxKind.JSDocNullableType : return ("-" +"JSDocNullableType: " + node.getText()); 
			case ts.SyntaxKind.JSDocNonNullableType : return ("-" +"JSDocNonNullableType: " + node.getText()); 
			case ts.SyntaxKind.JSDocOptionalType : return ("-" +"JSDocOptionalType: " + node.getText()); 
			case ts.SyntaxKind.JSDocFunctionType : return ("-" +"JSDocFunctionType: " + node.getText()); 
			case ts.SyntaxKind.JSDocVariadicType : return ("-" +"JSDocVariadicType: " + node.getText()); 
			case ts.SyntaxKind.JSDocComment : return ("-" +"JSDocComment: " + node.getText()); 
			case ts.SyntaxKind.JSDocTypeLiteral : return ("-" +"JSDocTypeLiteral: " + node.getText()); 
			case ts.SyntaxKind.JSDocTag : return ("-" +"JSDocTag: " + node.getText()); 
			case ts.SyntaxKind.JSDocAugmentsTag : return ("-" +"JSDocAugmentsTag: " + node.getText()); 
			case ts.SyntaxKind.JSDocClassTag : return ("-" +"JSDocClassTag: " + node.getText()); 
			case ts.SyntaxKind.JSDocParameterTag : return ("-" +"JSDocParameterTag: " + node.getText()); 
			case ts.SyntaxKind.JSDocReturnTag : return ("-" +"JSDocReturnTag: " + node.getText()); 
			case ts.SyntaxKind.JSDocTypeTag : return ("-" +"JSDocTypeTag: " + node.getText()); 
			case ts.SyntaxKind.JSDocTemplateTag : return ("-" +"JSDocTemplateTag: " + node.getText()); 
			case ts.SyntaxKind.JSDocTypedefTag : return ("-" +"JSDocTypedefTag: " + node.getText()); 
			case ts.SyntaxKind.JSDocPropertyTag : return ("-" +"JSDocPropertyTag: " + node.getText()); 
			case ts.SyntaxKind.SyntaxList : return ("-" +"SyntaxList: " + node.getText()); 
			case ts.SyntaxKind.NotEmittedStatement : return ("-" +"NotEmittedStatement: " + node.getText()); 
			case ts.SyntaxKind.PartiallyEmittedExpression : return ("-" +"PartiallyEmittedExpression: " + node.getText()); 
			case ts.SyntaxKind.CommaListExpression : return ("-" +"CommaListExpression: " + node.getText()); 
			case ts.SyntaxKind.MergeDeclarationMarker : return ("-" +"MergeDeclarationMarker: " + node.getText()); 
			case ts.SyntaxKind.EndOfDeclarationMarker : return ("-" +"EndOfDeclarationMarker: " + node.getText()); 
			case ts.SyntaxKind.Count : return ("-" +"Count: " + node.getText()); 
			case ts.SyntaxKind.FirstAssignment : return ("-" +"FirstAssignment: " + node.getText()); 
			case ts.SyntaxKind.LastAssignment : return ("-" +"LastAssignment: " + node.getText()); 
			case ts.SyntaxKind.FirstCompoundAssignment : return ("-" +"FirstCompoundAssignment: " + node.getText()); 
			case ts.SyntaxKind.LastCompoundAssignment : return ("-" +"LastCompoundAssignment: " + node.getText()); 
			case ts.SyntaxKind.FirstReservedWord : return ("-" +"FirstReservedWord: " + node.getText()); 
			case ts.SyntaxKind.LastReservedWord : return ("-" +"LastReservedWord: " + node.getText()); 
			case ts.SyntaxKind.FirstKeyword : return ("-" +"FirstKeyword: " + node.getText()); 
			case ts.SyntaxKind.LastKeyword : return ("-" +"LastKeyword: " + node.getText()); 
			case ts.SyntaxKind.FirstFutureReservedWord : return ("-" +"FirstFutureReservedWord: " + node.getText()); 
			case ts.SyntaxKind.LastFutureReservedWord : return ("-" +"LastFutureReservedWord: " + node.getText()); 
			case ts.SyntaxKind.FirstTypeNode : return ("-" +"FirstTypeNode: " + node.getText()); 
			case ts.SyntaxKind.LastTypeNode : return ("-" +"LastTypeNode: " + node.getText()); 
			case ts.SyntaxKind.FirstPunctuation : return ("-" +"FirstPunctuation: " + node.getText()); 
			case ts.SyntaxKind.LastPunctuation : return ("-" +"LastPunctuation: " + node.getText()); 
			case ts.SyntaxKind.FirstToken : return ("-" +"FirstToken: " + node.getText()); 
			case ts.SyntaxKind.LastToken : return ("-" +"LastToken: " + node.getText()); 
			case ts.SyntaxKind.FirstTriviaToken : return ("-" +"FirstTriviaToken: " + node.getText()); 
			case ts.SyntaxKind.LastTriviaToken : return ("-" +"LastTriviaToken: " + node.getText()); 
			case ts.SyntaxKind.FirstLiteralToken : return ("-" +"FirstLiteralToken: " + node.getText()); 
			case ts.SyntaxKind.LastLiteralToken : return ("-" +"LastLiteralToken: " + node.getText()); 
			case ts.SyntaxKind.FirstTemplateToken : return ("-" +"FirstTemplateToken: " + node.getText()); 
			case ts.SyntaxKind.LastTemplateToken : return ("-" +"LastTemplateToken: " + node.getText()); 
			case ts.SyntaxKind.FirstBinaryOperator : return ("-" +"FirstBinaryOperator: " + node.getText()); 
			case ts.SyntaxKind.LastBinaryOperator : return ("-" +"LastBinaryOperator: " + node.getText()); 
			case ts.SyntaxKind.FirstNode : return ("-" +"FirstNode: " + node.getText()); 
			case ts.SyntaxKind.FirstJSDocNode : return ("-" +"FirstJSDocNode: " + node.getText()); 
			case ts.SyntaxKind.LastJSDocNode : return ("-" +"LastJSDocNode: " + node.getText()); 
			case ts.SyntaxKind.FirstJSDocTagNode : return ("-" +"FirstJSDocTagNode: " + node.getText()); 
			case ts.SyntaxKind.LastJSDocTagNode : return ("-" +"LastJSDocTagNode: " + node.getText()); 
			default : return ("-" +"Unknown node.kind : " + node.kind); 
        }

	}
}