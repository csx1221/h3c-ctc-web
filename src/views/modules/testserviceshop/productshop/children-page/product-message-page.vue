<template>
  <el-row>
    <el-col :span="24">
      <div @click="inputFocus" class="my-reply">
        <div class="reply-info">
          <div tabindex="0" contenteditable="true" id="replyInput" spellcheck="false" placeholder="请输入留言评论" class="reply-input" @focus="showReplyBtn" @input="onDivInput($event)">
          </div>
        </div>
        <div class="reply-btn-box" v-show="btnShow">
          <el-button class="reply-btn" size="medium" @click="sendComment" type="primary">发表评论</el-button>
        </div>
      </div>
      <div v-for="(item,i) in comments" :key="i" class="author-title reply-father">
        <div class="author-info">
          <span class="author-name">{{item.msgPersonName}}</span>
          <span class="author-time">{{item.msgTime}}</span>
        </div>
        <div class="icon-btn">
          <span @click="showReplyInput(i,item.msgPersonName,item.msgPerson,item.messageId)" style="padding-top:5px;" title="回复">
            <i class="el-icon-chat-dot-square"></i>
          </span>
          <span style="padding-left:5px;">{{item.commentNum}}</span>
          <span style="margin-left:20px;" title="删除" v-if="showDeleteAuth(1,item)" @click="deleteData(1,item)"><i class="el-icon-delete"></i></span>
        </div>
        <div class="talk-box">
          <p>
            <span class="reply">{{item.msgDetail}}</span>
          </p>
        </div>
        <div class="reply-box">
          <div v-for="(reply,j) in item.reply" :key="j" class="author-title">
            <div class="author-info">
              <span class="author-name">{{reply.replyPersonNameFrom}}</span>
              <span class="author-time">{{reply.msgTime}}</span>
            </div>
            <div class="icon-btn">
              <span @click="showReplyInput(i,reply.replyPersonNameFrom,reply.replyPersonFrom,reply.messageId)" style="padding-top:5px;" title="回复">
                <i class="el-icon-chat-dot-square"></i>
              </span>
              <span style="margin-left:20px;" title="删除" v-if="showDeleteAuth(2,reply)" @click="deleteData(2,reply)"><i class="el-icon-delete"></i></span>
            </div>
            <div class="talk-box">
              <p>
                <span>回复 {{reply.replyPersonNameTo}}:</span>
                <span class="reply">{{reply.replyDetail}}</span>
              </p>
            </div>
            <div class="reply-box">
            </div>
          </div>
        </div>
        <div v-show="_inputShow(i)" class="my-reply my-comment-reply">
          <div class="reply-info">
            <div tabindex="0" contenteditable="true" spellcheck="false" placeholder="请输入留言评论..." @input="onDivInput($event)" class="reply-input reply-comment-input"></div>
          </div>
          <div class=" reply-btn-box">
            <el-button class="reply-btn" size="medium" @click="sendCommentReply(i)" type="primary">回复{{currReplyPerson}}评论</el-button>
          </div>
        </div>
      </div>
      <el-pagination :current-page="page" :page-size="limit" :total="total" layout="total, prev, pager, next, jumper" @current-change="pageCurrentChangeHandle">
      </el-pagination>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: 'ProductMessagePage',
  props: {
    productId: String,
    approvePerson: String
  },
  data () {
    return {
      currMessageId: '',
      currReplyPerson: '',
      btnShow: false,
      index: '0',
      myId: this.$store.state.user.id,
      myUserName: this.$store.state.user.name,
      myRealName: this.$store.state.user.realName,
      replyPersonNameTo: '',
      replyPersonTo: -1,
      replyComment: '',
      page: 1,
      limit: 5,
      total: 0,
      comments: [
      ]
    }
  },
  watch: {
    productId (newVal, oldVal) {
      this.getProductMsg()
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    init () {
      this.innerVisible = true
      this.$nextTick(() => {
      })
    },
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getProductMsg()
    },
    // 获取产品评论
    getProductMsg () {
      let params = { 'productId': this.productId, 'page': this.page, 'limit': this.limit }
      this.$http.get('/ctc/shop/productmsg/getmessage', { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        } else {
          this.comments = res.data.list
          this.total = res.data.total
        }
      }).catch(() => { })
    },
    inputFocus () {
      var replyInput = document.getElementById('replyInput')
      replyInput.style.padding = '8px 8px'
      replyInput.style.border = '2px solid #4190f7'
      replyInput.focus()
    },
    showReplyBtn () {
      this.btnShow = true
    },
    hideReplyBtn () {
      this.btnShow = false
      var replyInput = document.getElementById('replyInput')
      replyInput.style.padding = '10px'
      replyInput.style.border = 'none'
    },
    showReplyInput (i, msgPersonName, msgPerson, messageId) {
      this.comments[this.index].inputShow = false
      this.index = i
      this.comments[i].inputShow = true
      this.replyPersonNameTo = msgPersonName
      this.replyPersonTo = msgPerson
      // 设置当前回复人
      this.currMessageId = messageId
      this.currReplyPerson = '【' + msgPersonName + '】'
    },
    _inputShow (i) {
      return this.comments[i].inputShow
    },
    sendComment () {
      if (!this.replyComment) {
        this.$message.warning('留言评论不能为空！')
      } else {
        let a = {}
        let input = document.getElementById('replyInput')
        let timeNow = new Date().getTime()
        let msgTime = this.dateStr(timeNow)
        a.productId = this.productId
        a.msgPerson = this.myId
        a.msgPersonName = this.myRealName
        a.msgDetail = this.replyComment
        a.msgTime = msgTime
        a.commentNum = 0
        // this.comments.push(a)
        this.replyComment = ''
        input.innerHTML = ''
        this.executeSaveData(1, a)
      }
    },
    sendCommentReply (i) {
      if (!this.replyComment) {
        this.$message.warning('留言评论不能为空！')
      } else {
        let a = {}
        let timeNow = new Date().getTime()
        let msgTime = this.dateStr(timeNow)
        a.messageId = this.currMessageId
        a.replyPersonNameFrom = this.myRealName
        a.replyPersonFrom = this.myId
        a.replyPersonNameTo = this.replyPersonNameTo
        a.replyPersonTo = this.replyPersonTo
        a.replyDetail = this.replyComment
        a.msgTime = msgTime
        a.commentNum = 0
        // this.comments[i].reply.push(a)
        this.replyComment = ''
        this.currMessageId = ''
        this.currReplyPerson = ''
        document.getElementsByClassName('reply-comment-input')[i].innerHTML = ''
        this.executeSaveData(2, a)
      }
    },
    getDeleteAuthUser () {
      // 超级管理员，产品审核人,当前发表者
      let deleteAuth = [this.myId, this.approvePerson]
      // 特殊判断,是否是超级管理员
      if (this.$store.state.user.superAdmin === 1) {
        deleteAuth.push(this.$store.state.user.id)
      }
      return deleteAuth
    },
    showDeleteAuth (type, item) {
      // type:1留言评论;2:回复评论留言
      let delFlag = false
      let deleteAuth = this.getDeleteAuthUser()
      if (type === 1) {
        // 判断是否有删除权限
        delFlag = deleteAuth.includes(item.msgPerson)
        if (item.commentNum > 0) {
          delFlag = false
        }
      } else {
        // 判断是否有删除权限
        delFlag = deleteAuth.includes(item.replyPersonFrom)
      }
      return delFlag
    },
    deleteData (type, item) {
      // type:1留言评论;2:回复评论留言
      let params = {}
      let url = ''
      // 回复留言
      if (type === 1) {
        url = '/ctc/shop/productmsg/rmleavemsg'
        params.messageId = item.messageId
      } else {
        url = '/ctc/shop/replaymsg/rmreplymsg'
        params.replyId = item.replyId
      }
      this.$http.get(url, { 'params': params }).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message.success('删除评论成功')
        this.getProductMsg()
      }).catch(() => { })
    },
    executeSaveData (type, data) {
      // type:1留言评论;2:回复评论留言
      let url = '/ctc/shop/productmsg/leavemsg'
      // 回复留言
      if (type === 2) {
        url = '/ctc/shop/replaymsg/replaymsg'
      }
      let params = Object.assign({}, data)
      delete params['msgTime']
      this.$http.post(url, params).then(({ data: res }) => {
        if (res.code !== 0) {
          return this.$message.error(res.msg)
        }
        this.$message.success('发布评论成功')
        this.getProductMsg()
      }).catch(() => { })
    },
    onDivInput: function (e) {
      this.replyComment = e.target.innerHTML
    },
    dateStr (date) {
      // 获取js 时间戳
      var replyDate = new Date().getTime()
      // 去掉 js 时间戳后三位，与php 时间戳保持一致
      replyDate = parseInt((replyDate - date) / 1000)
      var s = ''
      if (replyDate < 60 * 10) {
        // 十分钟内
        return '刚刚'
      } else if ((replyDate < 60 * 60) && (replyDate >= 60 * 10)) {
        // 超过十分钟少于1小时
        s = Math.floor(replyDate / 60)
        return s + '分钟前'
      } else if ((replyDate < 60 * 60 * 24) && (replyDate >= 60 * 60)) {
        // 超过1小时少于24小时
        s = Math.floor(replyDate / 60 / 60)
        return s + '小时前'
      } else if ((replyDate < 60 * 60 * 24 * 30) && (replyDate >= 60 * 60 * 24)) {
        // 超过1天少于30天内
        s = Math.floor(replyDate / 60 / 60 / 24)
        return s + '天前'
      } else {
        // 超过30天ddd
        var tdate = new Date(parseInt(date))
        return tdate.getFullYear() + '/' + (tdate.getMonth() + 1) + '/' + tdate.getDate()
      }
    },
    handleDialogClose () {
      this.innerVisible = false
    },
    handleConfirm () {
    }
  }
}
</script>
<style lang="scss" scoped>
.my-reply {
  padding: 10px;
  background-color: #fafbfc;

  .header-img {
    display: inline-block;
    vertical-align: top;
  }

  .reply-info {
    display: inline-block;
    margin-left: 5px;
    width: 100%;
    @media screen and (max-width: 1200px) {
      width: 80%;
    }
    .reply-input {
      min-height: 20px;
      line-height: 22px;
      padding: 10px 10px;
      color: #909399;
      background-color: #fff;
      border-radius: 5px;
      &:empty:before {
        content: attr(placeholder);
      }

      &:focus:before {
        content: none;
      }

      &:focus {
        padding: 8px 8px;
        border: 2px solid blue;
        box-shadow: none;
        outline: none;
      }
    }
  }

  .reply-btn-box {
    height: 25px;
    margin: 10px 0;

    .reply-btn {
      position: relative;
      float: right;
      margin-right: 15px;
    }
  }
}

.my-comment-reply {
  margin-left: 50px;

  .reply-input {
    width: flex;
  }
}

.author-title:not(:last-child) {
  border-bottom: 1px solid rgba(178, 186, 194, 0.3);
}

.author-title {
  padding: 10px;

  .header-img {
    display: inline-block;
    vertical-align: top;
  }

  .author-info {
    display: inline-block;
    margin-left: 5px;
    width: 60%;
    height: 40px;
    line-height: 20px;

    > span {
      display: block;
      cursor: pointer;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    .author-name {
      color: #000;
      font-size: 18px;
      font-weight: bold;
    }

    .author-time {
      font-size: 14px;
    }
  }

  .icon-btn {
    width: 30%;
    padding: 0 !important;
    float: right;

    @media screen and (max-width: 1200px) {
      width: 20%;
      padding: 7px;
    }

    > span {
      cursor: pointer;
    }

    .iconfont {
      margin: 0 5px;
    }
  }

  .talk-box {
    margin: 0 50px;

    > p {
      margin: 0;
    }

    .reply {
      font-size: 16px;
      color: #000;
    }
  }

  .reply-box {
    margin: 10px 0 0 50px;
    background-color: #efefef;
  }
}
</style>
