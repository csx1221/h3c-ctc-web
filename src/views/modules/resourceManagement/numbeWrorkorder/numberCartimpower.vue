<template>
  <el-card shadow="never" class="aui-card--fill defect-data-detail accStyle">
    <el-divider content-position="left">
      <span style="color: #26c6da; font-size: 15px">申请单信息</span></el-divider>
    <el-form ref="dataForm"  :rules="dataRule"  :model="dataForm"  label-width="100px"  class="biaodan">
      <el-row>
        <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="8">
          <el-form-item label="申请标题:" prop="title">
            <el-input v-model="dataForm.title"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="from">
        <el-form-item label="授权类型:" prop="authorizeType">
          <el-select  v-model="dataForm.authorizeType"  defaultValue="lucy"  clearable  filterable  placeholder="系统类别"  value-key="moduleId"  @change="chooseModule">
            <el-option key="0" label="人员" value="0">人员</el-option>
            <el-option key="1" label="部门" value="1">部门</el-option>
            <el-option key="2" label="角色" value="2">角色</el-option>
            <el-option key="3" label="项目" value="3">项目</el-option>
          </el-select>
        </el-form-item>
        <el-button  type="primary"  size="small"  @click="createConfig('新增授权项', '11')"  style="marginLeft: 20px; marginBottom: 22px"  >选择内容项</el-button>
      </div>
      <div class="from">
        <div style="width: 100px; textAlign: right; paddingRight: 12px">
          授权项:
        </div>
        <!-- 人员列表 -->
        <el-table  v-if="dataForm.authorizeType == 0"  v-loading="dataListLoading"  :data="authorizeList"  border  style="width: 100%">
          <el-table-column  type="index"  label="序号"  width="50"  align="center"></el-table-column>
          <el-table-column  prop="realName"  label="姓名"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="email"  label="邮箱"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="organizeName"  label="所属机构 / 部门"  header-align="center"  align="center"  show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.deptName">  {{ scope.row.organizeName }} / {{ scope.row.deptName }}</span>
              <span v-else> {{ scope.row.organizeName }}</span>
            </template>
          </el-table-column>
          <el-table-column  fixed="right"  label="操作"  header-align="center"  align="center">
            <template slot-scope="scope">
              <el-button @click="deleteOperate(1, scope.$index)"  type="text"  size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 部门列表 -->
        <el-table  v-else-if="dataForm.authorizeType == 1"  v-loading="dataListLoading"  :data="authorizeList"  border  style="width: 100%">
          <el-table-column  type="index"  label="序号" width="50"  align="center"></el-table-column>
          <el-table-column  prop="name"  label="部门名称"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="organizeName"  label="所属机构"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="userCount"  label="用户数"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <!-- <el-table-column  prop="createDate"  label="创建时间"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column> -->
          <el-table-column  fixed="right"  label="操作"  header-align="center"  align="center">
            <template slot-scope="scope">
              <el-button  @click="deleteOperate(1, scope.$index)"  type="text"  size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 角色列表 -->
        <el-table  v-else-if="dataForm.authorizeType == 2"  v-loading="dataListLoading"  :data="authorizeList"  border  style="width: 100%">
          <el-table-column  type="index"  label="序号"  width="50"  align="center"></el-table-column>
          <el-table-column  prop="name" label="角色名称"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="remark"  label="备注"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <!-- <el-table-column  prop="createDate"  label="创建时间"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column> -->
          <el-table-column  fixed="right"  label="操作"  header-align="center"  align="center">
            <template slot-scope="scope">
              <el-button  @click="deleteOperate(1, scope.$index)"  type="text"  size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 项目列表 -->
        <el-table :data="authorizeList" border style="width: 100%" v-else-if="dataForm.authorizeType == 3">
          <el-table-column  type="selection"  header-align="center"  align="center"  width="50"></el-table-column>
          <template v-for="(item, index) in projectTableTitleData">
            <el-table-column  v-if="item.code != 'operate'"  :key="index"  :label="item.name"  show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-html="getTableColumnData(scope.row, item)"></span>
              </template>
            </el-table-column>
          </template>
          <el-table-column  fixed="right"  label="操作"  header-align="center"  align="center">
            <template slot-scope="scope">
              <el-button  @click="deleteOperate(1, scope.$index)"  type="text"  size="small"  >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="from">
        <div style="width: 100px; textAlign: right; paddingRight: 12px">  授权列表:</div>
        <el-table  v-loading="dataListLoading"  :data="dataForm.cardNumberList" @selection-change="accreditChange" border  style="width: 100%">
          <el-table-column type="selection" width="45" ></el-table-column>
          <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
          <el-table-column  prop="number"  label="卡号"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="provinceDefine"  label="省份"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="operator"  label="运行商"  header-align="center"  align="center"  show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-html="$getDictLabel('operators', scope.row.operator)"></span>
            </template>
          </el-table-column>
          <el-table-column  prop="platformDefine"  label="所属平台"  header-align="center"  align="center"  show-overflow-tooltip>
          </el-table-column>
          <el-table-column  prop="brandDefine"  label="品牌"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  prop="handler"  label="办卡人"  header-align="center"  align="center"  show-overflow-tooltip></el-table-column>
          <el-table-column  label="特定字段授权"  header-align="center"  align="center" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>{{scope.row.cardAuth}}</div>
            </template>
          </el-table-column>
          <el-table-column  fixed="right"  label="操作"  header-align="center"  align="center">
            <template slot-scope="scope">
              <el-button  @click="del(scope.$index)"  type="text"  size="small"  >删除</el-button>
              <el-button   @click="clickss(scope.$index)" type="text"  size="small">特定授权</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form style="textAlign: left; paddingLeft: 100px" ref="form" :model="form" label-width="80px">
          <el-button type="primary" size="small"  @click="addclick = true">增加</el-button>
          <el-button type="primary" size="small" @click="clickAll">批量特定授权</el-button>
        </el-form>
      <div class="from">
        <el-form-item prop="authorizeDate" label="授权日期:">
          <el-radio-group v-model="dataForm.authorizeDate">
            <el-radio label="1">短期</el-radio>
            <el-radio label="2">长期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item  v-if="dataForm.authorizeDate === '1'"  prop="date"  label="">
          <el-date-picker  v-model="dataForm.date"  value-format="yyyy-MM-dd"  type="daterange" :picker-options="pickerOptions"  range-separator="至"  start-placeholder="开始日期"    end-placeholder="结束日期"  ></el-date-picker>
        </el-form-item>
      </div>
      <el-form-item label="申请理由:" prop="desc">
        <el-input type="textarea" v-model="dataForm.desc"></el-input>
      </el-form-item>
      <!-- <el-form ref="form" :model="form" class="menu"></el-form> -->
      <add-or-updata  v-if="addOrUpdataVisible"  ref="addOrUpdata"  @refreshAuth="getAuthData"  @refresh="getPhoneData"  @init="addOrUpdataVisible = false"></add-or-updata>
      <el-form-item  prop="desc" align="center" style="margintop: 20px">
          <el-button type="primary"  size="middle" @click="handleSubmit(dataForm)">提交申请</el-button>
          <el-button  type="primary"  size="middle"  @click="handleCancel()">取消</el-button>
      </el-form-item>
    </el-form>
  <!-- 增加按钮显示 -->
  <el-dialog  title="信息"  :visible.sync="addclick"  width="80%">
    <el-col :span="24" style="margin-top:24px;">
          <el-form ref="dataForm" :model="dataForm" :inline="false" label-position="right" label-width="120px">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="手机号码" prop=" number ">
                                <el-input v-model="dataForm.number" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="省份：" prop=" provinceDefine ">
                                <el-input v-model="dataForm.provinceDefine" placeholder="请输入" clearable></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="所属平台:" prop=" platform ">
                              <el-select  v-model="dataForm.platform"  defaultValue="lucy"  clearable  filterable  placeholder="所属平台"  value-key="moduleId">
                                <el-option key="0" label="-" value="0">-</el-option>
                                <el-option key="1" label="智能拨测平台" value="1">智能拨测平台</el-option>
                                <el-option key="2" label="用户模拟平台" value="2">用户模拟平台</el-option>
                                <el-option key="3" label="APP测试平台" value="3">APP测试平台</el-option>
                                <el-option key="4" label="资费测试" value="4">资费测试</el-option>
                              </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6" align="right">
                            <el-button type="primary" size="small" @click="search()">查询</el-button>
                            <el-button size="small" @click="resetForm()">重置</el-button>
                        </el-col>
                    </el-row>
                </el-form>
    </el-col>
    <el-card shadow="never" class="aui-card--fill">
        <el-row style="margin-bottom:20px;">
            <el-col :span="12" class="split-line" style="text-align:left;">
                卡号列表
            </el-col>
            <!-- <el-col :span="12" align="right">
                <el-button :type="multipleSelection.length>0?'primary':'warning'" size="small" @click="createConfig('批量删除','4')">批量删除</el-button>
            </el-col> -->
        </el-row>
        <!-- :data="cardNumberList" -->
        <el-table stripe v-loading="dataListLoading"
        :data="cardNumberList"
        border
        ref="numberTable"
        @selection-change="clickchange"
        style="width: 100%;">
            <el-table-column type="selection" width="45"></el-table-column>
            <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
            <template v-for="(item, index) in titlecardnumberList">
                <template v-if="item.code==='number'">
                    <el-table-column :key="index" :label="item.name" align="center" width="110">
                        <template slot-scope="scope">
                            <span  size="small">{{getTableColumnData(scope.row,item)}}</span>
                        </template>
                    </el-table-column>
                </template>
              <template v-else-if="item.code==='serviceNo'">
                <el-table-column :key="index" :label="item.name" align="center">
                  <template slot-scope="scope">
                    <span v-html="scope.row.serviceNo"></span>
                  </template>
                </el-table-column>
              </template>
                <template v-else>
                    <el-table-column :key="index" :label="item.name" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-html="getTableColumnData(scope.row,item)"></span>
                        </template>
                    </el-table-column>
                </template>
            </template>
            <!-- <el-table-column fixed="right" label="操作" header-align="center" align="center" width="50">
                <template slot-scope="scope">
                    <el-button @click="createConfig('删除','3',scope.row)" type="text"  size="small">删除</el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <el-pagination :page-sizes="[10, 20, 50]" layout="total, sizes,prev, pager, next, jumper" :page-size="limit" :total="total" :current-page="page" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
        <!-- <add-or-updata v-if="addOrUpdataVisible" ref="addOrUpdata" @refresh="getProjectInfo(1)" @init="addOrUpdataVisible = false"></add-or-updata> -->
    </el-card>
    <span slot="footer" class="dialog-footer">
      <el-button @click="addclick=false">取 消</el-button>
      <!-- <el-button type="primary" @click="addclick = false ">确 定</el-button> -->
      <el-button type="primary" @click="listAdd">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 特定授权 -->
  <el-dialog  title="字段权限设置"  :visible.sync="handeclick"  width="30%">
    <fieldset>
        <legend>授权字段</legend>
        <el-checkbox-group v-model="checkedaccredit" @change="handleCheckedaccreditChange" class="ziduan">
          <el-checkbox v-for="impower in accredit" :label="impower" :key="impower" style="display:block;">{{impower}}</el-checkbox>
        </el-checkbox-group>
    </fieldset>
    <p style="color:#4190f7">注：卡号授权除基本权限外，上面的字段需单独授权</p>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <span slot="footer" class="dialog-footer">
      <el-button @click="clickCheckClose">取 消</el-button>
      <el-button type="primary" @click="clickaa">确 定</el-button>
    </span>
  </el-dialog>
  <!-- 批量特定授权 -->
  <el-dialog  title="字段权限设置"  :visible.sync="handesclick"  width="30%">
    <fieldset>
        <legend>授权字段</legend>
        <el-checkbox-group v-model="allCheckedaccredit" @change="handleCheckedaccreditChange" class="piliangziduan">
          <el-checkbox v-for="impower in accredit" :label="impower" :key="impower" style="display:block;">{{impower}}</el-checkbox>
        </el-checkbox-group>
    </fieldset>
    <p style="color:#4190f7">注：卡号授权除基本权限外，上面的字段需单独授权</p>
    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
    <span slot="footer" class="dialog-footer">
      <el-button @click="allClickCheckClose">取 消</el-button>
      <el-button type="primary" @click="clickAllAdd">确 定</el-button>
    </span>
  </el-dialog>
  </el-card>
</template>
<script>
/* eslint-disable */
import Cookies from "js-cookie";
import mixinViewModule from "@/mixins/view-module";
import addOrUpdata from "@/views/modules/resourceManagement/numbeWrorkorder/addOrUpdata";
import CtcProjectOrganizeTable from "@/components/project/ctc-project-organize-table";
import ctcPersonLiable from "@/components/programmecntre/ctc-person-liable";
import ctcUtils from "@/utils/ctc-utils.js";
import { addDynamicRoute } from "@/router";
import { number } from 'echarts';
const accredit = ['服务密码', '月度资费', '余额', '积分']
export default {
  mixins: [mixinViewModule],
  name: "numberManagement",
  components: {
    addOrUpdata,
    CtcProjectOrganizeTable,
    ctcPersonLiable,
  },
  data() {
    return {
      index:0,
      checkAll: false,
      isIndeterminate: true,
      accredit: accredit,
      checkedaccredit: [],
      allCheckedaccredit: [],
      handeclick: false,
      handesclick: false,
      titlecardnumberList: [
        {
          name: '卡号',
          code: 'number'
        },
        {
          name: '省份',
          code: 'provinceDefine'
        },
        {
          name: '运行商',
          code: 'operatorDefine'
        },
        {
          name: '所属平台',
          code: 'platformDefine'
        },
        {
          name: '品牌',
          code: 'brand'
        },
        {
          name: '办卡人',
          code: 'handler'
        }
      ],
      multipleSelection: [],
      cardNumberList: [],
      list: [],
      addclick: false,
      isOpen: false,
      addOrUpdataVisible: false,
      authorizeList: [],
      projectTableTitleData: [
        { code: "name", name: "项目名称" },
        { code: "projectStatus", name: "状态" },
        { code: "level", name: "级别" },
        { code: "scope", name: "范围" },
        { code: "managerName", name: "项目经理" },
        { code: "organizeIdName", name: "归属机构" },
        { code: "createDate", name: "创建时间" },
      ],
      dataForm: {
        title: "", // 标题
        authorizeType: "", // 授权类型  	0-人员（缺省）；1-部门；2-角色；3-项目
        platformType: "",//所属平台 0- ；1-智能拨测；2-APP测试平台； 3-广东测试平台
        authorizeKeyList: [], // 授权项
        cardNumberList: [], // 授权卡号列表
        authorizeDate: "1", // 授权日期   false: 短期   true:  长期
        date: "", // 短期日期区间
        reason: "", // 申请理由
        name: '',
        province: '',
        operator: '', // 运营商
        brand: '', // 品牌
        imsi: '', // imsi
        handler: '', // 办卡人
        creatorName: '', // 创建人
        createDate: [], // 创建时间区间
        lineState: '', // 在线状态
        title: '',
        provinceDefine: '',
        impowerDefine: '',
        number: '',
        platform: '',
      },
      form: {
        name: '',
        date1: '',
        date2: '',
        type: [],
        desc: '',
        endDta: '',
        createData: '',
        number: '',
        provinceDefine: '',
        platform: '',
      },
      dataRule: {
        title: [{ required: true, message: "请输入", trigger: "blur" }],
        authorizeType: [
          { required: true, message: "请选择", trigger: "change" },
        ],
        defaultValue: [
          { required: true, message: "请选择", trigger: "change" },
        ],
      },
      cardnumberList2: [],
      dataList: [],
      accreditChangeList:[],//批量授权列表 
      pickerOptions:{//当日之前日期不可选择
            disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7;
            },
        },
      dataList: [],
      dataTotal: 0,
    };
  },
  computed: {},
  mounted () {
    if (this.$route.params.number) {
      this.dataForm.number = this.$route.params.number
    }
    this.getProjectInfo(1)
    console.log(this.$route.params)
    if (this.$route.params.code) {
      this.getDetailData()
    }
  },
  methods: {
    translateData(data) {
      let thisvm = this;
      Object.keys(data).forEach(function (key) {
        Object.keys(thisvm.dataForm).forEach(function (key1) {
          if (key === key1) {
            if (data[key] === null) {
              thisvm.dataForm[key1] = "";
            } else {
              thisvm.dataForm[key1] = data[key];
            }
          }
        });
      });
    },
    getDetailData() {
      let code = this.$route.params.code
      this.$http
        .get(`/ctc/resource/activiti/apply/applyDetail/${code}`)
        .then(({ data: res }) => {
          this.dataListLoading = false;
          if (res.code !== 0) {
            this.$message.error(res.msg);
          } else {
            this.authorizeList = res.data.authorizeKeyList
            this.translateData(res.data);
          }
        })
        .catch(() => {
          this.dataListLoading = false;
        });
    },
    handleCheckAllChange (val) {
      this.checkedaccredit = val ? accredit : []
      this.isIndeterminate = false
    },
    handleCheckedaccreditChange (value) {
      this.checkedaccredit = value
      let checkedCount = value.length
      this.checkAll = checkedCount === this.accredit.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.accredit.length
    },
    clickaa () {
      // 特定授权
      let obj = ''
      this.checkedaccredit.forEach(item =>{
        obj = obj + item+" "
      })
      let value = this.dataForm.cardNumberList[this.index]
      value.cardAuth = obj
      console.log('------>>>', value,);
      this.$set(this.dataForm.cardNumberList, this.index, value)
      // this.cardnumberList2[this.index].cardAuth = obj
      // 1,1,1
      this.checkedaccredit = []
      this.handeclick = false
    },
    clickss (index) {
      this.handeclick = true
      this.index = index
    },
    clickAll() {
      console.log(this.accreditChangeList);
      if (this.accreditChangeList.length !==0){
        this.handesclick = true
      } else {
        this.$message.warning("请选择需要授权项！！！")
      }
    },
    accreditChange(val){    //获取批量授权列表
        // console.log(val);
        this.accreditChangeList = val
        console.log('已勾选列表',this.accreditChangeList);
    },
    clickAllAdd(){  //批量授权
      let obj = ''
      this.allCheckedaccredit.forEach(item =>{
          obj = obj + item+" "
      })
       let value = this.accreditChangeList
       console.log('value',value)
       value.forEach(item=>{
         item.cardAuth=obj
         console.log('item.cardAuth',item.cardAuth);
       })
       this.dataForm.cardNumberList=this.dataForm.cardNumberList.concat(this.dataForm.cardNumberList.splice(value))
      this.allCheckedaccredit = []
      this.checkedaccredit = []
      this.handesclick = false
    },
    clickCheckClose () {
      //取消授权
      this.checkedaccredit = []
      this.handeclick = false
    },
    allClickCheckClose () {
      //取消批量授权
      this.allCheckedaccredit = []
      this.handesclick = false
    },
    del (index) {
        this.$confirm('是否删除该授权?', '提示', {
          closeOnClickModal: false,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          console.log('11111111111', this.dataForm.cardNumberList)
          this.dataForm.cardNumberList.splice(index, 1)
          this.list.splice(index,1)
          this.$message.success("删除成功")
        }).catch(() => {        
        });
        
    },
    listAdd () {
      this.addclick = false
      let _ = require('lodash')
      this.dataForm.cardNumberList=_.uniqBy(this.list, 'cardNumberId')
      // this.listval=[]
      // this.listval = this._uniqueHandle(this.List)
      this.$refs.numberTable.clearSelection();
      console.log('this.list',this.List);
      console.log('this.dataForm.cardNumberList',this.dataForm.cardNumberList);
    },
      clickchange (val) {
      this.list.push(...val)
      console.log(val,this.list);
      
    },
     getProjectInfo (val) {
      if (val !== undefined) {
        this.page = 1
      }
      this.cardnumberListLoading = true
      let params1 = Object.assign({}, this.dataForm)
      // 特殊处理创建日期、修改日期
      if (params1.createDate.length > 0) {
        params1.createStartDate = params1.createDate[0]
        params1.createFinishDate = params1.createDate[1]
        delete params1['createDate']
      }else if(params1.cardNumberList){
        delete params1.cardNumberList
      }
      let params = { page: this.page, limit: this.limit, total: this.dataTotal, ...params1 }
      console.log(params)
      this.$http.get('/ctc/resource/activiti/cardnumber/page', { 'params': params }).then(({ data: res }) => {
        this.cardnumberListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.cardNumberList = []
          // this.total = 0
          this.total = res.data.totalCount
          this.limit = res.data.pageSize
        } else {
          this.cardNumberList = res.data.list
          this.cardnumberList2 = res.data.list
          this.limit = res.data.pageSize
          this.total = res.data.totalCount
        }
      }).catch(() => {
        this.cardnumberListLoading = false
        this.cardNumberList = []
        // this.total = 0
        // this.total = res.data.totalCount
      })
    },
     handleCurrentChange (val) {
      // this.page = val
      this.dataForm.page = val
      // this.dataForm.limit
      this.getProjectInfo()
    },
      handleSizeChange (val) {
      // this.page = 1
      // this.limit = val
      this.dataForm.limit = val
      console.log(this.dataForm.limit);
      this.getProjectInfo()
    },
      search () {
      let thisvm = this
      let params = {
        number: this.dataForm.number,
        provinceDefine: this.dataForm.provinceDefine,
        platform: this.dataForm.platform,
        page: this.page, 
        limit: this.limit,
        total: this.total
      }
      console.log('000',params);
      thisvm.$http.get('/ctc/resource/activiti/cardnumber/page', { 'params': params }).then(({ data: res }) => {
          console.log(this.cardNumberList)
        if (res.code === 0) {
          this.limit = res.data.pageSize
          this.cardNumberList=res.data.list
          this.total=res.data.totalCount
        } else {
          this.limit = res.data.pageSize
          this.cardNumberList=res.data.list
          this.total=res.data.totalCount
        }
        console.log('....',res.data);
      }).catch(() => {
        // console.log('失败')
      })
    },
    resetForm(){
      this.dataForm.platform = ''
      this.dataForm.number = ''
      this.dataForm.provinceDefine = ''
      let params = { page: this.page, limit: this.limit,}
      console.log(params)
      this.$http.get('/ctc/resource/activiti/cardnumber/page', { 'params': params }).then(({ data: res }) => {
        this.cardnumberListLoading = false
        if (res.code !== 0) {
          this.$message.error(res.msg)
          this.cardNumberList = []
          this.total = 0
        } else {
          this.cardNumberList = res.data.list
          this.cardnumberList2 = res.data.list
          this.total = res.data.totalCount
        }
      }).catch(() => {
        this.cardnumberListLoading = false
        this.cardNumberList = []
        this.total = 0
      })
    },
    handleSelectionChange (val) {
      console.log('**********', val)
      this.multipleSelection = val
    },
    // 去重方法
    // _uniqueHandle (arr) {
    //   const res = new Map()
    //   console.log(res);
    //   return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
    // },
    getAuthData(data) {
      // 新增授权项 确定
      console.log(...data);
      if (Array.isArray(data)) {
        // this.authorizeList.push(...data);
        console.log(this.authorizeList)
        // this.authorizeList = this._uniqueHandle(this.authorizeList)
        this.authorizeList = data
      }
      console.log(this.authorizeList);
    },
    getPhoneData(data) {
      console.log(data);
      if (Array.isArray(data)) {
        this.dataForm.cardNumberList =
          this.dataForm.cardNumberList.concat(data);
      }
    },
    // 验证是否要关联字典表
    getTableColumnData(row, item) {
      let columnValue = "";
      let bool = "projectStatus,level,category,scope".includes(item.code);
      if (bool) {
        columnValue = this.$getDictLabel(
          "project." + item.code,
          row[item.code]
        );
        columnValue = columnValue === -1 ? "" : columnValue;
      } else {
        columnValue = row[item.code];
      }
      // 特殊处理计划周期
      if (item.code === "planPeriod") {
        columnValue = row.planStartTime + "~" + row.planEndTime;
      }
      // 判断是否追加空格,保持项目名称对齐
      if (!row.hasChildren && item.code === "name") {
        columnValue = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + columnValue;
      }
      // console.log(columnValue);
      return columnValue;
    },
    chooseModule(val) {
      this.authorizeList = [];
    },
    createConfig(title, type) {
      // 11、新增授权项
      console.log(title,type);
      if (type === "11") {
        let authType = this.dataForm.authorizeType;
        console.log(this.dataForm.authorizeType);
        if (authType ==="") {
          this.$message.warning("请选择授权类型");
        }
        else {
          this.addOrUpdataVisible = true;
          this.$nextTick(() => {
            this.$refs.addOrUpdata.init(
              title,
              "11" + this.dataForm.authorizeType
            );
            this.$refs.addOrUpdata.selectData = this.authorizeList
            console.log(this.$refs.addOrUpdata.selectData );
          });
        }
      } 
    },
    customAddDynamicRoute(path, title, params) {
      var routeParams = {
        routeName: `${this.$route.name}__` + Math.random(),
        menuId: `${this.$route.meta.menuId}`,
        title: title,
        path: path,
        params: params || {},
      };
      addDynamicRoute(routeParams, this.$router);
    },
    deleteOperate(type, index) {
        this.$confirm('是否删除该授权项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          if (type == 1) {
            this.authorizeList.splice(index, 1);
          } else if (type == 2) {
            this.dataForm.cardNumberList.splice(index, 1);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    // 关闭当前窗口
    closeCurrentTab() {
      var tabName = this.$store.state.contentTabsActiveName;
      this.$store.state.contentTabs = this.$store.state.contentTabs.filter(
        (item) => item.name !== tabName
      );
      if (this.$store.state.contentTabs.length <= 0) {
        this.$store.state.sidebarMenuActiveName =
          this.$store.state.contentTabsActiveName = "home";
        return false;
      }
      if (tabName === this.$store.state.contentTabsActiveName) {
        this.$router.push({
          name: this.$store.state.contentTabs[
            this.$store.state.contentTabs.length - 1
          ].name,
        });
      }
    },
    handleCancel() {
      this.closeCurrentTab();
    },
    handleSubmit() {
      let thisvm = this;
      let code = this.$route.params.code
      let taskId = this.$route.params.taskId
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          if (this.dataForm.cardNumberList.length === 0) {
            thisvm.$message.warning("手机数据为空，请至少添加一条数据");
          } else if (this.authorizeList.length === 0) {
            thisvm.$message.warning("授权项数据为空，请至少添加一条数据");
          } else {
            let params = { ...this.dataForm, definitionId: 2, taskId: taskId };
            // 特殊处理创建日期、修改日期 1 false  短期 ；2 true 长期
            if (params.authorizeDate == 1) {
              params.authorizeDate = false
              if (params.date.length > 0) {
                params.startTime = params.date[0];
                params.endTime = params.date[1];
                delete params["date"];
              }
            } else if (params.authorizeDate == 2) {
              params.authorizeDate = true
            }

            for (var k = 0, length = this.authorizeList.length; k < length; k++) {
              if (params.authorizeType == 3) {
                params.authorizeKeyList.push(this.authorizeList[k].projectId)
              } else {
                params.authorizeKeyList.push(this.authorizeList[k].id)
              }
            }
            thisvm.$http["post"](
              code ? '/ctc/resource/activiti/apply/resubmitCardNumberAuthApply' : "/ctc/resource/activiti/apply/addCardAuthApply",
              params
            )
              .then(({ data: res }) => {
                if (res.code !== 0) {
                  return thisvm.$message.error(res.msg);
                } else {
                  thisvm.$message.success(
                    code ? '修改成功' : '创建成功'
                  );
                  thisvm.closeCurrentTab();
                }
              })
              .catch(() => {});
          }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.biaodan {
  width: 100%;
}
.from {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>
