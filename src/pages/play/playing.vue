<template>
	<div id="playingpage" :class="(playing?'playing':'')">
		<mt-header fixed :title="(music.name||''+' - '+(music.ar||music.artists||[])[0].name)">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
		</mt-header>
		<div id="playing-bg" class="blurbg" :style="{'background-image':'url('+(cover||(music.al||music.album||{}).picUrl)+'?param=500y500)'}"></div>
		<div id="playing-zz" v-show="!showlrc" @click="showlrc=!showlrc">
			<img src="static/images/aag.png" />
		</div>
		<div id="playing-main" v-show="!showlrc" @click="showlrc=!showlrc">
			<img id="playingmainbg" src="static/images/play.png" />
			<div :style="{'background-image':'url('+(cover||(music.al||music.album||{}).picUrl)+'?param=200y200)'}" bindtap="loadlrc" id="pmaincover"></div>
		</div>
		<div id="lrclist" @click="showlrc=!showlrc">
			<lrcTpl :lrc="lrcObj" :showlrc="showlrc" lrcindex="1"></lrcTpl>
		</div>
		<div id="playing-actwrap">
			<div id="playing-info" v-show="!showlrc">
				<div class="pi-act" @click="heart">
					<img :src="'static/images/cm2_play_icn_'+(star?'loved':'love')+'@2x.png'" />
				</div>
				<div class="pi-act" bindtap="downmusic">
					<img src="static/images/cm2_list_detail_icn_share@2x.png" />
				</div>
				<div class="pi-act commentscount">
					<router-link :to="{name:'comment',params:{id:music.id},query:{ctype:2}}">
						<img v-if="!commentscount" src="static/images/cm2_play_icn_cmt@2x.png" />
						<img v-if="commentscount" src="static/images/cm2_play_icn_cmt_num@2x.png" />
						<span v-if="commentscount">{{commentscount>999?'999+':commentscount}}</span>
					</router-link>
				</div>
				<div class="pi-act" @click="pop_tg=1">
					<img src="static/images/cm2_play_icn_more@2x.png" />
				</div>
			</div>
			<playaction v-on:psaction="psaction"></playaction>
			
		</div>
		<pop :show="pop_tg==1" v-on:closepop="pop_tg=0">
			<div class='ppm_header'>{{music.name}}</div>
			<div class='ppm_content'>
				<div class="menu">
					<div class="mn_list" @click="pop_tg=2">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_icn_fav_new@2x.png" alt="" />
						</div>
						<div class="cmain">收藏到歌单</div>
					</div>
					<router-link replace :to="{name:'simi',params:{id:music.id}}" class="mn_list">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_icn_similar_new@2x.png" alt="" />
						</div>
						<div class="cmain">相似推荐</div>
					</router-link>
					<router-link replace v-if="(music.ar||music.artists)[0].id" :to="{name:'artist',params:{id:(music.ar||music.artists)[0].id}}" class="mn_list">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_icn_artist_new@2x.png" alt="" />
						</div>
						<div class="cmain">歌手：{{(music.ar||music.artists)[0].name}}</div>
					</router-link>
					<router-link replace v-if="(music.al||music.album).id" :to="{name:'album',params:{id:(music.al||music.album).id},query:{img:(music.al||music.album).pic_str||(music.al||music.album).pic}}" class="mn_list">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_order_album_new@2x.png" alt="" />
						</div>
						<div class="cmain">专辑：{{(music.al||music.album).name}}</div>
					</router-link>
					<router-link v-if="music.mv" :to="{name:'mv',params:{id:music.mv}}" class="mn_list">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_icn_mv_new@2x.png" alt="" />
						</div>
						<div class="cmain">查看Mv</div>
					</router-link>
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

		<pop :show="pop_tg==3" v-on:closepop="pop_tg=0">
			<div class='ppm_header'>
				<div class="pph_cnt" @click="shuffle"><img :src="'static/images/cm2_play_btn_'+(shuffle_am==0?'loop':(shuffle_am==1?'one':'shuffle'))+'@2x.png'" alt="" />{{(shuffle==1?'列表循环':(shuffle==2?'单曲循环':'随机播放'))}}（{{list_am.length}}）</div>
				<div class="pph_cnt">
					<div><img src="static/images/cm2_btmlay_btn_fav_prs@2x.png" alt="" /><span>收藏</span></div>
					<div @click="delplaylist();pop3=false"><img src="static/images/cm2_btmlay_btn_dlt_prs@2x.png" alt="" /><span>清空</span></div>
				</div>
			</div>
			<div class='ppm_content'>
				<div class="cntloading" v-show="!list_am.length">列表为空</div>
				<div :class="'flexlist ml flex-center '+(re.id===music.id?'cur ':' ')" @click="playindex(idx)" v-for="(re,idx) in list_am" :key="re.id">
					<div class="flexlist">
						<div class="flexleft " v-if="re.id===music.id">
							<div>
								<img src="static/images/aal.png" alt="">
							</div>
						</div>
						<div class="flexmain">
							<div>{{re.name}} - <span>{{(re.ar||re.artists)[0].name}}</span></div>
						</div>
						<div class="flexact">
							<div class="fa_list" @click.stop="delplaylist(idx)">
								<img src="static/images/cm2_playlist_icn_dlt@2x.png" alt="" /></div>
						</div>
					</div>
				</div>
			</div>
		</pop>
	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import api from "@/api"
	import {
		Toast
	} from 'mint-ui';
	import u from "@/utils.js";
	import bs64 from "@/base64";
	import lrcTpl from "@/components/lrc";
	import pop from "@/components/pop"
	import playaction from "@/components/playaction"
	export default {
		name: 'playing',
		data() {
			return {
				loaded: false,
				id: 0,
				showlrc: false,
				cover: "",
				pop_tg: 0
			}
		},
		components: {
			playaction,
			lrcTpl,
			pop
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				//当前播放的音乐的id与路由的id不一样
				if(parseInt(to.params.id) !== parseInt(vm.music.id) || vm.playtype != 1||!vm.playurl) {
					console.log("enter playing page");
					vm.$store.commit("setplaytype", 1);
					if(vm.bgmchange && vm.music.id) {
						vm.$router.replace({
							name: 'playing',
							params: {
								id: vm.music.id
							},
							query: {
								img: (vm.music.al || vm.music.album).pic
							}
						})
						return;
					}
					vm.loaded = false;
					vm.$store.commit("setmusic")
					vm.$store.commit('resetmusic')
					vm.showlrc = false;
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
				console.log("playing watch music");
				if(!this.music.id || this.playtype != 1) return;
				this.showlrc && this.loadLrc(v.id);
				this.$store.commit("resetmusic");
				
				if(!this.playurl) {
					this.cover = "";
					this.$store.dispatch('only_murl');
					this.getcommit()
				}
				(this.$route.name == 'playing') && this.$router.replace({
					name: 'playing',
					params: {
						id: this.music.id
					},
					query: {
						img: (this.music.al || this.music.album).pic
					}
				})
			},
			showlrc(v) {
				if(v && !this.lrcObj.code) {
					this.loadLrc(this.music.id)
				}
			}
		},
		methods: {
			loadLrc(id) {
				id && this.$store.dispatch('getlrc', id);
			},
			playingtoggle() {
				this.$store.commit("setplaying", !this.playing);
			},
			async get() {
				var img = this.$route.query.img;
				img && (this.cover = bs64.id2Url(img));
				await this.$store.dispatch('getmusic', this.$route.params.id);
				if(this.list_am.findIndex((v) => {
						return v.id == this.music.id
					}) == -1) {
					//当前播放列表中没有此歌曲则向列表中添加
					this.list_am.splice(this.index_am + 1, 0, this.music);
					this.$store.commit("setindex", this.index_am + 1)
				}
			},
			getcommit() {
				api.comments(this.music.id, 0, 2).then(res => {
					this.$store.commit('commentscount', res.data.total);
				})
			},
			heart() {
				this.music.id && this.$store.dispatch('heart', {
					id: this.music.id,
					t: this.star
				})
			},
			tracktpl(pid) {
				this.$store.dispatch('tracktpl', {
					id: this.music.id,
					pid: pid,
					add: true
				})
			},
			psaction(){
				this.pop_tg=3
			},
			...mapMutations([
				'playindex',
				'delplaylist',
				'shuffle'
			])
		},
		computed: {
			playlist: function() {

			},
			star: function() {
				//歌曲红心状态
				if(!this.music.id) return 0;
				return this.likeall.indexOf(this.music.id) + 1
			},
			...mapState([
				'playing',
				'music',
				'shuffle_am',
				'likeall',
				'lrcObj',
				'commentscount',
				'list_am',
				'playurl',
				'playtype',
				'bgmchange',
				'uplaylist',
				'index_am'
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
</style>