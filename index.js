import Ajv from "ajv";
import fs from "fs";

class Gdlogue {
	constructor(json) { 
		let schema = JSON.parse(fs.readFileSync('schema.json'));
		console.log(JSON.stringify(schema, null, 4));
		this.ajv = new Ajv();
		this.validater = this.ajv.compile(schema)
		this.content = json;
	}

	format_validate() {
		if (!this.validater(this.content)) {
			console.log(this.validater.errors);
			return false;
		} else {
			return true;
		}
	}

	content_validate() {
		this.error_list = [];
		this.warning_list = [];
		this.content.forEach((node) => {
			switch (node.type) {
				case 'text':
					if (node.text = '') {
						this.warning_list.push('<Warning> : ' + node.id + '\'s text is empty.');
					}
					if (node.speaker = '') {
						this.warning_list.push('<Warning> : ' + node.id + '\'s speaker is empty.');
					}
					break;
				case 'selection':
					if (node.diversion.length == 0 ) {
						this.error_list.push('<Error> : ' + node.id + '\'s diversion array is empty. This node\' type is selection thus this is not allowed.');
					}
					node.diversion.forEach((div) => {
						if (div.text = '') {
							this.warning_list.push('<Warning> : ' + node.id + '\'s diversion, ' + div.id + '\' has empty text although node type is selection.');
						}
					});
					break;
				case 'branch':
					if (node.diversion.length == 0 ) {
						this.error_list.push('<Error> : ' + node.id + '\'s diversion array is empty. This node\' type is branch thus this is not allowed.');
					}
					let empty_qual_count = 0;
					node.diversion.forEach((div) => {
						if (div.qual = '') { empty_qual_count++; }
						// To only print once.
						// There is no break statement in js foreach
						if (empty_qual_count == 1){
							this.warning_list.push('<Warning> : ' + node.id + '\'s diversion include multiple empty qualifications although node type is branch. Multiple empty(default) node might not work as intended.');
							return;
						}
					});
					break;
				
				default:
					break;
			}
		});
	}

	print() {
		console.log(JSON.stringify(this.content));
	}

	pretty_print(){
		console.log(JSON.stringify(this.content, null, 4));
	}

	dotify(){
		// Start
		let dotScript = 'digraph {\n';
		let globalAttributes = 'node[shape="record"]\n';

		dotScript += globalAttributes;
		this.content.forEach((node) => {
			// Continue if goto is null (Null goto means invalid or placeholder)
			if (node.goto == null || node.goto.toLowerCase() == "null") {
				return
			}
			// Set node attributes
			let attr = '';
			if (node.type == 'text' || node.type == 'selection') {
				attr += `Speaker : ${node.speaker}|`;
			}
			attr += `Type : ${node.type}|`
			dotScript += `${node.id} [label ${attr}]\n`;

			// Set node edges TODO : Check if this is valid syntax
			let edges = '';

			if (node.type == 'text') {
				edges += `${node.id} -> ${node.goto}\n`;
			} else {
				node.diversion.forEach((div) => {
					edges += `${node.id} -> ${div.goto}\n`;
				});
			}
			dotScript += edges;
		});

		// End
		dotScript += '}';
		console.log(dotScript);
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

	if (!gdlogue.format_validate()) {
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
		case 'dotify':
			gdlogue.dotify();
			break;
		
		default:
			console.log(`"${sub_command}" is not viable sub command`);
			console.log("Use either <print> or <data>")
			return;
	}
}

main();
