
class MiniGame
{
	public update()
	{
		Graphics.drawImage(300, 300, "i0",256,256);
		Graphics.drawRect(100, 100,50,50, 1, 0, 1,1);
	}
}


namespace Testing{
	function main()
	{
		let game = new MiniGame();
		Graphics.init();
		while (true)
		{
			Graphics.update();
			Graphics.beginDraw();
			game.update();
			Graphics.drawFPS();
			Graphics.endDraw();
		}
	}
}