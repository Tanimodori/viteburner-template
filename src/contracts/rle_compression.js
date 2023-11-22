/** @param {NS} ns */
export async function main(ns) {
	/**
	 * Compression I: RLE Compression
	Run-length encoding (RLE) is a data compression technique which encodes data
	as a series of runs of a repeated single character. Runs are encoded as a length,
	followed by the character itself. Lengths are encoded as a single ASCII digit;
	runs of 10 characters or more are encoded by splitting them into multiple runs.
	
	You are given the following input string:
		wwwwwsrrrrrrrrrrrrOOOOOOOOOOOOOOPPaFdddddddVVVVVVVVVVpppcckkw777777llppppnn
	Encode it using run-length encoding with the minimum possible output length.
	
	Examples:
		aaaaabccc            ->  5a1b3c
		aAaAaA               ->  1a1A1a1A1a1A
		111112333            ->  511233
		zzzzzzzzzzzzzzzzzzz  ->  9z9z1z  (or 9z8z2z, etc.)
	
	 */
	const input = 'wwwwwsrrrrrrrrrrrrOOOOOOOOOOOOOOPPaFdddddddVVVVVVVVVVpppcckkw777777llppppnn';
	let encoding = [];
	let cursorIndex = 1;
	let cursorCharacter = input[cursorIndex];
	let charCount = 1;
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
	ns.tprint("Input: " + input);
	ns.tprint("Raw Output: " + JSON.stringify(encoding));
	let result = '';
	for (const encodingPair in encoding) {
		result += `${encoding[encodingPair][1]}${encoding[encodingPair][0]}`;
	}
	ns.tprint(`Formatted Output: ${result}`);
}