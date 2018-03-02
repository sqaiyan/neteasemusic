<template>
	<div>
		<!-- -->
		<mt-swipe>
			<mt-swipe-item v-for="item in banner" :key="item.targetId"><img :src="item.pic" class="banner-item" alt=""></mt-swipe-item>
		</mt-swipe>
		<div v-if="!rec_loaded" id="album_loading"><img src="../../../../static/images/cm2_discover_icn_start_big@2x.png" alt=""> 正在为您生成个性化推荐...
		</div>
		<div v-else>
			<div id="rec_nav">
				<router-link :to="{name:'fm'}">
					<div class="recn_ico">
						<img src="../../../../static/images/cm2_discover_icn_fm-ip6@2x.png">
					</div>
					私人FM
				</router-link>
				<router-link :to="{name:'recsong'}">
					<div class="recn_ico"><img src="../../../../static/images/cm4_disc_topbtn_daily-ip6@2x.png" alt="" /><span>{{thisday}}</span></div>
					每日歌曲推荐
				</router-link>
				<router-link :to="{name:'playlist',params:{id:3778678},query:{name:'云音乐热歌榜'}}">
					<div class="recn_ico">
						<img src="../../../../static/images/cm2_discover_icn_upbill-ip6@2x.png">
					</div>
					云音乐热歌榜
				</router-link>
			</div>
			<router-link :to="{path: 'playlist'}" class="listheader"><span>推荐歌单</span><img src="../../../../static/images/common_icon_arrow@2x.png" alt="" /></router-link>
			<div class="flex-boxlist">
				<router-link class="tl_cnt" :key="item.id" v-for="item in rec_pl" :to="{name: 'playlist',params: { id: item.id},query:{img: item.pic,name:item.name}}">
					<div class="cover">
						<img :src="item.picUrl+'?param=200y200'" class="music_cover" />
					</div>
					<div class="name">{{item.name}}
					</div>
				</router-link>
			</div>
			<!-- -->
			<div class="listheader"><span>最新音乐</span><img src="../../../../static/images/common_icon_arrow@2x.png" alt="" /></div>
			<div class="flex-boxlist">
				<!-- 
				<div class="tl_cnt">
					<div class="cover">
						<img src="../../../../static/images/cm4_disc_cover_new@2x.png" class="music_cover" />
					</div>
					<div class="tl_info">
						<div>新歌推荐</div>
						<div class="tli_des">推荐合口味的新歌</div>
					</div>
				</div> -->
				<router-link class="tl_cnt" :key="item.id" v-for="(item,index) in rec_ns" v-if="index<6" :to="{name: 'album',params: { id: item.song.album.id},query:{img:item.song.album.picId_str||item.song.album.picId||item.song.album.pic}}">
					<div class="cover">
						<img :src="item.song.album.picUrl+'?param=200y200'" class="music_cover" />
					</div>
					<div class="tl_info">
						<div>{{item.name}}</div>
						<div class="tli_des">{{item.song.artists[0].name}}</div>
					</div>
				</router-link>
			</div>
			<!-- -->
			<div class="listheader"><span>推荐Mv</span><img src="../../../../static/images/common_icon_arrow@2x.png" alt="" /></div>
			<div class="flex-boxlist  mvs flex-two">
				<router-link class="tl_cnt" :key="item.id" v-for="item in rec_mv" :to="{name: 'mv',params: { id: item.id, name: item.name}}">
					<div class="cover">
						<img :src="item.picUrl+'?param=320y180'" class="music_cover" />
					</div>
					<div class="tl_info">
						<div>{{item.name}}</div>
						<div class="tli_des">{{item.artistName}}</div>
					</div>
				</router-link>
			</div>
			<!-- -->
			<div class="listheader"><span>推荐节目</span><img src="../../../../static/images/common_icon_arrow@2x.png" alt="" /></div>
			<div class="flex-boxlist">
				<router-link class="tl_cnt" :key="item.id" v-for="item in rec_dj" :to="{name: 'program',params: { id: item.id, name: item.name}}">
					<div class="cover">
						<img :src="item.picUrl+'?param=200y200'" class="music_cover" />
					</div>
					<div class="name">{{item.name}}
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import api from '@/api'
	export default {
		data() {
			return {
				thisday: (new Date()).getDate(),
				rec_loaded: false,
				banner: [],
				rec_pl: [],
				rec_ns: [],
				rec_mv: [],
				rec_dj: []
			}
		},
		created() {
			this.get()
		},
		methods: {
			get() {
				api.index_rec().then(res => {
					this.rec_loaded = true
					this.banner = res[0]
					var pl_arr = res[1];
					pl_arr.forEach(v => {
						v.pic = this.picurlTn(v.picUrl);
					})
					this.rec_pl = pl_arr
					this.rec_ns = res[2];
					this.rec_mv = res[3];
					this.rec_dj = res[4];
				}).catch(err => {
					console.log(err);
					this.rec_loaded = true;
				})
			},
			picurlTn(s) {
				var arr = s.split("/");
				arr = arr[arr.length - 1];
				return arr.split(".")[0]
			}
		}
	}
</script>

<style scoped>
	.mint-swipe {
		height: 0;
		padding-top: 38.9%
	}
	
	#rec_nav {
		display: flex;
		text-align: center;
		width: 100%;
		border-bottom: 1px solid #eee;
		font-size: .667rem;
	}
	
	#rec_nav a {
		padding: 1.5em 0 1em;
		display: block;
		flex: 1;
	}
	
	.recn_ico {
		width: 50%;
		height: 0;
		padding-top: 50%;
		font-size: 1.3em;
		color: #BB2C08;
		border: 1px solid #BB2C08;
		border-radius: 50%;
		margin: 0 auto .5em;
		font-weight: 100;
		position: relative;
		line-height: 0;
		overflow: hidden;
		box-sizing: content-box;
	}
	
	.recn_ico span {
		position: absolute;
		top: 55%;
		transform: translateY(-50%);
		width: 100%;
		left: 0
	}
	
	.recn_ico img {
		width: 100%;
		position: absolute;
		top: 0;
		left: 0
	}
	
	#album_loading {
		text-align: center;
		color: #999;
		padding: 2em 0
	}
	
	#album_loading img {
		width: 12%;
		animation: circle infinite 1.5s linear;
		display: block;
		margin: 1em auto;
		border-radius: 50%;
		border: 1px solid #999
	}
</style>