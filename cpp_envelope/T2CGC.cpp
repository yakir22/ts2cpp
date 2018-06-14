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
#include "T2CGC.h"


GC& GC::Get()
{
	static GC _gc;
	return _gc;
}



GCObject::GCObject() :
	mMarked(false) 
{
	GC::Get().AddObject(this);
}

GCObject::GCObject(GCObject const&) :
	mMarked(false) 
{
	GC::Get().AddObject(this);
}

GCObject::~GCObject() 
{
}

void GCObject::Mark() 
{
	if (!mMarked) 
	{
		mMarked = true;
		MarkChildren();
	}
}

void GC::Collect(int debugLevel)
{
	for ( const auto & it : mRootObjects)
	{
		it->Mark();
	}
	for (const auto & it : mPinnedObjectsMap)
	{
		it.first->Mark();
	}

	if (debugLevel)
	{
		std::cout << "----After Mark----" << mRootObjects.size() << std::endl;
		std::cout << "Root Objects: " << mRootObjects.size() << std::endl;
		std::cout << "Pinned Objects: " << mPinnedObjectsMap.size() << std::endl;
		std::cout << "GC Objects: " << mObjects.size() << std::endl;
	}
	Sweep(debugLevel);

	if (debugLevel)
	{
		std::cout << "----After Sweep----" << mRootObjects.size() << std::endl;
		std::cout << "Root Objects: " << mRootObjects.size() << std::endl;
		std::cout << "Pinned Objects: " << mPinnedObjectsMap.size() << std::endl;
		std::cout << "GC Objects: " << mObjects.size() << std::endl;
	}
}

void GC::AddRootObject(GCObject* root) 
{
	mRootObjects.insert(root);
}

void GC::RemoveRootObject(GCObject* root) 
{
	mRootObjects.erase(root);
}

void GC::PinObject(GCObject* o) 
{
	const auto &it = mPinnedObjectsMap.find(o);
	if (it == mPinnedObjectsMap.end()) 
	{
		mPinnedObjectsMap.insert(std::make_pair(o, 1));
	}
	else 
	{
		(*it).second++;
	}
}

int GC::UnpinObject(GCObject* o) 
{
	const auto &it = mPinnedObjectsMap.find(o);
	if(it == mPinnedObjectsMap.end())
	{
		return 0;
	}
	int pinCount = --((*it).second);
	if (pinCount == 0)
	{
		mPinnedObjectsMap.erase(it);
	}
	return pinCount;
}

void GC::AddObject(GCObject* o) 
{
	mObjects.insert(o);
}

void GC::RemoveObject(GCObject* o) 
{
	mObjects.erase(o);
}


void GC::RemoveAllObjects(GCObject* o)
{
	while (UnpinObject(o) > 0)
		;
	RemoveObject(o);
	mObjectsToErase.erase(o);
}



void GC::Sweep(int debugLevel) 
{
	unsigned int live = 0;
	unsigned int dead = 0;
	unsigned int total = 0;
	for (const auto &it : mObjects)
	{
		GCObject* p = it;
		total++;
		if (p->mMarked || p->mMemorySpace != MemorySpace::None) 
		{
			p->mMarked = false;
			++live;
		}
		else 
		{
			mObjectsToErase.insert(p);
		}
	}
	dead = mObjectsToErase.size();

	while ( ! mObjectsToErase.empty() )
	{
		auto it = mObjectsToErase.begin();
		GCObject* p = *it;
		mObjects.erase(p);
		mObjectsToErase.erase(p);
		p->ReleaseRef();
	}
}

int GC::LiveObjectsCount() 
{
	return mObjects.size();
}
