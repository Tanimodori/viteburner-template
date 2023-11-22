/** @param {NS} ns */
export async function main(ns) {
	/**
	* Magic security modifier constants:
	  * 	  hack: +0.002 security per thread
	  * 	  grow: +0.004 security per thread
	  * 	weaken: -0.05 security per thread
	  */
	const hackSecMod = 0.002;
	const growSecMod = 0.004;
	const weakenSecMod = -0.05;
	const hackRatioInt = 5;
	const growRatioInt = 16;
	const weakenRatioInt = 20;
	const callBuffer = 30;
	const targetHackPercentage = 0.1;
	if (ns.args.length != 1) {
		grgLog(ns, "Error: Incorrect Usage!\tUsage: run prep.js <server-name>");
		return 1;
	}
	const serverName = ns.args[0]
	// Check to make sure that the server is prepped for batching.
	let isServerPrepped = true;
	if (ns.getServerMaxMoney(serverName) - ns.getServerMoneyAvailable(serverName) !== 0) {
		isServerPrepped = false;
		grgLog(ns, 'The server is not at the maximum money level.');
	}
	if (ns.getServerSecurityLevel(serverName) - ns.getServerMinSecurityLevel(serverName) !== 0) {
		isServerPrepped = false;
		grgLog(ns, 'The server is not at the minimum security level.');
	}
	if (!isServerPrepped) {
		grgLog(ns, `Please prep the ${serverName} server before trying to run batches on it. Exiting now.`);
		return 1;
	} else {
		grgLog(ns, `The ${serverName} server has been properly prepped. Starting RAM allocation.`);
	}

	// Calculate total resources per batch.
	const serverMaxMoney = ns.getServerMaxMoney(serverName);
	const hackThreadsPerBatch = Math.max(Math.floor(ns.hackAnalyzeThreads(serverName, serverMaxMoney * targetHackPercentage)), 1);
	const hackThreadsTotalRam = ns.getScriptRam('/deploy/hack.js') * hackThreadsPerBatch;
	const hackThreadsSecMod = hackThreadsPerBatch * hackSecMod;
	const firstWeakenThreadsPerBatch = Math.ceil(hackThreadsSecMod / (-1 * weakenSecMod));
	const firstWeakenThreadsTotalRam = ns.getScriptRam('/deploy/weaken.js') * firstWeakenThreadsPerBatch;
	const growThreadsPerBatch = Math.ceil(ns.growthAnalyze(serverName, (serverMaxMoney / (serverMaxMoney * (1 - targetHackPercentage)))));
	const growThreadsTotalRam = ns.getScriptRam('/deploy/grow.js');
	const growThreadsSecMod = growThreadsPerBatch * growSecMod;
	const secondWeakenThreadsPerBatch = Math.ceil(growThreadsSecMod * (-1 * weakenSecMod));
	const secondWeakenThreadsTotalRam = ns.getScriptRam('/deploy/weaken.js') * secondWeakenThreadsPerBatch;
	const timeToHack = ns.getHackTime(serverName);
	const timeToGrow = timeToHack * (growRatioInt / hackRatioInt);
	const timeToWeaken = timeToGrow * (weakenRatioInt / growRatioInt);

	grgLog(ns, `Hack Threads Per Batch: ${hackThreadsPerBatch}`);
	grgLog(ns, `Hack Threads Total RAM: ${hackThreadsTotalRam} GB`);
	grgLog(ns, `Grow Threads Per Batch: ${growThreadsPerBatch}`);
	grgLog(ns, `Grow Threads Total RAM: ${growThreadsTotalRam} GB`);
	grgLog(ns, `First Set Weaken Threads Per Batch: ${firstWeakenThreadsPerBatch}`);
	grgLog(ns, `First Set Weaken Threads Total RAM: ${firstWeakenThreadsTotalRam} GB`);
	grgLog(ns, `Second Set Weaken Threads Per Batch: ${secondWeakenThreadsPerBatch}`);
	grgLog(ns, `Second Set Weaken Threads Total RAM: ${secondWeakenThreadsTotalRam} GB`);
	grgLog(ns, `Total Batch RAM: ${hackThreadsTotalRam + growThreadsTotalRam + firstWeakenThreadsTotalRam + secondWeakenThreadsTotalRam} GB`);
	const moneyPerBatch = serverMaxMoney * targetHackPercentage;
	grgLog(ns, `Total Money Earned Per Batch: ${ns.nFormat(moneyPerBatch, '$0,0[.]00')}`);
	const moneyPerSecond = (8 + (1 / 3)) * moneyPerBatch;
	grgLog(ns, `Optimal Target Hacked Earnings Per Second: ${ns.nFormat(moneyPerSecond, '$0,0[.]00')}`);
	grgLog(ns, `Earnings Per Minute: ${ns.nFormat(60 * moneyPerSecond, '$0,0[.]00')}`);
	grgLog(ns, `Earnings Per Hour: ${ns.nFormat(60 * 60 * moneyPerSecond, '$0,0[.]00')}`);
	grgLog(ns, `Total Time For Batch Execution: ${ns.nFormat((timeToWeaken + (callBuffer * 4)) / 1000, '0,0[.]00')} seconds`);
	// TODO
	return 0;
}

function grgNow() {
	return new Date().toLocaleString("en-US", {
		timeZone: "America/Los_Angeles"
	});
}

/** @param {NS} ns */
function grgLog(ns, logString) {
	ns.print(`[${grgNow()}] - ${logString}`);
	ns.tprint(`[${grgNow()}] - ${logString}`);
}

/** @param {import("..").NS} ns */
function netwideAction(ns, actionOnVisit, currentServer = "home", outputCollection = [], alreadyVisited = []) {
	alreadyVisited.push(currentServer);
	actionOnVisit(currentServer, outputCollection);
	const children = ns.scan(currentServer);
	for (const child of children) {
		if (!alreadyVisited.includes(child)) {
			netwideAction(ns, actionOnVisit, child, outputCollection, alreadyVisited);
		}
	}
}