<template>
	<div class="page page_b page_t">
		<div class="mint-header is-fixed">
			<router-link :to="{name:'search'}" id="header_search">单曲/歌单/电台</router-link>
			<playico slot="right"></playico>
		</div>
		<div class="page_tab">
			<div class="page" id="indexwrap">
				<tab :tabs="tabs" :url="taburl" v-on:switchtab="switchtab"></tab>
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</div>
		</div>
	</div>
</template>

<script>
	import tab from "@/components/tabs.vue"
	import playico from "@/components/playico"
	export default {
		name: 'index',
		data() {
			return {
				taburl: true,
				title: '发现音乐',
				tabs: [{
					name: "个性推荐",
					url: 'find'
				}, {
					name: "歌单",
					url: 'playlist'
				}, {
					name: "主播电台",
					url: "djlist"
				}, {
					name: "排行榜",
					url: 'sort'
				}]
			}
		},
		components: {
			tab,
			playico
		},
		methods: {
			switchtab(index) {}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
	.tab {
		position: fixed;
		width: 100%;
		top: 40px;
		z-index: 10;
		max-width: 750px;
	}
	
	.page_tab {
		padding-top:3em;
	}
	
	#lastsearch {
		line-height: 1;
		padding-top: 20px;
		flex: 0 0 80px;
	}
	
	.homepl .tl_cnt {
		width: 168.75px;
	}
	
	#header_search {
		flex: 1;
		color: #999;
		background: #fff;
		border-radius: 2em;
		text-align: center;
		margin: 0 .3em;
		height: 28px;
		line-height: 28px;
	}
	
	#plc_header {
		border: none;
	}
	
	.djcatewrap {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	
	.djcatelist {
		text-align: center;
		font-size: 24px;
		flex: 0 0 187.5px;
		height: 145px
	}
	
	.djcatelist image {
		width: 80px;
		height: 80px;
		margin-top: 20px
	}
</style>