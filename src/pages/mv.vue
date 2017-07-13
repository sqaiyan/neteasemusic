<template>
	<div id="mvpage" v-infinite-scroll="getcomments" infinite-scroll-disabled="busy">
		<mt-header fixed :title="mv.name">
			<mt-button slot="left" @click="$router.go(-1)" icon="back">返回</mt-button>
		</mt-header>
		<div id="videowrap">
			<video width="100%" height="auto" :src="mvurl" autoplay="autoplay" controls="controls" webkit-playsinline="true" playsinline="true" x-webkit-airplay="allow" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" style="object-fit:fill" :poster="mv.cover">
			</video>
		</div>
		<div id="mvheader" v-show="loaded">
			<div id="mvinfo">
				<div id="mvname">{{mv.name}}</div>
				<div>
					<router-link :to="{name:'artist',params:{id:mv.artistId}}">歌手：{{mv.artistName}}</router-link>　|　播放：{{mv.playCount|playcount}}
				</div>
			</div>
			<div id="mvdes">
				<div class="fc_gray">发行：{{mv.publishTime}}</div>
				<div>{{mv.briefDesc}}</div>
				<div>{{mv.desc}}</div>
			</div>
		</div>
		<div v-if="simi.length">
			<div class="sm_title">相似Mv</div>
			<div class="mvs">
				<router-link replace :to="{name: 'mv',params:{id:re.id}}" v-for="re in simi" :key="re.id" class="flexlist flex-image">
					<div class="flexleft fl-image">
						<img :src="re.cover+'?param=320y180'" class="mv_cover" />
						<div class="img_playcount">
							<img src="../../static/images/video.png" alt="" />{{re.playCount}}</div>
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>{{re.name}}
							</div>
							<div class="relistdes">{{re.artistName}}
							</div>
						</div>
					</div>
				</router-link>
			</div>
		</div>
		<div v-if="rec.total">
			<div class="sm_title">评论（{{rec.total}}）</div>
			<comments :list="rec.comments"></comments>
		</div>
		<loading v-if="!loaded||rec.more"></loading>
	</div>
</template>

<script>
	import api from '@/api';
	import bs64 from "@/base64";
	import loading from "@/components/loading"
	import playico from "@/components/playico";
	import comments from "@/components/comments"
	export default {
		name: 'mv',
		data() {
			return {
				loaded: false,
				rec: {
					comments: []
				},
				mv: {},
				simi: [],
				id: 0,
				recid: 0,
				offset: 0,
				busy: true,
				mvurl: ''
			}
		},
		components: {
			loading,
			playico,
			comments
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(to.params.id !== vm.id) {
					vm.getmv()
				}
			})
		},
		beforeRouteUpdate(to, from, next) {
			next()
			this.getmv();
		},
		methods: {
			async getmv() {
				this.loaded = false;
				this.mv = {
					brs: []
				};
				this.simi = [];
				this.rec = {
					comments: []
				};
				this.recid = 0;
				this.offset = 0;
				this.id = this.$route.params.id
				await api.mv(this.id).then(res => {
					this.mv = res[0];
					this.simi = res[1];
					this.recid = res[0].commentThreadId;
					this.loaded = true;
					this.getcomments(false);
					var url = this.mv.brs;
					url = url[1080] || url[720] || url[480] || url[240]
					this.mvurl = this.$http.defaults.baseURL + 'mv/url?url=' + url
				});
			},
			getcomments() {
				if(this.$route.name != 'mv') return;
				this.busy = true
				api.comments(this.recid, this.offset, 1).then(res => {
					if(res.data.code!=200){return}
					res.data.comments = this.rec.comments.concat(res.data.comments);
					res.data.hotComments = this.rec.hotComments;
					this.rec = res.data;
					this.offset = res.data.comments.length;
					this.loaded = true;
					this.busy = this.rec.more ? false : true;
				})
			}

		}
	}
</script>

<style scoped>
	.mint-header {
		background-image: linear-gradient(rgba(0, 0, 0, .5), rgba(0, 0, 0, 0));
		background-color: transparent;
	}
	
	#videowrap {
		height: 0;
		padding-top: 56.2%;
		position: relative;
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		z-index: 5;
		box-shadow: 0 5px 5px rgba(0, 0, 0, .1);
		background-color: #fff;
	}
	
	#videowrap video {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}
	
	#mvpage {
		padding-top: 56.2%;
	}
	
	#mvinfo,
	#mvdes {
		padding: 2%;
		color: #666;
		line-height: 1.8
	}
	
	#mvdes {
		border-top: 1px solid #eee;
	}
	
	#mvname {
		font-size: 1.2em;
		color: #000;
		display: block
	}
	
	#mvinfo a {
		color: #537fb0
	}
</style>