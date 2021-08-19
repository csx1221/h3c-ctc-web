export default {
  state: {
    id: 0,
    name: '',
    realName: '',
    superAdmin: 0,
    superTenant: 0,
    tenantName: '',
    userRoleNames: '',
    roleType: 0, // 初始化用户角色默认超级管理员
    headUrl: '',
    sectionId: null, // 开发项目总监所属科室id——(需求开发模块)
    ascription: null, // 开发项目总监所属机构部门科室——(需求开发模块)
    subName: '' // 二级名称
  }
}
