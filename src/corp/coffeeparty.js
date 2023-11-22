/** @param {NS} ns */
export async function main(ns) {
	while (true) {
		let c = ns.corporation;
		const cities = ["Aevum", "Chongqing", "New Tokyo", "Ishima", "Volhaven", "Sector-12"];
		const agDiv = "AG";
		let tbDiv = undefined;
		tbDiv = "TB";
		for (const city of cities) {
			const office = c.getOffice(agDiv, city);
			if (office.avgEne < 95) c.buyCoffee(agDiv, city, 500_000);
			if (office.avgHap < 95 || office.avgMor < 95) c.throwParty(agDiv, city, 500_000);
		}

		if (tbDiv !== undefined) {
			for (const city of cities) {
				const office = c.getOffice(tbDiv, city);
				if (office.avgEne < 95) c.buyCoffee(tbDiv, city, 500_000);
				if (office.avgHap < 95 || office.avgMor < 95) c.throwParty(tbDiv, city, 500_000);
			}
		}

		await ns.sleep(10 * 1000);
	}
}