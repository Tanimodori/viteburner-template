/** @param {NS} ns */
export async function main(ns) {
	await ns.grow(ns.args[0]);
	ns.tprint(`[${grgNow()}] - Grow Call Finished`);
}

function grgNow() {
	return new Date().toLocaleString("en-US", {
		timeZone: "America/Los_Angeles"
	});
}