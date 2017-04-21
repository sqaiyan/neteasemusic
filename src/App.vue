<template>
	<div id="app">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<music></music>
	</div>
	
</template>

<script>
	import music from "@/components/music"
	export default {
		name: 'app',
		data() {
			return {
				bottomNav: 'movies'
			}
		},components:{music}
	}
</script>

<style>

</style>