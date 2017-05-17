<template>
	<div class="songs">
		<router-link :to="{name: 'playlist',params:{id:re.id},query:{img:re.coverImgId?re.coverImgId:urltn(re.coverImgUrl),name:re.name}}" class="flexlist flex-image" v-for="re in list" :key="re.id">
			<div class="flexleft fl-image">
				<img :src="re.coverImgUrl+'?param=100y100'" class="album_cover" />
			</div>
			<div class="flexlist">
				<div class="flexmain">
					<div>{{re.name}}</div>
					<div class="relistdes">{{re.trackCount}}首，<span v-if="showcreator">By{{re.creator.nickname}}，</span>播放{{re.playCount|playcount}}次</div>
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>
	export default {
		name: 'playlist',
		props: {
			list: Array,
			showcreator: {
				type: Boolean,
				default: true
			}
		},
		methods: {
			urltn(str) {
				if(!str) return "";
				str = str.split("/");
				str = str[str.length - 1];
				return str.split(".")[0];
			}
		}
	}
</script>