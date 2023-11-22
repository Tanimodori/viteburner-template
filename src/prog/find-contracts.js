/** @param {NS} ns */
export async function main(ns) {

	function findContracts(currentServer, alreadyVisited) {
		alreadyVisited.push(currentServer);
		const contracts = ns.ls(currentServer, ".cct");
		if (contracts.length > 0) {
			ns.tprint(`Server ${currentServer} => ${JSON.stringify(contracts)}`);
		}
		const neighbors = ns.scan(currentServer);
		for (const server of neighbors) {
			if (!alreadyVisited.includes(server)) {
				findContracts(ns, server, alreadyVisited);
			}
		}
	}

	findContracts("home", []);
}