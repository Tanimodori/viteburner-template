/** @param {NS} ns */
export async function main(ns) {
	// Note: This is intended to only be ran from the "home" server.
	const portOpeners = {
		"BruteSSH.exe": ns.brutessh,
		"FTPCrack.exe": ns.ftpcrack,
		"relaySMTP.exe": ns.relaysmtp,
		"HTTPWorm.exe": ns.httpworm,
		"SQLInject.exe": ns.sqlinject
	};
	let foundOpeners = []
	for (const [openerName, openerFunction] of Object.entries(portOpeners)) {
		if (ns.fileExists(openerName)) {
			foundOpeners.push(openerFunction);
			//ns.tprint(`Port opening program ${openerName} was FOUND.`);
		}
	}
	await autoNuke(ns, "home", foundOpeners, []);
	ns.tprint("Pwn script complete!");
}

/** @param {NS} ns */
async function autoNuke(ns, serverName, openerList, alreadyVisited) {
	if (!alreadyVisited.includes(serverName)) {
		await singleNuke(ns, serverName, openerList);
		alreadyVisited.push(serverName);
	}
	const children = ns.scan(serverName);
	for (const child of children) {
		if (!alreadyVisited.includes(child)) {
			await autoNuke(ns, child, openerList, alreadyVisited);
		}
	}
}

/** @param {NS} ns */
async function singleNuke(ns, serverName, openerList) {
	if (ns.hasRootAccess(serverName)) {
		//ns.tprint(`You already have admin rights to server ${serverName}.`);
		return true;
	}
	if (ns.getServerRequiredHackingLevel(serverName) > ns.getHackingLevel()) {
		//ns.tprint(`The server ${serverName} is currently too difficult to hack.`);
		return false;
	}
	if (ns.getServerNumPortsRequired(serverName) > openerList.length) {
		//ns.tprint(`You currently don't have enough port opening EXE programs to nuke server ${serverName}.`);
		return false;
	}
	for (const opener of openerList) {
		opener(serverName);
	}
	ns.nuke(serverName);
	if (ns.hasRootAccess(serverName)) {
		ns.tprint(`Nuke successfull! Gained admin rights to server ${serverName}.`);
		return true;
	} else {
		ns.tprint(`DEV ERROR! Nuke somehow didn't work as expected. Please review code.`);
		return false;
	}
}