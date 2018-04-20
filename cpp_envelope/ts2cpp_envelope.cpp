#include "ts2cpp_envelope.h"
JSConsole gConsole; 
JSConsole *console = &gConsole;

JSMath gMath;
JSMath *Math = &gMath;


#define MINIMAL_ENGINE
// TODO :: move to engine code
#ifndef MINIMAL_ENGINE
#include "SDL.h"
#include "SDL_image.h"
#define SCREEN_WIDTH 1024
#define SCREEN_HEIGHT 768

JSGFX gGraphics;
JSGFX *Graphics = &gGraphics;


void JSGFX::drawFPS()
{

}

void JSGFX::update()
{

}


void JSGFX::init()
{
	SDL_Init(SDL_INIT_EVERYTHING);
	IMG_Init(~0);
	mWindow = SDL_CreateWindow
	(
#ifdef WIN32
		"Runner Window", SDL_WINDOWPOS_UNDEFINED,
		SDL_WINDOWPOS_UNDEFINED,
		SCREEN_WIDTH,
		SCREEN_HEIGHT,
     SDL_WINDOW_SHOWN
#else
     NULL, 0,
     0,
     SCREEN_WIDTH,
     SCREEN_HEIGHT,
     SDL_WINDOW_BORDERLESS |
     SDL_WINDOW_FULLSCREEN |
     SDL_WINDOW_OPENGL | SDL_WINDOW_ALLOW_HIGHDPI
     
#endif
	);
	mRenderer = SDL_CreateRenderer(mWindow, -1, SDL_RENDERER_ACCELERATED);
}

void JSGFX::beginDraw()
{
	SDL_SetRenderDrawColor(mRenderer, 0,20,0,0);
	SDL_RenderClear(mRenderer);
}

void JSGFX::loadTexture(const JSString &path)
{
	std::string resource = mResourcePath + path;
	SDL_Surface *surface = IMG_Load(resource.c_str());
	mResources[path] = SDL_CreateTextureFromSurface(mRenderer, surface);
}


void JSGFX::setResourcesPath(const JSString &path)
{
#ifdef WIN32
	// TODO :: hardcoded values
	std::experimental::filesystem::path p = std::experimental::filesystem::path("D:\\1Dev\\SlateScienceV2\\SlateMathV3\\TestScripts") / path / "";
	mResourcePath = std::experimental::filesystem::canonical(p).string() + "\\";
#else
    mResourcePath = path;
#endif
}


void JSGFX::drawImage(double x, double y, const JSString &resource)
{
//    return;
	int dummyi;
	unsigned dummyu;
	SDL_Rect srect,drect;

	auto texture = mResources[resource];
	if (!texture)
		return;

	srect.x = 0;
	srect.y = 0;
	SDL_QueryTexture(texture, &dummyu, &dummyi, &srect.w, &srect.h);
	drect = srect;
	drect.x = (int)x;
	drect.y = (int)y;

	SDL_RenderCopyEx(mRenderer, texture, &srect, &drect, 0, NULL, SDL_FLIP_NONE);
}

void JSGFX::drawRect(double x,double y,unsigned char r, unsigned char g, unsigned char b, unsigned char a)
{
    SDL_SetRenderDrawColor(mRenderer, r,g,b,a);
//	SDL_SetRenderDrawColor(mRenderer, 255,0,255,255);
	SDL_Rect rect;
	rect.x = (int)x;
	rect.y = (int)y;
	rect.w = 10;
	rect.h = 10;
	SDL_RenderFillRect(mRenderer, &rect);

}
void JSGFX::endDraw()
{
	SDL_RenderPresent(mRenderer);
}
void JSGFX::terminate()
{
	SDL_DestroyWindow(mWindow);
	SDL_Quit();
}

void JSGFX::processEvents()
{
	SDL_Event event;
	while (SDL_PollEvent(&event)) {
		if (event.type == SDL_QUIT) {
			mQuiting = true;
		}
	}
}

/*
//#ifndef WIN32
int main(int argc, char *argv[])
{
	Testing::RunMain();
	return 0;
}
//#endif
*/



#endif
