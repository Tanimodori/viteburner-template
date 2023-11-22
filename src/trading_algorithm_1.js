/** @param {NS} ns */
export async function main(ns) {
	/**
	 * Algorithmic Stock Trader I
You are given the following array of stock prices (which are numbers) where the i-th element
represents the stock price on day i:

130,192,182,172,109,153,68,161,48,102,191,117,92,189,119,82,40,95,41,82,87,20,78,97,69,84,126,142,143,80,16,92,147,84,166,106,146,146,54

Determine the maximum possible profit you can earn using at most one transaction
(i.e. you can only buy and sell the stock once). If no profit can be made then the answer
should be 0. Note that you have to buy the stock before you can sell it.
	 */
	const input = [130, 192, 182, 172, 109, 153, 68, 161, 48, 102, 191, 117, 92, 189, 119,
		82, 40, 95, 41, 82, 87, 20, 78, 97, 69, 84, 126, 142, 143, 80, 16, 92, 147, 84, 166,
		106, 146, 146, 54];
	let maxDailyProfits = [];
	for (const outerDayNum in input) {
		//ns.tprint(`DEBUG: Calculating max profit for day #${outerDayNum}.`);
		const outerPrice = input[outerDayNum];
		let dailyStats = {
			"price": outerPrice,
			"buyDate": outerDayNum,
			"maxSalePrice": outerPrice,
			"saleDate": outerDayNum,
			"profit": 0,
		};
		for (let i = outerDayNum; i < input.length; i++) {
			const newProfit = input[i] - outerPrice;
			if (newProfit > dailyStats["profit"]) {
				dailyStats["maxSalePrice"] = input[i];
				dailyStats["saleDate"] = i;
				dailyStats["profit"] = newProfit;
			}
		}
		//ns.tprint(`DEBUG: Daily max profit was...\n${JSON.stringify(dailyStats, undefined, 2)}`);
		maxDailyProfits.push(dailyStats);
	}
	let maxProfit = undefined;
	for (const dailyStat of maxDailyProfits) {
		if (maxProfit === undefined || dailyStat["profit"] > maxProfit["profit"]) {
			maxProfit = dailyStat;
		}
	}
	ns.tprint(`Input: ${JSON.stringify(input)}`);
	ns.tprint(`Output: ${maxProfit["profit"]}`);
	//ns.tprint(`Output Details: ${JSON.stringify(maxProfit, undefined, 2)}`);
}