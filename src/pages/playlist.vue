<template>
	<div>
		<div id="headerblur">
			<div class="blurbg" :style="{'background-image':'url('+cover+')','top':-scrolltop+'px'}"></div>
		</div>
		<mt-header fixed :title="(title||list.playlist.name)">
			<mt-button slot="left" @click="$router.go(-1)" icon="back">返回</mt-button>
			<playico :playtype="playtype" slot="right" :playing="playing" :music="music"></playico>
		</mt-header>
		<div id="plist-header" ref="main">
			<div class="blurbg" :style="{'background-image':'url('+cover+')'}"></div>
			<div id="plh-main">
				<div id="plh-cover">
					<img class="music_cover" :src="cover" />
					<div class="img_playcount" v-if="list.playlist.playCount">
						<img src="../../static/images/p0.png" />{{list.playlist.playCount|playcount}}</div>
					<div id="plh-playinfo">
						<img src="../../static/images/cm2_list_detail_icn_infor@2x.png" />
					</div>
				</div>
				<div id="plh-cnt">
					<span id="music_h_name">{{name||list.playlist.name}}</span>
					<div>
						<img id="user_ava" class="user_avator" :src="list.playlist.creator.avatarUrl" />
						<span>{{list.playlist.creator.nickname||" "}} </span>
						<img src="../../static/images/cm2_list_detail_icn_arr@2x.png" style="height:1.2em;" />
					</div>
				</div>
			</div>
			<div id="plh_action">
				<div>
					<img src="../../static/images/cm2_list_detail_icn_fav_new@2x.png" v-if="!list.playlist.subscribed" />
					<img src="../../static/images/cm2_list_detail_icn_faved@2x.png" v-if="list.playlist.subscribed" />
					<span>{{list.playlist.subscribedCount||'收藏'}}</span>
				</div>
				<div>
					<router-link :to="{name:'comment',params:{id:list.playlist.commentThreadId||0}}">
						<img src="../../static/images/cm2_list_detail_icn_cmt@2x.png" />
						<span>{{list.playlist.commentCount||'评论'}}</span>
					</router-link>
				</div>
				<div>
					<img src="../../static/images/cm2_list_detail_icn_share@2x.png" />
					<span>{{list.playlist.shareCount||'分享'}}</span>
				</div>
			</div>
		</div>
		<div class="plist-detail">
			<div v-if="loaded">
				<div id="playall" @click="playall" class="flexlist flex-center">
					<div class="flexleft flexnum ">
						<img src="../../static/images/pl-playall.png" />
					</div>
					<div class="flexlist" >
						<span id="pa-count">播放全部 <span> (共{{list.playlist.trackCount}}首)</span>
						</span>
					</div>
				</div>
				<songlist :list="list.playlist.tracks" v-on:playindex="playindex" :curplay="music.id" :toplist="istoptype" :trackids="list.playlist.trackIds"></songlist>
			</div>
			<loading v-else></loading>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import loading from "@/components/loading"
	import playico from "@/components/playico"
	import songlist from "@/components/songlist";
	export default {
		name: 'playlist',
		data() {
			return {
				cover: '',
				list: {
					playlist: {
						creator: {}
					},
				},
				istoptype: 0,
				opacity: 0,
				name: '',
				offset: 0,
				id: -1,
				loaded: false,
				canplay: [],
				title: '歌单',
				scrolltop: 0
			}
		},
		components: {
			songlist,
			loading,
			playico
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(parseInt(to.params.id) !== parseInt(vm.id)) {
					vm.name = "";
					vm.loaded = false;
					vm.cover = "";
					vm.canplay=[];
					vm.list = {
						playlist: {
							creator: {}
						}
					};
					vm.loadpl();
				}
			})
		},
		activated() {
			var st = this.$refs.main;
			st = st.getBoundingClientRect().height;
			this.title = window.pageYOffset > 100 ? '' : '歌单';
			this.scrolltop = window.pageYOffset > st ? st : window.pageYOffset
			window.onscroll = () => {
				this.title = window.pageYOffset > 100 ? '' : '歌单';
				this.scrolltop = window.pageYOffset > st ? st : window.pageYOffset
			}
		},
		deactivated() {
			window.onscroll = null
		},
		methods: {
			loadpl() {
				var img = this.$route.query.img;
				var name = this.$route.query.name;
				this.name = name;
				this.id = this.$route.params.id;
				this.istoptype = this.$route.query.istop;
				img && (this.cover = bs64.id2Url(img));
				api.playlist(this.id, this.offset, 1000).then(res => {
					this.loaded = true;
					var canplay = res.data.playlist.tracks.map(item => {
						if(item.st >= 0) {
							return item;
						}
					});
					this.canplay = this.canplay.concat(canplay);
					this.cover = this.cover || (bs64.id2Url(res.data.playlist.coverImgId_str || res.data.playlist.coverImgId))
					this.list = res.data;
					this.offset += this.list.playlist.tracks.length
				}).catch(() => {
					this.loaded = true
				});
			},
			playindex(i){
				this.$store.commit("setplaytype",1);
				this.$store.commit("setplaylist",this.canplay);
				this.$store.commit("playindex",i);
			},
			playall(){
				this.playindex(0);
				this.$store.commit("setmusic",this.canplay[0])
				this.$store.dispatch("only_murl")
			}
			
		},
		computed: {
			...mapGetters([
				'playing',
				'music',
				"playtype"
			])
		},
		filters: {
			playcount(v) {
				return v < 10e3 ? v : ((v / 10e3).toFixed(0) + '万')
			}
		}
	}
</script>

<style scoped>
	.flexlist:hover{background-color: transparent;}
	.mint-header {
		background: rgba(0, 0, 0, 0)
	}
	
	.blurbg {
		background-color: #eee
	}
</style>