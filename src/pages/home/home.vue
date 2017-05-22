<template>
  <div>
    <router-view class="page_b"></router-view>
    <mt-tabbar fixed>
      <mt-tab-item id="home">
        <img slot="icon" src="../../../static/images/cm2_btm_icn_discovery_prs.png"> 发现音乐
      </mt-tab-item>
      <mt-tab-item id="me" href="#/me">
        <img slot="icon" src="../../../static/images/cm2_btm_icn_account.png"> 我的音乐
      </mt-tab-item>
    </mt-tabbar>
  </div>
</template>
