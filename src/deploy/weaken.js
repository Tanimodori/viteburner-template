/** @param {NS} ns */
export async function main(ns) {
	await ns.weaken(ns.args[0]);
	ns.tprint(`[${grgNow()}] - Weaken Call Finished`);
	ns.print(`[${grgNow()}] - Weaken Call Finished`);
}

function grgNow() {
	return new Date().toLocaleString("en-US", {
		timeZone: "America/Los_Angeles"
	});
}