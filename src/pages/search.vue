<template>
  <div v-infinite-scroll="loadmore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" style="padding-top:46px">
     <form action="" @submit="search(true,false)" id="searchform">
      <label><input type="search" v-model="value" :value="value" @onfocus="focus=true" placeholder="搜索音乐、电台、歌手"/><span @click="$router.back()">取消</span></label>
     </form>
    <tab :tabs="tab" :tabidx="cur" v-on:switchtab="switchtab"></tab>
    <mt-tab-container v-model="cur" swipeable>
      <mt-tab-container-item id="0">
        <songlist :list="st[0].relist.songs"></songlist>
        <div class="cntloading" v-if="st[0].loaded&&!st[0].relist.songs">暂无结果</div>
        <loading v-show="!st[0].loaded||!st[0].none"></loading>
      </mt-tab-container-item>
      <mt-tab-container-item id="1" class="artists ">
        <router-link :to="{name: 'artist',params:{id:re.id},query:{img:re.picId}}" class="flexlist flex-image" v-for="re in st[1].relist.artists" :key="re.id">
          <div class="flexleft fl-image">
            <img :src="re.img1v1Url+'?param=100y100'" class="user_avator" />
          </div>
          <div class="flexlist">
            <div class="flexmain">
              <div>{{re.name}}
                <span class="fm_tdes" v-if="re.alias[0]">({{re.alias[0]}})</span>
              </div>
            </div>
          </div>
        </router-link>
        <div class="cntloading" v-if="st[1].loaded&&!st[1].relist.artists">暂无结果</div>
        <loading v-show="!st[1].loaded||!st[1].none"></loading>
      </mt-tab-container-item>
      <mt-tab-container-item id="2" class="albums ">
        <router-link :to="{name: 'album',params:{id:re.id},query:{img:re.picId||re.pic}}" class="flexlist flex-image" v-for="re in st[2].relist.albums" :key="re.id">
          <div class="flexleft fl-image">
            <img :src="re.picUrl+'?param=100y100'" class="album_cover" />
            <img class="albums_cover" src="../../static/images/a6l.png" />
          </div>
          <div class="flexlist">
            <div class="flexmain">
              <div>{{re.name}}
                <span class="fm_tdes" v-if="re.alias[0]">({{re.alias[0]}})</span>
              </div>
              <div class="relistdes">{{re.artist.name}}
                <span v-if="re.artist.alias[re.artist.alias.length-1]">({{re.artist.alias[re.artist.alias.length-1]}})</span>
              </div>
            </div>
          </div>
        </router-link>
        <div class="cntloading" v-if="st[2].loaded&&!st[2].relist.albums">暂无结果</div>
        <loading v-show="!st[2].loaded||!st[2].none"></loading>
      </mt-tab-container-item>
      <mt-tab-container-item id="3" class="playlist ">
        <router-link :to="{name: 'playlist',params:{id:re.id}}" class="flexlist flex-image" v-for="re in st[3].relist.playlists" :key="re.id">
          <div class="flexleft fl-image">
            <img :src="re.coverImgUrl+'?param=100y100'" class="album_cover" />
          </div>
          <div class="flexlist">
            <div class="flexmain">
              <div>{{re.name}}</div>
              <div class="relistdes">{{re.trackCount}}首，By{{re.creator.nickname}}，播放{{re.playCount}}次</div>
            </div>
          </div>
        </router-link>
        <div class="cntloading" v-if="st[3].loaded&&!st[3].relist.playlists">暂无结果</div>
        <loading v-show="!st[3].loaded||!st[3].none"></loading>
      </mt-tab-container-item>
      <mt-tab-container-item id="4">
        <div class="flex-boxlist mvs flex-two">
          <router-link :to="{path:'/playlist',param:{id:re.id}}" class="tl_cnt" v-for="re in st[4].relist.mvs" :key="re.id">
            <div class="cover">
              <div class="img_playcount">
                <img src="../../static/images/video.png" style="height:20rpx;width:28rpx;" />{{re.playCount}}</div>
              <img :src="re.cover+'?param=320y180'" class="mv_cover" />
            </div>
            <div class="tl_info">
              <div>{{re.name}}</div>
              <div class="tli_des">{{re.artistName}}</div>
            </div>
          </router-link>
        </div>
        <div class="cntloading" v-if="st[4].loaded&&!st[4].relist.mvs">暂无结果</div>
        <loading v-show="!st[4].loaded||!st[4].none"></loading>
      </mt-tab-container-item>
      <mt-tab-container-item id="5">
        <div class="sm_title" v-if="st[5].relist.djRadios">电台</div>
        <router-link :to="{path:'/playlist',param:{id:re.id}}" class="flexlist flex-image" v-for="re in st[5].relist.djRadios" :key="re.id">
          <div class="flexleft fl-image">
            <img :src="re.picUrl+'?param=100y100'" class="album_cover" />
          </div>
          <div class="flexlist">
            <div class="flexmain">
              <div>{{re.name}}</div>
              <div class="relistdes">{{re.dj.nickname}}</div>
            </div>
          </div>
        </router-link>
        <div class="sm_title" v-if="st[5].relist.djprograms">节目</div>
        <router-link :to="{path:'/playlist',param:{id:re.id}}" class="flexlist flex-image" v-for="re in st[5].relist.djprograms" :key="re.id">
          <div class="flexleft fl-image">
            <img :src="re.coverUrl+'?param=100y100'" class="album_cover" />
          </div>
          <div class="flexlist">
            <div class="flexmain">
              <div>{{re.name}}</div>
              <div class="relistdes">{{re.dj.brand}} {{'Vol.'+re.serialNum}}</div>
            </div>
          </div>
        </router-link>
        <div class="cntloading" v-if="st[5].loaded&&!st[5].relist.djprograms">暂无结果</div>
        <loading v-show="!st[5].loaded||!st[5].none"></loading>
      </mt-tab-container-item>
      <mt-tab-container-item id="6" class="userprofiles">
        <router-link :to="{path:'/playlist',param:{id:re.userId}}" class="flexlist flex-image" v-for="re in st[6].relist.userprofiles" :key="re.id">
          <div class="flexleft fl-image">
            <img :src="re.avatarUrl+'?param=100y100'" class="user_avator" />
          </div>
          <div class="flexlist">
            <div class="flexmain">
              <div>{{re.nickname}}
                <img src="../../static/images/cm2_pro_icn_boy@2x.png" v-if="re.gender==1" />
                <img src="../../static/images/cm2_pro_icn_girl@2x.png" v-if="re.gender!=1" />
              </div>
              <div class="relistdes">{{re.signature}}</div>
            </div>
          </div>
        </router-link>
        <div class="cntloading" v-if="st[6].loaded&&!st[6].relist.userprofiles">暂无结果</div>
        <loading v-show="!st[6].loaded||!st[6].none"></loading>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
  import api from "@/api"
  import tab from "@/components/tabs"
  import {
    Toast
  } from 'mint-ui';
  import songlist from "@/components/songlist"
  import loading from "@/components/loading"
  const st = require("@/assets/searchtype.js")
  import u from "@/utils.js"
  export default {
    name: 'search',
    data() {
      return {
        focus:false,
        recent_s: [],
        cur: '0',
        songs: {},
        tab: st,
        st: u.clone(st),
        prevalue: '',
        value: "",
        busy: true
      }
    },
    components: {
      tab,
      songlist,
      loading
    },
    activated() {
      this.busy = false;
    },
    deactivated() {
      this.busy = true
    },
    created() {
      var k = this.$route.query.key;
      this.value = k;
      k && this.search(k, false, false)
    },
    watch: {
      'cur' (n, o) {
        //监控tab切换
        if (!this.st[n].loaded) {
          this.search(false, false)
        }
      }
    },
    methods: {
      loadmore() {
        this.search(false, true)
      },
      switchtab(index) {
        this.cur = index.toString()
      },
      search(notw = true, more = false) {
        //关键词,是否是新搜索，是否是更多搜索
        notw && (this.st = u.clone(st));
        var curt = this.st[this.cur];
        if (curt.none||!this.value) return;
        this.busy = true
        api.search(this.value, curt.type, curt.offset).then(res => { 
          res = res.data.result
          var rarry = res.songs || res.artists || res.albums || res.playlists || res.mvs || res.djprograms || res.userprofiles || [];
          var size = res.songCount || res.artistCount || res.albumCount || res.playlistCount || res.mvCount || res.djprogramCount || res.userprofileCount;
          size = size ? size : 0;
          curt.offset += rarry.length;
          curt.loaded = true
          curt.none = curt.offset >= size ? true : false;
          if (more) {
            this.cur == 0 && (curt.relist.songs = curt.relist.songs.concat(res.songs))
            this.cur == 1 && (curt.relist.artists = curt.relist.artists.concat(res.artists))
            this.cur == 2 && (curt.relist.albums = curt.relist.albums.concat(res.albums))
            this.cur == 3 && (curt.relist.playlists = curt.relist.playlists.concat(res.playlists))
            this.cur == 4 && (curt.relist.mvs = curt.relist.mvs.concat(res.mvs))
            this.cur == 5 && (curt.relist.djprograms = curt.relist.djprograms.concat(res.djprograms))
            this.cur == 6 && (curt.relist.userprofiles = curt.relist.userprofiles.concat(res.userprofiles))
          } else {
            curt.relist = res;
          }
          this.st[this.cur] = curt;
          this.busy = false;
        });
      }
    }
  }
</script>

<style scoped>
  #searchform {
    position: fixed;
    background: #BB2C08;
    color: #fff;
    z-index: 10;
    width:100%;top:0;
    border-bottom:1px solid #eee
  }
  .mint-button--default.is-plain{border:none;color:#fff;}
  #searchform label{display:flex;flex:1;margin: 8px;line-height: 30px}
  #searchform span{padding-left: 8px}
  #searchform input{flex:1;border:none;height:30px;border-radius:2em;color:#333;background:#fff;padding:0 1em;}
</style>
