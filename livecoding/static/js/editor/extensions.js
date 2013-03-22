/*
	Check whether the string is a hex - e.g. #FF00FF or #FFF.
	TODO: extend string prototype instead.

	@param {this} The string to check.
	@return {boolean} Whether the string is a hex or not.
*/
String.prototype.isHex = function() {

	return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(this);

};