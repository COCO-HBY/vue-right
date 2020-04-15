<template>
  <transition name="fade">
    <!-- 蒙版 -->
    <div class="mask" v-if="show" @touchmove.prevent>
      <div class="window">
        <div class="header"></div>
        <img class="shadow" :src="imgUrl" alt="" />
        <h1>{{ title }}</h1>
        <p>{{ content }}</p>
        <!-- <button @click="btnCancleClick">{{ btnCancleText }}</button>
        <button @click="btnConfirmClick">{{ btnConfirmText }}</button> -->
        <el-button size="small" @click="btnCancleClick">{{ btnCancleText }}</el-button>
        <el-button size="small" type="primary" @click="btnConfirmClick">{{ btnConfirmText }}</el-button>
      </div>
      <!-- <img @click="show = false" v-fb class="close" src="../../../pages/signin/dialog/images/关闭.png" alt=""> -->
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      imgUrl: "",
      title: "",
      content: "",
      btnCancleText: "",
      btnComfirmText: "",
      // 函数变量
      btnConfirm: "",
      btnCancle: "",
    };
  },
  created() {},
  methods: {
    btnCancleClick() {
      this.btnCancle();
      this.show = false;
    },
    btnConfirmClick() {
      this.btnConfirm();
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
// 渐变过度
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  // flex-direction: column;
  justify-content: center;
  align-items: center;
  // padding: 75px;
  .window {
    height: 300px;
    width: 30%;
    background: #fff;
    border-radius: 8px;
    text-align: center;
    .header {
      background-color: rgb(34, 134, 228);
      width: 100%;
      height: 40px;
    }
    .shadow {
      width: 270px;
    }
    h1 {
      margin-top: 32px;
      font-size: 32px;
      color: #000;
      line-height: 32px;
      font-weight: 600;
    }
    p {
      margin-top: 32px;
      font-size: 28px;
      color: #000;
      line-height: 40px;
    }
    // button {
    //   margin-top: 34px;
    //   background: #f95644;
    //   border-radius: 10px;
    //   width: 100x;
    //   height: 30px;
    //   font-size: 28px;
    //   color: #ffffff;
    // }
  }
}
</style>
