import {T2CNamespace} from "./T2CNamespace"

export class T2CFile{
    public name : string;
	public tsName : string;
	public cppName : string;
	public bareName : string;
	public hName : string;
	public processed    : boolean = false;
	public processedAsDep : boolean = false;
	public namespaces : T2CNamespace[] = [];
	public imports : string[] = [];

	constructor(tsName : string){
		this.tsName = tsName;
        this.name = tsName.substr(0, tsName.lastIndexOf("."));
		this.bareName = this.name.substr(tsName.lastIndexOf("/")+1);
		this.cppName = tsName.substr(0, tsName.lastIndexOf(".")) + ".cpp";
		this.hName = tsName.substr(0, tsName.lastIndexOf(".")) + ".h";
		this.namespaces.push(new T2CNamespace());
	}


	public printState(){
		console.log("namespaces : " + this.namespaces.length);
		this.namespaces.forEach(ns => {
			ns.printState();
		});
	}
}
