function playcount(v){
	if(!v)return "";
	return v < 10e3 ? v : ((v / 10e3).toFixed(0) + '万')
}
function time(date){
	if(!date) return '';
	date = new Date(date);
	var m=date.getMonth()+1;
	m=m>9?m:`0${m}`;
	var d=date.getDate();
	d=d>9?d:`0${d}`;
	return date.getFullYear() + '-' + m + '-' + d
}
export default {
	playcount:playcount,
	time:time
}