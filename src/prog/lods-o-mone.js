/** @param {NS} ns */
export async function main(ns) {
	let myServers = getServersWithAdmin(ns);
	myServers = myServers.filter(e => e !== 'home');
	ns.tprint(`Printing servers with admin access: `);
	for (const server of myServers) {
		ns.tprint(server);
	}
	let richestServer = "home";
	for (const server of myServers) {
		if (ns.getServerMaxMoney(server) > ns.getServerMaxMoney(richestServer)) {
			richestServer = server;
		}
	}

	ns.tprint(`The current server with root access the highest max money value is ${richestServer}.`);
	ns.tprint(`${richestServer} currently has ${ns.nFormat(ns.getServerMoneyAvailable(richestServer), '$0,0[.]00')}.`);
	ns.tprint(`${richestServer} maxes at ${ns.nFormat(ns.getServerMaxMoney(richestServer), '$0,0[.]00')}.`)
	const percentFull = ns.getServerMoneyAvailable(richestServer) / ns.getServerMaxMoney(richestServer);
	ns.tprint(`${richestServer} is currently ${ns.nFormat(percentFull, '0.000%')} full.`);

	let targetOverride = "";
	if (ns.args.length === 1) {

		targetOverride = ns.args[0];
		ns.tprint(`Target overridden to ${targetOverride}`);
		richestServer = targetOverride;
		if (targetOverride === "share") {
			ns.tprint("!!!Faction Share Mode Override Engaged!!!");
		}
	}

	myServers = myServers.concat(ns.getPurchasedServers());
	const moneyScriptPath = "/prog/mone.js";
	const shareScriptPath = "/prog/share.js";
	const dontKillList = [
		"/prog/batcher.js",
		"/prog/prep.js",
		"/prog/coffeeparty.js",
	];
	for (const server of myServers) {
		let processes = ns.ps(server);
		for (const process of processes) {
			if (!dontKillList.includes(process.filename)) {
				ns.kill(process.pid);
			}
		}
		//ns.tprint("For server " + server + " was scripts killed?: " + ns.killall(server, true));
		if (targetOverride === "share") {
			ns.tprint("Was deploy for server " + server + " successfull?: " + ns.scp(shareScriptPath, server, "home"));
			const threadCount = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(shareScriptPath));
			if (threadCount === 0) {
				continue;
			}
			ns.tprint("New running script PID on " + server + "? (PID 0 means exec failed.): " + ns.exec(shareScriptPath, server, threadCount));
			ns.tprint("Deploy for server " + server + " complete!");
		} else {
			ns.tprint("Was deploy for server " + server + " successfull?: " + ns.scp(moneyScriptPath, server, "home"));
			const threadCount = Math.floor((ns.getServerMaxRam(server) - ns.getServerUsedRam(server)) / ns.getScriptRam(moneyScriptPath));
			if (threadCount === 0) {
				continue;
			}
			ns.tprint("New running script PID on " + server + "? (PID 0 means exec failed.): " + ns.exec(moneyScriptPath, server, threadCount, richestServer));
			ns.tprint("Deploy for server " + server + " complete!");
		}
	}

}

/** @param {NS} ns */
function getServersWithAdmin(ns) {
	return getServersWithAdminInner(ns, "home", [], []);
}

/** @param {NS} ns */
function getServersWithAdminInner(ns, currentServer, adminList, alreadyVisited) {
	alreadyVisited.push(currentServer);
	if (ns.hasRootAccess(currentServer)) {
		adminList.push(currentServer);
	}
	const children = ns.scan(currentServer);
	for (const child of children) {
		if (!alreadyVisited.includes(child)) {
			getServersWithAdminInner(ns, child, adminList, alreadyVisited);
		}
	}
	return adminList;
}