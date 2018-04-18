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