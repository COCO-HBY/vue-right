<template>
  <div>
    <!-- 菜单卡片 -->
    <el-card>
      <!-- 左边菜单树状图 -->
      <div class="tree-container">
        <div class="tree">
          <div class="tree-header">
            <span>菜单树</span>
          </div>
          <el-tree :data="menusTableData" :props="treeProps" accordion @node-click="treeItemClick"></el-tree>
        </div>
        <!-- 右边显示详细信息 -->
        <div class="tree-item-info" ref="treeItemInfo">
          <div class="item-info-header">
            <span>菜单项信息</span>
          </div>
          <div class="item-info">
            <el-form
              :model="menuItemInfo"
              label-width="80px"
              size="mini"
              ref="menuItemInfoForm"
              :rules="menuRules"
              hide-required-asterisk
            >
              <el-form-item label="菜单名称" style="width: 200px" prop="name">
                <el-input v-model="menuItemInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="路径" style="width: 200px" prop="url">
                <el-input v-model="menuItemInfo.url"></el-input>
              </el-form-item>
              <el-form-item label="父级菜单" style="width: 200px">
                <el-select placeholder="选择父级" v-model="menuItemInfo.pid" style="width: 200px">
                  <el-option
                    v-for="item in selectList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.name"
                    filterable
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="图标" prop="icon">
                <el-select
                  placeholder="选择图标"
                  v-model="menuItemInfo.icon"
                  style="width: 200px"
                  @blur="onIconBlur"
                >
                  <el-option v-for="(item, index) in iconList" :key="index" :value="item.icon">
                    <template>
                      <i :class="item.icon" style="font-size: 20px;"></i>
                      <span>{{item.icon}}</span>
                    </template>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="type" prop="type">
                <el-select
                  placeholder="选择类型"
                  v-model="menuItemInfo.type"
                  style="width: 85px"
                  @blur="onTypeBlur"
                >
                  <el-option
                    v-for="(item, index) in typeList"
                    :key="index"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态">
                <el-switch :active-value="1" :inactive-value="0" v-model="menuItemInfo.state"></el-switch>
              </el-form-item>
              <el-form-item label="排序" style="width: 150px" prop="order">
                <el-input v-model="menuItemInfo.order"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  v-if="!menuItemInfo.id"
                  type="primary"
                  @click="onSubmitMenuItem(menuItemInfo)"
                >
                  新增
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
                <el-button
                  v-if="menuItemInfo.id"
                  type="primary"
                  @click="editMenuItem(menuItemInfo)"
                >
                  修改
                  <i class="el-icon-upload el-icon--right"></i>
                </el-button>
                <!-- <el-button
                  v-if="menuItemInfo.id"
                  type="danger"
                  @click="deleteMenuItem(menuItemInfo)"
                >
                  删除
                  <i class="el-icon-delete el-icon--right"></i>
                </el-button> -->
                 <el-button
                  v-if="menuItemInfo.id"
                  type="danger"
                  @click="pop"
                >
                  删除
                  <i class="el-icon-delete el-icon--right"></i>
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
// import SelectIcon from "./select/selectIcon.vue"
import bus from "../plugins/bus.js";
export default {
  data() {
    return {
      //菜单树的设置
      treeProps: {
        children: "children",
        label: "name"
      },
      //菜单树数据
      menusTableData: [],
      // 菜单项信息
      menuItemInfo: {},
      iconList: [
        {
          id: 1,
          icon: "el-icon-s-check"
        },
        {
          id: 2,
          icon: "el-icon-s-order"
        },
        {
          id: 3,
          icon: "el-icon-menu"
        },
        {
          id: 4,
          icon: "el-icon-s-data"
        },
        {
          id: 5,
          icon: "el-icon-s-home" 
        },
        {
          id: 6,
          icon: "el-icon-s-custom"
        },
      ],
      //父级下拉菜单列表
      selectMenuList: [],
      // 当前被选中父级ID
      selectPid: null,
      // type, state : 1 or 0
      typeList: [0, 1],
      // 校验菜单提交表单数据
      menuRules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
        order: [
          {
            required: true,
            message: "请输入编号",
            trigger: "blur",
          }
        ],
        icon: [{ required: true, message: "请选择图标", trigger: "change" }],
        type: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change",
            type: "number"
          }
        ]
      }
    };
  },
  components: {},
  created() {
    this.getRightsList();
  },
  methods: {
    pop(){
      this.$popup({
        title:'biaoti',
        content:'neirong',
        btnCancleText: 'cancle',
        btnComfirmText: 'comfirm',
        btnConfirm: () =>{
          this.$router.push()
        },
        btnCancle: () =>{   
        }
      })
    },
    onIconBlur() {
      this.$refs.menuItemInfoForm.validateField("icon");
    },
    onTypeBlur() {
      this.$refs.menuItemInfoForm.validateField("type");
    },
    getRightsList() {
      let _this = this;
      this.$http
        .get("menus")
        .then(function(res) {
          // console.log(res);
          if (res.data.code !== 200) {
            return _this.$message.error(res.data.message);
          }
          _this.menusTableData = res.data.data;
          _this.forEachMenu(res.data.data, _this.selectMenuList);
        })
        .catch(e => e);
    },
    //遍历菜单
    forEachMenu(arr, list) {
      list.push({ id: -1, name: "顶级菜单" });
      for (const key in arr) {
        this.pushKeyInMenuList(arr[key], list);
        // console.log(arr[key]);
      }
    },

    //遍历所有菜单项
    pushKeyInMenuList(arr, list) {
      list.push({ id: arr.id, name: arr.name });
      if (arr.children == null) {
        return;
      }
      let _this = this;
      arr.children.forEach(function(item) {
        _this.pushKeyInMenuList(item, list);
      });
    },

    // 点击树形菜单
    treeItemClick(data, node, tree) {
      this.$refs.menuItemInfoForm.clearValidate();
      this.menuItemInfo = { ...data };
      // console.log(this.selectMenuList);
    },

    //发送修改菜单
    editMenuItem(info) {
      // remove chilren
      delete info.children;
      let _this = this;
      _this.$refs.menuItemInfoForm.validate(function(valid) {
        if (!valid) return;
        _this.$http
          .put("menu", info)
          .then(function(res) {
            // console.log(res);
            if (res.data.code != 200) {
              return _this.$message.error(res.data.message);
            }
            _this.$message.success(res.data.message);
            _this.selectMenuList = [];
            _this.getRightsList();
            _this.submitReflashMenus();
          })
          .catch(e => e);
      });
    },
    // 新增菜单
    onSubmitMenuItem(item) {
      let _this = this;
      // console.log(item);
      // console.log(_this.$refs.menuItemInfoForm);
      if (item.pid == null) {
        item.pid = -1;
      }
      _this.$refs.menuItemInfoForm.validate(function(valid) {
        if (!valid) {
          return;
        }
        //验证完毕 发送新增请求
        _this.$http
          .post("menu", item)
          .then(function(res) {
            if (res.data.code !== 200) {
              return _this.$message.error(res.data.message);
            }
            _this.$message.success(res.data.message);
            _this.selectMenuList = [];
            _this.getRightsList();
            _this.submitReflashMenus();
            _this.$refs.menuItemInfoForm.resetFields();
            _this.menuItemInfo.pid = null;
          })
          .catch(e => e);
      });
    },

    //  发送事件 刷新home组件菜单栏
    submitReflashMenus() {
      bus.$emit("reflash", this);
    },
    // 删除菜单项
    deleteMenuItem(item) {
      // console.log("菜单id：" + item.id);
      let _this = this;
      _this
        .$confirm("是否删除“ " + item.name + " ”？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          _this.$http
            .delete(`menu/${item.id}`)
            .then(function(res) {
              if (res.data.code !== 200) {
                return _this.$message.error(res.data.message);
              }
              _this.$message.success(res.data.message);
              _this.selectMenuList = [];
              _this.getRightsList();
              _this.submitReflashMenus();
              _this.$refs.menuItemInfoForm.resetFields();
              _this.menuItemInfo.pid = null;
            })
            .catch(e => e);
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  computed: {
    selectList: function() {
      let _this = this;
      return this.selectMenuList.filter(function(item) {
        return item.id !== _this.menuItemInfo.id;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.tree {
  border: 1.2px solid #5b668f;
  width: 50%;
}
.tree .tree-header {
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
.tree-item-info {
  border: 1.2px solid rgb(34, 134, 228);
  width: 46%;
}
.tree-item-info .item-info-header {
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
.tree-container {
  display: flex;
  justify-content: space-between;
}
.item-info {
  margin-top: 20px;
}
.el-tree {
  margin-top: 15px;
  width: 90%;
}
</style>
