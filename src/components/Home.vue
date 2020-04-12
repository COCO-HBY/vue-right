<template>
  <el-container class="home-container">
    <el-container>
      <el-aside width="200px">
        <div class="header-text">
          <img src="@/assets/favicon.png" alt="icon" />
          <span>权限管理系统</span>
        </div>
        <el-menu
          background-color="#303750"
          text-color="#b3c7ec"
          active-text-color="#fff"
          unique-opened
          :router="true"
          :default-active="$route.path"
          @open="openUrl"
        >
          <div v-for="item in menulist" :key="item.id">
            <!-- 一级菜单 -->
            <el-menu-item
              v-if="item.children == null || item.children.length == 0"
              :index="item.url"
            >
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
              </template>
            </el-menu-item>
            <el-submenu v-else :index="item.url">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.name}}</span>
              </template>
              <!-- 二级菜单 -->
              <div v-for="li in item.children" :key="li.id">
                <el-menu-item v-if="li.children == null || li.children.length == 0" :index="li.url">
                  <template slot="title">
                    <i :class="li.icon"></i>
                    <span>{{li.name}}</span>
                  </template>
                </el-menu-item>
                <el-submenu v-else :index="li.url">
                  <template slot="title">
                    <i :class="li.icon"></i>
                    <span>{{li.name}}</span>
                  </template>
                  <el-menu-item v-for="it in li.children" :key="it.id" :index="it.url">
                    <template slot="title">
                      <i :class="it.icon"></i>
                      <span>{{it.name}}</span>
                    </template>
                  </el-menu-item>
                </el-submenu>
              </div>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>

      <el-main>
        <div class="header">
          <breadcrumb></breadcrumb>
          <div class="login-name">
            <el-avatar icon="el-icon-user-solid" :size="25"></el-avatar>
            <el-dropdown @command="logout">
              <span class="el-dropdown-link">
                {{name}}
                <i class="el-icon-caret-bottom"></i>
              </span>
              <el-dropdown-menu>
                <el-dropdown-item icon="el-icon-switch-button">登出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import breadcrumb from "./Breadcrumb.vue";
import bus from "../plugins/bus.js";
export default {
  data() {
    return {
      menulist: [],
      name: ""
    };
  },
  components: {
    breadcrumb
  },
  methods: {
    logout() {
      let _this = this;
      _this.$http
        .get("logout")
        .then(function(res) {
          if (res.data.code !== 200) {
            return _this.$message.error(res.data.message);
          }
          _this.$router.push("/login");
          window.sessionStorage.clear();
        })
        .catch(e => e);
    },
    getMenuList() {
      //请求菜单列表
      let vue = this;
      let userId = window.sessionStorage.getItem('id');
      this.$http.get(`menuList/${userId}`).then(function(res) {
        // new system
        if (res.data.code !== 200) {
          return vue.$message.error(res.data.message);
        }
        vue.menulist = res.data.data;
      });
    },
    openUrl(index){
      // console.log(index);  //自己设定的路由
      // if(this.$route.path !== index){
      //   this.$router.push(index);
      // } 
    }
  },
  created() {
    this.getMenuList();
    this.name = window.sessionStorage.getItem("name");
  },
  mounted() {
    var _this = this;
    bus.$on("reflash", function(res) {
      _this.getMenuList();
    });
  },
  beforeDestroy() {
    bus.$off("reflash");
  }
};
</script>

<style scoped lang='less'>
.home-container {
  height: 100%;
}
.header-text {
  text-align: center;
  align-items: center;
  margin: 15px 0px;
  font-size: 15px;
  font-weight: 900;
  color: #fff;
  img {
    width: 30px;
    height: 30px;
    margin-bottom: -10px;
    margin-left: -20%;
  }
}
.header-text span {
  margin-left: 5px;
}
.el-aside {
  background-color: #303750;
}

.el-main {
  background-color: #efeff1;
}
.el-menu {
  width: 100%;
}
.el-avatar {
  margin-right: 5px;
  display: inline-table;
}
.login-name {
  text-align: right;
  font-size: 15px;
  margin-top: -7px;
}
</style>