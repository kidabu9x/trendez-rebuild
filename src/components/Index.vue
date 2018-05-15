<template>
    <div>
        <nav class="navbar fixed-top navbar-expand-lg navbar-dark default-color">
            <!-- Navbar brand -->
            <a class="navbar-brand" href="#">TRENDEZ</a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#basicExampleNav" aria-controls="basicExampleNav"
                aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="basicExampleNav">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="#">Trang chủ</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Tin tức</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Ẩm thực</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Thời trang</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#">Phim ảnh</a>
                    </li>
                </ul>
            </div>
        </nav>
        <div class="container" style="margin-top: 60px;">
            <div class="row">
                <div class="col-md-3">
                </div>
                <div class="col-md-6">
                    <ul>
                    <li v-for="post in postsWithSearchs" :key="post.postId">
                        <md-card>
                            <md-card-header>
                                <md-avatar>
                                    <img :src="post.publisherAvatar" :alt="post.publisher">
                                </md-avatar>
                                <div class="md-title">{{post.publisher}}</div>
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
                                <md-button>Action</md-button>
                                <md-button>Action</md-button>
                            </md-card-actions>
                        </md-card>
                    </li>
                    </ul>
                </div>
                <div class="col-md-3">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Index',
  data () {
    return {
      posts: [],
      searchText: ''
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
    getPosts: function () {
      this.$http.get('https://trendez-server.herokuapp.com/api/get-posts').then((response) => {
        let posts = response.body
        posts.length = 10
        this.posts = posts
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
.md-card-header .md-card-header-text {
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
</style>
