
#include "stdafx.h"

#ifndef BUILD_AS_STATIC_LIB

#ifndef MINIMAL_ENGINE
#pragma comment(lib, "SDL2.lib")
#pragma comment(lib, "SDL2_image.lib")
#pragma comment(lib, "SDL2main.lib")
#pragma comment(lib, "vld.lib")
#endif


namespace $MainClassNamespace
{
	void main();
};

int main()
{
	$MainClassNamespace::main();
}
#endif

