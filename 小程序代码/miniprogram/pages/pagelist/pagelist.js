// pages/pagelist/pagelist.js
const MAX_LIMIT = 15
Page({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
      swiperImgUrls: [
        {
          url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg',
        },
        {
          url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg',
        },
        {
          url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg',
        }
      ],

    playlist: [
      
    ]
  },
  
  onLoad: function(options) {
    this._getPlayList()
  },

  onReachBottom: function() {
    this._getPlayList()
  },

  onPullDownRefresh: function() {
    this.setData({
      playlist:[]
    })
    this._getPlayList()
  },
  /**
   * 组件的方法列表
   */
  methods: {

  },
  _getPlayList() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        start: this.data.playlist.length,
        count: MAX_LIMIT,
        $url: 'playlist'
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        playlist: this.data.playlist.concat(res.result.data)
      })
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })
  }
})
