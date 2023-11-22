/** @param {NS} ns **/
export async function main(ns) {
	// Config to avoid RAM cost on server calls
	const target = "joesguns";
	const moneyThreshold = 0.75 * 62500000;
	const securityTreshold = 5 + 5;

	while(true) {
		if (ns.getServerSecurityLevel(target) > securityTreshold) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
			await ns.grow(target);
		} else {
			await ns.hack(target);
		}
	}
}