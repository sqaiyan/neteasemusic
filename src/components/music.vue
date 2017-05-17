<template>
	<div>
		<audio :src="playurl" @timeupdate="playingtime" @error="errormp3" @waiting="waiting" @ended="nextmusic" @canplay="toplay" id="audio"></audio>
	</div>
</template>
<script>
	import { mapMutations, mapGetters } from 'vuex';
	export default {
		name: 'music',
		methods: {
			toplay() {
				this.$store.commit("setplaying", true);
			},
			waiting() {
				this.$store.commit("waiting")
			},
			playingtime() {
				this.$store.commit("playtimechange", document.getElementById("audio").currentTime);
			},
			nextmusic() {
				this.$store.commit("setbgmchange", true)
				if(this.playtype == 2) {
					this.$store.dispatch('next_fm');
				} else {
					this.$store.dispatch('next_music');
				}
			},
			errormp3(e) {
				//出错再重新请求一次
				this.playurl && this.$store.dispatch('only_murl'), console.log("music loading error", e);

			}
		},
		computed: {
			...mapGetters([
				'playurl',
				'music',
				'playtype'
			])
		}
	}
</script>

<style scoped>

</style>