<template>
  <div class="ctctree-select-tablegy">
    <el-tooltip class="item" :content="showOrganizeName" placement="top">
      <el-input v-model="showOrganizeName" :disabled="disabled" :placeholder="placeholder" readonly>
        <el-button slot="append" icon="el-icon-search" @click="openDialog"></el-button>
      </el-input>
    </el-tooltip>
<!--    <el-input :value="value" style="display: none"></el-input>-->
    <el-dialog :visible.sync="visible" width="35%" :modal="false" title="所属机构/部门/科室选择" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row class="leftTree tree-container">
        <el-col :span="24">
          <el-form label-position="right" :inline="false" ref="dataForm" :model="dataForm" label-width="90px" @keyup.enter.native="getSeachTreeData()">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="name" label="筛选条件：">
                  <el-input v-model="dataForm.name" placeholder="请输入筛选条件" clearable></el-input>
                </el-form-item>
              </el-col>
<!--              <el-col :span="4" align="right">-->
<!--                <el-button type="primary" size="small" @click="getSeachTreeData()">查询</el-button>-->
<!--              </el-col>-->
            </el-row>
          </el-form>
        </el-col>
        <el-col :span="24" class="tree-data">
          <el-tree ref="leftTreeData" :filter-node-method="filterNode" :data="data" :props="defaultProps" default-expand-all :default-checked-keys="checkedKeys" node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="false" :indent="30" :expand-on-click-node="false" :check-on-click-node="true" style="height:440px;overflow-y:auto;">
            <span class="custom-tree-node" :title="getTreeIcon('title',data,node)" slot-scope="{ node, data }" style="display:block;">
              <img :src="getTreeIcon('src',data,node)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </span>
          </el-tree>
        </el-col>
      </el-row>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消选择</el-button>
        <el-button v-if="type==='checkbox'" type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcTreeOrgan',
  data () {
    return {
      dataForm: {
        name: ''
      },
      data: [],
      visible: false,
      showOrganizeName: '',
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      checkedKeys: [], // 多选回显
      jtzb: 0, // 集团总部
      sgs: 2, // 省公司
      zygs: 1, // 专业公司
      cs: 5 // 厂商
    }
  },
  props: {
    value: [Number, String, Array],
    disabled: Boolean,
    type: {
      type: String,
      default: 'radio'
    },
    id: String,
    pid: String,
    placeholder: String
  },
  watch: {
    'dataForm.name' (val) {
      this.$refs.leftTreeData.filter(val)
    },
    pid (newVal, oldVal) {
      this.$emit('input', [])
      this.showOrganizeName = ''
      this.data = []
    }
    // id (newVal, oldVal) {
    //   if (oldVal === '') {
    //     this.echoData()
    //   }
    //   if (newVal === '') {
    //     this.showOrganizeName = ''
    //   }
    // }
  },
  mounted () {
    // if (this.id) {
    //   this.echoData()
    // }
    // if (this.data.length === 0) {
    //   this.getSeachTreeData()
    // }
  },
  methods: {
    init (res) {
      this.showOrganizeName = res.name || ''
    },
    openDialog () {
      if (!this.disabled) {
        if (this.pid) {
          this.visible = true
          this.dataForm.name = ''
          if (this.data.length === 0) {
            this.getSeachTreeData()
          }
        } else {
          this.$message.warning('请先选择账号类型！')
        }
      }
    },
    filterNode (value, data, node) {
      if (!value) return true
      if (node.level === 3) {
        if (data.name.indexOf(value) !== -1 || node.parent.data.name.indexOf(value) !== -1 || node.parent.parent.data.name.indexOf(value) !== -1) {
          return true
        } else {
          return false
        }
      } else if (node.level === 2) {
        return node.parent.data.name.indexOf(value) !== -1
      } else {
        return data.name.indexOf(value) !== -1
      }
    },
    getSeachTreeData () {
      let thisvm = this
      // 默认先清空目录树缓存数据
      thisvm.$ctcLoading.open()
      let params = { sysAcctType: this.pid }
      // let params = { ...this.dataForm }
      // this.data = [
      //   {
      //     id: 1,
      //     name: '集团总部',
      //     type: 0,
      //     children: [{
      //       id: 4,
      //       name: '集团总部-部门1',
      //       children: [{
      //         id: 9,
      //         name: '集团总部-部门-科室1'
      //       }, {
      //         id: 10,
      //         name: '集团总部-部门-科室2'
      //       }]
      //     }]
      //   },
      //   {
      //     id: 2,
      //     name: '省公司',
      //     type: 2,
      //     children: [{
      //       id: 5,
      //       name: '省公司-部门1'
      //     }, {
      //       id: 6,
      //       name: '省公司-部门2'
      //     }]
      //   },
      //   {
      //     id: 3,
      //     name: '专业公司',
      //     type: 1,
      //     children: [{
      //       id: 7,
      //       name: '专业公司-部门1'
      //     }, {
      //       id: 8,
      //       name: '专业公司-部门2'
      //     }]
      //   },
      //   {
      //     id: 11,
      //     name: '厂商',
      //     type: 5,
      //     children: [{
      //       id: 41,
      //       name: '厂商-部门1',
      //       children: [{
      //         id: 91,
      //         name: '厂商-部门-科室1'
      //       }, {
      //         id: 101,
      //         name: '厂商-部门-科室2'
      //       }]
      //     }]
      //   }
      // ]
      thisvm.$http.get('/account4a/sys/org/tree', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        let list = res.data
        this.data = list
      }).catch(() => {
        this.data = []
        thisvm.$ctcLoading.close()
      })
    },
    handleNodeClick (data, node) {
      // 设置点击，触发选中
      if (this.type === 'radio') {
        let orgType
        if (node.level === 1) {
          orgType = node.data.type
          this.showOrganizeName = node.data.name
        } else if (node.level === 2) {
          orgType = node.parent.data.type
          this.showOrganizeName = node.parent.data.name + ' / ' + node.data.name
        } else if (node.level === 3) {
          orgType = node.parent.parent.data.type
          this.showOrganizeName = node.parent.parent.data.name + ' / ' + node.parent.data.name + ' / ' + node.data.name
        }
        console.log(orgType)
        if (this.fixType(orgType, node.level)) {
          this.$emit('input', this.getId(node))
          this.$emit('update:afterSelectData', { type: data.id })
          this.visible = false
        } else {
          this.showOrganizeName = ''
        }
      }
    },
    getId (node) {
      let ids = []
      if (node.level === 1) {
        ids.push(node.data.id)
      } else if (node.level === 2) {
        ids.push(node.parent.data.id, node.data.id)
      } else if (node.level === 3) {
        ids.push(node.parent.parent.data.id, node.parent.data.id, node.data.id)
      }
      return ids
    },
    fixType (orgType, level) {
      // jtzb: 0, // 集团总部
      //         sgs: 2, // 省公司
      //         zygs: 1, // 专业公司
      //         cs: 5 // 厂商
      // 1）集团总部：必须选到最底层，即机构，部门，科室均为必选项
      // 2）省公司、专业公司：必须选到部门级别，即机构、部门为必选项，科室为非必选项
      // 3）厂商：机构为必选项，部门、科室为非必选项
      if (orgType === this.jtzb) {
        if (level < 3) {
          this.$message.warning('集团总部：必须选到最底层，即机构，部门，科室均为必选项!')
          return false
        }
      } else if (orgType === this.sgs) {
        if (level < 2) {
          this.$message.warning('省公司：必须选到部门级别，即机构、部门为必选项，科室为非必选项!')
          return false
        }
      } else if (orgType === this.zygs) {
        if (level < 2) {
          this.$message.warning('专业公司：必须选到部门级别，即机构、部门为必选项，科室为非必选项!')
          return false
        }
      } else if (orgType === this.cs) {
        return true
      }
      return true
    },
    getTreeIcon (type, data, node) {
      if (type === 'src') {
        return require('@/assets/img/sys_icon_' + node.level + '.png')
      } else {
        return data.name
      }
    },
    echoData () {
      if (this.type === 'radio') {
        this.showOrganizeName = ''
        this.$http.get(this.baseOption.echoUrl + this.id).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          } else {
            if (res.data.list.length > 0) {
              this.showOrganizeName = res.data.list[0].name || res.data.list[0].username
              this.$emit('input', this.id)
            }
          }
        }).catch(() => { })
      }
    },
    cancelHandle () {
      this.$emit('input', [])
      this.$emit('update:afterSelectData', { })
      this.showOrganizeName = ''
      this.visible = false
    },
    commitHandle () {
    }
  }
}
</script>
<style lang="scss" >
  .ctctree-select-tablegy {
    .el-input__prefix {
      left: 0px;
      width: 100%;
    }
  }
</style>
