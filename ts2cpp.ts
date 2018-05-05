import {T2CRoot} from "./transpiler/T2CRoot"
import {T2CProjectGenerator} from "./transpiler/T2CProjectGenerator"


function main(){
	let root : T2CRoot = new T2CRoot();
	const fileNames = process.argv.slice(2);
	root.processFile(fileNames[0]);
	let name = fileNames[0].substr(fileNames[0].lastIndexOf("/") + 1).replace(".ts","");
	let dir = fileNames[0].substr(0,fileNames[0].lastIndexOf("/") + 1);
	root.createCppCode("./CppFiles/" + name + "/");
	T2CProjectGenerator.createProject("vcxproj", name,"./CppFiles/" + name + "/" +dir + "/",root);
}

main();







