
/*
	Check whether the string is a hex - e.g. #FF00FF or #FFF.
	TODO: extend string prototype instead.

	@param {this} The string to check.
	@return {boolean} Whether the string is a hex or not.
*/
String.prototype.isHex = function() {

	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this);

};

/*
	Modify a number by a certain distance.
	e.g. modifyNumber(5.89, 10) = 5.89 + 10 * 0.1
	e.g. modifyNumber(58.9, 20) = 58.9 + 20 * 1

	@param {this} The number to modify.
	@param {Number} distance The distance to modify the number by.
	@return {Number} The modified number.
*/
Number.prototype.modifyBy = function(distance) {

	var parts;
	var exponent;
	var factor;
	var result;
	var decimalPlaces;

	// say we have a number: 5.89
	// we first calculate its exponent: 0
	parts = this.toExponential().split('e');
	exponent = Number(parts[1]);

	// next we subtract 1 from the exponent: -1
	exponent = exponent - 1;

	// then we calculate our desired factor: 10^-1 = 0.1
	factor = Math.pow(10, exponent);

	// next we modify the number by the distance
	result = this + distance * factor;

	// finally we make sure not to add rounding errors
	// how many decimal places does the factor (0.1) have?
	decimalPlaces = (factor.toString().split('.')[1] || "").length;

	// round to that many decimal places (e.g. 2)
	// round implementation lifted from https://github.com/mbostock/d3/wiki/Formatting#wiki-d3_round
	var x = result;
	var n = decimalPlaces;
	return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);

};