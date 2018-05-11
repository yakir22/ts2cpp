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


