/**
 * Encryption I: Caesar Cipher
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


Caesar cipher is one of the simplest encryption technique. It is a type of substitution cipher in which each letter in the plaintext is replaced by a letter some fixed number of positions down the alphabet. For example, with a left shift of 3, D would be replaced by A, E would become B, and A would become X (because of rotation).

You are given an array with two elements:
  ["ARRAY TRASH FLASH MODEM MACRO", 7]
The first element is the plaintext, the second element is the left shift value.

Return the ciphertext as uppercase string. Spaces remains the same.
 */


/** @param {NS} ns */
export async function main(ns) {

	const input = ["ARRAY TRASH FLASH MODEM MACRO", 7];
	const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
		'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	const alphaStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let output = "";
	ns.tprint(`Test: ${mod(-5, 26)}\n`);
	for (const letter of input[0]) {
		if (letter !== ' ') {
			let index = alphaStr.indexOf(letter);
			index = mod((index - input[1]), 26);
			output += alphaStr[index];
		} else {
			output += ' ';
		}
	}
	ns.tprint(output);
}

function mod(n, m) {
	return ((n % m) + m) % m;
}