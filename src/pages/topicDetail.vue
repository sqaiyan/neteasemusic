<template>
	<div>
		<mt-header fixed :title="topic.title||''">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<loading v-if="loading"></loading>
		<div class="pop_cnt" v-if="!loading&&!topic.id">
			<div class="cntloading">暂无数据</div>
		</div>

		<div id="topicwrap" v-if="!loading&&topic.id">
			<div class="pop_cnt">
				<div class="topic_header">
					<h2 id="topictitle">{{topic.title}}</h2>
					<p>{{topic.addTime|time}}　阅读：{{topic.readCount|playcount}}</p>
					<div><img :src="topic.creator.avatarUrl+'?param=30y30'" class="user_avator" width="24" :alt="topic.creator.nickname" /> {{topic.creator.nickname}} |
						<router-link :to="{name:'topicDetail',params:{id:topic.topicSeries.id}}" class="fc_blue">{{topic.topicSeries.name}}</router-link>
					</div>
				</div>
				<topicres :type="item.type" v-for="item in topic.resources" :resource="item.resource"></topicres>
			</div>
			<div id="topic_comments">
				<div class="sm_title">精彩评论</div>
				<cmt :list="comments.hotComments"></cmt>
				<div class="cntloading" v-if="comments.more">查看更多热门评论</div>
			</div>
			<div id="topic_relates">
				<div class="sm_title">往期回顾</div>
				<router-link :to="{name:'topicDetail',params:{id:re.id}}" class="flexlist flex-image mvs" replace v-for="(re,index) in relates" v-if="index<3">
					<div class="flexleft fl-image">
						<img :src="re.rectanglePicUrl+'?param=320y180'" class="mv_cover" />
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div class="fm_title">{{re.mainTitle}}</div>
							<div class="relistdes">by{{re.creator.nickname}}　阅读{{re.readCount|playcount}}</div>
						</div>
					</div>
				</router-link>
				<router-link :to="{name:'topicDetail',params:{id:1}}" tag='div' replace class="cntloading">查看更多></router-link>
			</div>

			<!-- 
			<div class="topic_bottom">
				<div>{{topic.likedCount}}</div>
				<div></div>
				<div></div>
				<div></div>
			</div> -->

		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import topicres from "@/components/topicres"
	import playico from "@/components/playico"
	import loading from "@/components/loading"
	import cmt from "@/components/comments"
	export default {
		name: 'topicDetail',
		data() {
			return {
				topic: {
					creator: {},
					resources: {},
					topicSeries: {}
				},
				relates: [],
				comments: [],
				loading: true
			}
		},
		components: {
			playico,
			topicres,
			loading,
			cmt
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				console.log("aaaaaaaaaaaaaa");
				if(parseInt(to.params.id) !== parseInt(vm.topic.id)) {
					vm.topic = {
						creator: {},
						resources: {},
						topicSeries: {}
					};
					vm.loading = true
					vm.getDetail()
				}
			})
		},
		methods: {
			getDetail() {
				api.topic_detail(this.$route.params.id).then(res => {
					this.loading = false;
					if(res.data.code != 200) {
						return;
					}
					this.relates = res.data.relates
					this.topic = res.data.topic
					api.comments(this.topic.commentThreadId, 0, 1).then(rescmt => {
						rescmt.data.code == 200 && (this.comments = rescmt.data);
					})
				})
			}
		},
		computed: {
			title() {},
			...mapState([
				"scrolltop",
				"music"
			])
		}
	}
</script>

<style scoped>
	.pop_cnt {
		padding: 60px 10px 10px;
		height: 100%;
		overflow: auto;
		word-break: break-all;
		box-sizing: border-box
	}
	
	.topic_header {
		padding: 0 .5em 1em;
	}
	
	#topictitle {
		font-size: 26px;
		line-height: 1.3;
		font-weight: 400;
	}
	
	.topic_header p {
		color: #888;
		padding: .5em 0;
		font-size: 13px;
	}
</style>