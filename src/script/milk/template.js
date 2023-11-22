/** @param {NS} ns **/
export async function main(ns) {
	// Config to avoid RAM cost on server calls
	const target = "<TARGET>";
	const moneyThreshold = 0.75 * REPLACE_ME_WITH_MAX_MONEY;
	const securityTreshold = 5 + REPLACE_ME_WITH_MIN_SECURITY;

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