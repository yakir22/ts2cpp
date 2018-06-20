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

import {T2CRoot} from "./T2CRoot"
import {T2CFile} from "./T2CFile"
import * as fs from "fs";
import * as path from "path"
import { T2CNamespace } from "./T2CNamespace";
import * as child from "child_process";
import { T2CUtils } from "./T2CUtils";

export class T2CProjectGenerator
{
    static createProject(type : string,name : string,basePath : string,root : T2CRoot)
    {
        let This = new T2CProjectGenerator();
        switch (type)
        {
            case "vcxproj":
                This.createVCXProject(name,basePath,root);
                break;
        }
    }

    private createVCXProject(name : string,basePath : string,root : T2CRoot)
    {
        // TODO :: better path for relative directories
        let envelopeBase = __dirname + "/../cpp_envelope/"; 
        envelopeBase = path.normalize(envelopeBase).replace("\\out","").replace("/out","");

        let templateProjectBase = __dirname + "/../templates/vcxproj/"; 
        templateProjectBase = path.normalize(templateProjectBase).replace("\\out","").replace("/out","");
        
        let projectData  = fs.readFileSync(templateProjectBase + "TemplateProject.vcxproj","utf8");

        let filesForGPlusPlus = [];
        let replacePattern = "<ClCompile Include=\"Main.cpp\" />";
        let projectFiles =  replacePattern + "\n";

        let filesToLink : string[] = ["ts2cpp_envelope","Framework","gfx","stdafx","T2CGC","my_intrusive_ptr"];
        let filesToAddToProject : string[] = ["ts2cpp_envelope","Framework","gfx","T2CGC"];
        let ext : string[] = [".h",".cpp"]
        let directoriesToLink : string[] = ["SDL2","vld","boost_mini"];

        let cd = child.execSync(T2CUtils.isWindows()?"cd":"pwd",{"encoding" : "utf8"}).trim();
        
        filesToAddToProject.forEach(file =>{
            projectFiles += "<ClCompile Include=\""+file+".cpp\" />"
            filesForGPlusPlus.push(file + ".cpp");
        });
        
        filesToLink.forEach(file =>{
            ext.forEach(ext =>{
                try {
                    this.linkFiles(cd, basePath, file, ext, envelopeBase);
                } 
                catch (error) {
                }
            })
        });

        directoriesToLink.forEach(file =>{
            try {
                this.linkFiles(cd, basePath, file, "", envelopeBase);
            } 
            catch (error) {
            }
        });


        let mainClassNamespace : T2CNamespace= null;
        let mainClassFile : T2CFile = null;
        root.getFiles().forEach(file =>{
            if ( file.name.indexOf("BindingDecorators") != -1 )
                return;
            filesForGPlusPlus.push(file.bareName + ".cpp");
            projectFiles += "<ClCompile Include=\"" + file.bareName + ".cpp\" />\n";
            if ( file.bareName == name ){
                file.namespaces.forEach(ns =>{
                    ns.functions.forEach(func => {
                        if ( func.name == "main" ){
                            mainClassNamespace = ns;
                            mainClassFile = file;
                        }
                    })
                })
            }
        });

        projectData = projectData.replace(replacePattern,projectFiles);

        let oldProjectFileContent = "";
        try {
            oldProjectFileContent = fs.readFileSync(basePath + "/" + name + ".vcxproj","utf8");
        } catch (error) {
            
        }
        if ( projectData != oldProjectFileContent )
        {
            fs.writeFileSync(basePath + "/" + name + ".vcxproj",projectData);
        }

        filesForGPlusPlus.push("Main.cpp");
        let mainFileData  = fs.readFileSync(templateProjectBase + "Main.cpp","utf8");

        if ( mainClassNamespace != null )
        {
            replacePattern = "$MainClassNamespace";
            // TODO :: implement replace all util
            mainFileData = mainFileData.replace(replacePattern,mainClassNamespace.nameClean(mainClassFile)).replace(replacePattern,mainClassNamespace.nameClean(mainClassFile));
        }

        fs.writeFileSync(basePath + "/Main.cpp",mainFileData);


        if ( !T2CUtils.isWindows() )
        {
            let command = "g++ -std=c++11 -I$BOOST_DIR/include -o " + name +".out ";
            filesForGPlusPlus.forEach(file => {
                command += " " + file;
            }); 
            let buildFilename = basePath +"/build" + name + ".sh"; 
            fs.writeFileSync( buildFilename,command);
            child.execSync("chmod 777 " + buildFilename);
        }
    }


    private linkFiles(cd: string, basePath: string, file: string, ext: string, envelopeBase: string) {
        let destFile = path.normalize(cd + "/" + basePath + "/" + file + ext);
        let srcFile = path.normalize(envelopeBase + file + ext);
        if (T2CUtils.isWindows()) {
            if ( ext == "" ) // linking directory. TODO :: refactor and support osx
                child.execSync("mklink /D " + destFile + " " + srcFile);
            else
                child.execSync("mklink " + destFile + " " + srcFile);
        }
        else {
            child.execSync("ln -s " + srcFile + " " + destFile);
        }
    }
}