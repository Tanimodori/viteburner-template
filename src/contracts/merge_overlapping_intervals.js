/** @param {NS} ns */
export async function main(ns) {
	/**
   * Merge Overlapping Intervals
  You are attempting to solve a Coding Contract. You have 15 tries remaining, after which the contract will self-destruct.
  
  
  Given the following array of arrays of numbers representing a list of intervals, merge all overlapping intervals.
  
  [[5,10],[13,16],[19,23],[18,19],[12,14],[16,17],[16,18],[19,23],[24,29],[19,27],[2,5],[21,23],[6,15],[10,16],[6,9],[8,14],[25,28]]
  
  Example:
  
  [[1, 3], [8, 10], [2, 6], [10, 16]]
  
  would merge into [[1, 6], [8, 16]].
  
  The intervals must be returned in ASCENDING order. You can assume that in an interval, the first number will always be smaller than the second.
   */
	const input = [
		[14,16],[2,5],[8,11],[8,15],[14,19],[20,28],[3,6],[5,10],[18,24],[17,25],[13,14],[24,28],[19,26],[24,31],[1,2],[11,18]
	];
	const testInput = [
		[1, 3],
		[8, 10],
		[2, 6],
		[10, 16],
	];
	const expectedTestOutput = [
		[1, 6],
		[8, 16],
	];
	let sortedTestInput = testInput.sort(function (a, b) {
		return a[0] - b[0];
	});
	ns.tprint(JSON.stringify(sortedTestInput));



	ns.tprint(JSON.stringify(mergeIntervals(ns, sortedTestInput)));

	let sortedInput = input.sort(function (a, b) {
		return a[0] - b[0];
	});
	ns.tprint(JSON.stringify(sortedInput));
	const answer = mergeIntervals(ns, sortedInput);
	ns.tprint(`Answer: ${JSON.stringify(answer)}`);
	//ns.tprint(JSON.stringify(mergeIntervals(ns, sortedInput)));
}

/** @param {NS} ns */
function mergeIntervals(ns, intervalArray) {
	ns.tprint("DEBUG INSIDE MERGE INTERVALS CALL");
	if (intervalArray.length < 2) {
		return intervalArray;
	}
	let mergelessPass = false;
	let result = intervalArray;
	while (!mergelessPass) {
		mergelessPass = true;
		let prepassIntervals = result;
		if (prepassIntervals.length === 1) {
			continue;
		}
		let postpassIntervals = [];
		for (let i = 0; i < prepassIntervals.length - 1; i++) {
			let interval1 = prepassIntervals[i];
			let interval2 = prepassIntervals[i + 1];
			ns.tprint(`Currently comparing ${JSON.stringify(interval1)} and ${JSON.stringify(interval2)}.`);
			if (interval1[1] >= interval2[0] - 1) {
				ns.tprint(`Intervals MERGED`);
				mergelessPass = false;
				postpassIntervals.push([
					interval1[0],
					Math.max(interval1[1], interval2[1]),
				]);
				i++;
			} else {
				ns.tprint(`Intervals NOT merged`);
				postpassIntervals.push(interval1);
				if (i + 2 === prepassIntervals.length) {
					postpassIntervals.push(interval2);
				}
			}
		}
		result = postpassIntervals;
		ns.tprint(`Results so far: ${JSON.stringify(result)}`);
	}
	return result;
}