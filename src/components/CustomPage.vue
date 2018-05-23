<template>
  <div>
    <div class="md-layout md-gutter">
      <div class="md-layout-item md-size-15">
      </div>
      <div class="md-layout-item md-size-45">
        <md-field>
          <label>Link trang Facebook bạn muốn theo dõi</label>
          <md-input v-model="pageUrl"></md-input>
          <span class="md-helper-text">Ex: https://www.facebook.com/tintucvtv24/</span>
        </md-field>
      </div>
      <div class="md-layout-item">
        <md-button class="md-raised md-accent md-alignment-center-center" style="width: 120px; height: 54px;" @click="submitFavPage()">
          Thêm
          <md-icon>favorite</md-icon>
        </md-button>
      </div>
      <div class="md-layout-item md-size-15"></div>
    </div>
    <div v-if="pages.length > 0">
      <md-table >
        <md-table-toolbar>
          <h1 class="md-title">Các trang đang theo dõi</h1>
        </md-table-toolbar>

        <md-table-row>
          <!-- <md-table-head md-numeric>STT</md-table-head> -->
          <md-table-head>Tên trang</md-table-head>
          <md-table-head>Số theo dõi</md-table-head>
          <md-table-head>Số bài đăng</md-table-head>
          <md-table-head>Tác vụ</md-table-head>
        </md-table-row>

        <md-table-row v-for="page in pages" :key="page.pageId">
          <!-- <md-table-cell md-numeric>{{index + 1}}</md-table-cell> -->
          <md-table-cell>{{page.pageName}}</md-table-cell>
          <md-table-cell>{{page.pageLikes}}</md-table-cell>
          <md-table-cell>{{page.posts.length}}</md-table-cell>
          <md-table-cell>
            <md-button class="md-icon-button md-accent" @click="deleteFavPage(page.pageId)">
              <md-icon>delete</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    <div v-else>
      <h1>Hiện bạn chưa theo dõi trang nào !</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: 'customPage',
  props: ['user'],
  data () {
    return {
      // apiUrl: 'https://trendez-server.herokuapp.com',
      apiUrl: 'http://localhost:6868',
      fakeUser: this.user,
      pageUrl: '',
      loadUserInfo: true,
      pages: []
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$http.get(`${this.apiUrl}/api/get-favorite-page?userid=${this.fakeUser._id}`).then(res => {
        this.pages = res.body.pages
        this.$http.get(`${this.apiUrl}/api/get-favorite-posts`, {
          pages: this.pages,
          userId: this.fakeUser._id
        }).then(res => {
          console.log(res)
        })
      })
    },
    submitFavPage () {
      this.$http.post(`${this.apiUrl}/api/create-favorite-page`, {
        userId: this.fakeUser._id,
        pageUrl: this.pageUrl
      }).then(res => {
        if (res.body.error) {
          this.showErrorToast(res.body.error)
        } else {
          this.pages.push(res.body.doc)
        }
      })
    },
    showErrorToast: function (message) {
      this.$toasted.error(message, {
        theme: 'bubble',
        position: 'top-right',
        duration: 3000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~vue-material/dist/theme/engine";

@include md-register-theme("default", (
  primary: md-get-palette-color(blue, A200)
));

@import "~vue-material/dist/theme/all";
.md-dialog {
  background-color: white;
}
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
.fb-signin-button {
  border-radius: 3px;
  color: #448aff;
  display: block;
  margin: 30px auto;
  cursor: pointer;
  max-width: 160px;
  size: 16px;
}
</style>
