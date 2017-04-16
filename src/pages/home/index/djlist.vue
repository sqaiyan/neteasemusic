<template>
  <div v-infinite-scroll="getdjlist" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
    <mt-swipe :auto="5000">
      <mt-swipe-item v-for="item in [1,2,3]" class="djcatewrap" :key="item">
        <div bindtap="djradiotype" v-if="(idx<item*8)&&(idx>=(item-1)*8)" class="djcatelist" data-djtype="re.id" v-for="(re,idx) in djcate.categories">
          <img :src="re.pic56x56Url" class="slide-image" width="56" height="56" />
          <div>{{re.name}}</div>
        </div>
      </mt-swipe-item>
    </mt-swipe>
  
    <div class="listheader">{{djrecs.rec_p.name}}</div>
    <div v-for="re in djrecs.rec_p.programs" class="playlist">
      <div class="flexlist  flex-image">
        <div class="flexleft fl-image">
          <img :src="re.coverUrl+'?param=100y100'" class="album_cover" />
        </div>
        <div class="flexlist">
          <div class="flexmain">
            <div>{{re.name}}</div>
            <div class="relistdes">{{re.reason}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="listheader">{{djrecs.rec_d.name}}</div>
    <div class='flex-boxlist'>
      <div class="tl_cnt cateplaylist" v-for="(item,idx) in djrecs.rec_d.djRadios" v-if="idx<6">
        <div class="cover">
          <img :src="item.picUrl+'?param=200y200'" class="music_cover" />
        </div>
        <div class="name">{{item.copywriter}}</div>
      </div>
    </div>
    <div class="listheader">热门电台</div>
    <div class='flex-boxlist flex-two'>
      <div class="tl_cnt cateplaylist" v-for="item in djlist">
        <div class="cover">
          <img :src="item.picUrl+'?param=200y200'" class="music_cover" />
          <div class="img_playcount">
            <img src='../../../../static/images/cm2_list_icn_subscribe@2x.png' />{{item.subCount}}订阅</div>
        </div>
        <div class="name">{{item.name}}</div>
      </div>
    </div>
    <loading v-show="loaded||hasMore"></loading>
  </div>
</template>

<script>
  import api from '@/api'
  import loading from "@/components/loading"
  export default {
    name: 'djlist',
    data() {
      return {
        djcate: [],
        djrecs: {},
        djlist: {},
        offset: 0,
        hasMore: false,
        busy: false,
        loaded: false
      }
    },
    components: {
      loading
    },
    activated() {
      this.busy = false
    },
    deactivated() {
      this.busy = true
    },
    created() {
      this.djall();
    },
    methods: {
      djall(val) {
        api.index_dj().then(res => {
          this.djcate = res[0].data;
          this.djrecs = {
            rec_p: res[1].data,
            rec_d: res[2].data
          };
          this.loaded = true;
          this.djlist = res[3].data.djRadios
          this.offset = res[3].data.djRadios.length;
          this.hasMore = res[3].data.hasMore;
        })
      },
      getdjlist() {
        this.busy = true
        api.index_djlist(this.offset).then(res => {
          this.offset += res.data.djRadios.length;
          res.data.djRadios = this.djlist.concat(res.data.djRadios);
          this.djlist = res.data.djRadios;
          this.hasMore = res.data.hasMore;
          this.busy = false;
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mint-swipe {
    height: 8em;
  }
  
  .djcatewrap {
    overflow: hidden
  }
  
  .djcatelist {
    text-align: center;
    width: 25%;
    float: left;
  }
  
  .djcatelist img {
    width: auto;
    height: 2em;
    margin: .5em 0 .2em
  }
  
  .djcatelist div {
    font-size: .8em
  }
</style>
