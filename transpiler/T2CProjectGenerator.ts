import {T2CRoot} from "./T2CRoot"
import {T2CFile} from "./T2CFile"
import * as fs from "fs";
import * as path from "path"
import { T2CNamespace } from "./T2CNamespace";

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
        envelopeBase = path.normalize(envelopeBase).replace("\\out","");

        let templateProjectBase = __dirname + "/../templates/vcxproj/"; 
        templateProjectBase = path.normalize(templateProjectBase).replace("\\out","");
        
        let projectData  = fs.readFileSync(templateProjectBase + "TemplateProject.vcxproj","utf8");

        let replacePattern = "<ClCompile Include=\"Main.cpp\" />";
        let projectFiles =  replacePattern + "\n";

        let filesToCopy : string[] = ["ts2cpp_envelope","Framework"];
        let ext : string[] = [".h",".cpp"]
        filesToCopy.forEach(file =>{
            projectFiles += "<ClCompile Include=\""+file+".cpp\" />"
            ext.forEach(ext =>{
                try {
                    // TODO :: check why copyFile doesn't work
                    //fs.copyFileSync(envelopeBase + "ts2cpp_envelope.cpp",basePath + "/ts2cpp_envelope.cpp");
                    let data  = fs.readFileSync(envelopeBase + file + ext,"utf8");
                    fs.writeFileSync(basePath + "/"+file+ ext,data);
                } 
                catch (error) {
                }
            })
        });



        let mainClassNamespace : T2CNamespace= null;
        let mainClassFile : T2CFile = null;
        root.getFiles().forEach(file =>{
            if ( file.name.indexOf("BindingDecorators") != -1 )
                return;
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

        let mainFileData  = fs.readFileSync(templateProjectBase + "Main.cpp","utf8");

        if ( mainClassNamespace != null )
        {
            replacePattern = "$MainClassNamespace";
            // TODO :: implement replace all util
            mainFileData = mainFileData.replace(replacePattern,mainClassNamespace.nameClean(mainClassFile)).replace(replacePattern,mainClassNamespace.nameClean(mainClassFile));
        }

        fs.writeFileSync(basePath + "/Main.cpp",mainFileData);

    }

}