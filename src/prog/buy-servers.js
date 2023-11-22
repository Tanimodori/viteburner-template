/** @param {NS} ns */
export async function main(ns) {
	ns.tprint("Arg count: ", ns.args.length);
	if (ns.args.length < 2 || ns.args.length > 3) {
		ns.tprint("Incorrect argument count used.\nUsage: run buy-servers.js <RAM in GB> <server count> [Is dry run?]");
		return;
	}
	let dryRun = true;
	if (ns.args.length == 3 && ns.args[2] == false) {
		dryRun = false;
	}

	let output = ""
	const ramAmount = ns.args[0];
	const serverAmount = ns.args[1];
	output += "\nServer cost will be: " + ns.nFormat(ns.getPurchasedServerCost(ramAmount) * serverAmount, '$0,0.00');
	output += "\nYour server limit is: " + ns.getPurchasedServerLimit();
	output += "\nYou current server count is: " + ns.getPurchasedServers().length;
	let remainingServerSlots = ns.getPurchasedServerLimit() - ns.getPurchasedServers().length;
	output += "\nServer purchases before hitting limit: " + remainingServerSlots;
	if (remainingServerSlots < serverAmount) {
		output += "\nThis command would replace " + (serverAmount - remainingServerSlots) + " servers.";
	}
 	
	if (!dryRun) {
		if (remainingServerSlots < serverAmount) {
			let oldServers = ns.getPurchasedServers();
			oldServers.sort((a,b) => {return ns.getServerMaxRam(a) - ns.getServerMaxRam(b)});
			const deleteAmount = serverAmount - remainingServerSlots;
			for (const server of oldServers.slice(0, deleteAmount)) {
				ns.killall(server);
				output += `\nDeletion of server ${server} was successfull?: ${ns.deleteServer(server)}`;
				
			}
		}
		output += "\nReal Purchase Started! Listing new hosts:";
		for (let step = 0; step < serverAmount; step++) {
			output += "\n\t" + step + ". " + ns.purchaseServer("grgserv-0", ramAmount);
		}
		output += "\nPurchase Complete!";
	}
	ns.tprint(output);
}