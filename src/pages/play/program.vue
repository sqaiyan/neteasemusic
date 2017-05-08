<template>
	<div id="playingpage" :class="(playing?'playing':'')">
		<mt-header fixed :title="(music.name)">
			<mt-button slot="left" @click="$router.go(-1)" icon="back">返回</mt-button>
		</mt-header>
		<div id="playing-bg" class="blurbg" :style="{'background-image':'url('+(cover||(music.mainSong.album||{}).picUrl)+')'}">{{cover}}----</div>
		<div id="playing-zz" v-show="!showlrc" @click="showlrc=!showlrc">
			<img src="../../../static/images/aag.png" />
		</div>
		<div id="playing-main" v-show="!showlrc" @click="showlrc=!showlrc">
			<img id="playingmainbg" src="../../../static/images/play.png" />
			<div :style="{'background-image':'url('+(cover||(music.mainSong.album||{}).picUrl)+'?param=200y200)'}" bindtap="loadlrc" id="pmaincover"></div>
		</div>
		<div id="playing-actwrap">
			<div id="playing-info" v-show="!showlrc">
				<div class="pi-act commentscount" @click="heart">
					<img :src="'../../../static/images/cm2_play_icn_'+(!program.liked?'praise':'yizan')+'@2x.png'" />
					<span>{{program.likedCount}}</span>
				</div>
				<div class="pi-act" bindtap="downmusic">
					<img src="../../../static/images/cm2_list_detail_icn_share@2x.png" />
				</div>
				<div class="pi-act commentscount">
					<router-link :to="{name:'comment',params:{id:music.id},query:{ctype:2}}">
						<img v-if="!commentscount" src="../../../static/images/cm2_play_icn_cmt@2x.png" />
						<img v-if="commentscount" src="../../../static/images/cm2_play_icn_cmt_num@2x.png" />
						<span v-if="commentscount">{{commentscount>999?'999+':commentscount}}</span>
					</router-link>
				</div>
				<div class="pi-act">
					<img src="../../../static/images/cm2_play_icn_more@2x.png" />
				</div>
			</div>
			<playpercent :playtime="playtime" v-on:change="change" :musicloading="musicloading" :duration="music.dt"></playpercent>
			<div id="playingaction">
				<div class="pa-saction" @click="setshuffle" v-if="shuffle==1">
					<img :src="'../../../static/images/cm2_icn_'+(shuffle==1?'order':(shuffle==2?'one':'shuffle'))+'@2x.png'" />
				</div>

				<div class="pa-maction" @click="prev" bindtap="playother">
					<img src="../../../static/images/ajh.png" />
				</div>
				<div class="pa-baction" @click="playingtoggle">
					<img id='pa-playing' :src="'../../../static/images/aj'+(playing?'d':'f')+'.png'" />
				</div>

				<div class="pa-maction" @click="next">
					<img src="../../../static/images/ajb.png" />
				</div>
				<div class="pa-saction" @click="pop_tg=3">
					<img src="../../../static/images/cm2_icn_list@2x.png" />
				</div>
			</div>
		</div>

		<pop :show="pop_tg==3" v-on:closepop="pop_tg=0">
			<div class='ppm_header'>
				<div class="pph_cnt">{{(shuffle==1?'列表循环':(shuffle==2?'单曲循环':'随机播放'))}}（{{list_dj.length}}）</div>
				<div class="pph_cnt">
					<div><img src="../../../static/images/cm2_btmlay_btn_fav_prs@2x.png" alt="" /><span>收藏</span></div>
					<div @click="delplaylist();pop3=false"><img src="../../../static/images/cm2_btmlay_btn_dlt_prs@2x.png" alt="" /><span>清空</span></div>
				</div>
			</div>
			<div class='ppm_content'>
				<div class="cntloading" v-show="!list_dj.length">列表为空</div>
				<div :class="'flexlist ml flex-center '+(re.id===music.id?'cur ':' ')" @click="playindex(idx)" v-for="(re,idx) in list_dj" :key="re.id">
					<div class="flexlist">
						<div class="flexleft " v-if="re.id===music.id">
							<div>
								<img src="../../../static/images/aal.png" alt="">
							</div>
						</div>
						<div class="flexmain">
							<div>{{re.name}} - <span>{{re.artists[0].name}}</span></div>
						</div>
						<div class="flexact">
							<div class="fa_list" @click.stop="delplaylist(idx)">
								<img src="../../../static/images/cm2_playlist_icn_dlt@2x.png" alt="" /></div>
						</div>
					</div>
				</div>
			</div>
		</pop>
	</div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import api from "@/api"
	import {
		Toast
	} from 'mint-ui';
	import u from "@/utils.js";
	import bs64 from "@/base64";
	import lrcTpl from "@/components/lrc";
	import pop from "@/components/pop"
	import playpercent from "@/components/playpercent"
	export default {
		name: 'program',
		data() {
			return {
				showlrc:false,
				loaded: false,
				id: 0,
				cover: "",
				pop_tg: 0,
				program: {}
			}
		},
		components: {
			playpercent,
			lrcTpl,
			pop
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				//当前播放的音乐的id与路由的id不一样
				console.log(vm.bgmchange, to.params.id, vm.music.id);
				if((parseInt(to.params.id) !== parseInt(vm.music.id)) && vm.setplaytype != 2) {
					vm.$store.commit("setplaytype", 3);
					if(vm.bgmchange && vm.music.id) {
						vm.$router.replace({
							name: 'program',
							params: {
								id: vm.music.id
							},
							query: {
								img: vm.music.album.picUrl
							}
						})
						return;
					}
					vm.loaded = false;
					vm.$store.commit("setmusic", {
						mainSong:{
							album:{}
						}
					})
					vm.$store.commit('resetmusic')
					vm.cover = ""
					vm.get();

				}
			})
		},
		beforeRouteLeave(to, from, next) {
			this.pop_tg = 0;
			this.showlrc = false;
			next()
		},
		watch: {
			music(v) {
				if(!this.music.id || this.playtype != 1) return;
				this.showlrc && this.loadLrc(v.id);
				this.$store.commit("resetmusic");
				this.cover = "";
				this.getcommit()
					((this.$router.name == 'program') && this.bgmchange) && this.$router.replace({
						name: 'program',
						params: {
							id: this.music.id
						},
						query: {
							img: this.music.al.pic
						}
					})
			}
		},
		methods: {
			playingtoggle() {
				this.$store.commit("setplaying", !this.playing);
			},
			async get() {
				var img = this.$route.query.img;
				this.id = this.$route.params.id;
				img && (this.cover = bs64.id2Url(img));
				api.program_detail(this.id).then(res => {
					this.program = res.data.program;
					this.$store.commit("setmusic", res.data.program);
					this.getcommit()
				})
			},
			getcommit() {
				api.comments(this.program.commentThreadId, 0, 1).then(res => {
					this.$store.commit('commentscount', res.data.total);
				})
			},
			heart() {
				this.program.id && this.$store.dispatch('heart', {
					id: this.music.id,
					t: this.star
				})
			},
			change(v) {
				this.$store.commit("seekmusic", v)
			},
			...mapMutations([
				'next',
				'prev',
				'setshuffle',
				'playindex',
				'delplaylist'
			])
		},
		computed: {
			...mapGetters([
				'playing',
				'music',
				'playtime',
				'shuffle',
				'commentscount',
				'musicloading',
				'list_dj',
				'playtype',
				'bgmchange'
			])
		}
	}
</script>

<style scoped>
	.mint-header {
		background: rgba(0, 0, 0, 0);
		border-bottom: 1px solid rgba(255, 255, 255, .2);
	}
	
	.blurbg {
		z-index: 0;
		height: 100%;
		padding: 0;
		background-position: center center;
		background-size: auto 100%;
	}
	
	.mn_list {}
</style>