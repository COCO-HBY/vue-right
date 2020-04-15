<template>
  <div class="login">
    <div class="login_box">
      <div class="login_image">
        <img src="../assets/favicon.png" />
      </div>
      <el-form :model="loginFrom" ref="login" :rules="rules" class="login_form" label-width="0px">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginFrom.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginFrom.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="button_box">
          <el-button type="primary" round @click="login()">登录</el-button>
          <!-- <el-button round @click="add()">注册</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <!-- 用户注册 -->
    <el-dialog title="用户注册" :visible.sync="dialogVisible" width="50%" @close="setDialogInfo">
      <!-- //表单 -->
      <el-form
        :model="userForm"
        :rules="userRules"
        ref="user"
        label-width="65px"
        label-position="left"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleAddUser()">取 消</el-button>
        <el-button type="primary" @click="addUser()">添 加</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import axios from "axios";
export default {
  data() {
    return {
      loginFrom: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请輸入密码", trigger: "blur" }]
      },
      loginInfo: {},

      // 注册对话框
      dialogVisible: false,
      // 添加用户表单
      userForm: {
        username: "",
        password: ""
      },
      userRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      //  loading 配置
      options: {
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(255, 255, 255, 1)"
      }
    };
  },
  methods: {
    // 用户注册
    add() {
      this.dialogVisible = true;
    },
    // 取消注册
    cancleAddUser() {
      this.dialogVisible = false;
    },
    setDialogInfo() {
      this.$refs.user.resetFields();
      this.userForm = {};
    },
    // 添加用户
    addUser() {
      let _this = this;
      this.$refs.user.validate(function(validate) {
        if (!validate) {
          // console.log(123);
          return;
        }
        // console.log(_this.userForm);
        _this.$http
          .post("users", _this.userForm)
          .then(function(res) {
            _this.dialogVisible = false;
            console.log(res);
          })
          .catch(function(error) {
            console.log(error + "注册失败");
            _this.$message.error("注册失败!");
          });
      });
    },
    reset() {
      this.$refs.login.resetFields();
    },
    // 登录验证 登录发送
    login() {
      let vue = this;
      let loading = vue.$loading.service(vue.options);
      this.$refs.login.validate(async function(valid) {
        if (!valid) return;
        const result = await vue.$http
          .post("login", vue.loginFrom)
          .then(function(res) {
            if (res.data.code !== 200) {
              return vue.$message.error(res.data.message);
            }
            // console.log(res);
            vue.$nextTick(() => {
              // 以服务的方式调用的 Loading 需要异步关闭
               loading.close();
            });

            window.sessionStorage.setItem("name", res.data.data.name);
            window.sessionStorage.setItem("id", res.data.data.id);
            window.sessionStorage.setItem("token", res.data.data.token);
            vue.$message.success("登录成功");
            vue.$router.push("/home");
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    }
  }
};
</script>

<style  lang = 'less' scoped>
.login {
  background-color: #303750;
  height: 100%;
}
.login_box {
  width: 400px;
  height: 300px;
  border-radius: 3px;
  background-color: #eee;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login_image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid #fff;
  position: absolute;
  left: 50%;
  background-color: #fff;
  padding: 3px;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 10px;
  box-sizing: border-box;
}
.button_box {
  display: flex;
  justify-content: center;
}
</style>
