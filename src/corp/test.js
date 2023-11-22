/** @param {NS} ns */
export async function main(ns) {
	//ns.tprint(document);
	//ns.tprint(JSON.stringify(document, undefined, 2));
	//for (const key of Object.keys(window)) {
	//ns.tprint(window[key]);
	//ns.tprint(JSON.stringify(window[key], undefined, 2));
	//}
	//let keys = Object.getOwnPropertyNames(self);
	//ns.tprint(JSON.stringify(keys, undefined, 2));
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
		"Sector-12",
		"New Tokyo",
		"Ishima",
		"Volhaven",
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

	await waitForStage("START");
	for (let city of cities) {
		//for (let materialName of Object.keys(materialPhases)) {
			c.buyMaterial(tbDiv["name"], city, Object.keys(materialPhases)[2], 100000 / 10);
			//c.buyMaterial(agDiv["name"], cities[5], materialName, materialPhases[materialName][1] / 10);
		//}
	}
	await waitForStage("PRODUCTION");
	for (let city of cities) {
		//for (let materialName of Object.keys(materialPhases)) {
			c.buyMaterial(tbDiv["name"], city, Object.keys(materialPhases)[2], 0);
			//c.buyMaterial(agDiv["name"], cities[5], materialName, 0);
		//}
	}
	async function waitForStage(state) {
		while (ns.corporation.getCorporation().state !== state) {
			await ns.sleep(100);
		}
	}
}