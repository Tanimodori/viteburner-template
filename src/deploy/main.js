// Global Config
const moneyThresholdPercentage = 0.90;
const minSecurityBuffer = 5;

/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length != 1) {
		ns.print(`Incorrect number of parameters. Needs exactly one (1).`);
		ns.print(`Usage: run /deploy/main.js <serverName>`);
		return;
	}
	const hackRam = ns.getScriptRam('/deploy/hack.js');
	const homeMaxRam = ns.getServerMaxRam('home');
	const homeUsedRam = ns.getServerUsedRam('home');
	const availableRam = homeMaxRam - homeUsedRam;
	const maxThreads = Math.floor(availableRam / hackRam);

	let target = ns.args[0];
	const maxMoney = ns.getServerMaxMoney(target);
	let moneyThreshold = maxMoney * moneyThresholdPercentage;
	const minSecLevel = ns.getServerMinSecurityLevel(target);
	let securityTreshold = minSecLevel + minSecurityBuffer;
	
	await ns.sleep(Math.random() * 1000 * 60 * 5);
	while (true) {
		let myHackTime = ns.getHackTime(target);
		let myGrowTime = ns.getGrowTime(target);
		let myWeakenTime = ns.getWeakenTime(target);
		const currentSecLevel = ns.getServerSecurityLevel(target);
		let currentMoney = ns.getServerMoneyAvailable(target);

		if (currentSecLevel > securityTreshold) {
			let weakenThreads = Math.ceil((currentSecLevel - minSecLevel) / ns.weakenAnalyze(1));
			weakenThreads = Math.min(maxThreads, weakenThreads);
			ns.exec("/deploy/weaken.js", "home", weakenThreads, target);
			await ns.sleep(myWeakenTime);
		} else if (currentMoney < moneyThreshold) {
			if (currentMoney <= 0) currentMoney = 1; // division by zero safety
			let growThreads = Math.ceil(ns.growthAnalyze(target, maxMoney / currentMoney));
			growThreads = Math.min(maxThreads, growThreads);
			ns.exec("/deploy/grow.js", "home", growThreads, target);
			await ns.sleep(myGrowTime);
		} else {
			if (currentMoney <= 0) currentMoney = 1; // division by zero safety
			let hackThreads = Math.ceil(ns.hackAnalyzeThreads(target, currentMoney));
			hackThreads = Math.min(maxThreads, hackThreads);
			ns.exec("/deploy/hack.js", "home", hackThreads, target);
			await ns.sleep(myHackTime);
		}
	}
}

/** @param {NS} ns */
function getAllServers(ns, root = "home", found = new Set()) {
	found.add(root);
	for (const server of ns.scan(root)) {
		if (!found.has(server)) GetAllServers(ns, server, found);
	}
	return [...found];
}


/** @param {NS} ns */
function runScript(ns, scriptName, target, threads) {
	let allServers = getAllServers(ns);
	function RamSort(a, b) {
		if (ns.getServerMaxRam(a) > ns.getServerMaxRam(b)) return -1;
		if (ns.getServerMaxRam(a) < ns.getServerMaxRam(b)) return 1;
		return 0;
	}
	allServers.sort(RamSort);

	let ramPerThread = ns.getScriptRam(scriptName);
	let usableServers = allServers.filter(
		(p) => ns.hasRootAccess(p) && ns.getServerMaxRam(p) > 0
	);

	let fired = 0;

	for (const server of usableServers) {
		let availableRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server);
		let possibleThreads = Math.floor(availableRam / ramPerThread);

		if (possibleThreads <= 0) continue;
		if (possibleThreads > threads) possibleThreads = threads;
		if (server != "home") ns.scp(scriptName, server);
		ns.print(
			`Starting script ${scriptName} on ${server} with ${possibleThreads} threads.`
		);
		ns.exec(scriptName, server, possibleThreads, target);

		fired += possibleThreads;
		if (fired >= threads) break;
	}
}