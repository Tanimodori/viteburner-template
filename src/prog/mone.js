/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length != 1) {
		ns.print("Error: Incorrect Usage!\tUsage: run mone.js <server-name>");
		return 1;
	}
	const server = ns.args[0];
	const securityBuffer = 5;
	const moneyPercentBuffer = 0.90;
	const securityThreshold = ns.getServerMinSecurityLevel(server) + securityBuffer;
	const moneyThreshold = ns.getServerMaxMoney(server) * moneyPercentBuffer;
	if(securityThreshold >= 100) {
		ns.print(`Error: Minimum Security is too high on ${server} to milk for money.`);
		return 2;
	}
	await ns.sleep(Math.random() * 1000 * 200);
	while(true) {
		if (ns.getServerSecurityLevel(server) > securityThreshold) {
			await ns.weaken(server);
		} else if (ns.getServerMoneyAvailable(server) < moneyThreshold) {
			await ns.grow(server);
		} else {
			await ns.hack(server);
		}
	}
}