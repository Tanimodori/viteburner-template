/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		let c = ns.corporation;
		const cities = ["Aevum", "Chongqing", "New Tokyo", "Ishima", "Volhaven", "Sector-12"];
		const agDiv = "AG";
		const tbDiv = "TB";
		for (const city of cities) {
			const office = c.getOffice(agDiv, city);
			if (office.avgEnergy < 95) {
				ns.print(`Buying tea for Agriculture division in the city of ${city}.`);
				c.buyTea(agDiv, city, 500_000);
			} else {
				ns.print(`No need for tea for Agriculture division in the city of ${city}.`);
			}
			if (office.avgMorale < 95) {
				ns.print(`Throwing party for Agriculture division in the city of ${city}.`);
				c.throwParty(agDiv, city, 500_000);
			} else {
				ns.print(`No need to throw a party for Agriculture division in the city of ${city}.`);
			}
		}

		for (const city of cities) {
			const office = c.getOffice(tbDiv, city);
			if (office.avgEnergy < 95) {
				ns.print(`Buying tea for Tobacco division in the city of ${city}.`);
				c.buyTea(tbDiv, city, 500_000);
			} else {
				ns.print(`No need for tea for Tobacco division in the city of ${city}.`);
			}
			if (office.avgMorale < 95) {
				ns.print(`Throwing party for Tobacco division in the city of ${city}.`);
				c.throwParty(tbDiv, city, 500_000);
			} else {
				ns.print(`No need to throw a party for Tobacco division in the city of ${city}.`);
			}
		}

		await ns.sleep(10 * 1000);
	}
}