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
	const callBuffer = 250;
	if (ns.args.length != 1) {
		ns.print("Error: Incorrect Usage!\tUsage: run prep.js <server-name>");
		return 1;
	}
	const serverName = ns.args[0];
	grgLog(ns, `[${grgNow()}]:  Beginning hacking prep of server '${serverName}'.`);
	let security = ns.getServerSecurityLevel(serverName);
	let minSecurity = ns.getServerMinSecurityLevel(serverName);
	let money = ns.getServerMoneyAvailable(serverName);
	let maxMoney = ns.getServerMaxMoney(serverName);
	let timeToHack = ns.getHackTime(serverName);
	let timeToGrow = timeToHack * (growRatioInt / hackRatioInt);
	let timeToWeaken = timeToHack * (weakenRatioInt / hackRatioInt);
	let weakenTimeInSecs = timeToWeaken / 1000;
	let diffToMinSec = security - minSecurity;
	let callsToMinSec = Math.ceil(diffToMinSec / (-1 * weakenSecMod));
	let callsToMaxMoney = Math.ceil(ns.growthAnalyze(serverName, (maxMoney / money), ns.getServer('home').cpuCores));
	let secAfterGrow = minSecurity + (callsToMaxMoney * growSecMod);
	let callsToFinalMinSec = Math.ceil((callsToMaxMoney * growSecMod) / (-1 * weakenSecMod));
	let debugStateInfo = {
		'Current Security Level': security,
		'Minimum Security Level': minSecurity,
		'Available Money': ns.nFormat(money, '$0,0[.]00'),
		'Maximum Money': ns.nFormat(maxMoney, '$0,0[.]00'),
		'Current Time To Weaken': `${weakenTimeInSecs} seconds`,
		'Weaken Calls Until Minimum Security': callsToMinSec,
		'Grow Calls Until Maximum Money': callsToMaxMoney,
		'Expected Sec Level After Full Growth': secAfterGrow,
		'Number of Secondary Weaken Calls to Return To Min Sec After Growth': callsToFinalMinSec,
	};
	grgLog(ns, `\n${JSON.stringify(debugStateInfo, undefined, 2)}`);

	while (ns.getServerMaxMoney(serverName) !== ns.getServerMoneyAvailable(serverName)) {
		while (ns.getServerMinSecurityLevel(serverName) !== ns.getServerSecurityLevel(serverName)) {
			await execBatch(ns, 'home', '/deploy/weaken.js', ns.getWeakenTime(serverName) + callBuffer, serverName);
		}
		await execBatch(ns, 'home', '/deploy/grow.js', ns.getGrowTime(serverName) + callBuffer, serverName);
	}

	let numOfBatches = Math.ceil((ns.getScriptRam('/deploy/weaken.js') * callsToFinalMinSec) / (ns.getServerMaxRam('home') - (ns.getServerUsedRam('home') + ns.getScriptRam('/prog/prep.js', 'home'))));
	ns.tprint(`[${grgNow()}] - Trigger final weaken script with ${Math.max(callsToFinalMinSec, 1)} threads over ${numOfBatches} batches.`);
	for (let i = 0; i < numOfBatches; i++) {
		ns.tprint(`DEBUG - Attempting to launch final weaken with ${Math.max(Math.floor(callsToFinalMinSec / numOfBatches))} threads in batch number ${i + 1} with duration of ${ns.nFormat(ns.getWeakenTime(serverName) / 1000, '0,0[.]00')} seconds.`);
		let returnCode = ns.exec('/deploy/weaken.js', 'home', Math.max(Math.floor(callsToFinalMinSec / numOfBatches), 1), serverName);
		if (returnCode === 0) {
			ns.tprint('Final Weaken Call Could Not Run.');
			return 1;
		}
		await ns.sleep(ns.getWeakenTime(serverName) + callBuffer);
	}

	ns.tprint(`DEBUG - Current Amount Above Min Security: ${ns.getServerSecurityLevel(serverName) - minSecurity}`);
	ns.tprint(`DEBUG - Current Money Level Below Max: ${maxMoney - ns.getServerMoneyAvailable(serverName)}`);
	grgLog(ns, `[${grgNow()}]:  Finished hacking prep of server '${serverName}'.`);
	return 0;
}

/** @param {NS} ns */
async function execBatch(ns, hostName, scriptPath, waitTime, targetServer) {
	const scriptRAM = ns.getScriptRam(scriptPath);
	const availableRAM = ns.getServerMaxRam(hostName) - (ns.getServerUsedRam(hostName) + scriptRAM);
	const batchThreads = Math.floor(availableRAM / scriptRAM);
	let returnCode = -1;
	if (batchThreads !== 0) {
		returnCode = ns.exec(scriptPath, hostName, batchThreads, targetServer);
	}
	if (returnCode === 0) {
		grgLog(ns, `Not enough memory to run a batch for script ${scriptPath} on host ${hostName} against ${targetServer} with ${batchThreads} threads using ${scriptRAM * batchThreads} GB of RAM.`);
		return false;
	} else if (returnCode === -1) {
		grgLog(ns, `Skipping attempt at zero thread batch for script ${scriptPath} on host ${hostName} against ${targetServer} with ${batchThreads} threads using ${scriptRAM * batchThreads} GB of RAM.`);
		await ns.sleep(waitTime);
		return true;
	} else {
		grgLog(ns, `Running a batch for script ${scriptPath} on host ${hostName} against ${targetServer} with duration ${ns.nFormat(waitTime / 1000, '0,0[.]00')} seconds with ${batchThreads} threads using ${scriptRAM * batchThreads} GB of RAM.`);
		await ns.sleep(waitTime);
		return true;
	}
}

function grgNow() {
	return new Date().toLocaleString("en-US", {
		timeZone: "America/Los_Angeles"
	});
}

/** @param {NS} ns */
function setStateMoney(ns, state, money) {
	state['Available Money'] = ns.nFormat(money, '$0,0[.]00');
	return state;
}

/** @param {NS} ns */
function grgLog(ns, logString) {
	ns.print(logString);
	ns.tprint(logString);
}