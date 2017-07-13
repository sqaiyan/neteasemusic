<template>
	<div id="app">
		<keep-alive exclude="comment">
			<router-view></router-view>
		</keep-alive>
		<music></music>
	</div>
</template>

<script>
	import music from "@/components/music";
	export default {
		name: 'app',
		components: {
			music
		}
	}
</script>
