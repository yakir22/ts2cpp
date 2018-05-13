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
#include <iostream>
#include <stdlib.h>  
#include <errno.h>  
#include <string>
#include <fstream>
#include <streambuf>
#include <functional> 
#include <iomanip>      // std::setfill, std::setw
#include <cstdio>
#include <memory>
#include <stdexcept>
#include <array>
#include <vector>
#include <map>
#include <list>
#include <cctype>
#include <assert.h>
#include <algorithm>
#include <stdio.h>

#include <boost/algorithm/string/predicate.hpp>
#include <boost/algorithm/string.hpp>
#include <boost/tokenizer.hpp>


#ifdef WIN32
#include <tchar.h>
#include <direct.h>  
#else

#endif


class FrameworkImpl
{
public:
	class FileSystem
	{
	public:
		std::string ReadFile(const std::string &filename);
		void WriteFile(const std::string & filename, const std::string &data);
		void DeleteFile(const std::string & filename);
		bool FileExist(const std::string & filename);
	};

	class OperatingSystem
	{
	public:
		std::string Exec(const std::string &command);
	};



	class PathUtils
	{
	public:
		std::string RemoveExtension(const std::string &path);
		std::string ReplaceExtension(const std::string &filename, const std::string &ext);
	};

	class StringUtils
	{
	public:
		std::string Trim(const std::string &s);
		std::string RTrim(const std::string &s);
		std::string LTrim(const std::string &s);
		bool Contains(const std::string &s, const std::string & what);
		bool BeginWith(const std::string &s, const std::string & with);
		std::vector<std::string> Split(const std::string &str, const std::string &delim);
		void StripComments(std::string &str);
		std::string RemoveChars(const std::string& str, const std::string& chars);
	};

public:
	PathUtils		PathUtils;
	OperatingSystem	OS;
	FileSystem		FS;
	StringUtils		StringUtils;
};

extern FrameworkImpl Framework;


