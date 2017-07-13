<template>
	<div class="page_t page_b">
		<mt-header fixed title="我的音乐">
			<span slot="left">我的</span>
			<playico slot="right"></playico>
		</mt-header>
		<div class="menu">
			<div class="mn_list">
				<div class="mn_ico"><img src="../../../static/images/cm2_list_icn_dld_new@2x.png" alt="" /></div>
				<div class="cmain">我的下载</div>
			</div>
			<div class="mn_list">
				<div class="mn_ico"><img src="../../../static/images/cm2_list_icn_recent_new@2x.png" alt="" /></div>
				<div class="cmain">最近播放</div>
			</div>
			<router-link :to="{name:'cloud'}" class="mn_list">
				<div class="mn_ico"><img src="../../../static/images/cm2_lay_icn_cloud@2x.png" alt="" /></div>
				<div class="cmain">我的云盘</div>
				<div class="rdes"><span class="arrow"></span></div>
			</router-link>
			<router-link :to="{name:'favradio'}" class="mn_list">
				<div class="mn_ico"><img src="../../../static/images/cm2_list_icn_rdi_new@2x.png" alt="" /></div>
				<div class="cmain">我的电台</div>
				<div class="rdes"><span>{{subcount.djRadioCount}}</span><span class="arrow"></span></div>
			</router-link>
			<router-link :to="{name:'sublist'}" class="mn_list">
				<div class="mn_ico"><img src="../../../static/images/cm4_my_icn_fav@2x.png" alt="" /></div>
				<div class="cmain">我的收藏</div>
				<div class="rdes"><span>{{subcount.artistCount+subcount.mvCount+subcount.djRadioCount}}</span><span class="arrow"></span></div>
			</router-link>
		</div>

		<div v-if="playlist1.length">
			<div class="sm_title">歌单({{subcount.createdPlaylistCount}})</div>
			<pl :list="playlist1" :showcreator="false"></pl>
		</div>
		<div v-if="playlist2.length">
			<div class="sm_title">收藏的歌单({{subcount.subPlaylistCount}})</div>
			<pl :list="playlist2"></pl>
		</div>
		<loading v-show="!loaded"></loading>
		<mt-tabbar fixed>
			<mt-tab-item id="home" href="#/">
				<img slot="icon" src="../../../static/images/cm2_btm_icn_discovery.png"> 发现音乐
			</mt-tab-item>
			<mt-tab-item id="me">
				<img slot="icon" src="../../../static/images/cm2_btm_icn_account_prs.png">我的音乐
			</mt-tab-item>
		</mt-tabbar>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import loading from "@/components/loading"
	import playico from "@/components/playico";
	import utils from "@/utils"
	import pl from "@/components/playlist";
	export default {
		name: 'user',
		data() {
			return {
				playlist1: [],
				playlist2: [],
				loaded: false,
				busy: true,
				subcount: 0
			}
		},
		components: {
			loading,
			playico,
			pl
		},
		mounted() {
			console.log(".........................created my page",this.user);
			api.user_playlist(this.user.account.id, 0).then(res => {
				this.playlist1 = res.data.playlist.filter(i => {
					return i.creator.userId == this.user.account.id
				});
				this.playlist2 = res.data.playlist.filter(i => {
					return i.creator.userId != this.user.account.id
				});
				this.loaded = true
			});
			api.user_subcount(this.user.account.id).then(res => {
				this.subcount = res.data;
			})
		},
		methods: {

		},
		computed: {
			...mapState([
				"user"
			])
		}
	}
</script>

<style scoped>

</style>