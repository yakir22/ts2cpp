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

        let filesToLink : string[] = ["ts2cpp_envelope","Framework"];
        let ext : string[] = [".h",".cpp"]

        let cd = child.execSync(T2CUtils.isWindows()?"cd":"pwd",{"encoding" : "utf8"}).trim();
        filesToLink.forEach(file =>{
            projectFiles += "<ClCompile Include=\""+file+".cpp\" />"
            filesForGPlusPlus.push(file + ".cpp");
            ext.forEach(ext =>{
                try {
                    let destFile = path.normalize( cd + "/" + basePath + "/"+file+ ext);
                    let srcFile = path.normalize( envelopeBase + file + ext);

                    if ( T2CUtils.isWindows() ){
                        child.execSync("mklink " + destFile +" " + srcFile);
                    }
                    else{
                        child.execSync("ln -s " + srcFile + " " + destFile);
                    }
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

}