<template>
  <div>
    <mt-header fixed title="发现音乐">
    <router-link slot="right" :to="{name:'search'}">搜索</router-link>
    </mt-header>
    <div class="page page_t page_b">
      <div class="page" id="indexwrap">
       <tab :tabs="tabs" :url="taburl" v-on:switchtab="switchtab"></tab>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      </div>
    </div>
  
  </div>
</template>

<script>
  import tab from "@/components/tabs.vue"
  export default {
    name: 'index',
    data() {
      return {
        taburl: true,
        title: '发现音乐',
        tabs: [{
          name: "个性推荐",
          url: 'find'
        }, {
          name: "歌单",
          url: 'playlist'
        }, {
          name: "主播电台",
          url: "djlist"
        }, {
          name: "排行榜",
          url: 'sort'
        }]
      }
    },
    components: {
      tab
    },
    methods: {
      switchtab(index) {}
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  #lastsearch {
    line-height: 1;
    padding-top: 20px;
    flex: 0 0 80px;
  }
  
  .homepl .tl_cnt {
    width: 168.75px;
  }
  
  #plc_header {
    border: none;
  }
  
  .djcatewrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .djcatelist {
    text-align: center;
    font-size: 24px;
    flex: 0 0 187.5px;
    height: 145px
  }
  
  .djcatelist image {
    width: 80px;
    height: 80px;
    margin-top: 20px
  }
</style>
