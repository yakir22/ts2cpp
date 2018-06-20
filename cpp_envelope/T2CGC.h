#pragma once
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

#include <memory>
#include "my_intrusive_ptr.h"
#include <SDL_assert.h>
#define Assert SDL_assert

#define RefCountClass() int mRefCount = 0;\
public:\
 void AddRef(){mRefCount++;}\
 void ReleaseRef() {Assert(mRefCount > 0 ); mRefCount--;if (mRefCount == 0)delete this;}\
 int GetRefCount(){return mRefCount;}\
 private: 

#define RefCountClassImpl(cls)\
typedef boost::my_intrusive_ptr<class cls> cls ## Ref;\
inline void my_intrusive_ptr_add_ref(cls* res) { res->AddRef(); }\
inline void my_intrusive_ptr_release(cls* res) { res->ReleaseRef(); }


enum class MemorySpace
{
	None, // TODO :: naming. since it's not really none but Heap is not a good option either
	Stack,
	Global,
	Static
};

template <typename T, MemorySpace space>
class space_mark_intrusive_ptr : public boost::my_intrusive_ptr<T>
{
public:
	space_mark_intrusive_ptr() :
		my_intrusive_ptr<T>()
	{
	}

	space_mark_intrusive_ptr(T*obj) :
		my_intrusive_ptr<T>(obj)
	{
		if (get())
			get()->mMemorySpace = space;
	}

	~space_mark_intrusive_ptr()
	{
		if (get())
			get()->mMemorySpace = MemorySpace::None;
	}
};

template <typename T>
using root_mark_intrusive_ptr = boost::my_intrusive_ptr<T>;


template <typename T>
using stack_mark_intrusive_ptr = space_mark_intrusive_ptr<T, MemorySpace::Stack>;

template <typename T>
using global_mark_intrusive_ptr = space_mark_intrusive_ptr<T, MemorySpace::Global>;

template <typename T>
using static_mark_intrusive_ptr = space_mark_intrusive_ptr<T, MemorySpace::Static>;


class GCObject;
class GC
{
public:
	std::set<GCObject*>					mObjects;
	std::set<GCObject*>					mRootObjects;
	std::set<GCObject*>					mObjectsToErase;
	std::map<GCObject*, unsigned int>	mPinnedObjectsMap;
public:
	static GC&	Get();
	void		Collect(int debugLevel);
	void		AddRootObject(GCObject* root);
	void		RemoveRootObject(GCObject* root);
	void		RemoveAllObjects(GCObject* o);
	void		PinObject(GCObject* o);
	int			UnpinObject(GCObject* o);
	void		AddObject(GCObject* o);
	void		RemoveObject(GCObject* o);
	int			LiveObjectsCount();
private:
	void		Sweep(int debugLevel);
};



class GCObject 
{
	//RefCountClass();
public:
	int			mRefCount = 0;
	MemorySpace mMemorySpace = MemorySpace::None;
	void AddRef() 
	{ 
		mRefCount++; 
	}
	void ReleaseRef() 
	{ 
		//Assert(mRefCount > 0); 
		if (mRefCount == 0) // deleted by the GC.Collect() loop
			return;
		mRefCount--; 
		if (mRefCount == 0)
		{
			GC::Get().RemoveAllObjects(this);
			delete this;
		}
	}
	int GetRefCount() 
	{ 
		return mRefCount; 
	}
public:
	bool mMarked;
public:
	GCObject();
	GCObject(GCObject const&);
	virtual ~GCObject();
	void Mark();
	virtual void MarkChildren() = 0;
};

