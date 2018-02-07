import * as $ from "jquery";

function Finder(rawString) {
	this.rawString = rawString;
}
Finder.prototype.isFind = function() {
	const result = [];
	function onFind(str, index1, index2) {
		result.push({ str, index1, index2 });
	}
	this.find(onFind);
	return result.length > 0;
};
Finder.prototype.find = function(onFind) {
	const self = this;
	function onGetFirstString(str1, index1) {
		function onGetSecondString(str2, index2) {
			if (str1 === str2) {
				onFind(str1, index1, index2);
			}
		}
		self.getSecondString(str1, index1, onGetSecondString);
	}
	this.getFirstString(onGetFirstString);
};
Finder.prototype.getFirstString = function(onGetFirstString) {
	for (let start = 0; start < this.rawString.length; start++) {
		for (let end = start + 1; end < this.rawString.length; end++) {
			onGetFirstString(this.rawString.substring(start, end), start);
		}
	}
};
Finder.prototype.getSecondString = function(str1, index1, onGetSecondString) {
	const str2StartIndex = index1 + str1.length;
	const str2EndIndex = index1 + str1.length + str1.length;
	if (str2EndIndex <= this.rawString.length) {
		let str2 = this.rawString.substring(str2StartIndex, str2EndIndex);
		onGetSecondString(str2, str2StartIndex);
	}
};

$(() => {
	const result = new Finder("abcaaabc").isFind();
	console.log(result);
});
