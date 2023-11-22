/** @param {NS} ns */
export async function main(ns) {
	/**
	 * batchTimeLength = callBuffer * 3 + (ns.timeToHack(serverName) * 4)
	 * ns.exec(host=serverName, script=weaken.js, threads=2*x, initDelay=0, repeatDelay=batchTimeLength, batch=i);
	 * ns.exec(host=serverName, script=weaken.js, threads=2*x, initDelay=callBuffer*2, repeatDelay=batchTimeLength, batch=i);
	 * ns.exec(host=serverName, script=grow.js, threads=25*x, initDelay=ns.timeToHack(serverName)*0.8-callBuffer, repeatDelay=batchTimeLength, batch=i);
	 * ns.exec(host=serverName, script=hack.js, threads=50*x, initDelay=ns.timeToHack(serverName)*2.2-callBuffer, repeatDelay=batchTimeLength, batch=i);
	 * await sleep(callBuffer*4);
	 */
	function launchBatch(target, callBuffer = 250) {
		let serverList = getAllMyServers();
		for (const server of serverList) {
			ns.tprint(`${server} : ${ns.nFormat(getAvailableRAM(server), '0,0[.]00')} GB`);
		}
	}

	function getAllMyServers() {
		let serverList = [];
		netwideAction(addServerToList, "home", serverList);
		serverList = serverList.filter(server => ns.hasRootAccess(server));
		serverList = serverList.filter(server => 0 !== (getAvailableRAM(server)));
		serverList = serverList.sort((a, b) => getAvailableRAM(b) - getAvailableRAM(a));
		return serverList;
	}

	function getAvailableRAM(server) {
		return ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
	}

	function addServerToList(server, foundSoFar){
		foundSoFar.push(server);
	}

	function netwideAction(actionOnVisit, currentServer = "home", outputCollection = [], alreadyVisited = []) {
		alreadyVisited.push(currentServer);
		actionOnVisit(currentServer, outputCollection);
		const children = ns.scan(currentServer);
		for (const child of children) {
			if (!alreadyVisited.includes(child)) {
				netwideAction(actionOnVisit, child, outputCollection, alreadyVisited);
			}
		}
	}

	launchBatch("n00dles");
}