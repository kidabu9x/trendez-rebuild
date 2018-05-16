<template>
    <div>
      <md-app>
        <md-app-toolbar class="md-accent" md-elevation="1">
          <md-button class="md-icon-button" @click="toggleMenu" v-if="!menuVisible">
            <md-icon>menu</md-icon>
          </md-button>
          <span class="md-title">TRENDEZ</span>
          <md-button class="ml-auto" data-toggle="modal" data-target="#loginModal" v-if="!user">Đăng kí/Đăng nhập</md-button>
        </md-app-toolbar>
        <md-app-drawer :md-active.sync="menuVisible" md-persistent="mini" class="fixed-top">
          <md-toolbar class="md-transparent" md-elevation="0">
            <span>Danh mục</span>

            <div class="md-toolbar-section-end">
              <md-button class="md-icon-button md-dense" @click="toggleMenu">
                <md-icon>keyboard_arrow_left</md-icon>
              </md-button>
            </div>
          </md-toolbar>
          <md-list>
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

            <md-list-item v-on:click="getPosts('news')">
              <md-icon>pool</md-icon>
              <span class="md-list-item-text">Thể thao</span>
            </md-list-item>

            <md-list-item v-on:click="getPosts('news')">
              <md-icon>bookmark</md-icon>
              <span class="md-list-item-text">Bài đã lưu</span>
            </md-list-item>

            <md-list-item v-on:click="getPosts('news')">
              <md-icon>subscriptions</md-icon>
              <span class="md-list-item-text">Trang theo dõi</span>
            </md-list-item>
          </md-list>
        </md-app-drawer>
        <md-app-content>
          <div class="container" style="margin-top: 60px;">
            <ul>
              <li v-for="post in postsWithSearchs" :key="post.postId" v-if="post.isPublic">
                <md-card>
                    <md-card-header>
                        <md-avatar>
                            <img :src="post.publisherAvatar" :alt="post.publisher">
                        </md-avatar>
                        <div class="md-title" style="padding-left: 0">{{post.publisher}}</div>
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
                          <md-switch class="md-success">Lưu</md-switch>
                        </md-button>
                    </md-card-actions>
                </md-card>
              </li>
              <!-- <infinite-loading @infinite="showPosts"></infinite-loading> -->
            </ul>
          </div>
        </md-app-content>
      </md-app>
        <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="loginModalLabel">Chào mừng bạn đến với TrendEz !</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <form>
                  <p class="h4 text-center mb-4">Sign up</p>
                  <!-- Material input text -->
                  <div class="md-form">
                    <i class="fa fa-user prefix grey-text"></i>
                    <input type="text" id="materialFormRegisterNameEx" class="form-control">
                    <label for="materialFormRegisterNameEx">Your name</label>
                  </div>
                  <!-- Material input email -->
                  <div class="md-form">
                    <i class="fa fa-envelope prefix grey-text"></i>
                    <input type="email" id="materialFormRegisterEmailEx" class="form-control">
                    <label for="materialFormRegisterEmailEx">Your email</label>
                  </div>

                  <!-- Material input email -->
                  <div class="md-form">
                    <i class="fa fa-exclamation-triangle prefix grey-text"></i>
                    <input type="email" id="materialFormRegisterConfirmEx" class="form-control">
                    <label for="materialFormRegisterConfirmEx">Confirm your email</label>
                  </div>

                  <!-- Material input password -->
                  <div class="md-form">
                    <i class="fa fa-lock prefix grey-text"></i>
                    <input type="password" id="materialFormRegisterPasswordEx" class="form-control">
                    <label for="materialFormRegisterPasswordEx">Your password</label>
                  </div>

                  <div class="text-center mt-4">
                    <button class="btn btn-primary" type="submit">Register</button>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
export default {
  name: 'Index',
  data () {
    return {
      posts: [],
      restPosts: [],
      count: 0,
      searchText: '',
      user: null,
      menuVisible: false
    }
  },
  computed: {
    postsWithSearchs: function () {
      var self = this
      if (this.searchText === '') {
        return this.posts
      }
      return this.posts.filter(function (post) {
        return post.message.indexOf(self.searchText) >= 0
      })
    }
  },
  created () {
    this.getPosts()
  },
  methods: {
    getPosts: function (category) {
      if (category) {
        this.posts = []
        this.$http.get(`https://trendez-server.herokuapp.com/api/get-posts?category=${category}`).then((response) => {
          this.restPosts = response.body
        })
      } else {
        this.posts = []
        this.$http.get('https://trendez-server.herokuapp.com/api/get-posts').then((response) => {
          this.restPosts = response.body
          this.posts = this.restPosts.slice(0, 10)
        })
      }
    },
    showPosts: function ($state) {
      setTimeout(() => {
        if (this.count + 10 < this.restPosts.length) {
          this.posts = this.posts.concat(this.restPosts.slice(this.count, this.count + 10))
          this.count += 10
        } else {
          this.posts = this.posts.concat(this.restPosts.slice(this.count, this.count + (this.restPosts.length - this.count)))
          this.count += this.restPosts.length - this.count
        }
        $state.loaded()
      }, 1000)
    },
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    }
  },
  components: {
    InfiniteLoading
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
.md-card {
  width: 100%;
  margin: 4px;
  vertical-align: top;
  overflow: hidden;
}
.md-card-header .md-title {
  flex: none;
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
</style>
