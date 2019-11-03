// pages/blog/blog.js
let keyword = ''
Page({
  data: {
    modalShow: false,
    blogList: []
  },

  onPublish() {
      // this.setData({
      //   modalShow: true
      // })
      wx.getSetting({
        success: (res) => {
          console.log(res)
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success:(res)=> {
                //console.log(res)
                this.onLoginSuccess({
                  detail: res.userInfo
                })
              }
            })
          }else {
            this.setData({
              modalShow: true
            })
          }
        }
      })
  },

  onLoginSuccess(event) {
      console.log(event)
      const detail = event.detail
      wx.navigateTo({
        url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`
      })
  },
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },
  onLoad() {
    this._loadBlogList()
  },

  onSearch(event) {
    //console.log(event.detail.keyWords)
    this.setData({
      blogList:[]
    })
    keyword = event.detail.keyWords
    this._loadBlogList(0)
  },

  _loadBlogList(start = 0) {
      wx.showLoading({
        title: '拼命加载中',
      })

      wx.cloud.callFunction({
        name:'blog',
        data: {
          keyword,
          start,
          $url:'list',
          
          count: 10,

        }
      }).then((res)=>{
        this.setData({
          blogList: this.data.blogList.concat(res.result)
        })
      })

      wx.hideLoading()
  },
  onPullDownRefresh() {
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  onReachBottom: function() {
    this._loadBlogList(this.data.blogList.length)
  },

  goComment(event) {
    wx.navigateTo({
      url: '../../pages/blog-comment/blog-comment?blogId=' + event.target.dataset.blogid,
    })
  },
  onShareAppMessage: function (event) {
    console.log(event)
    let blogObj = event.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
      // imageUrl: ''
    }
  }

  

})