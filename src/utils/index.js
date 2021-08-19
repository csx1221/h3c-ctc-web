import Cookies from 'js-cookie'
import store from '@/store'

/**
 * 权限
 * @param {*} key
 */
export function hasPermission (key) {
  return window.SITE_CONFIG['permissions'].indexOf(key) !== -1 || false
}

/**
 * 获取字典数据列表
 * @param dictType  字典类型
 */
export function getDictDataList (dictType) {
  const type = window.SITE_CONFIG['dictList'].find((element) => (element.dictType === dictType))
  if (type) {
    return type.dataList
  } else {
    return []
  }
}

/**
 * 获取字典名称
 * @param dictType  字典类型
 * @param dictValue  字典值
 */
export function getDictLabel (dictType, dictValue) {
  const type = window.SITE_CONFIG['dictList'].find((element) => (element.dictType === dictType))
  if (type) {
    const val = type.dataList.find((element) => (element.dictValue === dictValue + ''))
    if (val) {
      return val.dictLabel
    } else {
      return dictValue
    }
  } else {
    return dictValue
  }
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  store.commit('resetStore')
  Cookies.remove('token')
  Cookies.remove('language')
  Cookies.remove('id')
  Cookies.remove('userDuty')
  Cookies.remove('deptId')
  window.SITE_CONFIG['dynamicMenuRoutesHasAdded'] = false
}

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 获取svg图标(id)列表
 */
export function getIconList () {
  var res = []
  document.querySelectorAll('svg symbol').forEach(item => {
    res.push(item.id)
  })
  return res
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'pid') {
  var res = []
  var temp = {}
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  for (var k = 0; k < data.length; k++) {
    if (!temp[data[k][pid]] || data[k][id] === data[k][pid]) {
      res.push(data[k])
      continue
    }
    if (!temp[data[k][pid]]['children']) {
      temp[data[k][pid]]['children'] = []
    }
    temp[data[k][pid]]['children'].push(data[k])
    data[k]['_level'] = (temp[data[k][pid]]._level || 0) + 1
  }
  return res
}

/**
 * 表格默认选中
 * @param refName  表格ref名称
 * @param row  表格行数据
 */
export function toggleRowSelectionTable (refName, row) {
  if (row !== undefined) {
    this.$refs[refName].toggleRowSelection(row, true)
  }
}

/**
 * 解决不同标签页通信
 * @param key  唯一key标识符
 */
export function handTriggerReLoadEvent (key) {
  var handReLoadEvent = new Event('handReLoadEvent')
  handReLoadEvent.key = key
  window.dispatchEvent(handReLoadEvent)
}

/**
 * 复制内容
 * @param key  唯一key标识符
 */
export function copyContent (content) {
  try {
    // 存储传递过来的数据
    let orderNumber = content || ''
    // 创建一个input 元素
    // createElement() 方法通过指定名称创建一个元素
    let newInput = document.createElement('input')
    // 讲存储的数据赋值给input的value值
    newInput.value = orderNumber
    // appendChild() 方法向节点添加最后一个子节点。
    document.body.appendChild(newInput)
    // 选中input元素中的文本，select() 方法用于选择该元素中的文本。
    newInput.select()
    // 执行浏览器复制命令, execCommand方法是执行一个对当前文档，当前选择或者给出范围的命令
    document.execCommand('Copy')
    // 清空输入框
    if (!!window.ActiveXObject || 'ActiveXObject' in window || (/Trident\/7\./).test(navigator.userAgent)) {
      newInput.removeNode(true)
    } else {
      newInput.remove()
    }
    this.$message.success('复制成功')
  } catch (ex) {
    console.error('copyContent：', ex)
  }
}
