<template>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input style="width: 80%" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
        <el-tree style='margin-top: 30px;' :data="dataTree" node-key="id" isLeaf=false lazy :load="loadNode" :expand-on-click-node="false" :props="defaultPropsuser" :filter-node-method="filterNode" ref="tree" >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button v-if="showGroup(data)" type="text" size="mini" @click="() => append(node, data)">添加</el-button>
        </span>
      </span>
        </el-tree>
      </el-col>
      <el-col :span="16">
        <el-input style="width: 40%" placeholder="输入关键字进行过滤" v-model="filterPopText"></el-input>
        <el-tree style='margin-top: 30px;' :data="poptree" :props="defaultpoptree" default-expand-all="!addgroup" :filter-node-method="filterNode" ref="popres" expand-on-click-node='false' >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.data.username }}</span>
            <span>{{ node.data.mobile }}</span>
            <span>{{ node.data.email }}</span>
            <span>
              <el-button type="text" size="mini" @click="() => deleteend(node, data)">移除</el-button>
        </span>
      </span>
        </el-tree>
      </el-col>
    </el-row>
</template>
<script>
export default {
  name: 'SelectControl',
  props: {
    addgroup: {
      type: Boolean
    },
    dataTree: {
      type: Array
    }
  },
  data () {
    return {
      // 选中人员列表
      poptree: [],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      defaultPropsuser: {
        children: 'children',
        label: 'username',
        isLeaf: 'leaf'
      },
      defaultpoptree: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      filterPopText: ''
    }
  },
  created () {
    // 进入组件时请求
    // this.requestTree()
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    append (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      if (!this.addgroup) {
        this.poptree.push(children[index])
        children[index].disabled = true
      } else {
        for (let i = 0; i < children[index].children.length; i++) {
          this.poptree.push(children[index].children[i])
        }
      }
    },
    deleteend (node, data) {
      // data.splice(index, 1)
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children[index].disabled = false
      children.splice(index, 1)
    },
    showGroup (data) {
      if (this.addgroup) {
        return true
      } else {
        return !data.children
      }
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        if (node.children === []) {
          this.$http.get(`sys/dept/users?deptId=${node.data.pid}`).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            node.data.children = res.data
            return resolve(node.data.children)
          }).catch(() => {})
        }
        return resolve(this.dataTree)
      }
      if (node.level === 1) {
        if (node.childNodes.length === 0) {
          this.$http.get(`sys/dept/users?deptId=${node.data.pid}`).then(({ data: res }) => {
            if (res.code !== 0) {
              return this.$message.error(res.msg)
            }
            node.data.children = res.data
            return resolve(node.data.children)
          }).catch(() => {})
        }
        return resolve(node.data.children)
      }
      if (node.level === 2) {
        return resolve(node.data.children)
      }
      if (node.level === 3) {
        this.$http.get(`sys/dept/users?deptId=${node.data.pid}`).then(({ data: res }) => {
          if (res.code !== 0) {
            return this.$message.error(res.msg)
          }
          node.data.children = res.data
          return resolve(node.data.children)
        }).catch(() => {})
      }
    }
    // 进入组件请求信息
    // requestTree () {
    //   this.$http.get(`ctc/auth/organization/tree?uuid=1c854dc0-b15f-4880-b843-f11cedf683fa`).then(({ data: res }) => {
    //     if (res.code !== 0) {
    //       return this.$message.error(res.msg)
    //     }
    //   }).catch(() => {})
    // }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    filterPopText (val) {
      this.$refs.popres.filter(val)
    }
  }
}
</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
