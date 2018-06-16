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

#include "stdafx.h"
#ifndef MINIMAL_ENGINE

#include "gfx.h"

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
	processEvents();
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
	SDL_SetRenderDrawColor(mRenderer, 0, 0, 0, 0);
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


void JSGFX::drawImage(double x, double y, const JSString &_resource,double width /*= 0*/, double height/* = 0*/)
{
	//    return;
	static const JSString ext = JSString(".png");
	const JSString resource = _resource + ext;
	int dummyi;
	unsigned dummyu;
	SDL_Rect srect, drect;

	auto texture = mResources[resource];
	if (!texture)
	{
		loadTexture(resource);
		texture = mResources[resource];
		if ( !texture) 
			return;
	}
	srect.x = 0;
	srect.y = 0;
	drect.x = (int)x;
	drect.y = (int)y;
	SDL_QueryTexture(texture, &dummyu, &dummyi, &srect.w, &srect.h);
	if (width > 0 && height > 0)
	{
		drect.w = (int)width;
		drect.h = (int)height;
	}
	else
	{
		drect.w = srect.w;
		drect.h = srect.h;
	}

	SDL_RenderCopyEx(mRenderer, texture, &srect, &drect, 0, NULL, SDL_FLIP_NONE);
}

void JSGFX::drawRect(double x, double y,double width, double height, unsigned char r, unsigned char g, unsigned char b, unsigned char a)
{
	SDL_SetRenderDrawColor(mRenderer, r * 255, g * 255, b * 255, a * 255);
	//	SDL_SetRenderDrawColor(mRenderer, 255,0,255,255);
	SDL_Rect rect;
	rect.x = (int)x;
	rect.y = (int)y;
	rect.w = (int)width;
	rect.h = (int)height;
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
