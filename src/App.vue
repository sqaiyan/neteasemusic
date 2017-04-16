<template>
	<div id="app">
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				bottomNav: 'movies'
			}
		}
	}
</script>

<style>

</style>