<template>
  <div>
    <!--卡片视图 -->
    <el-card>
      <!-- 按钮 -->
      <el-row>
        <el-col>
          <el-button
            size="small"
            type="primary"
            @click="showAddRoleDialog()"
            icon="el-icon-plus"
          >添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据 -->
      <div class="role-container">
        <div class="role">
          <div class="role-header">
            <span>角色列表</span>
          </div>
          <div class="role-table">
            <el-table style="width: 100%"
            stripe :border="true" 
            :data="rolesList" 
            ref="rolesTable"
            @row-click="showRoleMenusRight"
            >
              <!-- 展开内容 -->
              <el-table-column type="index" label="#"></el-table-column>

              <!-- 内容区 -->
              <el-table-column label="角色名" prop="name"></el-table-column>
              <el-table-column label="操作" prop="add" width="300">
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-edit"
                    size="mini"
                    type="primary"
                    @click.stop="showEditRole(scope.row)"
                  >编辑</el-button>
                  <el-button
                    icon="el-icon-delete"
                    size="mini"
                    type="danger"
                    @click.stop="deleteRole(scope.row)"
                  >删除</el-button>
                  <el-button
                    icon="el-icon-setting"
                    size="mini"
                    type="warning"
                    @click.stop="showRoleMenusRight(scope.row)"
                  >配置权限</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="tree">
          <div class="tree-header">
            <span>菜单权限</span>
          </div>
          <div class="tree-list">
            <el-tree
              :data="allMenus"
              :props="treeProps"
              ref="menusTree"
              accordion
              show-checkbox
              node-key="id"
              :default-checked-keys="treeCheckKey"
            ></el-tree>
            <div class="tree-button">
              <el-button v-if="roleId" size="mini" type="primary" @click="submitMenusRight">确 定</el-button>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      @close="closeAddRoleDialog()"
      title="添加角色"
      :visible.sync="addRoledialogVisible"
      width="30%"
    >
      <!-- 表单 -->
      <el-form
        :model="addRoleForm"
        :rules="addRoleRules"
        ref="addRoleForm"
        label-width="80px"
        label-position="right"
        :hide-required-asterisk="true"
      >
        <el-form-item label="角色名:" prop="name">
          <el-input size="small" v-model="addRoleForm.name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancleAddRole()">取 消</el-button>
        <el-button size="small" type="primary" @click="addRole()">添 加</el-button>
      </span>
    </el-dialog>

    <!-- 打开编辑角色信息的对话框 -->
    <el-dialog
      @closed="editRoleDialog()"
      :title="'编辑角色：'+ currentRoleInfo.name"
      :visible.sync="setRoleInfoDialogVisible"
      width="30%"
    >
      <el-form ref="editRoleFrom" :model="editRoleForm" label-width="100px">
        <el-form-item label="新角色名称:">
          <el-input v-model="editRoleForm.name" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div class="edit-button">
        <el-button size="small" @click="setRoleInfoDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="editRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  //组件数据
  data() {
    return {

      rolesList: [],
      //菜单树列表
      allMenus: [],
      // 菜单树显示的标签
      treeProps: {
        label: "name",
        children: "children"
      },
      roleId: null,
      // 当前角色下拥有的菜单的ID
      treeCheckKey: [],

      // 添加角色
      addRoleForm: {},
      // 添加角色规则
      addRoleRules: {
        name: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      addRoledialogVisible: false,

      // 修改角色信息
      setRoleInfoDialogVisible: false,
      //修改后的角色信息表单
      editRoleForm: {},
      // 当前要修改的角色信息
      currentRoleInfo: {}
    };
  },

  //实例创建完后 发送请求
  created() {
    this.getRolesList();
    this.getMenus();
  },
  // 组件操作
  methods: {
    // 接收角色， 权限id
    deleteTagById(role, rightid) {
      let _this = this;
      // console.log(this);
      this.$confirm("是否删除该权限？", "注意", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function(res) {
          console.log("点击删除按钮!");
          _this.$http
            .delete(`roles/${role.id}/rights/${rightid}`)
            .then(function(res) {
              // console.log(res);
              if (res.data.meta.status !== 200) {
                return;
              }
              role.children = res.data.data;
            })
            .catch(function(e) {
              return e;
            });
        })
        .catch(function(e) {
          console.log("已取消删除该权限----id:" + rightid);
        });
    },

    //更改展开的项状态
    // toogleExpand(row) {
    //   let $table = this.$refs.rolesTable;
    //   this.rolesList.map(item => {
    //     if (row.id != item.id) {
    //       $table.toggleRowExpansion(item, false);
    //     }
    //   });
    //   $table.toggleRowExpansion(row);
    // },

    // 显示配置权限的对话框
    getMenus() {
      let _this = this;
      this.$http
        .get("menus")
        .then(function(res) {
          if (res.data.code !== 200) {
            return _this.$message.error("获取所有菜单权限失败");
          }
          _this.allMenus = res.data.data;
        })
        .catch(e => e);
    },

    // 获取某个角色下所有的菜单
    showRoleMenusRight(row){
      if(this.treeCheckKey !== null){
        this.treeCheckKey = [];
      } 
      let _this = this;
      _this.roleId = row.id;
      _this.$http.get(`permission/${_this.roleId}`).then(function(res){
        if(res.data.code !== 200){
          return _this.$message.error(res.data.message);
        }
        // console.log(res);
        if(res.data.data !== null){
          // 不为空
          _this.putMenuInList(res.data.data, _this.treeCheckKey);
          // console.log(_this.treeCheckKey);
          _this.$refs.menusTree.setCheckedKeys(_this.treeCheckKey);
        }else{
          _this.$refs.menusTree.setCheckedKeys([])
        }
      }).catch(e => e);
      
    },

    // 更改角色的菜单权限
    async submitMenusRight() {
      const checkKey = this.$refs.menusTree.getCheckedKeys();
      const halfCheckKey = this.$refs.menusTree.getHalfCheckedKeys();
      const arr = checkKey.concat(halfCheckKey);
      
      const res = await this.$http.put("permission", {
        roleId: this.roleId,
        menuIds: arr
      });
      
      if (res.data.code !== 200) {
        return this.$message.error("更新权限失败！");
      }
      // 更新角色权限数据和视图
      this.getRolesList();
      this.$message.success("更新权限成功");
    },

    putMenuInList(menu, arr){
      for(const key in menu){
        this.pushKeyInTree(menu[key], arr);
      }
    },
    // 遍历角色拥有的权限
    pushKeyInTree(row, arr) {
      if (!row.children) {
        return arr.push(row.id);
      }
      let _this = this;
      row.children.forEach(function(item) {
        _this.pushKeyInTree(item, arr);
      });
    },

// 获取所有角色
    getRolesList() {
      let _this = this;
      _this.$http
        .get("roles")
        .then(function(res) {
          // console.log(res);
          if (res.data.code !== 200) {
            return;
          }
          // console.log(res);
          _this.rolesList = res.data.data;
        })
        .catch(function(e) {
          console.log(e);
        });
    },

    // 添加角色对话框
    showAddRoleDialog() {
      this.addRoledialogVisible = true;
    },
    // 取消添加角色
    cancleAddRole() {
      this.addRoledialogVisible = false;
    },
    //发送添加角色的信息
    addRole() {
      let _this = this;
      this.$refs.addRoleForm.validate(function(validate) {
        if (!validate) {
          return;
        }
        console.log(_this.addRoleForm);
        _this.$http
          .post("role", _this.addRoleForm)
          .then(function(res) {
            if (res.data.code !== 200) {
              return _this.$message.error(res.data.message);
            }
            _this.getRolesList();
            _this.addRoledialogVisible = false;
          })
          .catch(function(error) {
            console.log("添加角色失败");
          });
      });
    },
    // 重置关闭添加角色对话框
    closeAddRoleDialog() {
      this.addRoleForm = {};
      this.$refs.addRoleForm.resetFields();
    },

    //编辑角色信息对话框
    showEditRole(row) {
      this.currentRoleInfo = row;
      this.setRoleInfoDialogVisible = true;
    },
    //发送修改角色
    editRole() {
      if (!this.editRoleForm.name) {
        return this.$message.error("角色名不能为空");
      }
      let _this = this;
      this.currentRoleInfo.name = this.editRoleForm.name;
      this.$http
        .put("role", this.currentRoleInfo)
        .then(function(res) {
          // console.log(res);
          if (res.data.code !== 200) {
            return _this.$message.error(res.data.message);
          }
          _this.getRolesList();
          _this.setRoleInfoDialogVisible = false;
        })
        .catch(e => e);
    },
    // 编辑对话框关闭后 重置表单
    editRoleDialog() {
      this.$refs.editRoleFrom.resetFields();
      this.editRoleForm = {};
      this.currentRoleInfo = {};
    },

    // 删除角色
    deleteRole(row) {
      // cosole.log(row);
      let _this = this;
      this.$confirm("是否删除“ " + row.name + " ”这个角色？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          _this.$http
            .delete(`role/${row.id}`)
            .then(function(res) {
              if (res.data.code !== 200) {
                return _this.$messagr.error(res.data.message);
              }
              _this.$message.success("删除角色成功！");
              _this.getRolesList();
            })
            .catch(e => e);
        })
        .catch(() => {
          // _this.$message({
          //   type: "info",
          //   message: "已取消删除"
          // });
        });
    }
  }
};
</script>


<style lang="less" scoped>
// .el-tag {
//   margin: 10px 3px;
// }

// .bottom-br {
//   border-bottom: 1px solid #ddd;
// }
// //增加第一项的顶线
// .bottom-br:first-child {
//   border-top: 1px solid #ddd;
// }

// //2级权限上划线
// .top-br {
//   border-top: 1px solid #ddd;
// }
// .top-br:first-child {
//   border-top: none;
// }

// //展开tag标签 垂直居中表示
// .item-vertical {
//   display: flex;
//   align-items: center;
// }
// //编辑按钮右对齐
// .edit-button {
//   text-align: right;
// }

//角色列表
.role-container {
  margin-top: 20px;
  width: 100%;
  overflow: hidden;
  .role {
    width: 58%;
    float: left;
    border: 1.2px solid #5b668f;
    .role-header {
      background-color: #5b668f;
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
    .role-table {
      padding: 2px;
    }
  }
  .tree {
    border: 1.2px solid rgb(34, 134, 228);
    width: 38%;
    float: right;
    .tree-header {
      background-color: rgb(34, 134, 228);
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
    .tree-list {
      padding: 2px;
      margin: 10px;
    }
  }
}
.tree-button {
  margin-left: 10px;
  margin-top: 20px;
}
</style>