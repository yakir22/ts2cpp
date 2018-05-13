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

#include "Framework.h"



FrameworkImpl Framework;

#ifdef WIN32
#	define popen _popen
#	define pclose _pclose
#endif



std::string FrameworkImpl::PathUtils::RemoveExtension(const std::string &path)
{
	return path.substr(0, path.find_last_of("."));
}


std::string FrameworkImpl::PathUtils::ReplaceExtension(const std::string &filename, const std::string &ext)
{
	return RemoveExtension(filename) + ext;
}

std::string FrameworkImpl::OperatingSystem::Exec(const std::string &command)
{
	std::array<char, 128> buffer;
	std::string result;
	std::shared_ptr<FILE> pipe(popen(command.c_str(), "r"), pclose);
	if (!pipe) throw std::runtime_error("popen() failed!");
	while (!feof(pipe.get())) {
		if (fgets(buffer.data(), 128, pipe.get()) != nullptr)
			result += buffer.data();
	}
	return result;
}

std::string FrameworkImpl::FileSystem::ReadFile(const std::string &filename)
{
	std::ifstream t(filename);
	std::string str((std::istreambuf_iterator<char>(t)),
		std::istreambuf_iterator<char>());
	return str;
}


void FrameworkImpl::FileSystem::WriteFile(const std::string & filename,const std::string &data)
{
	std::ofstream out(filename);
	out << data;
	out.close();
}

void FrameworkImpl::FileSystem::DeleteFile(const std::string & filename)
{
	std::remove(filename.c_str());
}

bool FrameworkImpl::FileSystem::FileExist(const std::string & filename)
{
	std::ifstream f(filename.c_str());
	return f.good();
}

std::vector<std::string> FrameworkImpl::StringUtils::Split(const std::string &str, const std::string &delim)
{
	size_t start, end = 0;
	std::vector<std::string> parts;
	while (end < str.size()) 
	{
		start = end;
		while (start < str.size() && (delim.find(str[start]) != std::string::npos)) {
			start++;  // skip initial whitespace
		}
		end = start;
		while (end < str.size() && (delim.find(str[end]) == std::string::npos)) {
			end++; // skip to end of word
		}
		if (end - start != 0) {  // just ignore zero-length strings.
			parts.push_back(std::string(str, start, end - start));
		}
	}
	return parts;
}

void  FrameworkImpl::StringUtils::StripComments(std::string & input)
{
	for (int i = 0; i < (int)input.length() - 1; i++)
	{
		if (input[i] == '\'' || input[i] == '\"')
		{
			char start = input[i];
			for (int j = i; j < (int)input.length(); j++)
			{
				if (input[++i] == start)
					break;
			}
		}

		if (input[i] == '/' && input[i + 1] == '/')
		{
			for (int j = i; j < (int)input.length(); j++)
			{
				if (input[i] == '\n')
					break;
				input[i++] = ' ';
			}
		}
		if (input[i] == '/' && input[i + 1] == '*')
		{
			for (int j = i; j < (int)input.length() - 1; j++)
			{
				if (input[i] == '*' && input[i + 1] == '/')
				{
					input[i] = ' ';
					input[i + 1] = ' ';
					break;
				}
				input[i++] = ' ';
			}
		}
	}
}

std::string FrameworkImpl::StringUtils::RemoveChars(const std::string& str,const std::string& chars)
{
	std::string newStr = str;
	for ( int i = 0 ; i < (int)chars.length() ; i++ )
	{
		newStr.erase(std::remove(newStr.begin(), newStr.end(), chars[i]), newStr.end());
	}
	return newStr;
}

std::string FrameworkImpl::StringUtils::LTrim(const std::string &s1)
{
	std::string s = s1;
	s.erase(s.begin(), std::find_if(s.begin(), s.end(), std::not1(std::ptr_fun<int, int>(std::isspace))));
	return s;
}


std::string FrameworkImpl::StringUtils::RTrim(const std::string &s1)
{
	std::string s = s1;
	s.erase(std::find_if(s.rbegin(), s.rend(), std::not1(std::ptr_fun<int, int>(std::isspace))).base(), s.end());
	return s;
}

std::string FrameworkImpl::StringUtils::Trim(const std::string &s)
{
	return LTrim(RTrim(s));
}

bool FrameworkImpl::StringUtils::BeginWith(const std::string &s, const std::string & with)
{
	return s.compare(0, with.length(), with) == 0;
}

bool FrameworkImpl::StringUtils::Contains(const std::string &s, const std::string & what)
{
	return s.find(what) != std::string::npos;
}
