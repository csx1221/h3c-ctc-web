<template>
    <el-row>
      <el-col :span="12">
        <el-input style="width: 80%" placeholder="111" v-model="filterText"></el-input>
        <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false" :props="defaultProps" :filter-node-method="filterNode" ref="tree" >
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <!-- 加号位置 data为整个tree模型 -->
              <el-button v-if="data.children" class="el-icon-plus" type="text" size="mini" @click="() => append(node, data)"></el-button>
        </span>
      </span>
        </el-tree>
      </el-col>
      <el-col :span="12">
        <el-input style="width: 80%" placeholder="输入关键字进行过滤" v-model="filterPopText"></el-input>
        <el-tree :data="poptree" :props="defaultpoptree" default-expand-all :filter-node-method="filterNode" ref="popres" expand-on-click-node='false' ></el-tree>
      </el-col>
    </el-row>
</template>
<script>
export default {
  name: 'RadioControl',
  data () {
    return {
      // 选中人员列表
      poptree: [],
      data: [{
        id: 1,
        // label: '中国移动',
        label: 'H3C',
        children: [{
          id: 2,
          label: '测试部门',
          children: [{
            id: 3,
            label: '王燕',
            value: '王燕',
            'address': '中移管理',
            'role': '项目经理',
            'phone': '13232323232',
            'email': '19239990@163.com'
          },
          {
            id: 4,
            label: '张雪城',
            value: '张雪城',
            'address': '中移管理',
            'role': '项目经理',
            'phone': '13232323232',
            'email': '19239990@163.com'
          }]
        },
        {
          id: 5,
          label: '运营部门',
          children: [{
            id: 6,
            label: '候书亮',
            value: '候书亮',
            'address': '中移管理',
            'role': '项目经理',
            'phone': '13232323232',
            'email': '19239990@163.com'
          },
          {
            id: 7,
            label: '马先前',
            value: '马先前',
            'address': '中移管理',
            'role': '项目经理',
            'phone': '13232323232',
            'email': '19239990@163.com'
          }]
        }]
      }],
      defaultpoptree: {
        children: 'children',
        label: 'label'
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '',
      filterPopText: ''
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    append (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      this.poptree.push(children[index])
      children.splice(index, 1)
    }
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
