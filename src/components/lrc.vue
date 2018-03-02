<template>
	<div id="lrcontent" :class="{'playinghidden':!showlrc,'noscroll':(lrc.scroll&&!lrc.nolyric&&!lrc.uncollected)}" >
		<div id="lrcwrap" v-show="lrc" :style="{'transform':'translateY('+(-lrcindex*100/(lrc.lrc.length+6))+'%)'}">
			<div v-if="lrc.nolyric" class="notext">纯音乐，无歌词</div>
			<div v-if="lrc.scroll&&!lrc.nolyric&&!lrc.uncollected" class="notext">*歌词不支持滚动*</div>
			<div v-if="lrc.uncollected" class="notext">暂无歌词</div>
			<div v-for="(item,idx) in lrc.lrc" :key="(item.lrc_sec||idx)" :data-t="item.lrc_sec" :class="((idx==lrcindex)&&!lrc.scroll?'lrcur':'')">
				<span>{{item.lrc}}<br/>{{item.tlrc}}</span>
				<!-- 
				<span v-if="lrc.tlrc.length">{{lrc.tlrc[idx].lrc}}</span> -->
			</div>
		</div>
		<loading text="歌词加载中..." v-show="lrc.code!=200"></loading>
		<div class="cnloading" v-show="lrc.code&&(lrc.code!=200)">加载出错了</div>
	</div>
</template>

<script>
	import { mapState} from 'vuex'
	import loading from "@/components/loading"
	export default {
		name: 'lrc',
		components: {
			loading
		},
		data() {
			return {
				lrcindex: 0
			}
		},
		props: {
			lrc: {type:Object,default:{}},
			showlrc: Boolean
		},
		watch: {
			playtime(v) {
				if(!this.lrc.lrc) return;
				v = Math.floor(v / 1e3);
				this.lrcindex = 0;
				for(let i = 0; i < this.lrc.lrc.length; i++) {
					if(v >= this.lrc.lrc[i].lrc_sec) {
						this.lrcindex = i
					}
				}
			}
		},
		computed: {
			...mapState([
				'musicloading',
				'playtime'
			])
		}
	}
</script>

<style scoped>

</style>