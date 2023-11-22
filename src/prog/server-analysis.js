/** @param {NS} ns */
export async function main(ns) {
	var output = "\nSERVER REPORT:"
	const targetServerName = String(ns.args[0]);
	output += "\n\tTarget:\t\t\t" + targetServerName;
	const doesServerExist = ns.serverExists(targetServerName);
	output += "\n\tExists:\t\t\t" + doesServerExist;
	if (!doesServerExist) {
		ns.tprint(output);
		ns.print(output);
		return;
	}
	const targetServer = ns.getServer(targetServerName);

	// Server physical-ish properties
	output += "\n\n\t--Physical-ish Properties--";
	output += "\n\thostname:\t\t" + targetServer.hostname;
	output += "\n\tip:\t\t\t" + targetServer.ip;
	output += "\n\tcpuCores:\t\t" + targetServer.cpuCores;
	output += "\n\tmaxRam:\t\t\t" + targetServer.maxRam;
	output += "\n\tramUsed:\t\t" + targetServer.ramUsed;
	output += "\n\thasAdminRights:\t\t" + targetServer.hasAdminRights;
	output += "\n\tpurchasedByPlayer:\t" + targetServer.purchasedByPlayer;
	output += "\n\torganizationName:\t" + targetServer.organizationName;

	// Money stats
	output += "\n\n\t--Money Stats--";
	output += "\n\tmoneyMax:\t\t" + ns.nFormat(targetServer.moneyMax, '$0,0.00');
	output += "\n\tmoneyAvailable:\t\t" + ns.nFormat(targetServer.moneyAvailable, '$0,0.00');
	if (targetServer.moneyMax > 0) {
		output += "\n\tmoneyFullPercent:\t" + ns.nFormat((targetServer.moneyAvailable / targetServer.moneyMax), '0.000%');
	} else {
		output += "\n\tmoneyFullPercent:\t$0.00";
	}
	output += "\n\tserverGrowth:\t\t" + targetServer.serverGrowth;

	// Hacking difficulty
	output += "\n\n\t--Hacking Difficulty--";
	output += "\n\tminDifficulty:\t\t" + targetServer.minDifficulty;
	output += "\n\tbaseDifficulty:\t\t" + targetServer.baseDifficulty;
	output += "\n\thackDifficulty:\t\t" + targetServer.hackDifficulty;
	output += "\n\trequiredHackingSkill:\t" + targetServer.requiredHackingSkill;
	
	// Port information
	output += "\n\n\t--Port Information--";
	output += "\n\tnumOpenPortsRequired:\t" + targetServer.numOpenPortsRequired;
	output += "\n\topenPortCount:\t\t" + targetServer.openPortCount;
	output += "\n\tftpPortOpen:\t\t" + targetServer.ftpPortOpen;
	output += "\n\thttpPortOpen:\t\t" + targetServer.httpPortOpen;
	output += "\n\tsmtpPortOpen:\t\t" + targetServer.smtpPortOpen;
	output += "\n\tsqlPortOpen:\t\t" + targetServer.sqlPortOpen;
	output += "\n\tsshPortOpen:\t\t" + targetServer.sshPortOpen;

	// Time for async hacking tasks
	output += "\n\n\t--Async Hacking Task Information--";
	output += "\n\tTime to complete a hack: " + ns.nFormat(ns.getHackTime(targetServerName)/1000, '00:00:00.0');
	output += "\n\tChance a hack call will be successful: " + ns.nFormat(ns.hackAnalyzeChance(targetServerName), '0.000%');
	output += "\n\tTime to complete a weakening: " + ns.nFormat(ns.getWeakenTime(targetServerName)/1000, '00:00:00.0');
	output += "\n\tTime to complete a growth: " + ns.nFormat(ns.getGrowTime(targetServerName)/1000, '00:00:00.0');
	output += "\n\tThe number of grow calls needed to double the money: " + ns.growthAnalyze(targetServerName, 2);
	ns.print(output);
	ns.tprint(output);
}