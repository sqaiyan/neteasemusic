<template>
	<div id="videopage" v-infinite-scroll="getcomments" infinite-scroll-disabled="busy">
		<mt-header fixed :title="video.title">
			<mt-button slot="left" @click="$router.go(-1)" icon="back">返回</mt-button>
		</mt-header>
		<div id="videowrap">
			<video width="100%" height="auto" :src="videourl" autoplay="autoplay" controls="controls" webkit-playsinline="true" playsinline="true" x-webkit-airplay="allow" x5-video-player-type="h5" x5-video-player-fullscreen="true" x5-video-orientation="portraint" style="object-fit:fill" :poster="video.coverUrl">
			</video>
		</div>
		<div id="videoheader" v-show="loaded">
			<div id="videoinfo">
				<div id="videoname">{{video.title}}</div>
				<div>
					<router-link :to="{name:'user',params:{id:video.creator.userId}}">{{video.creator.nickname}}</router-link> | 播放：{{video.playTime|playcount}}
				</div>
			</div>
			<div id="videodes">
				<div class="fc_gray">发布时间：{{time(video.publishTime)}}</div>
				<div>
					<span v-for="re in emoji(video.description)" :key="re.id">
									<span v-if="re.node == 'text'">{{re.text}}</span>
					<span v-if="re.node == 'element'"><img class="wxEmoji" :src="'http://s1.music.126.net/style/web2/emt//emoji_'+re.text+'.png'" /></span>
					</span>
				</div>
			</div>
		</div>
		<div v-if="simi.length">
			<div class="sm_title">相关推荐</div>
			<div class="mvs">
				<router-link replace :to="{name: 'video',params:{id:re.vid}}" v-for="re in simi" :key="re.id" class="flexlist flex-image">
					<div class="flexleft fl-image">
						<img :src="re.coverUrl+'?param=320y180'" class="mv_cover" />
						<div class="img_playcount">
							<img src="../../static/images/video.png" alt="" />{{re.playTime}}</div>
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>{{re.title}}</div>
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
	import utils from "@/utils"
	export default {
		name: 'video',
		data() {
			return {
				loaded: false,
				rec: {
					comments: []
				},
				video: {
					creator: {}
				},
				simi: [],
				id: 0,
				recid: 0,
				offset: 0,
				busy: true,
				videourl: ''
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
					vm.getvideo()
				}
			})
		},
		beforeRouteUpdate(to, from, next) {
			next()
			this.getvideo();
		},
		methods: {
			async getvideo() {
				this.loaded = false;
				this.simi = [];
				this.rec = {
					comments: []
				};
				this.recid = 0;
				this.offset = 0;
				this.id = this.$route.params.id;
				this.getRcmd();
				this.getcomments();
				await api.video_detail(this.id).then(res => {
					if(res.data.code == 200) {
						this.video = res.data.data;
						this.loaded = true;
						api.video_playurl(this.id,this.video.resolutions[this.video.resolutions.length-1].resolution).then(u => {
							u.data.code==200&&(this.videourl=u.data.urls[0].url)
						})
					}
				});
			},
			getRcmd() {
				api.video_rcmd(this.id).then(res => {
					this.simi = res.data.code == 200 ? res.data.data : []
				})
			},
			getcomments() {
				if(this.$route.name != 'video') return;
				this.busy = true
				api.comments("R_VI_62_" + this.id, this.offset, 1).then(res => {
					if(res.data.code != 200) {
						return
					}
					res.data.comments = this.rec.comments.concat(res.data.comments);
					res.data.hotComments = this.rec.hotComments;
					this.rec = res.data;
					this.offset = res.data.comments.length;
					this.loaded = true;
					this.busy = this.rec.more ? false : true;
				})
			},
			emoji(v) {
				return utils.emoji(v)
			},
			time(v) {
				return utils.time(v)
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
	
	#videopage {
		padding-top: 56.2%;
	}
	
	#videoinfo,
	#videodes {
		padding: 2%;
		color: #666;
		line-height: 1.8
	}
	
	#videodes {
		border-top: 1px solid #eee;
	}
	
	#videoname {
		font-size: 1.2em;
		color: #000;
		display: block
	}
	
	#videoinfo a {
		color: #537fb0
	}
</style>