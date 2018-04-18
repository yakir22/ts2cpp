import {T2CFile} from "./T2CFile"
import {T2CParser} from "./T2CParser"
import {T2CCodeBuilder} from "./T2CCodeBuilder"
import {T2CExeBuilder} from "./T2CExeBuilder"

export class T2CRoot{

    private mFiles : T2CFile[] = [];
	public forwardDeclarations : string[] = [] 
	private mCustomBuilder : T2CCodeBuilder = null;
	constructor(customBuilder : T2CCodeBuilder = null){
		this.mCustomBuilder = customBuilder;
	}

	public processFile(filename : string){
		let file = this.getFile(filename);
		this.processFileInternal(file);
	}

	private processFileInternal(file : T2CFile ){
		console.log("processing " + file.name);
		file.processed = true;
		if ( T2CParser.parseFile(file) ){
			this.mFiles.push(file);
			file.imports.forEach(impt => {
				let importedFile = this.getFile(impt);
				if ( ! importedFile.processed )
					this.processFileInternal(importedFile);
			});
		}
	}

	public getFiles(): T2CFile[]{
		return this.mFiles;
	}


	public getFile(name : string) : T2CFile{
		let ret = null;
		this.mFiles.forEach(file => {
			if ( file.name == name )
				ret = file; 
		});
		if ( ret == null )
			ret = new T2CFile(name);
		return ret;
	}

	public createCppCode(outDir : string = "./"){
		T2CCodeBuilder.createCode(this,outDir,this.mCustomBuilder);
    }
    
    public build(){
        T2CExeBuilder.build(this);
    }
}