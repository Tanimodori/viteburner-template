/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length !== 1) {
		ns.tprint(`Incorrect Usage! Usage: prep.js [target]`);
		ns.exit();
	}

	function getMostAvailableRAMServer() {
		return getAllMyServers[0];
	}

	function getAllMyServers() {
		let serverList = [];
		netwideAction(addServerToList, "home", serverList);
		serverList = serverList.filter(server => ns.hasRootAccess(server));
		serverList = serverList.filter(server => 1.75 !== (getAvailableRAM(server)));
		//serverList = serverList.filter(server => server !== "home");
		serverList = serverList.sort((a, b) => getAvailableRAM(b) - getAvailableRAM(a));
		return serverList;
	}

	function getAvailableRAM(server) {
		return ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
	}

	function addServerToList(server, foundSoFar) {
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


	const callBuffer = 250;
	const weakenSecAmount = 0.05;
	const growSecAmount = 0.004;
	const growsPerWeaken = weakenSecAmount / growSecAmount;
	const weakensPerGrow = growSecAmount / weakenSecAmount;
	const target = ns.args[0];
	const minSec = ns.getServerMinSecurityLevel(target);
	let currentSec = ns.getServerSecurityLevel(target);
	const startWeakenThreadCount = Math.ceil((currentSec - minSec) / weakenSecAmount);
	const maxMoney = ns.getServerMaxMoney(target);
	let currentMoney = ns.getServerMoneyAvailable(target);
	let growthMultiplier = maxMoney / currentMoney;
	let growThreadCount = Math.ceil(ns.growthAnalyze(target, growthMultiplier)) + 1;
	let finalWeakenThreadCount = Math.ceil(growThreadCount * weakensPerGrow);
	let singleWeakenRAM = ns.getScriptRam('/simpleHGW/weaken.js');
	let singleGrowRAM = ns.getScriptRam('/simpleHGW/grow.js');
	let firstWeakenRAM = startWeakenThreadCount * singleWeakenRAM;
	let growRAM = growThreadCount * singleGrowRAM;
	let finalWeakenRAM = finalWeakenThreadCount * singleWeakenRAM;
	ns.tprint(`First Weaken = ${startWeakenThreadCount} calls and ${ns.formatRam(firstWeakenRAM)}`);
	ns.tprint(`Grow batch = ${growThreadCount} calls and ${ns.formatRam(growRAM)}`);
	ns.tprint(`Final Weaken = ${finalWeakenThreadCount} calls and ${ns.formatRam(finalWeakenRAM)}`);
	ns.tprint(`RAM per grow call = ${singleGrowRAM}, RAM per weaken call = ${singleWeakenRAM}`);

	ns.tprint(`*** First Weaken Call Allocations ***`);
	let firstWeakenAllocations = [];
	let firstWeakenCallCounter = startWeakenThreadCount;
	while (firstWeakenCallCounter > 0) {
		let runnerServer = getMostAvailableRAMServer();
		let threadMultiplier = ns.getServer(runnerServer).cpuCores;
		let runnerServerRAM = getAvailableRAM(runnerServer);
		let maxCallsOnRunner = (runnerServerRAM / singleWeakenRAM) * threadMultiplier;
		if (maxCallsOnRunner > firstWeakenCallCounter) {
			let callsNeeded = Math.ceil(firstWeakenCallCounter / threadMultiplier);
			firstWeakenAllocations.push([runnerServer, callsNeeded]);
			firstWeakenCallCounter = 0;
		} else {
			let callsToFit = Math.floor(maxCallsOnRunner / threadMultiplier);
			firstWeakenAllocations.push([runnerServer, callsToFit]);
			firstWeakenCallCounter -= callsToFit;
		}
	}
	ns.tprint(JSON.stringify(firstWeakenAllocations, undefined, 2));
}