/** @param {NS} ns */
export async function main(ns) {
	const cc = ns.codingcontract;
	const contractMapping = {
		"Find Largest Prime Factor": undefined,
		"Subarray with Maximum Sum": undefined,
		"Total Ways to Sum": undefined,
		"Total Ways to Sum II": undefined,
		"Spiralize Matrix": undefined,
		"Array Jumping Game": undefined,
		"Array Jumping Game II": undefined,
		"Merge Overlapping Intervals": mergeOverlappingIntervals,
		"Generate IP Addresses": undefined,
		"Algorithmic Stock Trader I": algoStockTrader1,
		"Algorithmic Stock Trader II": undefined,
		"Algorithmic Stock Trader III": undefined,
		"Algorithmic Stock Trader IV": undefined,
		"Minimum Path Sum in a Triangle": undefined,
		"Unique Paths in a Grid I": undefined,
		"Unique Paths in a Grid II": undefined,
		"Shortest Path in a Grid": undefined,
		"Sanitize Parentheses in Expression": undefined,
		"Find All Valid Math Expressions": undefined,
		"HammingCodes: Integer to Encoded Binary": undefined,
		"HammingCodes: Encoded Binary to Integer": undefined,
		"Proper 2-Coloring of a Graph": undefined,
		"Compression I: RLE Compression": rleCompression,
		"Compression II: LZ Decompression": undefined,
		"Compression III: LZ Compression": undefined,
		"Encryption I: Caesar Cipher": caesarCipher,
		"Encryption II: Vigenère Cipher": undefined,
	};

	function rleCompression(input) {
		let encoding = [];
		let cursorIndex = 0;
		let cursorCharacter = input[cursorIndex];
		let charCount = 0;
		while (cursorIndex !== input.length) {
			if (cursorCharacter === input[cursorIndex]) {
				if (charCount === 9) {
					encoding.push([cursorCharacter, charCount]);
					charCount = 0;
				}
				charCount++;
				cursorIndex++;
				if (cursorIndex === input.length) {
					encoding.push([cursorCharacter, charCount]);
				}
			} else {
				encoding.push([cursorCharacter, charCount]);
				cursorCharacter = input[cursorIndex];
				charCount = 0;
			}
		}
		//ns.tprint("Input: " + input);
		//ns.tprint("Raw Output: " + JSON.stringify(encoding));
		let result = '';
		for (const encodingPair in encoding) {
			result += `${encoding[encodingPair][1]}${encoding[encodingPair][0]}`;
		}
		//ns.tprint(`Formatted Output: ${result}`);
		return result;
	}

	function algoStockTrader1(input) {
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
		return maxProfit["profit"];
		//ns.tprint(`Output Details: ${JSON.stringify(maxProfit, undefined, 2)}`);

	}

	function caesarCipher(input) {
		const alphaStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let output = "";
		//ns.tprint(`Test: ${mod(-5, 26)}\n`);
		for (const letter of input[0]) {
			if (letter !== ' ') {
				let index = alphaStr.indexOf(letter);
				index = mod((index - input[1]), 26);
				output += alphaStr[index];
			} else {
				output += ' ';
			}
		}
		return output;
	}

	function mod(n, m) {
		return ((n % m) + m) % m;
	}

	function mergeOverlappingIntervals(input) {
		let intervalArray = input.sort(function (a, b) {
			return a[0] - b[0];
		});
		//ns.tprint(`Sorted Intervals: ${JSON.stringify(intervalArray)}`)
		//ns.tprint("DEBUG INSIDE MERGE INTERVALS CALL");
		if (intervalArray.length < 2) {
			return intervalArray;
		}
		let mergelessPass = false;
		let result = intervalArray;
		let debugJ = 0;
		while (!mergelessPass) {
			//ns.tprint(`DEBUG: While-loop interation number ${debugJ}`);
			debugJ++;
			mergelessPass = true;
			let prepassIntervals = result;
			if (prepassIntervals.length === 1) {
				continue;
			}
			let postpassIntervals = [];
			//ns.tprint(`DEBUG: pre-for-loop print of postpassIntervals = ${JSON.stringify(postpassIntervals)}`);
			for (let i = 0; i < prepassIntervals.length; i++) {
				//ns.tprint(`DEBUG: Index of interval1 = ${i}`);
				let interval1 = prepassIntervals[i];
				//ns.tprint(`DEBUG: Interval1 = ${JSON.stringify(interval1)}`);
				//ns.tprint(`DEBUG: Index of interval2 = ${i + 1}`);
				// If at end of prepassIntervals, check to see if we already added the current interval
				if ((i + 1) === prepassIntervals.length) {
					if ((interval1[0] !== postpassIntervals[postpassIntervals.length - 1][0])
						|| (interval1[1] !== postpassIntervals[postpassIntervals.length - 1][1])) {
						postpassIntervals.push(interval1);
					}
					continue;
				}
				let interval2 = prepassIntervals[i + 1];
				//ns.tprint(`DEBUG: Interval2 = ${JSON.stringify(interval2)}`);
				//ns.tprint(`Currently comparing ${JSON.stringify(interval1)} and ${JSON.stringify(interval2)}.`);
				if (interval1[1] >= interval2[0] - 1) {
					//ns.tprint(`DEBUG: Intervals MERGED`);
					mergelessPass = false;
					//ns.tprint(`DEBUG: Merged interval = ${JSON.stringify([interval1[0],Math.max(interval1[1], interval2[1]),])}`);
					postpassIntervals.push([
						interval1[0],
						Math.max(interval1[1], interval2[1]),
					]);
					i++;
				} else {
					ns.tprint(`DEBUG: Intervals NOT merged`);
					postpassIntervals.push(interval1);
					if (i + 2 === prepassIntervals.length) {
						postpassIntervals.push(interval2);
					}
				}
				//ns.tprint(`DEBUG: End-of-for-loop postpastIntervals = ${JSON.stringify(postpassIntervals)}`);
				//ns.tprint(`DEBUG: End-of-for-loop index = ${i}`);
				//ns.tprint(`DEBUG: PrepassIntervals length = ${prepassIntervals.length}`);
				//ns.tprint(`DEBUG: PrepassIntervals = ${JSON.stringify(prepassIntervals)}`);
			}
			result = postpassIntervals;
			//ns.tprint(`Results so far: ${JSON.stringify(result)}`);
		}
		return result;
	}


	function findContracts(currentServer = "home", alreadyVisited = [], foundContracts = [], unsolvedMapping = {}) {
		alreadyVisited.push(currentServer);
		const contracts = ns.ls(currentServer, ".cct");
		if (contracts.length > 0) {
			for (const contract of contracts) {
				const contractType = cc.getContractType(contract, currentServer);
				const contractDescription = cc.getDescription(contract, currentServer);
				const contractData = cc.getData(contract, currentServer);
				const contractNumTries = cc.getNumTriesRemaining(contract, currentServer);
				const contractFunction = contractMapping[contractType];
				if (contractFunction !== undefined) {
					const result = cc.attempt(contractFunction(contractData), contract, currentServer);
					//const result = "";
					let output = "Attempted a contract with the following description:\n\n";
					output += contractDescription;
					output += `\nServer: ${currentServer}`;
					output += `\nInput: ${JSON.stringify(contractData)}`;
					output += `\nAnswer: ${JSON.stringify(contractFunction(contractData))}\n`;
					if (result === "") {
						output += "\nResult: FAILURE";
					} else {
						output += "\nResult: SUCCESS";
						output += "\nReward: " + result;
					}
					ns.tprint(output);
				} else {
					let output = "Found a contract that is currently unsolveable.";
					output += `\nServer: ${currentServer}`;
					output += `\nType: ${contractType}\n\n`;
					if (!unsolvedMapping.hasOwnProperty(contractType)) {
						unsolvedMapping[contractType] = 0;
					}
					unsolvedMapping[contractType]++;
					//ns.tprint(output);
				}
				foundContracts.push({
					"server": currentServer,
					"file": contract,
					"type": contractType,
					//"description": contractDescription,
					//"data": contractData,
					"tries remaining": contractNumTries,
				});
			}
		}
		const neighbors = ns.scan(currentServer);
		for (const server of neighbors) {
			if (!alreadyVisited.includes(server)) {
				findContracts(server, alreadyVisited, foundContracts, unsolvedMapping);
			}
		}
		if (currentServer === "home") {
			ns.tprint(`Found unsolveable contracts: \n${JSON.stringify(unsolvedMapping, undefined, 2)}`);
		}
		return foundContracts;
	}
	const currentContracts = findContracts();
	for (const contract of currentContracts) {
		//ns.tprint(JSON.stringify(contract, undefined, 2));
	}
	//ns.tprint(JSON.stringify(ns.codingcontract.getContractTypes()));
}