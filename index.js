import Ajv from "ajv";
import fs from "fs";

class Gdlogue {
	constructor(json) { 
		let schema = JSON.parse(fs.readFileSync('schema.json'));
		console.log(JSON.stringify(schema, null, 4));
		this.ajv = new Ajv();
		this.validater = this.ajv.compile(schema)
		this.json = json;
	}

	validate() {
		if (!this.validater(this.json)) {
			console.log(this.validater.errors);
			return false;
		} else {
			return true;
		}
	}

	print() {
		console.log(JSON.stringify(this.json));
	}

	pretty_print(){
		console.log(JSON.stringify(this.json, null, 4));
	}

	// TODO 
	treefy(){

	}

	// TODO
	visualize(){

	}
}

class GdTree {
	constructor(top_nodes) {
		this.top_nodes = top_nodes;
	}
}

class GdNode {
	constructor(nodeObject) {
		this.id = nodeObject.id;
		this.content = nodeObject.content;
		this.redirect = nodeObject.redirect;
	}
}

function main() {
	const file_path = process.argv[2];
	const sub_command = process.argv[3];
	if (sub_command == "" || sub_command == null) {
		console.log("Aborting because no subcommand was given.")
		return;
	}
	let json = JSON.parse(fs.readFileSync(file_path));
	let gdlogue = new Gdlogue(json);

	if (!gdlogue.validate()) {
		console.log("Failed to validate json file.");
		return;
	}

	switch (sub_command) {
		case 'print':
			gdlogue.pretty_print();
			break;
		case 'data':
			gdlogue.print();
			break;
		
		default:
			console.log(`"${sub_command}" is not viable sub command, aborting...`);
			return;
	}
}

main();
