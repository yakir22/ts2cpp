#pragma once
#include <string>
#include <iostream>
#include <vector>
#include <iostream>
#include <cmath>
#include <initializer_list>
#ifdef WIN32
#include <experimental/filesystem>
#endif
#include <map>


//#ifndef WIN32 //must happen before including sdl ( TODO :: move to own file that doesn't include sdl )
namespace Testing
{
    extern void main();
    inline void RunMain()
    {
        main();
    }
}
//#endif

struct JSConsole
{
	template<typename T>
	void log(const T &v)
	{
		std::cout << v << std::endl;
	}
};
extern JSConsole *console;

struct JSMath 
{
	double random() // TODO :: create testing random that will sync with JS to match results
	{
		auto ret = (rand() % 1000) / 1000.0;
		return ret;
	}
	double abs(double x)
	{
        return std::abs(x);
	}
	double sqrt(double x)
	{
		return std::sqrt(x);
	}
	double pow(double x, double y)
	{
		return std::pow(x,y);
	}

};

extern JSMath *Math;

class JSString;
class JSObject
{
public:
	virtual const JSString toString();
};

class JSString : public std::string
{
public:
	template <class T>
	JSString operator + (T num) {
        auto s = std::to_string(num);
		auto ret = *((std::string*)this) + ToJSNumber(s);
		return ret;
	}

	JSString operator + (const JSString &other) {
		auto ret = *((std::string*)this) + *((std::string*)&other);
		return ret;
	}

	JSString operator + (JSObject *p) {
		auto ret = *((std::string*)this) + p->toString();
		return ret;
	}
	JSString(const std::string &other)
		:std::string(other)
	{
	}
	JSString()
		:std::string("")
	{
	}
	JSString(const char*s)
		:std::string(s)
	{
	}
	JSString* operator->() {
		return this;
	}

	std::string charAt(int index ){
		return  std::string(1, c_str()[index]);
	}
	int length() {
		return (int)size();
	}

public:
	static std::string ToJSNumber(std::string &str)
	{
		if (str.find(".") == std::string::npos)
			return str;
		for (std::string::size_type s = str.length() - 1; s > 0; --s)
		{
			if (str[s] == '0' ) 
				str.erase(s, 1);
			else if (str[s] == '.')
			{
				str.erase(s, 1);
				break;
			}
			else 
				break;
		}
		return str;
	}
};

template <class T>
JSString operator+(T i, const JSString& a)
{
	return JSString::ToJSNumber(std::to_string(i)) + a.c_str();
};


inline
const JSString JSObject::toString()
{
	return JSString("Stam");
}

//#define push push_back // TODO :: do it only if type is array
//#define length size() // TODO :: do it only if type is array

template<class T>
class JSArray //: public std::vector<T>
{
	std::shared_ptr<std::vector<T> > mInternalArray;
public:
	JSArray(const std::initializer_list<T>& il)
//		: std::vector<T>(il)
	{
		mInternalArray = std::make_shared<std::vector<T> >(il);
	}
	JSArray() 
	{
		mInternalArray = std::make_shared<std::vector<T> >();
	}

/*
	JSArray(JSArray<T> & other)
	{ 
		mInternalArray = other->mInternalArray; 
	}*/

	void splice(int start, int deleteCount){
		// TODO :: assert values and support negative start
		mInternalArray->erase(mInternalArray->begin() + start, mInternalArray->begin() + start + deleteCount);
	}

	JSArray<T>& reverse(){
		std::reverse(std::begin(*mInternalArray), std::end(*mInternalArray));
		return *this;
	}
	void push(T elm) {
		mInternalArray->push_back(elm);
	}
	int length() {
		return (int)mInternalArray->size();
	}

	void clear()
	{
		mInternalArray->clear();
	}
	JSArray* operator->() {
		return this;
	}

	T& operator[] (int index) {
		if ( index >= (int)mInternalArray->size() )
		{
			mInternalArray->resize(index + 1);
		}
		return (*mInternalArray)[index];
		//return std::vector<T>::operator[](index);
	}
};





class JSGFX
{
public:
	void init();
	void beginDraw();
	void drawRect(double x, double y, unsigned char r, unsigned char g, unsigned char b, unsigned char a);
	void drawImage(double x, double y, const JSString &resource);
	void endDraw();
	void terminate();
	void processEvents();
	void loadTexture(const JSString &path);
	double getWidth() { return 1024; }
	double getHeight() { return 768; }
	bool quiting() { return mQuiting; }
	void setResourcesPath(const JSString &path);
	void drawFPS();
	void update();
protected:
	struct SDL_Renderer* mRenderer = NULL;
	struct SDL_Window* mWindow = NULL;
	bool mQuiting = false;
	JSString mResourcePath;
	std::map<std::string, struct SDL_Texture*> mResources;
};

extern JSGFX *Graphics;


#define null nullptr
