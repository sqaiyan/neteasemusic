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
//转换歌词字符串为数组
function parse_lrc(lrc_content) {
  let now_lrc = [];
  let lrc_row = lrc_content.split("\n");
  let scroll = true;
  for (let i in lrc_row) {
    if ((lrc_row[i].indexOf(']') == -1) && lrc_row[i]) {
      now_lrc.push({ lrc: lrc_row[i] });
    } else if (lrc_row[i] != "") {
      var tmp = lrc_row[i].split("]");
      for (let j in tmp) {
        scroll = false
        let tmp2 = tmp[j].substr(1, 8);
        tmp2 = tmp2.split(":");
        let lrc_sec = parseInt(tmp2[0] * 60 + tmp2[1] * 1);
        if (lrc_sec && (lrc_sec > 0)) {
          let lrc = (tmp[tmp.length - 1]).replace(/(^\s*)|(\s*$)/g, "");
          lrc && now_lrc.push({ lrc_sec: lrc_sec, lrc: lrc });
        }
      }
    }
  }
  if (!scroll) {
    now_lrc.sort(function (a, b) {
      return a.lrc_sec - b.lrc_sec;
    });
  }
  return {
    now_lrc: now_lrc,
    scroll: scroll
  };
}
export default {
    time: time,
    clone: deepclone,
    parse_lrc:parse_lrc
}