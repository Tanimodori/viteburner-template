/** @param {NS} ns */
export async function main(ns) {
	await ns.hack(ns.args[0]);
	ns.tprint(`[${grgNow()}] - Hack Call Finished`);
	ns.print(`[${grgNow()}] - Hack Call Finished`);
}

function grgNow() {
	return new Date().toLocaleString("en-US", {
		timeZone: "America/Los_Angeles"
	});
}