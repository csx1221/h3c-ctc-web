/**
 * 邮箱
 * @param {*} s
 */
export function isEmail (s) {
  return /^[A-Za-z0-9_.-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(s)
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile (s) {
  return /^1[0-9]{10}$/.test(s)
}

/**
 * 电话号码
 * @param {*} s
 */
export function isPhone (s) {
  return /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)
}

/**
 * URL地址
 * @param {*} s
 */
export function isURL (s) {
  return /^http[s]?:\/\/.*/.test(s)
}

/**
 * 正整数
 * @param {*} s
 */
export function isNumber (s) {
  return /^\+?[1-9][0-9]*$/.test(s)
}

/**
 * 身份证
 * @param {*} s
 */
export function isIDCard (s) {
  // 位数日期基本校验
  let isNumberTrue = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/.test(s)
  if (isNumberTrue) {
    if (s.length === 18) {
      return calculate(s)
    } else {
      return isNumberTrue
    }
  }
  return isNumberTrue
}
// 校验最后一位身份证
function calculate (s) {
  console.log(1)
  // 前17位每项的系数
  let coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  // 除11取余的结果对应的校验位（最后一位）的值
  let checkDigitMap = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
  var sum = 0
  for (var i = 0; i < 17; i++) {
    sum += s[i] * coefficient[i]
  }
  if (s.substr(-1) === checkDigitMap[sum % 11]) {
    return true
  }
  return false
}

/**
 * 字典表类型判断是否有删除、修改
 * @param {*} dictType
 */
export function dictTypeValidData (dictType) {
  let dictValidData = []
  dictValidData = dictValidData.concat(['organizeType', 'testType', 'caseDifficulty', 'noticeType', 'project.category', 'project.scope', 'project.projectStatus'])
  dictValidData = dictValidData.concat(['project.level', 'project.framework', 'ifCity', '', 'sourceOfDemand', 'stageType', 'stageTemplate', 'operateType'])
  dictValidData = dictValidData.concat(['taskStatus', 'moudleLevel', 'caseAttr', 'memberType', 'reviewStatus', 'priority', 'whether', 'case.operateType', 'ifShared'])
  dictValidData = dictValidData.concat(['dealStatus', 'workOrder.type', 'orderOperateType', 'orderManagementType', 'resultDetermination', 'networkWideTest', 'noticeForm'])
  dictValidData = dictValidData.concat(['noticeTime', 'gender', 'executionMethod', 'permissionLevel', 'defectStatus', 'defectEnv', 'defectLevel', 'defectSource'])
  dictValidData = dictValidData.concat(['defectDealStatus', 'defectDateDim', 'defectPeriodType', 'productEnv', 'productType', 'productStatus', 'applyStatus'])
  dictValidData = dictValidData.concat(['yesOrNo', 'scopeOfRequirements', 'roleType'])
  dictValidData = dictValidData.concat(['defectType', 'defectType-1', 'defectType-2', 'defectType-3', 'defectType-4', 'defectType-5', 'defectType-6', 'defectType-7', 'defectType-8', 'defectType-9', 'defectType-10'])
  let bool = !dictValidData.includes(dictType)
  bool = true
  return bool
}

/**
 * 字典表类型数据判断是否有删除、修改
 * @param {*} dictType
 */
export function dictValidData (dictType) {
  let dictValidData = []
  dictValidData = dictValidData.concat(['organizeType', 'testType', 'caseDifficulty', 'noticeType', 'project.category', 'project.scope', 'project.projectStatus'])
  dictValidData = dictValidData.concat(['project.level', 'project.framework', 'ifCity', 'caseType', 'sourceOfDemand', 'stageType', 'stageTemplate', 'operateType'])
  dictValidData = dictValidData.concat(['taskStatus', 'moudleLevel', 'caseAttr', 'memberType', 'reviewStatus', 'priority', 'whether', 'case.operateType', 'ifShared'])
  dictValidData = dictValidData.concat(['dealStatus', 'workOrder.type', 'orderOperateType', 'orderManagementType', 'resultDetermination', 'networkWideTest', 'noticeForm'])
  dictValidData = dictValidData.concat(['noticeTime', 'gender', 'executionMethod', 'permissionLevel', 'defectStatus', 'defectEnv', 'defectLevel', 'defectSource'])
  dictValidData = dictValidData.concat(['defectDealStatus', 'defectDateDim', 'defectPeriodType', 'productEnv', 'productType', 'productStatus', 'applyStatus'])
  dictValidData = dictValidData.concat(['yesOrNo', 'scopeOfRequirements', 'roleType'])
  dictValidData = dictValidData.concat(['defectType'])
  let bool = !dictValidData.includes(dictType)
  bool = true
  return bool
}

// 替换URL地址中IP信息
export function replaceUrlIp (url, targetVal) {
  console.info('replaceUrlIp=old：' + url)
  // 替换包含端口
  // eslint-disable-next-line no-useless-escape
  let pattIpPort = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}(\:(\d{1,5}|[1-5]\d{1,5}|6[0-5]\d{1,3}|65[0-5]\d{1,2}|655[0-2]\d|6553[0-5])){1}/g
  url = url.replace(pattIpPort, '#临时替换#')
  // 替换不包含端口
  let pattIp = /(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}/g
  url = url.replace(pattIp, '#临时替换#')
  let tmpReg = new RegExp('#临时替换#', 'gm')
  url = url.replace(tmpReg, targetVal)
  console.info('replaceUrlIp=new：' + url)
  return url
}
// 补齐Oss文件系统域名(type=1:图片预览;2:图片后台导出)
export function polishingOssHost (filePath, type) {
  let fileUrl = ''
  let host = location.host
  if (host === 'localhost:4000') {
    fileUrl = 'http://10.248.68.185:7081/file-service' + filePath
  } else {
    fileUrl = 'http://' + host + '/file-service' + filePath
  }
  return fileUrl
}
