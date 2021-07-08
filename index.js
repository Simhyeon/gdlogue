import Ajv from "ajv";
import fs from "fs";
const schema = {
	type: "object",
	properties: {
		speakers: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					name: { type: "string" }
				},
				required: ["id", "name"]
			}
		},
		dialogues: {
			type: "array",
			items: {
				type: "object",
				properties: {
					id: { type: "string" },
					content: {
						type: "array",
						items: {
							type: "object",
							properties: {
								type: { type: "string" },
								speaker: { type: "string" },
								text: { type: "string" },
								selection: {
									type: "array",
									optional: "true",
									itmes: {
										type: "object",
										properties: {
											text: { type: "string" },
											redirect: { type: "string" }
										},
										required: ["text", "redirect"]
									}
								}
							},
							required: ["type", "speaker", "text"]
						}
					}
				},
				required: ["id", "content"]
			}
		}
	},
	required: ["speakers", "dialogues"],
	additionalProperties: false
}

class Gdlogue {
	constructor(json) { 
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
