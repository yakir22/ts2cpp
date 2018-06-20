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

#pragma once
#ifndef MINIMAL_ENGINE
#include "ts2cpp_envelope.h"

class JSGFX
{
public:
	void init();
	void beginDraw();
	void drawRect(double x, double y, double width, double height, double r, double g, double b, double a);
	void drawImage(double x, double y, const JSString &resource, double width = 0, double height = 0);
	void drawText(double x, double y, const JSString &text, double size, double r, double g, double b, double a);
	void endDraw();
	void terminate();
	void loadTexture(const JSString &path);
	double getWidth() { return 1024; }
	double getHeight() { return 768; }
	bool quiting() { return mQuiting; }
	void setResourcesPath(const JSString &path);
	void drawFPS();
	void update();
protected:
	void processEvents();
protected:
	struct SDL_Renderer* mRenderer = NULL;
	struct SDL_Window* mWindow = NULL;
	bool mQuiting = false;
	JSString mResourcePath;
	std::map<std::string, struct SDL_Texture*> mResources;
	std::map<std::string, struct SDL_Texture*> mTexts;
	std::map<int, struct _TTF_Font*> mFonts;
};

extern JSGFX *Graphics;
#endif