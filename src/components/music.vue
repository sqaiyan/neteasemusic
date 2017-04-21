<template>
	<div>
		<audio :src.sync="playurl" @timeupdate="playingtime" @ended="next" @canplay="toplay" @error="audioerror" id="audio"></audio>
	</div>
</template>

<script>
	import { mapMutations, mapGetters } from 'vuex'
	export default {
		name: 'music',
		methods: {
			toplay() {
				this.$store.commit("setplaying", 1);
			},
			playingtime() {
				this.$store.commit("playtimechange", document.getElementById("audio").currentTime);
			},
			audioerror() {},
			...mapMutations([
				'next'
			])
		},
		computed: {
			...mapGetters([
				'playurl'
			])
		}
	}
</script>

<style scoped>

</style>