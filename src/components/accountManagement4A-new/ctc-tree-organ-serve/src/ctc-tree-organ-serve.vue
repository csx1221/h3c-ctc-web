<template>
  <div>
<!--    {{checkedKeys}}<br>-->
<!--    {{nameList}}-->
<!--    {{jg}}-->
    <el-input v-if="type==='radio'" v-model="showOrganizeName" :placeholder="placeholder" readonly>
      <el-button slot="append" icon="el-icon-search" @click="openDialog"></el-button>
    </el-input>
    <div v-else class="el-input el-input-group el-input-group--append" :class="{'is-disabled':disabled}">
      <div class="el-input__inner dib" v-if="nameList.length>0">
        <template v-for="(item,index) in nameList" v-if="!disabled">
          <el-tag style="white-space: normal;height: auto" v-if="item.disabled" class="eltag" :key="index" type="info">{{item.name}}</el-tag>
          <el-tag style="white-space: normal;height: auto" v-else class="eltag" :key="index" closable @close="handleClose(item)">{{item.name}}</el-tag>
        </template>
          <template v-for="(item,index) in nameList" v-if="disabled">
              <el-tag style="white-space: normal;height: auto" class="eltag" :key="index" type="info">{{item.name}}</el-tag>
          </template>
      </div>
      <el-input :disabled="disabled" v-else :placeholder="placeholder"></el-input>
      <div class="el-input-group__append" @click="openDialog">
        <el-button icon="el-icon-search"></el-button>
      </div>
    </div>
<!--    <el-input :value="value" style="display: none"></el-input>-->
    <el-dialog :visible.sync="visible" width="35%" :modal="false" title="服务机构/部门/科室" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row class="leftTree tree-container">
        <el-col :span="24">
          <el-form label-position="right" :inline="true" ref="dataForm" :model="dataForm" label-width="90px" @keyup.enter.native="getSeachTreeData()">
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
          <el-tree ref="leftTreeData" :data="data" :filter-node-method="filterNode" :props="defaultProps" default-expand-all :default-checked-keys="checkedKeys" :default-expanded-keys="defaultExpandedKeys" node-key="id" class="treeLight treeLine treeCss" @node-click="handleNodeClick" check-on-click-node :show-checkbox="type==='radio'?false:true" highlight-current :check-strictly="true" :indent="30" :expand-on-click-node="true" style="height:440px;overflow-y:auto;">
            <div class="custom-tree-node" :title="getTreeIcon('title',data,node)" slot-scope="{ node, data }" style="display:block;">
              <img :src="getTreeIcon('src',data,node)" style="width:16px;height:16px;margin-right:5px;" />
              <span>{{data.name}}</span>
            </div>
          </el-tree>
        </el-col>
      </el-row>
      <template slot="footer">
        <el-button type="default" @click="cancelHandle()" size="mini">取消</el-button>
        <el-button v-if="type==='checkbox'" type="primary" @click="commitHandle()" size="mini">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CtcTreeOrganServe',
  data () {
    return {
      dataForm: {},
      data: [],
      visible: false,
      showOrganizeName: '',
      nameList: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf',
        disabled: this.disabledFn
      },
      activeName: '0',
      checkedKeys: [], // 多选回显
      defaultExpandedKeys: [],
      jtzb: 0, // 集团总部
      sgs: 2, // 省公司
      zygs: 1, // 专业公司
      cs: 5, // 厂商
      orgId: '' // 所属机构id
    }
  },
  props: {
    value: [Number, String, Array],
    type: {
      type: String,
      default: 'radio'
    },
    id: String,
    pid: String,
    placeholder: String,
    jg: [Array, String, Number],
    acctType: [Number, String, Array],
    disabled: Boolean
  },
  watch: {
    'dataForm.name' (val) {
      this.$refs.leftTreeData.filter(val)
    },
    'acctType' (newVal, oldVal) {
      this.nameList = []
      this.checkedKeys = []
      this.$emit('input', [])
      this.data = []
      console.log('进入acctType')
    },
    'jg' (newVal, oldVal) {
      this.nameList = []
      this.checkedKeys = []
      this.$emit('input', [])
      this.data = []
      console.log(newVal)
      console.log('进入jg')
      if (Array.isArray(newVal) && newVal.length > 0) {
        this.orgId = newVal[newVal.length - 1]
      }
    }
  },
  mounted () {
    // if (this.id) {
    //   console.log('有id -- sjh')
    //   this.echoData()
    // }
  },
  methods: {
    init (nameList) {
      this.nameList = nameList
    },
    disabledFn (data, node) {
      // console.log(node)
      // acctType 0局方 1厂商
      //          jtzb: 0, // 集团总部
      //         sgs: 2, // 省公司
      //         zygs: 1, // 专业公司
      //         cs: 5 // 厂商
      // 2.服务机构/部门/科室输入限制：
      // 1）集团总部：必须选到最底层，即机构，部门，科室均为必选项
      // 2）省公司、专业公司：必须选到部门级别，即机构、部门为必选项，科室为非必选项
      let orgType
      if (node.level === 1) {
        orgType = node.data.type
      } else if (node.level === 2) {
        orgType = node.parent.data.type
      } else if (node.level === 3) {
        orgType = node.parent.parent.data.type
      }
      if (orgType === this.jtzb) {
        if (node.level < 3) {
          return true
        }
      } else if (orgType === this.sgs || orgType === this.zygs) {
        if (node.level < 2) {
          return true
        }
      }
      if (node.data.id === this.orgId) {
        return true
      }
    },
    filterNode (value, data, node) {
      // if (!value) return true
      // console.log(data)
      // return data.name.indexOf(value) !== -1
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
    handleClose (tag) {
      // let thisvm = this
      this.nameList.splice(this.nameList.indexOf(tag), 1)
      let nameList = this.nameList
      let ids = []
      let backIds = []
      for (let i = 0; i < nameList.length; i++) {
        ids.push(nameList[i].id)
        backIds.push(nameList[i].ids)
      }
      this.$emit('input', backIds)
      this.checkedKeys = ids
      // this.$refs['leftTreeData'].setCheckedKeys(ids)
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    openDialog () {
      if (!this.disabled) {
        if (this.acctType) {
          let jg = false
          if (Array.isArray(this.jg)) {
            jg = this.jg.length > 0
          } else {
            jg = !!this.jg
          }
          if (jg) {
            this.visible = true
            // this.getSeachTreeData()
            if (this.data.length === 0) {
              if (Array.isArray(this.jg) && this.jg.length > 0) {
                this.orgId = this.jg[this.jg.length - 1]
              }
              this.getSeachTreeData()
            }
            this.$nextTick(() => {
              let nameList = this.nameList
              let ids = []
              for (let i = 0; i < nameList.length; i++) {
                ids.push(nameList[i].id)
              }
              this.checkedKeys = ids
              this.$refs['leftTreeData'].setCheckedKeys(ids)
            })
          } else {
            this.$message.warning('请先选择所属机构！')
          }
        } else {
          this.$message.warning('请先选择账号类型！')
        }
      }
    },
    buildData (data) {
      // acctType 0局方 1厂商
      if (this.acctType === '0' && this.orgId) {
        this.checkedKeys = [this.orgId]
        // this.nameList = [
        //   {
        //     id: parameter.jg,
        //     name: 'node.name' + parameter.jg,
        //     disabled: true
        //   }
        // ]
      }
      if (this.nameList.length > 0) {
        this.$nextTick(() => {
          let nameList = this.nameList
          let ids = []
          for (let i = 0; i < nameList.length; i++) {
            ids.push(nameList[i].id)
          }
          this.checkedKeys = ids
          this.$refs['leftTreeData'].setCheckedKeys(ids)
        })
      }
      return data
    },
    getSeachTreeData () {
      // let res = [
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
      // ] // 返回的数据
      // this.data = this.buildData(res)

      let thisvm = this
      thisvm.$ctcLoading.open()
      let params = { sysAcctType: '0' }
      thisvm.$http.get('/account4a/sys/org/tree', { 'params': params }).then(({ data: res }) => {
        thisvm.$ctcLoading.close()
        if (res.code !== 0) {
          return thisvm.$message.error(res.msg)
        }
        this.data = this.buildData(res.data)
        // this.$nextTick(() => {
        //   let nameList = this.nameList
        //   let ids = []
        //   for (let i = 0; i < nameList.length; i++) {
        //     ids.push(nameList[i].id)
        //   }
        //   this.checkedKeys = ids
        //   this.$refs['leftTreeData'].setCheckedKeys(ids)
        // })
      }).catch(() => {
        this.data = []
        thisvm.$ctcLoading.close()
      })
    },
    buildTreeDate (data, id) {
      let result = []
      // let temp
      for (let i = 0; i < data.length; i++) {
        if (data[i].type && data[i].type === id) {
          data[i].disabled = true
          if (data[i].children.length > 0) {
            let childNode = data[i].children
            for (let j = 0; j < childNode.length; j++) {
              childNode[j].disabled = true
            }
          }
          result.push(data[i])
        } else {
          result.push(data[i])
        }
      }
      return result
    },
    getCheckedNodes () {
      // return [].concat(
      //   this.$refs['leftTreeData'].getHalfCheckedNodes(),
      //   this.$refs['leftTreeData'].getCheckedNodes()
      // )
      return [].concat(
        this.$refs['leftTreeData'].getHalfCheckedKeys(),
        this.$refs['leftTreeData'].getCheckedKeys()
      )
    },
    handleNodeClick (data) {
      // 设置点击，触发选中
    },
    getTreeIcon (type, data, node) {
      if (type === 'src') {
        return require('@/assets/img/sys_icon_' + node.level + '.png')
      } else {
        return data.name
      }
    },
    echoData () {
      this.showOrganizeName = ''
      this.$http.get('' + this.id).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          let nameList = []
          this.nameList = nameList
          this.checkedKeys = nameList
        }
      }).catch(() => { })
    },
    cancelHandle () {
      this.visible = false
    },
    getNodes (selectNodes) {
      let nodes = []
      for (let i = 0; i < selectNodes.length; i++) {
        nodes.push(this.$refs['leftTreeData'].getNode(selectNodes[i]))
      }
      return nodes
    },
    commitHandle () {
      if (this.type !== 'radio') {
        // let selectNodes = this.filterArr(this.getCheckedNodes(), 'id')
        let selectNodes = [...new Set(this.getCheckedNodes())]
        console.log(selectNodes)
        console.log(this.getNodes(selectNodes))
        // console.log(this.$refs['leftTreeData'].getHalfCheckedNodes())
        // console.log(this.$refs['leftTreeData'].getCheckedNodes())
        console.log(this.$refs['leftTreeData'].getHalfCheckedKeys())
        console.log(this.$refs['leftTreeData'].getCheckedKeys())
        let nodes
        if (selectNodes.length === 0) {
          this.$message.warning('请选择' + this.placeholder)
          return
        } else {
          nodes = this.getNodes(selectNodes)
        }
        let nameList = []
        let id = []
        let backIds = []

        for (let i = 0; i < nodes.length; i++) {
          // acctType 0局方 1厂商
          if (this.acctType === '0' && this.orgId && nodes[i].data.id === this.orgId) {
            nameList.push({ id: nodes[i].data.id, ids: this.getId(nodes[i]), name: this.getName(nodes[i]), disabled: true })
          } else {
            nameList.push({ id: nodes[i].data.id, ids: this.getId(nodes[i]), name: this.getName(nodes[i]) })
          }
          id.push(nodes[i].data.id)
          backIds.push(this.getId(nodes[i]))
        }
        console.log(backIds)
        this.$emit('input', backIds)
        this.nameList = nameList
        this.checkedKeys = id
        this.visible = false
      }
    },
    getName (node) {
      let name
      if (node.level === 1) {
        name = node.data.name
      } else if (node.level === 2) {
        name = node.parent.data.name + ' / ' + node.data.name
      } else if (node.level === 3) {
        name = node.parent.parent.data.name + ' / ' + node.parent.data.name + ' / ' + node.data.name
      }
      return name
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
    // 根据对象中的属性进行去重
    filterArr (arr, val) {
      const res = new Map()
      return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
    }
  }
}
</script>
<style lang="scss">
  .leftTree {
    background: #fff;
    .treeCss {
      margin: 10px 0 0 -16px;
    }
    .treeLight {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
      height: 768px;
      overflow-y: auto;
      .el-tree-node:focus > .el-tree-node__content {
        background-color: #f5f7fa !important;
      }
      .custom-tree-node {
        display: flex;
        width: 100%;
        font-family: PingFang-SC-Medium;
        font-size: 14px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        justify-content: space-between;
        align-items: center;
        .rightTreeColorCon {
          display: flex;
          margin-right: 15px;
          justify-content: space-between;
          align-items: center;
          :nth-child(1) {
            margin-right: 20px;
          }
        }
        .rightTreeColor {
          border-radius: 10px;
          width: 8px;
          height: 8px;
        }
      }
      .el-tree-node__content {
        height: 32px;
        line-height: 32px;
        .el-checkbox__inner {
          background: rgba(255, 255, 255, 0.45);
        }
      }

      .el-tree-node__content:hover {
        background-color: #f5f7fa !important;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner,
      .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        border-color: #147bd1;
        background-color: #147bd1;
      }
      .el-tree-node.is-current > .el-tree-node__content {
        color: rgba(0, 0, 0, 0.65);
        background-color: #f5f7fa !important;
      }

      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: rgba(0, 0, 0, 0.65);
        background-color: #f5f7fa !important;
      }
      /deep/ .el-tree-node::before {
        position: absolute;
        top: -11px;
        right: auto;
        bottom: 0;
        left: -4px;
        border-width: 1px;
        border-left: 1px solid rgba(0, 0, 0, 0.19);
        width: 1px;
        height: 100%;
        content: '';
      }

      /deep/ .el-tree-node::after {
        position: absolute;
        top: 15px;
        right: auto;
        left: -4px;
        border-width: 1px;
        border-top: 1px solid rgba(0, 0, 0, 0.19);
        width: 26px;
        height: 20px;
        content: '';
      }
    }
    .el-tree .el-tree-node__expand-icon.expanded {
      transform: rotate(0deg);
    }
    .el-tree .el-icon-caret-right::before {
      font-size: 12px;
      content: '\E723' !important;
    }
    .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right::before {
      font-size: 12px;
      content: '\E722' !important;
    }
    .el-checkbox__input.is-disabled .el-checkbox__inner {
      background-color: #edf2fc;
      border-color: #dcdfe6;
      cursor: not-allowed;
    }
  }

  /* 树形结构节点添加连线 */
  .treeLine /deep/ .el-tree-node {
    position: relative;
    padding-left: 16px;
  }

  .treeLine /deep/ .el-tree-node__children {
    padding-left: 16px;
  }

  .treeLine /deep/ .el-tree-node :last-child::before {
    height: 26px;
  }

  .treeLine /deep/ .el-tree > .el-tree-node::before {
    border-left: none;
  }

  .tree-container /deep/ .el-tree > .el-tree-node::after {
    border-top: none;
  }

  .treeLine /deep/ .el-tree-node[tabindex^='0']::before {
    border-left: none !important;
  }

  .treeLine /deep/ .el-tree-node__expand-icon.is-leaf {
    display: none;
  }

  .treeLine .el-tree-node > .el-tree-node__children {
    overflow: inherit;
  }

  .eltag {
    margin-right: 5px;
  }
</style>
