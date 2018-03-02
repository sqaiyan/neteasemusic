<template>
	<div>
		<audio :src="playurl" @timeupdate="playingtime" @error="errormp3" @waiting="waiting" @ended="next_music" @canplay="setplaying(true)" id="audio"></audio>
	</div>
</template>
<script>
	import { mapState,mapMutations,mapActions } from 'vuex';
	export default {
		name: 'music',
		methods: {
			playingtime(e) {
				this.$store.commit("playtimechange", document.getElementById("audio").currentTime);
			},
			errormp3(e) {
				//出错再重新请求一次
				console.log("mp3请求出错",e);
				//this.playurl && this.$store.dispatch('only_murl'), console.log("music loading error", e);
			},
			...mapActions([
				'next_music'
			]),
			...mapMutations([
				'setplaying',
				'waiting'
			])
		},
		computed: {
			...mapState([
				'playurl',
				'music',
				'playtype'
			])
		}
	}
</script>
