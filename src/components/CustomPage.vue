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
        <md-button v-if="!isAdding" class="md-raised md-accent md-alignment-center-center" style="width: 120px; height: 54px;" @click="submitFavPage()">
          Thêm
          <md-icon>favorite</md-icon>
        </md-button>
        <div v-else align="center">
          <hollow-dots-spinner
            :animation-duration="1000"
            :dot-size="5"
            :dots-num="4"
            color="#ff5252"
            style="margin-top: 33px;"
          />
        </div>
      </div>
      <div class="md-layout-item md-size-15">
        <!-- <md-button class="md-icon-button md-accent" @click="getFavPosts()">
          <md-icon>home</md-icon>
        </md-button> -->
      </div>
    </div>
    <div v-if="pages">
      <md-table style="margin-top: 15px;">
        <!-- <md-table-toolbar> -->
          <!-- <h1 class="md-title">Các trang đang theo dõi</h1> -->
        <!-- </md-table-toolbar> -->

        <md-table-row>
          <md-table-head>Tên trang</md-table-head>
          <md-table-head>Số theo dõi</md-table-head>
          <md-table-head>Tác vụ</md-table-head>
        </md-table-row>

        <md-table-row v-for="page in pages" :key="page.pageId" v-if="pages.length > 0">
          <md-table-cell>{{page.pageName}}</md-table-cell>
          <md-table-cell>{{page.pageLikes}}</md-table-cell>
          <md-table-cell>
            <md-button class="md-icon-button md-accent" @click="deleteFavPage(page.pageId)" title="Xóa">
              <md-icon>delete</md-icon>
            </md-button>
          </md-table-cell>
        </md-table-row>
      </md-table>
    </div>
    <div v-else>
      <h2 style="margin: 30px;">Hiện bạn chưa theo dõi trang nào !</h2>
    </div>
    <div v-if="posts">
      <md-field>
        <label>Tìm kiếm...</label>
        <md-input v-model="searchText"></md-input>
      </md-field>
      <div v-masonry origin-left="true" transition-duration="1s" item-selector=".item">
        <div v-masonry-tile class="item" v-for="post in postsWithSearchs" :key="post.postId" v-if="post.isPublic">
          <md-card style="max-width: 400px" >
            <md-card-header>
              <md-avatar>
                  <img :src="post.publisherAvatar" :alt="post.publisher">
              </md-avatar>
              <div class="md-title">
                {{post.publisher}}
              </div>

              <div class="md-subhead">{{post.created | moment('from', 'now') }}</div>
            </md-card-header>

            <md-card-media v-if="post.picture">
              <md-card-media>
                  <img :src="post.picture">
              </md-card-media>
            </md-card-media>

            <md-card-content>
              {{post.message}}
            </md-card-content>

            <md-card-actions>
              <div class="md-layout">
                <div class="md-layout-item md-size-20">
                  <md-button>
                    <span style="vertical-align:middle; color: #ee5253; margin: auto;">
                      <i class="material-icons">favorite</i>
                      {{post.like_count}}
                    </span>
                  </md-button>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-button>
                    <span style="vertical-align:middle; margin: auto; color: #576574;">
                      <i class="material-icons">comment</i>
                      {{post.comment_count}}
                    </span>
                  </md-button>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-button>
                    <span style="vertical-align:middle; color: #ff9f43; margin: auto;">
                      <i class="material-icons">bookmark</i>
                      {{post.share_count}}
                    </span>
                  </md-button>
                </div>
                <div class="md-layout-item md-size-20">
                  <md-button class="ml-auto">
                    <a style="vertical-align:middle; color: #3F729B; margin: auto;" :href="post.link" target="_blank" title="Xem bài đăng gốc trên Facebook">
                      <i class="material-icons">description</i>
                    </a>
                  </md-button>
                </div>
                <div class="md-layout-item md-size-20" v-if="user">
                  <md-button title="Lưu bài đăng">
                    <md-switch  v-model="user.posts" :value="post.postId" @change="handleSavedPost(post.postId)"></md-switch>
                  </md-button>
                </div>
              </div>
            </md-card-actions>
          </md-card>
        </div>
      </div>
    </div>
    <div v-if="isLoading">
      <atom-spinner
        :animation-duration="1000"
        :size="60"
        color="#ff5252"
        style="margin: 30px auto;"
      />
    </div>
  </div>
</template>

<script>
import { AtomSpinner, HollowDotsSpinner } from 'epic-spinners'
export default {
  name: 'customPage',
  props: ['user'],
  data () {
    return {
      apiUrl: 'https://trendez-server.herokuapp.com',
      // apiUrl: 'http://localhost:6868',
      fakeUser: this.user,
      pageUrl: '',
      loadUserInfo: true,
      pages: [],
      posts: [],
      restPosts: [],
      isLoading: false,
      searchText: '',
      isAdding: false
    }
  },
  mounted () {
    this.fetchData()
  },
  computed: {
    postsWithSearchs: function () {
      var self = this
      if (this.searchText === '') {
        return this.posts
      }
      return this.posts.filter(function (post) {
        return post.message.indexOf(self.searchText) >= 0 || post.publisher.indexOf(self.searchText) >= 0
      })
    }
  },
  methods: {
    fetchData () {
      this.$http.get(`${this.apiUrl}/api/get-favorite-page?userid=${this.fakeUser._id}`).then(res => {
        if (!res.body.error && res.body.pages) {
          this.pages = res.body.pages
          this.getFavPosts()
        }
      })
    },
    getFavPosts () {
      this.isLoading = true
      this.$http.get(`${this.apiUrl}/api/get-favorite-posts?userid=${this.fakeUser._id}`).then(res => {
        this.isLoading = false
        if (res.body && res.body.length > 0) {
          this.restPosts = this.restPosts.concat(res.body)
          if (this.restPosts.length >= 30) {
            this.posts = this.restPosts.slice(1, 30)
          } else {
            this.posts = this.restPosts.slice(1, this.restPosts.length - 1)
          }
        }
      })
    },
    submitFavPage () {
      this.isAdding = true
      this.$http.post(`${this.apiUrl}/api/create-favorite-page`, {
        userId: this.fakeUser._id,
        pageUrl: this.pageUrl
      }).then(res => {
        this.isAdding = false
        if (res.body.error) {
          this.showErrorToast(res.body.error)
        } else {
          this.restPosts = []
          this.posts = []
          this.pageUrl = ''
          this.pages.push(res.body.doc)
          this.getFavPosts()
        }
      })
    },
    deleteFavPage (pageId) {
      this.$http.post(`${this.apiUrl}/api/delete-favorite-page`, {
        userId: this.fakeUser._id,
        pageId: pageId
      }).then(res => {
        if (res.body.error) {
          this.showErrorToast(res.body.error)
        } else {
          this.pages = this.pages.filter(function (page) {
            return page.pageId !== pageId
          })
          this.restPosts = []
          this.posts = []
          this.getFavPosts()
        }
      })
    },
    handleSavedPost: function (postId) {
      this.$http.post(`${this.apiUrl}/api/handle-saved-post`, {
        userId: this.user._id,
        postId: postId
      }).then((response) => {
      })
    },
    showErrorToast: function (message) {
      this.$toasted.error(message, {
        theme: 'bubble',
        position: 'top-right',
        duration: 3000
      })
    }
  },
  components: {
    AtomSpinner,
    HollowDotsSpinner
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

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 0 10px;
}
.col-title {
  text-align: left;
}
p {
  text-align: left;
}
a {
  color: #42b983;
}

.item {
  margin: 5px;
}

.md-card {
  width: 100%;
  margin: 4px;
  vertical-align: top;
  overflow: hidden;
}
.md-card-header .md-title {
  flex: none;
  text-align: left;
}
.md-card .md-subhead {
  text-align: justify;
}
.md-card-header+.md-card-content {
  text-align: justify;
}
.md-card-content {
  text-align: justify;
}
.md-card-actions {
  justify-content: left !important;
}
.md-card-actions .md-button {
  border-radius: 2px;
  color: #000;
}
.md-card-actions .md-button i {
  display: inline-block;
}
.md-card-actions .md-button span {
  display: inline-block;
}

.md-subhead {
    .md-icon {
    $size: 16px;
    width: $size;
    min-width: $size;
    height: $size;
    font-size: $size !important;
    }

    span {
    vertical-align: middle;
    }
}

.card-reservation {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .md-icon {
    margin: 8px;
    }
}

.md-button-group {
    display: flex;

    .md-button {
    min-width: 60px;
    border-radius: 2px;
    }
}
.md-app {
  min-height: 350px;
  border: 1px solid rgba(#000, .12);
}
  // Demo purposes only
.md-drawer {
  width: 230px;
  max-width: calc(100vw - 125px);
}
.md-card-drawer {
  position: sticky;
}
</style>
