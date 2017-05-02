<template>
	<div>
		<div class="limg_list rec_list" v-for="(item,index) in list" :key="item.commentId">
			<div class="rec_avatar">
				<img class="user_avator" :src="item.user.avatarUrl+'?param=60y60'" />
			</div>
			<div class="rec_main">
				<div class="rm_header">
					<div>
						<span>{{item.likedCount}}</span>
						<img src="../../..../../static/images/xg.png" v-if="!item.liked" />
						<img src="../../..../../static/images/xi.png" v-else />
					</div>
					<span class="fmh_name">{{item.user.nickname}}</span>
					<span class="fmh_time">{{item.time|time}}</span>
				</div>
				<div class="rm_cnt">
					<span v-if="item.beReplied.length">回复 <span class="replyname">@{{item.beReplied[0].user.nickname}}</span>：</span>
					<div class="WxEmojidiv">
						<span v-for="re in emoji(item.content)" :key="re.id">
                      <span v-if="re.node == 'text'">{{re.text}}</span>
						<span v-if="re.node == 'element'"><img class="wxEmoji" :src="'http://s1.music.126.net/style/web2/emt//emoji_'+re.text+'.png'" /></span>
						</span>
					</div>
					<div class="rmc_reply" v-if="item.beReplied.length">
						<span class="replyname">@{{item.beReplied[0].user.nickname}}</span>：
						<div class="WxEmojidiv">
							<span v-for="r in emoji(item.beReplied[0].content)">
                        <span v-if="r.node == 'text'">{{r.text}}</span>
							<span v-if="r.node == 'element'"><img class="wxEmoji" :src="'http://s1.music.126.net/style/web2/emt//emoji_'+r.text+'.png'" /></span>
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import utils from "@/utils.js";
	export default {
		name: 'comment',
		props: {
			list: Array
		},
		methods: {
			emoji(str) {
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
		},
		filters: {
			time(date) {
				return utils.time(date);
			}
		}
	}
</script>

<style scoped>

</style>