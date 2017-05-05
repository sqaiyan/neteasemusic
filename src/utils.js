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
};
function emoji(str) {
	if(!str) return;
	var bl = {
		"大笑": "86",
		"可爱": "85",
		"憨笑": "359",
		"色": "95",
		"亲亲": "363",
		"惊恐": "96",
		"流泪": "356",
		"亲": "362",
		"呆": "352",
		"哀伤": "342",
		"呲牙": "343",
		"吐舌": "348",
		"撇嘴": "353",
		"怒": "361",
		"奸笑": "341",
		"汗": "97",
		"痛苦": "346",
		"惶恐": "354",
		"生病": "350",
		"口罩": "351",
		"大哭": "357",
		"晕": "355",
		"发怒": "115",
		"开心": "360",
		"鬼脸": "94",
		"皱眉": "87",
		"流感": "358",
		"爱心": "33",
		"心碎": "34",
		"钟情": "303",
		"星星": "309",
		"生气": "314",
		"便便": "89",
		"强": "13",
		"弱": "372",
		"拜": "14",
		"牵手": "379",
		"跳舞": "380",
		"禁止": "374",
		"这边": "262",
		"爱意": "106",
		"示爱": "376",
		"嘴唇": "367",
		"狗": "81",
		"猫": "78",
		"猪": "100",
		"兔子": "459",
		"小鸡": "450",
		"公鸡": "461",
		"幽灵": "116",
		"圣诞": "411",
		"外星": "101",
		"钻石": "52",
		"礼物": "107",
		"男孩": "0",
		"女孩": "1",
		"蛋糕": "337",
		18: "186",
		"圈": "312",
		"叉": "313"
	}
	var emojiObjs = [];
	str = str.replace(/\[([^\[\]]+)\]/g, ':$1:')
	var eReg = new RegExp("[:]");
	var array = str.split(eReg);
	for(var i = 0; i < array.length; i++) {
		var ele = array[i];
		var emojiObj = {};
		if(bl[ele]) {
			emojiObj.node = "element";
			emojiObj.tag = "emoji";
			emojiObj.text = bl[ele];
		} else {
			emojiObj.node = "text";
			emojiObj.text = ele;
		}
		emojiObjs.push(emojiObj);
	}
	return emojiObjs;
}
export default {
    time: time,
    clone: deepclone,
    parse_lrc:parse_lrc,
    emoji:emoji
}