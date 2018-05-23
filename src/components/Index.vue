<template>
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed">
        <md-app-toolbar class="md-accent" md-elevation="1">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">{{title}}</span>
          <div class="md-toolbar-section-end">
            <md-button @click="showDialog = true" class="md-primary" v-if="!user">
              Đăng kí/Đăng nhập
            </md-button>
            <md-button class="md-primary" v-else-if="user">
              <md-avatar class="md-small">
                <img :src="user.avatar">
              </md-avatar>
              <span>{{user.firstName}} {{user.lastName}}</span>
            </md-button>
          </div>
        </md-app-toolbar>
        <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini">
          <md-toolbar class="md-transparent" md-elevation="0">
            <span>Danh mục</span>
            <div class="md-toolbar-section-end">
              <md-button class="md-icon-button md-dense" @click="toggleMenu">
                <md-icon>keyboard_arrow_left</md-icon>
              </md-button>
            </div>
          </md-toolbar>
          <md-list>
            <md-list-item v-on:click="getPosts()">
              <md-icon>home</md-icon>
              <span class="md-list-item-text">Tổng hợp</span>
            </md-list-item>
            <md-list-item v-on:click="getPosts('news')">
              <md-icon>chrome_reader_mode</md-icon>
              <span class="md-list-item-text">Tin tức</span>
            </md-list-item>

            <md-list-item v-on:click="getPosts('food')">
              <md-icon>fastfood</md-icon>
              <span class="md-list-item-text">Ăn uống</span>
            </md-list-item>

            <md-list-item v-on:click="getPosts('fashion')">
              <md-icon>nature_people</md-icon>
              <span class="md-list-item-text">Thời trang</span>
            </md-list-item>

            <md-list-item v-on:click="getPosts('film')">
              <md-icon>camera_roll</md-icon>
              <span class="md-list-item-text">Phim ảnh</span>
            </md-list-item>

            <md-list-item v-on:click="getPosts('sport')">
              <md-icon>pool</md-icon>
              <span class="md-list-item-text">Thể thao</span>
            </md-list-item>
            <md-divider></md-divider>
            <md-list-item v-on:click="getSavedPosts()">
              <md-icon>bookmark</md-icon>
              <span class="md-list-item-text">Bài đã lưu</span>
            </md-list-item>

            <md-list-item v-on:click="getFollowPages()">
              <md-icon>subscriptions</md-icon>
              <span class="md-list-item-text">Trang theo dõi</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>
        <md-app-content>
          <div>
            <div v-if="showCustomPage">
              <custom-page :user="user"></custom-page>
            </div>
            <div v-if="isLoading">
              <fulfilling-square-spinner
                  :animation-duration="4000"
                  :size="50"
                  color="#FF8800"
                  style="display: block; margin: 50px auto auto auto;"
                />
            </div>
            <div v-if="!isLoading">
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
                        <md-switch v-if="user" v-model="user.posts" :value="post.postId" @change="handleSavedPost(post.postId)"></md-switch>
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
                      <md-button>
                        <span style="vertical-align:middle; color: #ee5253; margin: auto;">
                          <i class="material-icons">favorite_border</i>
                          {{post.like_count}}
                        </span>
                      </md-button>
                      <md-button>
                        <span style="vertical-align:middle; margin: auto; color: #576574;">
                          <i class="material-icons">comment</i>
                          {{post.comment_count}}
                        </span>
                      </md-button>
                      <md-button>
                        <span style="vertical-align:middle; color: #ff9f43; margin: auto;">
                          <i class="material-icons">bookmark_border</i>
                          {{post.share_count}}
                        </span>
                      </md-button>
                      <md-button class="ml-auto">
                        <a style="vertical-align:middle; color: #3F729B; margin: auto;" :href="post.link" target="_blank" title="Xem bài đăng gốc trên Facebook">
                          <i class="material-icons">description</i>
                        </a>
                      </md-button>
                    </md-card-actions>
                  </md-card>
                </div>
                <infinite-loading spinner="waveDots"  @infinite="showMorePosts"></infinite-loading>
              </div>
            </div>
            <login-form :showDialog="showDialog" @closeDialog="closeDialog" @userLoggedIn='getUser'></login-form>
          </div>
        </md-app-content>
      </md-app>
    </div>
</template>

<script>
/* global $:true */
/* eslint no-undef: "error" */
import InfiniteLoading from 'vue-infinite-loading'
import { FulfillingSquareSpinner } from 'epic-spinners'
import LoginForm from './Login'
import CustomPage from './CustomPage'
export default {
  name: 'Index',
  data () {
    return {
      title: 'TRENDEZ',
      // apiUrl: 'http://localhost:6868',
      apiUrl: 'https://trendez-server.herokuapp.com',
      posts: [],
      restPosts: [],
      count: 0,
      searchText: '',
      user: null,
      menuVisible: true,
      isLoading: true,
      showDialog: false,
      showCustomPage: false
    }
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
  created () {
    this.getPosts()
  },
  methods: {
    getUser: function (user) {
      this.user = user
    },
    getPosts: function (category) {
      this.isLoading = true
      if (category) {
        this.changeTitle(category)
        this.posts = []
        this.$http.get(`https://trendez-server.herokuapp.com/api/get-posts?category=${category}`).then((response) => {
          this.isLoading = false
          this.restPosts = response.body
          if (this.restPosts.length >= 10) {
            this.posts = this.restPosts.slice(1, 10)
          } else {
            this.posts = this.restPosts.slice(1, this.restPosts.length - 1)
          }
        })
      } else {
        this.title = 'TRENDEZ'
        this.posts = []
        this.$http.get('https://trendez-server.herokuapp.com/api/get-posts').then((response) => {
          this.isLoading = false
          this.restPosts = response.body
          if (this.restPosts.length >= 10) {
            this.posts = this.restPosts.slice(1, 10)
          } else {
            this.posts = this.restPosts.slice(1, this.restPosts.length - 1)
          }
        })
      }
    },
    showMorePosts: function ($state) {
      setTimeout(() => {
        console.log('Loading')
        let count = this.posts.length + 1
        if (count + 10 <= this.restPosts.length) {
          this.posts = this.posts.concat(this.restPosts.slice(count, count + 10))
        } else if (count < this.restPosts.length < count + 10) {
          this.posts = this.posts.concat(this.restPosts.slice(count, this.restPosts.length - count - 1))
        } else {
          $state.complete()
        }
      }, 1000)
    },
    handleSavedPost: function (postId) {
      this.$http.post(`${this.apiUrl}/api/handle-saved-post`, {
        userId: this.user._id,
        postId: postId
      }).then((response) => {
      })
    },
    changeTitle (category) {
      if (category === 'news') this.title = 'TIN TỨC'
      else if (category === 'food') this.title = 'ĂN UỐNG'
      else if (category === 'fashion') this.title = 'THỜI TRANG'
      else if (category === 'film') this.title = 'PHIM ẢNH'
      else if (category === 'sport') this.title = 'THỂ THAO'
    },
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    },
    getSavedPosts: function () {
      if (!this.user) {
        this.showErrorToast('Oops... Bạn cần đăng nhập trước nhé !')
      } else {
        if (this.user.posts.length > 0) {
          this.isLoading = true
          this.posts = []
          this.restPosts = []
          this.$http.post(`${this.apiUrl}/api/get-saved-post`, {
            userId: this.user._id
          }).then((response) => {
            this.isLoading = false
            this.posts = response.body.posts
          })
        } else {
          this.$toasted.error('Oops... Hình như bạn chưa có bài đăng nào !', {
            theme: 'bubble',
            position: 'top-right',
            duration: 3000
          })
        }
      }
    },
    getFollowPages: function () {
      if (!this.user) {
        this.showErrorToast('Oops... Bạn cần đăng nhập trước nhé !')
      } else {
        this.showCustomPage = true
      }
    },
    showErrorToast: function (message) {
      this.$toasted.error(message, {
        theme: 'bubble',
        position: 'top-right',
        duration: 3000,
        action: {
          icon: 'fingerprint',
          onClick: () => {
            $('#loginModal').modal('toggle')
          }
        }
      })
    },
    closeDialog: function (status) {
      this.showDialog = status
    }
  },
  components: {
    LoginForm,
    CustomPage,
    InfiniteLoading,
    FulfillingSquareSpinner
  }
}
</script>

<style lang="scss" scoped>
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

.items {
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
