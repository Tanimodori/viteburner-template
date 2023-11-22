/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length !== 2) {
		ns.print(`Incorrect usage. Usage: weaken.js [target] [delay]`);
		ns.exit();
	}
	await ns.sleep(ns.args[1]);
	await ns.weaken(ns.args[0]);
}