var time = function(date) {
        var d = new Date(date)
        var year = d.getFullYear()
        var month = d.getMonth() + 1
        var day = d.getDate()
        var hour = d.getHours()
        var minute = d.getMinutes()
        var second = d.getSeconds();
        var jm = new Date,
            Fo = jm.getTime() - date;
        if (Fo <= 6e4)
            return "刚刚";
        var Qq = jm.getHours() * 36e5 + jm.getMinutes() * 6e4 + jm.getSeconds() * 1e3;
        if (day == jm.getDate()) {
            if (Fo < 36e5) {
                var bOh = Math.floor(Fo / 6e4);
                return bOh + "分钟前"
            }
            return [hour, minute].map(n => {
                n = n.toString()
                return n[1] ? n : '0' + n;
            }).join(':');
        } else {
            if (Fo < Qq + 864e5) {
                return "昨天" + [hour, minute].map(n => {
                    n = n.toString()
                    return n[1] ? n : '0' + n;
                }).join(':');
            } else {
                var hq = jm.getFullYear(),
                    bOg = new Date(hq, 0, 1);
                var Qq = jm.getTime() - bOg.getTime();
                if (Fo < Qq) {
                    return year + "年" + month + "月" + day + "日" + [hour, minute].map(n => {
                        n = n.toString()
                        return n[1] ? n : '0' + n;
                    }).join(':');
                }
                return year + "年" + month + "月" + day + "日"
            }
        }
    }
    //对象克隆
function deepclone(obj) {
    var str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (JSON) {
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                deepclone(obj[i]) : obj[i];
        }
    }
    return newobj;
}
export default {
    time: time,
    clone: deepclone
}