<template>
  <div>
    <router-view class="page_b"></router-view>
    <mt-tabbar v-model="bottomNav" fixed>
      <mt-tab-item id="home">
        <img slot="icon" v-if="bottomNav=='home'" src="../../../static/images/cm2_btm_icn_discovery_prs.png">
        <img slot="icon" v-else src="../../../static/images/cm2_btm_icn_discovery.png"> 发现音乐
      </mt-tab-item>
      <mt-tab-item id="me" href="#/play/fm">
        <img slot="icon" v-if="bottomNav=='me'"  src="../../../static/images/cm2_btm_icn_account_prs.png">
        <img slot="icon" v-else src="../../../static/images/cm2_btm_icn_account.png"> 我的音乐
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>

<script>
  export default {
    name: 'home',
    data() {
      return {
        bottomNav: 'home'
      }
    }
  }
</script>

<style lang="less" scoped>
  #plc_header {
    border: none;
  }
  
</style>
