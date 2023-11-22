/** @param {NS} ns */
export async function main(ns) {
	if (ns.args.length !== 4) {
		ns.print(`Incorrect usage. Usage: run weaken.js target initDelay repeatDelay BatchID`);
	}
	const target = ns.args[0];
	const initDelay = ns.args[1];
	const repeatDelay = ns.args[2];
	const batchID = ns.args[3];
	await sleep(initDelay);
	while (true) {
		await ns.weaken(target);
		await ns.sleep(repeatDelay);
	}
}