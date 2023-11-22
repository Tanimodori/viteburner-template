/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length < 1 || ns.args.length > 2) {
		ns.tprint(`Incorrect number of arguments. Usage: run net-scan.js <find|full|backdoor> [name|next]`);
		return 1;
	}
	const cmd = ns.args[0];
	if (cmd === "full") {
		printFullNetwork(ns);
	} else if (cmd === "find") {
		ns.tprint(`NOT IMPLEMENTED YET!`);
		return;
	} else if (cmd === "backdoor") {
		ns.tprint(`NOT IMPLEMENTED YET!`);
		return;
	} else if (cmd === "money") {
		let serverCandidates = getBestMoneyServer(ns);
		for (const serverName of serverCandidates) {
			const maxMoney = ns.getServerMaxMoney(serverName);
			const score = ns.getServerMaxMoney(serverName) / ns.getServerMinSecurityLevel(serverName);
			// ns.nFormat(ns.getServerMaxMoney(richestServer), '$0,0[.]00')
			ns.tprint(`Name: ${serverName}, \t\t\tMax:${ns.nFormat(maxMoney, '$0,0[.]00')}, \t\t\tScore: ${ns.nFormat(score, '0,0[.]00')}`);
		}
	} else {
		ns.tprint(`Unknown command. Valid commands are "find", "full", and "backdoor".`);
		return 1;
	}
}

/** @param {NS} ns */
function getBestMoneyServer(ns) {
	const fullNetwork = getFullNetwork(ns);
	let serverList = Object.keys(fullNetwork);
	let serverShortList = serverList.filter(x => ns.getServerRequiredHackingLevel(x) <= Math.floor(ns.getHackingLevel() / 2));
	serverShortList = serverShortList.filter(x => ns.getServerMaxMoney(x) !== 0);
	serverShortList.sort((a, b) => ns.getServerMaxMoney(b) / ns.getServerMinSecurityLevel(b) - ns.getServerMaxMoney(a) / ns.getServerMinSecurityLevel(a));
	return serverShortList;
}

/** @param {NS} ns */
function getFullNetwork(ns) {
	return getFullNetworkInner(ns, "home", [], {});
}

/** @param {NS} ns */
function getFullNetworkInner(ns, serverName, path, visited) {
	//ns.tprint(`name: ${serverName}, path: ${path}, visited: ${JSON.stringify(visited)}`);
	let newPath = [];
	if (!path.length == 0) {
		// Don't want to pass by reference here and JSON provides easiest means of true copy by value.
		newPath = JSON.parse(JSON.stringify(path));

	}
	newPath.push(serverName);
	//ns.tprint(`${serverName}: ${JSON.stringify(newPath)}`);
	visited[serverName] = newPath;
	const children = ns.scan(serverName);
	for (const child of children) {
		if (!visited.hasOwnProperty(child)) {
			visited = mergeVisitedObjects(visited, getFullNetworkInner(ns, child, newPath, visited));
		}
	}
	return visited;
}

function mergeVisitedObjects(map1, map2) {
	let biggerMap;
	let smallerMap;
	if (Object.keys(map1).length >= Object.keys(map2).length) {
		biggerMap = map1;
		smallerMap = map2;
	} else {
		biggerMap = map2;
		smallerMap = map1;
	}
	for (const key of Object.keys(smallerMap)) {
		if (!key in Object.keys(biggerMap)) {
			biggerMap[key] = smallerMap[key];
		}
	}
	return biggerMap;
}

/** @param {NS} ns */
function printFullNetwork(ns) {
	const rootChildren = ns.scan("home");
	let visited = ["home"]
	for (const child of rootChildren) {
		printFullNetworkInner(ns, child, [], visited);
	}
}

/** @param {NS} ns */
function printFullNetworkInner(ns, serverName, path, visited) {
	visited.push(serverName);
	// Don't want to pass by reference here and JSON provides easiest means of true copy by value.
	//ns.tprint(`ns: ${ns}\nserverName: ${serverName}\npath: ${path}\nvisited: ${visited}`);
	let newPath = [];
	if (path.length === 0) {
		newPath = ["home"];
	} else {
		//ns.tprint(`Result of path deep copy: ${JSON.stringify(JSON.parse(JSON.stringify(path)))}`);
		newPath = JSON.parse(JSON.stringify(path));
		newPath.push(serverName);
	}
	let output = "home";
	//ns.tprint(JSON.stringify(newPath));
	for (const server of newPath) {
		output += ` => ${server}`;
	}
	ns.tprint(output);
	const children = ns.scan(serverName);
	for (const child of children) {
		if (!visited.includes(child)) {
			printFullNetworkInner(ns, child, newPath, visited);
		}
	}
	return;
}