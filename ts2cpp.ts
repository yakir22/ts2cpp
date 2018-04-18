import {T2CRoot} from "./transpiler/T2CRoot"

function main(){
	let root : T2CRoot = new T2CRoot();
	const fileNames = process.argv.slice(2);
	root.processFile(fileNames[0]);
	root.createCppCode();
	root.build();
}

main();







