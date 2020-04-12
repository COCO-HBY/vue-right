<template>
  <div>
    <el-card class="box-card">
      <h1>欢迎回来！{{userinfo}}</h1>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userinfo: {}
    };
  },
  created() {
    this.userinfo = window.sessionStorage.getItem("name");
  }
};
</script>
<style lang="less" scoped>
.el-card {
  height: 400px;
}
</style>

