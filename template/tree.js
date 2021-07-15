let svg = null;
let main = null;

function addToLevel(node) {
	// Find level
	let levelElem = document.querySelector('#level' + node.level);
	// Level deosn't exist
	if (levelElem == undefined) {
		levelElem = document.createElement('div');
		levelElem.setAttribute('class', 'level');
		levelElem.setAttribute('id', 'level' + node.level)
	}

	// Create new node
	levelElem.appendChild(newNode(node));

	// Add selection nodes if node type is selection
	if (node.type == 'selection') {
		let selectionElem = document.createElement('div');
		selectionElem.setAttribute('class', 'selection');
		node.selection.forEach( item => {
			selectionElem.appendChild(newSelNode(item))
		});
		levelElem.appendChild(selectionElem);
	}

	return levelElem;
}

function newNode(node) {
	let nodeElem = document.createElement('div');
	nodeElem.setAttribute('id', 'node' + node.id);
	nodeElem.setAttribute('class', 'node');
	nodeElem.setAttribute('data-next', node.next);

	let nodeSpeaker = document.createElement('div');
	nodeSpeaker.textContent = 'Speaker : ' + node.speaker;
	let nodeText = document.createElement('div');
	nodeText.textContent = 'Text : ' + node.text;
	let nodeType = document.createElement('div');
	nodeType.textContent = 'Type : ' + node.type;

	nodeElem.appendChild(nodeSpeaker);
	nodeElem.appendChild(nodeText);
	nodeElem.appendChild(nodeType);

	return nodeElem;
}

function newSelNode(selNode) {
	let nodeElem = document.createElement('div');
	nodeElem.setAttribute('class', 'selNode node');
	nodeElem.setAttribute('data-next', selNode.next);

	let nodeText = document.createElement('div');
	nodeText.textContent = 'Text : ' + selNode.text;

	nodeElem.appendChild(nodeText);

	return nodeElem;
}

function addLine(nodeElem) {
	let nextElem = document.querySelector('#node' + nodeElem.dataset.next);
	let { x,y } = nodeElem.getBoundingClientRect();
	let {x : nx,y : ny} = nextElem.getBoundingClientRect();

	let path = document.createElement('path');
	// Draw line(path) from nodeElem to nextElem
	path.setAttribute('d', `M ${x.toFixed(2)},${y.toFixed(2)} L ${nx.toFixed(2)},${ny.toFixed(2)}`);
	path.setAttribute('stroke', '#f00');
	path.setAttribute('stroke-width', '2');

	svg.appendChild(path);
}

function init() {

}

function debug() {
	main = newMain();
	svg = newSvg();

	for (let i = 0; i < data.dialogues.length; i++) {
		// New level
		main.appendChild(addToLevel(data.dialogues[i]));
	}

	let allNodes = document.querySelectorAll(".node");

	// Increate svg width and height
	let {width,height} = main.getBoundingClientRect();

	svg.setAttribute('viewBox', `0 0 ${parseInt(width)} ${parseInt(height)}`)
	//svg.style.width = parseInt(width) + 'px'
	//svg.style.height = parseInt(height) + 'px'

	//svg.setAttribute('width', parseInt(width));
	//svg.setAttribute('height', parseInt(height));

	// All lines to nodes
	allNodes.forEach(item => {
		if ( item.dataset.next != 'null' ) {
			console.log(item.dataset.next);
			addLine(item);
		}
	});
}

function newMain() {
	main = document.createElement("div");
	main.setAttribute('id', 'main');
	document.body.appendChild(main);

	return main;
}

function newSvg() {
	svg = document.createElement("svg");
	svg.setAttribute('id', 'svg');
	document.body.appendChild(svg);

	return svg;
}

const data = {
	"speakers": [
		{"id": "A",  "name": "A person's name"},
		{"id": "B",  "name": "B person's name"}
	],
	"dialogues": [
		{
			"level" : 1,
			"id": "1",
			"speaker": "A",
			"type": "selection",
			"text": "nodeText",
			"selection": [
				{"text":"1", "next": "2"},
				{"text":"2", "next": "3"}
			],
			"next": "2"
		},
		{
			"level" : 2,
			"id": "2",
			"speaker": "B",
			"type": "text",
			"text": "nodeText2",
			"selection": null,
			"next": null
		},
		{
			"level" : 2,
			"id": "3",
			"speaker": "B",
			"type": "text",
			"text": "nodeText2",
			"selection": null,
			"next": null
		},
	]
}
