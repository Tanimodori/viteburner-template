/** @param {NS} ns */
export async function main(ns) {
	// I'm not actually sure if this is a true breath first search but it works.
	function bfs(server, target, path = [], visited = []) {
		visited.push(server);
		path.push(server);
		const children = ns.scan(server);
		for (const child of children) {
			if (child === target) {
				path.push(child);
				return path;
			}
		}
		let results = [];
		for (const child of children) {
			if (visited.includes(child)) {
				continue;
			} else {
				let result = bfs(child, target, JSON.parse(JSON.stringify(path)), visited);
				if (result !== undefined) {
					results.push(result);
				}
			}
		}
		let minPath = undefined;
		for (const result of results) {
			if (minPath === undefined) {
				minPath = result;
			} else if (minPath.length > result.length) {
				minPath = result;
			}
		}
		return minPath;
	}

	// Script driver
	const startNode = "home";
	const endNodes = [
		"CSEC",
		"avmnite-02h",
		"I.I.I.I",
		"run4theh111z",
		"The-Cave",
	];
	if (ns.args.length === 0) {
		for (const node of endNodes) {
			ns.tprint(JSON.stringify(bfs(startNode, node)));
		}
	} else {
		ns.tprint(JSON.stringify(bfs(startNode, ns.args[0])));
	}
}