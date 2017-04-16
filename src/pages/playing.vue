<template>
	<div>
		playing{{music}}
	</div>
</template>

<script>
import api from "@/api"
	export default {
		name: 'playing',
		data() {
			return {
				music: {},
				loaded: false,
				id: 0,
			}
		},
		created() {
			this.get()
		},
		methods: {
			get() {
			api.music_detail(this.$route.params.id).then(res=>{
			console.log(res.data);
			this.music=res.data.songs[0]
			})
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>