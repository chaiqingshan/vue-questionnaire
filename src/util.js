var util = {
	hasClass(className, elem){
		if(typeof className !== 'string') return;
		var result = false;
		var classNames = elem.className.replace(/^\s+|\s+$/g, '').split(/\s+/);
		var count = classNames.length;
		while(count--){
			if(classNames === classNames[count]) {
				result = true;
			}
		}
		return result;
	},
	setCookie(name,value,expireday){
		var date = new Date();
		date.setDate(date.getDate()+expireday);
		document.cookie = `${name}=${value};expires=${date.toGMTString()}`;
	}
};
export default util;