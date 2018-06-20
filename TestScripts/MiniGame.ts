
enum NodeType{
	None = 0,
	Image,
	Text,
	Rect
}

class SceneGraphNode
{
	constructor(type : NodeType, parent : SceneGraphNode,value: string = "" )
	{
		this.value = value;
		this.mType = type;
		if ( parent != null){
			this.mParent = parent;
			this.mParent.addChild(this);
		}
	}

	setColor(r : number,g: number,b: number,a: number){
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}

	setSize(w : number,h: number){
		this.w = w;
		this.h = h;
	}

	getType() : NodeType{
		return this.mType;
	}
	addChild(node : SceneGraphNode){
		this.mChildren.push(node);
	}
	getChildren() : SceneGraphNode[]{
		return this.mChildren;
	}

	protected mType : NodeType;
	protected mParent : SceneGraphNode;
	protected mValue:  string;

	protected mChildren : SceneGraphNode[] = [];

	public value : string;
	public x = 0;
	public y = 0;
	public anchorX = 0.5;
	public anchorY = 0.5;
	public r = 1;
	public g = 1;
	public b = 1;
	public a = 1;
	public w = 1;
	public h = 1;

}


class SceneGraph
{
	protected mRoot : SceneGraphNode = null;
	constructor(){
		this.mRoot = new SceneGraphNode(NodeType.None,null);
	}

	public getRoot() : SceneGraphNode{
		return this.mRoot;
	}

	public draw(): void{
		this.drawInternal(this.getRoot(),0,0);
	}

	protected drawInternal(node : SceneGraphNode, px : number,py : number ){
		node.getChildren().forEach(child =>{
			let x = px + child.x;
			let y = py + child.y;
			switch(child.getType() ){
				case NodeType.None:
					break;
				case NodeType.Image:
					Graphics.drawImage(x,y,child.value);
					break;
				case NodeType.Text:
					Graphics.drawText(x,y,child.value,16,child.r,child.g,child.b,child.a);
					break;
				case NodeType.Rect:
					Graphics.drawRect(x, y,child.w,child.h,child.r,child.g,child.b,child.a);
					break;
			}
			this.drawInternal(child,px + child.x,py + child.y);
		});

	}
}


class GameCell{
	constructor(node :SceneGraphNode ,value : number){
		this.node = node;
		this.value = value;
	}
	public node : SceneGraphNode;
	public value : number;
}

class MiniGame
{
	private mScene : SceneGraph;
	private mCells : GameCell[][] = [];
	constructor(){
		this.mScene = new SceneGraph();
		for ( let y = 0 ; y < 10 ; y++ ){
			this.mCells[y] = [];
			for ( let x = 0 ; x < 10 ; x++){

				var rect = new SceneGraphNode(NodeType.Rect,this.mScene.getRoot());
				rect.setSize(50,50);
				rect.x = x * 60;
				rect.y = y * 60;
				var text = new SceneGraphNode(NodeType.Text,rect,"" + (x * y) );
				text.g = text.b = 0;
				this.mCells[y][x] = new GameCell(rect,x * y);	
			}
		}
	}
	public update()
	{
		this.mScene.draw();
	}
}


namespace Testing{
	function main()
	{
		let game = new MiniGame();
		Graphics.init();
		while (!Graphics.quiting())
		{
			Graphics.update();
			Graphics.beginDraw();
			game.update();
			Graphics.drawFPS();
			Graphics.endDraw();
		}
	}
}