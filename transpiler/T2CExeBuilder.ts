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

import {readFileSync, unlink,unlinkSync, writeFileSync} from "fs";
import {T2CRoot} from "./T2CRoot"

export class T2CExeBuilder{
    static build(root : T2CRoot){
        let eb = new T2CExeBuilder();
        eb.buildFiles([root.getFiles()[0].cppName],"Point.exe",true);
    }
    private buildFiles(files : string[],exeName : string,debugBuild : boolean) : string{
        let compileBatch : string = "";
        // TODO :: hardcoded values
    
        compileBatch += "CALL \"D:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\Common7\\Tools\\VsDevCmd.bat\"\n";
        compileBatch += "d:\n";
        compileBatch += "cd \"D:\\1Dev\\SlateScienceV2\\SlateMathV3\\TestScripts\"\n";
        compileBatch += "cl.exe /W3 /EHsc -I\"D:\\1Dev\\SlateScienceV2\\SlateMathV3\\js2cpp\" ";
        if ( debugBuild )
        { 
            compileBatch += " /Od /MDd /D \"WIN32\" /D \"_DEBUG\" /D \"_CONSOLE\" ";
        }
        files.forEach(file => {
            try {
                unlinkSync(file.substr(0, file.lastIndexOf(".")) + ".exe",);
                unlinkSync(file.substr(0, file.lastIndexOf(".")) + ".obj",);
            } catch (e) {}
            compileBatch += " " + file;

        });
        compileBatch += " \"D:\\1Dev\\SlateScienceV2\\SlateMathV3\\js2cpp\\js2cpp_engine.cpp\"";
        compileBatch += " /link /out:" + exeName;
    
        if (debugBuild)
        {
            compileBatch += " SDL2_image.lib SDL2.lib SDL2Main.lib /LIBPATH:\"D:\\1Dev\\SlateScienceV2\\SlateMathV3\\js2cpp\\GraphicsEngine\\SDL2-2.0.8\\lib\\x86\" /PDB:\""+ exeName.substr(0, exeName.lastIndexOf(".")) + ".pdb" +"\"";
        }

        try {
            unlinkSync(exeName);
        } catch (e) {}
        writeFileSync("compile.bat",compileBatch);
    
    //    consoleOut = Framework.OS.Exec("compile.bat");
        return "";//Framework.FS.FileExist(exeName);
    
    }

}