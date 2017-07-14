<template>
	<div class="page_t" v-infinite-scroll="cloud" infinite-scroll-disabled="busy">
		<mt-header fixed title="我的云盘">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<div class="flexlist flex-center">
			<div class="flexlist">
				<span id="pa-count">　云盘容量：</span>
				<div id="cloud_percent">{{(list.size/1073741824).toFixed(2)}}G/{{(list.maxSize/1073741824).toFixed(2)}}G
					<div :style="{'width':((list.size/list.maxSize)*100+'%')}"></div>
				</div>
			</div>
		</div>
		<div class="songs">
			<router-link v-for="(re,idx) in list.data" :key="re.id" :to="{name: 'playing',params:{id:re.simpleSong.id}}" :class="'flexlist flex-center '+(re.simpleSong.id===music.id?'cur ':' ')">
				<div class="flexleft flexnum ">
					<div v-if="re.simpleSong.id===music.id">
						<img src="../../../static/images/aal.png" alt="">
					</div>
					<div v-else>
						<span>{{idx+1}}</span>
					</div>
				</div>
				<div class="flexlist">
					<div class="flexmain">
						<div>{{re.simpleSong.name}}<span v-if="re.simpleSong.alia.length">（{{re.simpleSong.alia[0]}}）</span></div>
						<div class="relistdes">{{re.simpleSong.ar[0].name}}-{{re.simpleSong.al.name}}</div>
					</div>
					<div class="flexact">
						<router-link :to="{name:'mv',params:{id:re.simpleSong.mv}}" class="fa_list fa_mv" v-if="re.simpleSong.mv!=0">
							<img src="../../../static/images/l0.png" />
						</router-link>
						<div class="fa_list">
							<img src="../../../static/images/cm2_list_btn_more@2x.png" />
						</div>
					</div>
				</div>
			</router-link>
		</div>
		<loading v-show="!loaded||list.hasMore"></loading>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import songlist from "@/components/songlist";
	import loading from "@/components/loading"
	import playico from "@/components/playico";
	import utils from "@/utils"
	export default {
		name: 'cloud',
		data() {
			return {
				loaded: false,
				busy: true,
				list: {
					data: []
				}
			}
		},
		components: {
			loading,
			playico,
			songlist
		},
		created() {
			this.cloud()
		},
		methods: {
			cloud() {
				if(this.$route.name != 'cloud') return;
				this.busy = true;
				api.user_cloud(this.list.data.length).then(res => {
					this.loaded = true;
					res.data.data = this.list.data.concat(res.data.data);
					this.list = res.data;
					this.busy = res.data.hasMore ? false : true
				})
			}
		},
		computed: {
			...mapState([
				"music"
			])
		}
	}
</script>

<style scoped>
	#cloud_percent {
		text-align: center;
		background: #ddd;
		border-radius: 2em;
		position: relative;
		flex: 1;
		line-height: 1;
		overflow: hidden;
		color: #999;
		padding: .1em 0;
	}
	
	#cloud_percent div {
		position: absolute;
		background: #d33a31;
		height: 100%;
		left: 0;
		top: 0;
		border-radius: 2em
	}
</style>