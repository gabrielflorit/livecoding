var lc = lc || {}; 

lc.util = {

	/*
		Check whether the string is a hex - e.g. #FF00FF.
		TODO: extend string prototype instead.

		@param {string} value The string to check.
		@return {boolean} Whether the string is a hex or not.
	*/
	isHexString: function(value) {
		return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value);
	},

	/*
		Modify a number by a certain distance.
		e.g. modifyNumber(5.89, 10) = 5.89 + 10 * 0.1
		e.g. modifyNumber(58.9, 20) = 58.9 + 20 * 1

		@param {Number} number The number to modify.
		@param {Number} distance The distance to modify the number by.
		@return {Number} The modified number.
	*/
	modifyNumber: function(number, distance) {

		var parts;
		var exponent;
		var factor;
		var result;
		var decimalPlaces;

		// say we have a number: 5.89
		// we first calculate its exponent: 0
		parts = number.toExponential().split('e');
		exponent = Number(parts[1]);

		// next we subtract 1 from the exponent: -1
		exponent = exponent - 1;

		// then we calculate our desired factor: 10^-1 = 0.1
		factor = Math.pow(10, exponent);

		// next we modify the number by the distance
		result = number + distance * factor;

		// finally we make sure not to add rounding errors
		// how many decimal places does the factor (0.1) have?
		decimalPlaces = (factor.toString().split('.')[1] || "").length;

		// round to that many decimal places (2)
		return d3.round(result, decimalPlaces);
	}

};