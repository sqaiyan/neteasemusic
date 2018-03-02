<template>
	<div>
		<div class="limg_list rec_list" v-for="(item,index) in list">
			<div class="rec_avatar">
				<img class="user_avator" :src="item.user.avatarUrl+'?param=60y60'" />
			</div>
			<div class="rec_main">
				<div class="rm_header">
					<div>
						<span>{{item.likedCount}}</span>
						<img src="../../static/images/xg.png" v-if="!item.liked" />
						<img src="../../static/images/xi.png" v-else />
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
				return utils.emoji(str)
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