<template>
	<div>
		<div id="headerblur">
			<div class="blurbg" :style="{'background-image':'url('+cover+')','top':-st+'px'}"></div>
		</div>
		<mt-header fixed :title="(title||list.playlist.name)">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<div id="plist-header" ref="main">
			<div class="blurbg" :style="{'background-image':'url('+cover+')'}"></div>
			<div id="plh-main">
				<div id="plh-cover">
					<div class="hqico cover_ico" v-if="list.playlist.highQuality"></div>
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
						<router-link :to="{name:'user',params:{id:list.playlist.creator.userId}}">{{list.playlist.creator.nickname||" "}}</router-link>
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
				<songlist :list="list.playlist.tracks" v-on:playindex="playindex" :curplay="music.id" :privileges="list.privileges" :toplist="istoptype" :trackids="list.playlist.trackIds"></songlist>
			</div>
			<loading v-else></loading>
		</div>
	</div>
</template>

<script>
	import {mapState } from 'vuex'
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
		methods: {
			loadpl() {
				var img = this.$route.query.img;
				var name = this.$route.query.name;
				this.name = name;
				this.id = this.$route.params.id;
				this.istoptype = this.$route.query.istop;
				img && (this.cover = bs64.id2Url(img));
				api.playlist(this.id,0, 1000).then(res => {
					this.loaded = true;
					var canplay = res.data.playlist.tracks.map(item => {
						if(item.st >= 0) return item;
					});
					this.canplay = this.canplay.concat(canplay);
					this.cover = this.cover || (bs64.id2Url(res.data.playlist.coverImgId_str || res.data.playlist.coverImgId))
					this.list = res.data;
				});
			},
			playindex(i){
				//this.$store.commit("setplaytype",1);
				this.$store.commit("setplaylist",this.canplay);
				this.$store.commit("playindex",i);
			},
			playall(){
				this.playindex(0);
				this.$store.commit("setplaytype",1);
				this.$store.dispatch("only_murl");
				api.comments(this.music.id, 0, 2).then(res => {
					this.$store.commit('commentscount', res.data.total);
				})
			}
		},
		computed: {
			title(){
				return this.scrolltop > 100 ? '' : '歌单';
			},
			st(){
				var main = this.$refs.main;
				main =main? main.getBoundingClientRect().height:0;
				return this.scrolltop > main ? main : this.scrolltop
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
	
	.blurbg {
		background-color: #eee
	}
</style>