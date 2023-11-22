/** @param {NS} ns */
export async function main(ns) {
	ns.tail(); ns.disableLog("ALL"); ns.clearLog();

	const corpName = "grgcorp";
	const agDiv = {
		"name": "AG",
		"type": "Agriculture"
	};
	const tbDiv = {
		"name": "TB",
		"type": "Tobacco"
	};
	const jobs = [
		"Operations",
		"Engineer",
		"Business",
		"Management",
		"Research & Development",
	];
	const boostMaterials = [
		"Hardware",
		"Robots",
		"AI Cores",
		"Real Estate",
	]
	const materialPhases = {
		"Hardware": [125, 2675, 6500],
		"Robots": [0, 96, 630],
		"AI Cores": [75, 2445, 3750],
		"Real Estate": [27000, 119400, 84000]
	};
	const cities = [
		"Aevum",
		"Chongqing",
		"New Tokyo",
		"Ishima",
		"Volhaven",
		"Sector-12",
	];
	const levelUpgrades = [
		"Smart Factories",
		"Smart Storage",
		"FocusWires",
		"Neural Accelerators",
		"Speech Processor Implants",
		"Nuoptimal Nootropic Injector Implants",
		"Wilson Analytics",
	];
	const hirePatterns = [
		"ag-all",
		"tb-man",
		"tb-rnd",
	]
	const states = [
		"START",
		"PURCHASE",
		"PRODUCTION",
		"EXPORT",
		"SALE",
	];
	const c = ns.corporation;

	const corpProgress = {
		"Initialized Corp": true,
		"Initialized Agriculture": true,
		"1st Warehouse Expansion": true,
		"1st Corp Upgrade Purchases": true,
		"1st Ag Upgrade Material Purchases": true,
	}

	function onExitActions() {
		ns.print(`State at exit:\n${JSON.stringify(corpProgress, undefined, 2)}`);
	}
	ns.atExit(onExitActions);

	let stage = 0;
	let step = 0;

	if (corpProgress["Initialized Corp"] === false) {
		try {
			c.createCorporation(corpName, false);
			ns.print(`Created corp via investors.`);
		} catch {
			try {
				c.createCorporation(corpName, true);
				ns.print(`Created corp via self-funding.`);
			} catch {
				try {
					c.getCorporation();
				} catch {
					ns.print(`DEV ERROR! Couldn't create or get corp reference for unknown reasons.`);
					c.getCorporation();
					ns.exit();
				}
			}
		}
	}
	corpProgress["Initialized Corp"] = true;

	if (corpProgress["Initialized Agriculture"] === false) {
		c.expandIndustry(agDiv["type"], agDiv["name"]);
		c.unlockUpgrade("Smart Supply");
		for (const city of cities) {
			if (city !== "Sector-12") {
				c.expandCity(agDiv["name"], city);
				c.purchaseWarehouse(agDiv["name"], city);
			}
			c.setSmartSupply(agDiv["name"], city, true);
			autoHireAndAssignToMax(agDiv["name"], city, "ag-all");
		}
	}

	if (corpProgress["1st Ag Upgrade Material Purchases"] === false) {
		await waitForStage("START");
		for (let city of cities) {
			for (let materialName of Object.keys(materialPhases)) {
				c.buyMaterial(agDiv["name"], city, materialName, materialPhases[materialName][0] / 10);
			}
		}
		await waitForStage("PRODUCTION");
		for (let city of cities) {
			for (let materialName of Object.keys(materialPhases)) {
				c.buyMaterial(agDiv["name"], city, materialName, 0);
			}
		}

	}
	corpProgress["1st Ag Upgrade Material Purchases"] = true;

	async function waitForStage(state) {
		while (ns.corporation.getCorporation().state !== state) {
			await ns.sleep(100);
		}
	}

	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	function autoHireAndAssignToMax(divName, cityName) {
		const office = c.getOffice(divName, cityName);
		ns.print(`Hiring more employees at '${cityName}' for division '${divName}'.`);
		let isTbRnd = false;
		while (c.hireEmployee(divName, cityName)) { };
		if (divName === tbDiv["name"] && cityName === "Aevum") {
			ns.print(`WARN: Tobacco Manufacturing hiring pattern not implemented yet. Falling back to agriculture pattern without R&D jobs.`);
			isTbRnd = true;
		}
		for (let i = office.employees; i < office.size; i++) {
			c.hireEmployee(divName, cityName);
			if (divName === agDiv["name"]) {
				c.setAutoJobAssignment(divName, cityName, jobs[mod(i, jobs.length)], 1);
			} else if (isTbRnd) {
				c.setAutoJobAssignment(divName, cityName, jobs[mod(i, jobs.length - 1)], 1);
			} else if (divName === tbDiv["name"] && cityName !== "Aevum") {
				if (i < jobs.length) {
					c.setAutoJobAssignment(divName, cityName, jobs[mod(i, jobs.length)], 1);
				} else {
					c.setAutoJobAssignment(divName, cityName, "Research & Development", 1);
				}
			} else {
				ns.print(`WARN: Unknown hiring state. Not assigning hired employee.`);
			}
		}
	}
}