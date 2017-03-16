module.exports = function isSelectorInPrefixArray (prefixArray) {
	return function (selector) {
		if (!Array.isArray(prefixArray)) {
			prefixArray = [prefixArray];
		}
		return prefixArray.some((prefix)=> {
			return new RegExp("^\\[?" + prefix).test(selector);
		});

	};
};
