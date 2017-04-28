<template>
  <div>
    <div v-if="loaded">
      <div class='listheader'>云音乐官方榜</div>
      <div class='flex-boxlist flex sortlist'>
        <router-link class=" flexlist " :to="{name: 'playlist',query:{img:item.coverImgId, name: item.name,istop:'a'},params: { id: item.id}}" v-for="item in re.list" v-if="item.ToplistType" :key="item.id">
          <div class="cover flexleft fl-image">
            <img class="album_cover" :src="item.coverImgUrl+'?param=200y200'" />
            <span>{{item.updateFrequency}}</span>
          </div>
          <div class="flexlist tl_info">
            <div class="sort_fl_list " v-for="(r,idx) in item.tracks">
              {{idx+1}}．{{r.first}} - {{r.second}}
            </div>
          </div>
         </router-link>
        <router-link class=" flexlist " :to="{path:'artlist'}">
          <div class="cover flexleft">
            <img class="album_cover" :src="re.artistToplist.coverUrl" />
          </div>
          <div class="flexlist tl_info">
            <div class="sort_fl_list " v-for="(r,idx) in re.artistToplist.artists">
              {{idx+1}}．{{r.first}} - <img src="../../../../static/images/cm2_radio_icn_hot_sml@2x.png" style="width:1em"/><span>{{r.third}}</span>
            </div>
          </div>
         </router-link>
      </div>
      <div class='listheader'>全球榜</div>
      <div class='flex-boxlist'>
       <router-link class=" tl_cnt " :to="{name: 'playlist',query:{img:item.coverImgId, name: item.name,istop:'a'},params: { id: item.id}}" v-for="item in re.list" v-if="!item.ToplistType" :key="item.id">
          <div class="cover flexleft">
            <img :src="item.coverImgUrl+'?param=200y200'" class="album_cover" />
            <span>{{item.updateFrequency}}</span>
          </div>
          <span>{{item.name}}</span>
        </router-link>
      </div>
    </div>
    <loading v-else></loading>
  </div>
</template>

<script>
  import loading from '@/components/loading'
  import api from "@/api"
  export default {
    name: 'playlist',
    data() {
      return {
        loaded: false,
        re: []
      }
    },
    components: {
      loading
    },
    created() {
      this.getsort()
    },
    methods: {
      getsort() {
        api.index_sort().then(res => {
          this.re = res.data
          this.loaded = true;
          console.log(this.re, this.loaded)
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .flexlist .cover {
    flex: 0 0 32%;
    margin: 1% 3% 1% 1%;
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
</style>
