<template>
	<div>
		<div class='flex-boxlist flex sortlist'>
        <router-link class=" flexlist " :to="{name: 'playlist',query:{name: re.name},params: { id: re.id}}" v-for="re in list" :key="re.id">
          <div class="cover flexleft fl-image">
          	<div class="hqico cover_ico" v-if="re.highQuality"></div>
            <img class="album_cover" :src="re.coverImgUrl+'?param=200y200'" />
          </div>
          <div class="flexlist tl_info">
            <div class="sort_fl_list ">
            	{{re.name}}
            </div>
            <div class="tli_des">by{{re.creator.nickname}}</div>
            <div class="tli_des tag_des"><span class="tags">{{re.tag}}</span>{{re.copywriter}}</div>
          </div>
         </router-link>
      </div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/api';
	import loading from "@/components/loading"
	import playico from "@/components/playico"
	import songlist from "@/components/songlist";
	export default {
		name: 'playlist',
		data() {
			return {
				loaded: false,
				list: [],
				cate:['华语','欧美','韩语','日语','粤语','小语种','运动','ACG','影视原声','流行','摇滚','后摇','古风','民谣','轻音乐','电子','器乐','说唱','古典','爵士'],
				checked:"全部"
			}
		},
		components: {
			songlist,
			loading,
			playico
		},
		created() {
			this.get()
		},
		methods: {
			get() {
				api.index_hqpl(this.checked).then(res => {
					this.list = res.data.playlists
				})
			}
		}
	}
</script>
<style>
	.flexlist .cover {
    flex: 0 0 32%;
    margin: 1% 0 0 0;
    padding-top: 32%;
  }
  
  .flexlist {
    width: 100%
  }
	.sort_fl_list {
    flex: 0 0 100%;
    line-height: 2
  }
  
  .sortlist .flexlist {
    flex-flow: wrap;
    align-content: center;
  }
  .sortlist .flexlist .flexlist{padding: .3em;}
  .sort_fl_list  span{color: #999;}
.sortlist .tl_info  .tag_des{padding-top: 1em;}
</style>