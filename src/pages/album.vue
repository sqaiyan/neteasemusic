<template>
	<div>
		<div id="headerblur">
			<img :src="cover" class="blurbg" :style="{'background-image':'url('+cover+')','top':-st+'px'}"/>
		</div>
		<mt-header fixed :title="(title||name||list.album.name)">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<div id="plist-header" ref="main">
			<div class="blurbg" :style="{'background-image':'url('+cover+')'}"></div>
			<div id="plh-main">
				<div id="plh-cover">
					<img src="../../static/images/a82.png" id="plh-cover-album" />
					<img :src="cover+'?param=177y177'" class="music_cover" />
				</div>
				<div id="plh-cnt">
					<div id="music_h_name">{{name||list.album.name}}</div>
					<router-link :to="{name:'artist',params:{id:list.album.artist.id}}">
						歌手：
						<span>{{list.album.artist.name||" "}} </span>
					</router-link>	
					<div>发行时间：{{list.album.publishTime|time}}</div>
				</div>
			</div>
			<div id="plh_action">
				<div>
					<img src="../../static/images/cm2_list_detail_icn_fav_new@2x.png" v-if="!list.album.info.liked" />
					<img src="../../static/images/cm2_list_detail_icn_faved@2x.png" v-if="list.album.info.liked" />
					<span>收藏</span>
				</div>
				<div>
					<router-link :to="{name:'comment',params:{id:list.album.info.threadId}}">
						<img src="../../static/images/cm2_list_detail_icn_cmt@2x.png" />
						<span>{{list.album.info.commentCount||'评论'}}</span>
					</router-link>
				</div>
				<div>
					<img src="../../static/images/cm2_list_detail_icn_share@2x.png" />
					<span>{{list.album.info.shareCount||'分享'}}</span>
				</div>
			</div>
		</div>
		<div class="plist-detail">
			<div v-if="loaded">
				<div id="playall" @click="playall" class="flexlist flex-center">
					<div class="flexleft flexnum ">
						<img src="../../static/images/pl-playall.png" />
					</div>
					<div class="flexlist">
						<span id="pa-count">播放全部 <span> (共{{list.songs.length}}首)</span>
						</span>
					</div>
				</div>
				<songlist :list="list.songs" v-on:playindex="playindex" :curplay="music.id"></songlist>
			</div>
			<loading v-else></loading>
		</div>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import playico from "@/components/playico"
	import loading from "@/components/loading"
	import songlist from "@/components/songlist";
	export default {
		name: 'album',
		data() {
			return {
				cover: '',
				list: {
					songs:[],
					album: {
						artist: {},
						info: {}
					}
				},
				opacity: 0,
				name: '',
				offset: 0,
				id: -1,
				loaded: false,
				canplay: []
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
					vm.name = vm.$route.query.name;
					vm.id = vm.$route.params.id
					vm.cover = vm.$route.query.img ? bs64.id2Url(vm.$route.query.img) : '';
					vm.list = {
						album: {
							artist: {},
							info: {}
						}
					};
					vm.loadpl();
				}
			})
		},
		methods: {
			loadpl() {
				api.album(this.id, this.offset, 1000).then(res => {
					this.loaded = true;
					this.cover = this.cover || res.data.album.picUrl
					this.list = res.data;
				}).catch(() => {
					this.loaded = true
				});
			},
			playindex(i){
				this.$store.commit("setplaytype",1);
				this.$store.commit("setplaylist",this.list.songs);
				this.$store.commit("playindex",i);
			},
			playall(){
				this.playindex(0);
				this.$store.commit("setmusic",this.list.songs[0])
				this.$store.dispatch("only_murl")
			}
		},
		computed: {
			title(){
				return this.scrolltop>100?'':'专辑'
			},
			st(){
				var main=this.$refs.main;
				main=main?main.getBoundingClientRect().height:0;
				return this.scrolltop>main?main:this.scrolltop
			},
			...mapState([
				"scrolltop",
				"music"
			])
		}
	}
</script>

<style scoped>
	.mint-header {
		background: rgba(0, 0, 0, 0)
	}
	
	#plh-cover {
		margin: 0 3% 2%;
		position: relative;
		flex: 0 0 41%;
		height: 0;
		padding-top: 35%;
	}
	
	#plh-cover #plh-cover-album {
		z-index: 1;
		width: 100%
	}
	
	#plh-cover img {
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2
	}
	
	.blurbg {
		background-color: #eee
	}
	
	.music_cover {
		width: auto !important
	}
</style>