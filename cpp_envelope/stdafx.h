#pragma once
#ifdef WIN32
#	include "vld.h"
#	define	NOMINMAX
#	include <windows.h>
#endif

#pragma warning(disable : 4786)
#include <set>
#include <map>
#include <stdexcept>
#include <limits>
#include <string>
#include <iostream>
#include <vector>
#include <iostream>
#include <cmath>
#include <memory>
#include <initializer_list>
#ifdef WIN32
#include <experimental/filesystem>
#endif
