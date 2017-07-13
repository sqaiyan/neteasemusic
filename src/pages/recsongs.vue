<template>
	<div class="page_t">
		<mt-header fixed title="每日歌曲推荐">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<div id="recs_header"><img src="http://s2.music.126.net/style/web2/img/recmd_daily.jpg" alt="" />
			<div id="date"><span>{{day}}</span><img src="../../static/images/cm2_daily_cal_bg@2x.png" alt="" /></div>
		</div>
		<div class="plist-detail ml">
			<div id="playall" @click="playall" class="flexlist flex-center">
				<div class="flexlist">
					<div class="flexleft ">
						<img src="../../static/images/pl-playall.png" />
					</div>
					<span id="pa-count">播放全部 <span> (共{{list.length}}首)</span>
					</span>
				</div>
			</div>
			<div class="songs">
				<router-link @click.native="playindex(idx)" :key="re.id" :to="{name:'playing',params:{id:re.id}}" :class="'flexlist flex-center '+(re.id==music.id?'cur':'')" v-for="(re,idx) in list">
					<div class="flexlist">
						<div class="flexleft" v-if="re.id==music.id"><img src="../../static/images/aal.png" alt="" /></div>
						<div class="flexmain">
							<div class="">{{re.name}}<span v-if="re.alias.length">({{re.alias[0]}})</span></div>
							<div class="relistdes">{{re.artists[0].name}}-{{re.album.name}}</div>
						</div>
						<div class="flexact">
							<router-link :to="{name:'mv',params:{id:re.mvid}}" class="fa_list fa_mv" v-if="re.mvid!=0">
								<img src="../../static/images/l0.png" />
							</router-link>
							<div class="fa_list" @click.prevent="moreact(re,idx)">
								<img src="../../static/images/cm2_list_btn_more@2x.png" />
							</div>
						</div>
					</div>

				</router-link>
			</div>
			<loading v-show="!loaded"></loading>
		</div>
		<pop :show="pop_tg==1" v-on:closepop="pop_tg=0">
			<div class='ppm_header'>{{more.name}}</div>
			<div class='ppm_content'>
				<div class="menu">
					<div class="mn_list" @click="pop_tg=2">
						<div class="mn_ico">
							<img src="../../static/images/cm2_lay_icn_fav_new@2x.png" alt="" />
						</div>
						<div class="cmain">收藏到歌单</div>
					</div>
					<router-link :to="{name:'comment',params:{id:more.commentThreadId},query:{ctype:1}}" class="mn_list">
						<div class="mn_ico">
							<img src="../../static/images/cm2_lay_icn_cmt_new@2x.png" alt="" />
						</div>
						<div class="cmain">评论{{comments}}</div>
					</router-link>
					<router-link v-if="more.artists[0].id" :to="{name:'artist',params:{id:more.artists[0].id}}" class="mn_list">
						<div class="mn_ico">
							<img src="../../static/images/cm2_lay_icn_artist_new@2x.png" alt="" />
						</div>
						<div class="cmain">歌手：{{more.artists[0].name}}</div>
					</router-link>
					<router-link :to="{name:'album',params:{id:more.album.id},query:{img:more.album.pic_str||more.album.pic}}" class="mn_list">
						<div class="mn_ico">
							<img src="../../static/images/cm2_lay_order_album_new@2x.png" alt="" />
						</div>
						<div class="cmain">专辑：{{more.album.name}}</div>
					</router-link>
					<router-link v-if="more.mvid" :to="{name:'mv',params:{id:more.mvid}}" class="mn_list">
						<div class="mn_ico">
							<img src="../../static/images/cm2_lay_icn_mv_new@2x.png" alt="" />
						</div>
						<div class="cmain">查看Mv</div>
					</router-link>
					<div class="mn_list" @click="del_rec">
						<div class="mn_ico"><img src="../../static/images/cm2_lay_icn_notinterest_new@2x.png" /></div>
						<div class="cmain">不感兴趣</div>
					</div>
				</div>
			</div>
		</pop>
		<pop :show="pop_tg==2" v-on:closepop="pop_tg=0">
			<div class='ppm_header'>收藏到歌单</div>
			<div class='ppm_content'>
				<div class="flexlist flex-image" @click="tracktpl(re.id)" v-for="re in uplaylist" :key="re.id">
					<div class="flexlist">
						<div class="flexleft fl-image ml">
							<img :src="re.coverImgUrl+'?param=100y100'" class="album_cover" />
						</div>
						<div class="flexmain">
							<div>{{re.name}}</div>
							<div class="relistdes">{{re.trackCount}}首</div>
						</div>
					</div>
				</div>
			</div>
		</pop>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/api';
	import loading from "@/components/loading"
	import playico from "@/components/playico";
	import utils from "@/utils";
	import pop from "@/components/pop"
	import {
		Toast
	} from 'mint-ui';
	export default {
		name: 'recsong',
		data() {
			return {
				loaded: false,
				day: new Date().getDate(),
				list: [],
				more: {
					artists: [{}],
					album: {}
				},
				pop_tg: 0,
				comments: 0,
				idx: -1
			}
		},
		components: {
			loading,
			playico,
			pop
		},
		created() {
			api.user_recs().then(res => {
				this.list = res.data.recommend
				this.loaded = true
			})
		},
		methods: {
			
			playindex(i){
				this.$store.commit("setplaytype",1);
				this.$store.commit("setplaylist",this.list);
				this.$store.commit("playindex",i);
			},
			playall(){
				this.playindex(0);
				this.$store.dispatch("only_murl");
				api.comments(this.music.id, 0, 2).then(res => {
					this.$store.commit('commentscount', res.data.total);
				})
			},
			moreact(music, idx) {
				this.comments = 0;
				this.idx = idx
				api.comments(music.commentThreadId, 0, 1).then(res => {
					this.comments = res.data.total;
					this.more = music;
					this.pop_tg = 1;
				})
			},
			del_rec() {
				//接口不对
				return;
				api.dislike(this.more.id, this.more.rtype).then(res => {
					if(res.data.code == 200) {
						console.log(this.idx, res.data.data[1]);
						this.list[this.idx] = res.data.data[1];
						this.more = {
							artists: [{}],
							album: {}
						};
						this.pop_tg = 0
					} else {
						Toast({
							message: res.data.message,
							duration: 3000
						});
					}
				})
			},
			tracktpl(pid) {
				this.$store.dispatch('tracktpl', {
					id: this.more.id,
					pid: pid,
					add: true
				})
			},
		},
		computed: {
			...mapState([
				'uplaylist',
				'music'
			])
		}
	}
</script>

<style scoped>
	#recs_header {
		position: relative
	}
	
	#recs_header img {
		width: 100%;
		vertical-align: top
	}
	
	#date {
		position: absolute;
		left: 5%;
		top: 50%;
		text-align: center;
		transform: translateY(-50%);
		width: 5em;
	}
	
	#date span {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		width: 100%;
		color: #BB2C08;
		font-size: 2em;
	}
</style>