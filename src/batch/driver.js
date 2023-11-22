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
	const weakenPath = '/batch/weaken.js';
	const growPath = '/batch/grow.js';
	const hackPath = '/batch/hack.js';
	const weakenRAM = ns.getScriptRam(weakenPath);
	const growRAM = ns.getScriptRam(growPath);
	const hackRAM = ns.getScriptRam(hackPath);

	function launchBatch(target, callBuffer = 250) {
		let serverList = getAllMyServers();
		for (const server of serverList) {
			ns.tprint(`${server} : ${ns.formatRam(getAvailableRAM(server))}`);
		}
		deployScripts(serverList);
		let firstWeakenRAMperX = weakenRAM * 2;
		let secondWeakenRAMperX = firstWeakenRAMperX;
		let growRAMperX = growRAM * 25;
		let hackRAMperX = hackRAM * 50;
		let totalRAMperX = firstWeakenRAMperX + secondWeakenRAMperX + growRAMperX + hackRAMperX;
		ns.tprint(`First weaken RAM per X: ${ns.formatRam(firstWeakenRAMperX)}`);
		ns.tprint(`Second weaken RAM per X: ${ns.formatRam(secondWeakenRAMperX)}`);
		ns.tprint(`Grow RAM per X: ${ns.formatRam(growRAMperX)}`);
		ns.tprint(`Hack RAM per X: ${ns.formatRam(hackRAMperX)}`);
		ns.tprint(`Total RAM per X: ${ns.formatRam(totalRAMperX)}`);
		const debugTestTargets = [
			'n00dles', // $7k
			'nectar-net', // $81k
			'joesguns', // $60k
			'hong-fang-tea', // $64k
			'neo-net', // $122k
			'foodnstuff', // $12k
			'sigma-cosmetics', // $25k
			'harakiri-sushi', // $161k
			'zer0', // $231k
			'iron-gym', // $337k
			'max-hardware', // $300k
			//'phantasy', // $605k
		];
		for (const debugTestTarget of debugTestTargets) {
			const singleHackAmount = ns.hackAnalyze(debugTestTarget) * ns.getServerMaxMoney(debugTestTarget);
			const serverAfterSingleHack = ns.getServerMaxMoney(debugTestTarget) - singleHackAmount;
			const serverToFullMultiplier = ns.getServerMaxMoney(debugTestTarget) / serverAfterSingleHack;
			const growCallsPerHackCall = Math.ceil(ns.growthAnalyze(debugTestTarget, serverToFullMultiplier));
			//ns.tprint(`A single hack of ${debugTestTarget} would produce \$${ns.formatNumber(singleHackAmount)}.`);
			//ns.tprint(`${debugTestTarget} would have \$${ns.formatNumber(serverAfterSingleHack)} left.`);
			//ns.tprint(`${debugTestTarget} number of grow calls per hack call is approximately ${ns.formatNumber(growCallsPerHackCall)}.`);
			ns.tprint(`**** ${debugTestTarget} money per grow call(s) per hack call = \$${ns.formatNumber(singleHackAmount / growCallsPerHackCall)} ****`);
		}
	}

	function launchScript(target, script, serverList, threads, initDelay, repeatDelay, batchID) {
		const topServers = serverList.sort((a, b) => getAvailableRAM(b) - getAvailableRAM(a));
		const topServer = topServers[0];
		if (getAvailableRAM(topServer) >= ns.getScriptRam(script)) {
			ns.exec(script, target, 1, initDelay, repeatDelay, batchID);
			launchScript(target, script, serverList, threads - 1, initDelay, repeatDelay, batchID);
		}
	}

	function deployScripts(serverList) {
		for (const server of serverList) {
			ns.scp(weakenPath, server);
			ns.scp(growPath, server);
			ns.scp(hackPath, server);
		}
	}

	function getAllMyServers() {
		let serverList = [];
		netwideAction(addServerToList, "home", serverList);
		serverList = serverList.filter(server => ns.hasRootAccess(server));
		serverList = serverList.filter(server => 0 !== (getAvailableRAM(server)));
		serverList = serverList.filter(server => server !== "home");
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

	launchBatch("n00dles");
}