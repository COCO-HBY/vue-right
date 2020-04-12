<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="5">
        <el-col :span="8">
          <el-input
            size="small"
            placeholder="请输入搜索内容"
            v-model="getparams.query"
            @keyup.enter.native="queryUser()"
          >
            <el-button size="small" slot="append" icon="el-icon-search" @click="queryUser()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button
            size="small"
            type="primary"
            @click="dialogVisible = true"
            icon="el-icon-plus"
          >添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <div class="user-container">
        <div class="user-header">
          <span>用户列表</span>
        </div>
        <div class="user-list">
          <el-table :data="usersdata" stripe style="width: 100%" border>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="账号"></el-table-column>
            <el-table-column prop="name" label="昵称"></el-table-column>
            <el-table-column prop="roleName" label="角色"></el-table-column>
            <el-table-column label="操作" width="250px">
              <template slot-scope="scope">
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="deleteUser(scope.row.id)"
                >删除</el-button>
                <el-button
                  icon="el-icon-setting"
                  size="mini"
                  type="success"
                  @click="showRoleDialog(scope.row)"
                >分配角色</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="getparams.pagenum"
            :page-sizes="[1, 3, 5, 10]"
            :page-size="getparams.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="dialogVisible" width="30%" @close="closeAddUser">
      <el-form
        :model="userForm"
        :rules="userRules"
        ref="user"
        label-width="90px"
        label-position="right"
        size="small"
      >
        <el-form-item label="账号" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="name">
          <el-input v-model="userForm.name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword">
          <el-input v-model="userForm.checkPassword"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancleAddUser()">取 消</el-button>
        <el-button size="small" type="primary" @click="addUser()">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 角色对话框 -->
    <el-dialog @close="setInfoOfRole()" title="分配角色" :visible.sync="roledialogVisible" width="30%">
      <div> 
        <p>用户名：{{userRoleInfo.username}}</p>
        <p>当前角色：{{userRoleInfo.roleName}}</p>
        <el-form :model="userRoleInfo" label-width="100px">
          <el-form-item label="分配新角色">
            <el-select v-model="selectRoleId" placeholder="请选择">
              <el-option
                v-for="item in roleList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
              <el-button size="small" @click="roledialogVisible = false">取 消</el-button>
              <el-button size="small" type="primary" @click="pushRoleInfo()">确 定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.userForm.checkPassword !== "") {
          this.$refs.user.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.userForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      usersdata: [],
      // 请求参数
      getparams: {
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示数量
        pagesize: 3
      },
      // 用户总数
      total: 0,
      // 添加用户对话框显示
      dialogVisible: false,

      // 添加用户表单
      userForm: {
        username: "",
        password: "",
        checkPassword: "",
        name: "",
        roleId: 0
      },
      userRules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        name: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPassword: [{ validator: validatePass2, trigger: "blur" }]
      },
      // 配置角色对话框
      roledialogVisible: false,
      // 当前要配置角色的用户信息
      userRoleInfo: {},
      // 角色列表
      roleList: [],
      // 当前选择的角色ID
      selectRoleId: ""
      //
    };
  },
  methods: {
    handleEdit(scope) {
      console.log(scope);
    },
    getUserslist() {
      let _this = this;
      _this.$http
        .get("users")
        .then(function(res) {
          // console.log(res);
          if (res.data.code !== 200) {
            return _this.$message.error("请求用户列表失败");
          }
          // _this.$message.success(res.data.message);
          _this.usersdata = res.data.data;
          // _this.total = res.data.total;
          // _this.getparams.query = "";
        })
        .catch(function(error) {
          console.log(error + "请求失败信息");
        });
    },
    handleSizeChange(newValue) {
      // 每页显示数量修改
      // console.log(newValue);
      this.getparams.pagesize = newValue;
      this.getUserslist();
    },
    handleCurrentChange(value) {
      // 当前页码
      this.getparams.pagenum = value;
      this.getUserslist();
    },

    // 搜索用户
    queryUser() {
      // this.getUserslist();
      this.debounce(this.getUserslist, 600);
    },

    // 防抖
    debounce(func, delay){
      let timer = null;
      return function(){
        if(timer) clearTimeout(timer);

        let args = arguments;
        let scope = this;

        timer = setTimeout(function(){
          func.apply(scope, args);
        }, delay);
      }
    },

    // 添加用户
    addUser() {
      let _this = this;
      console.log(_this.userForm);
      _this.$refs.user.validate(function(validate) {
        if (!validate) {
          return;
        }
        // console.log(_this.userForm);
        _this.$http
          .post("user", _this.userForm)
          .then(function(res) {
            _this.getUserslist();
            _this.dialogVisible = false;
          })
          .catch(function(error) {
            console.log(error + "添加失败");
          });
      });
    },
    // 取消用户添加
    cancleAddUser() {
      this.dialogVisible = false;
      this.$refs.user.resetFields();
    },
    // 关闭添加用户对话框触发回调
    closeAddUser() {
      this.$refs.user.resetFields();
    },

    deleteUser(id) {
      let _this = this;
      this.$confirm("是否删除该用户?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          _this.$http
            .delete(`user/${id}`)
            .then(function(res) {
              console.log(res);
              _this.$message.success(res.data.message);
              _this.getUserslist();
            })
            .catch(function(error) {
              console.log(error);
            });
        })
        .catch(function(e) {
          // _this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    },
    // 配置角色对话框
    showRoleDialog(row) {
      // console.log(row);
      let _this = this;
      this.$http
        .get("roles")
        .then(function(res) {
          if (res.data.code !== 200) {
            return _this.$message.error("获取角色列表失败");
          }
          _this.roleList = res.data.data;
          // console.log(_this.roleList);
        })
        .catch(e => e);
      this.userRoleInfo = {...row};
      this.roledialogVisible = true;
    },

    //重置配置角色的信息
    setInfoOfRole() {
      this.userRoleInfo = {};
      this.selectRoleId = "";
    },
    // 发送修改新角色信息
    pushRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择新角色！");
      }else{
        this.userRoleInfo.roleId = this.selectRoleId;
      }
      let _this = this;
      console.log(this.userRoleInfo);
      _this.$http
        .put('user', _this.userRoleInfo)
        .then(function(res) {
          if (res.data.code !== 200) {
            return;
          }
          _this.getUserslist();
          _this.roledialogVisible = false;
          _this.$message.success("配置新角色成功");
        })
        .catch(e => e);
    }
  },
  created() {
    this.getUserslist();
  }
};
</script>

<style scoped lang="less">
.user-container {
  margin-top: 20px;
  border: 1.2px solid rgb(50, 144, 233);
  width: 100%;
}
.user-container .user-header {
  background-color: rgb(50, 144, 233);
  width: 100%;
  height: 40px;
  position: relative;
  span {
    color: #fff;
    position: absolute;
    top: 50%;
    left: 3%;
    transform: translateY(-50%);
  }
}
.user-list {
  padding: 1px;
  .el-pagination {
    margin: 10px 10px 5px 10px;
  }
}
</style>