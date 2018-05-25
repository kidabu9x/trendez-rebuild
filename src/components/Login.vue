<template>
  <div>
    <md-dialog :md-active.sync="show" @md-closed="updateShowDialog" :md-backdrop='true'>
      <md-dialog-title style="margin: auto;">
        <img src="../assets/logo-trendez-2.png" width="140">
      </md-dialog-title>

      <md-tabs md-dynamic-height md-alignment="centered">
        <md-tab md-label="Đăng nhập" md-icon='fingerprint'>
          <form novalidate class="md-layout" @submit.prevent="validateLoginUser">
            <md-card class="md-layout-item">
              <md-card-header>
              </md-card-header>

              <md-card-content>
                <md-field :class="getValidationClass('username')">
                  <label for="loginUsername">Tên đăng nhập</label>
                  <md-input type="username" name="username" id="loginUsername" autocomplete="username" v-model="loginForm.username" :disabled="sending" />
                  <span class="md-error" v-if="!$v.loginForm.username.required">*Bắt buộc</span>
                </md-field>

                <md-field :class="getValidationClass('password')">
                  <label for="loginPassword">Mật khẩu</label>
                  <md-input type="password" name="password" id="loginPassword" autocomplete="password" v-model="loginForm.password" :disabled="sending" />
                  <span class="md-error" v-if="!$v.loginForm.password.required">*Bắt buộc</span>
                </md-field>
              </md-card-content>

              <md-progress-bar md-mode="indeterminate" v-if="sending" />

              <md-card-actions>
                <md-button type="submit" class="md-primary" :disabled="sending">Đăng nhập</md-button>
              </md-card-actions>
            </md-card>
          </form>
        </md-tab>
        <md-tab md-label="Đăng ký" md-icon='create'>
          <form novalidate class="md-layout" @submit.prevent="validateRegisterUser">
            <md-card class="md-layout-item">
              <md-card-header>
              </md-card-header>

              <md-card-content>
                <div class="md-layout md-gutter">
                  <div class="md-layout-item md-small-size-100">
                    <md-field :class="getValidationClass('firstName')">
                      <label for="first-name">Tên</label>
                      <md-input name="first-name" id="first-name" autocomplete="given-name" v-model="registerForm.firstName" :disabled="sending" />
                      <span class="md-error" v-if="!$v.registerForm.firstName.required">*Bắt buộc</span>
                      <span class="md-error" v-else-if="!$v.registerForm.firstName.minlength">*Ít nhất 2 kí tự</span>
                    </md-field>
                  </div>

                  <div class="md-layout-item md-small-size-100">
                    <md-field :class="getValidationClass('lastName')">
                      <label for="last-name">Họ</label>
                      <md-input name="last-name" id="last-name" autocomplete="family-name" v-model="registerForm.lastName" :disabled="sending" />
                      <span class="md-error" v-if="!$v.registerForm.lastName.required">*Bắt buộc</span>
                      <span class="md-error" v-else-if="!$v.registerForm.lastName.minlength">*Ít nhất 2 kí tự</span>
                    </md-field>
                  </div>
                </div>

                <md-field :class="getValidationClass('username')">
                  <label for="registerUsername">Tên đăng nhập</label>
                  <md-input type="username" name="username" id="registerUsername" autocomplete="username" v-model="registerForm.username" :disabled="sending" />
                  <span class="md-error" v-if="!$v.registerForm.username.required">*Bắt buộc</span>
                  <span class="md-error" v-else-if="!$v.registerForm.username.username">*Không hợp lệ</span>
                </md-field>

                <md-field :class="getValidationClass('password')">
                  <label for="registerPassword">Mật khẩu</label>
                  <md-input type="password" name="password" id="registerPassword" autocomplete="password" v-model="registerForm.password" :disabled="sending" />
                  <span class="md-error" v-if="!$v.registerForm.password.required">*Bắt buộc</span>
                  <span class="md-error" v-else-if="!$v.registerForm.password.password">*Mật khẩu không hợp lệ</span>
                </md-field>

                <md-field>
                  <label for="registerAvatar">Link ảnh đại diện</label>
                  <md-input type="text" name="avatar" id="registerAvatar" autocomplete="password" v-model="registerForm.avatar" :disabled="sending" />
                </md-field>
              </md-card-content>

              <md-progress-bar md-mode="indeterminate" v-if="sending" />

              <md-card-actions>
                <md-button type="submit" class="md-primary" :disabled="sending">Đăng ký</md-button>
              </md-card-actions>
            </md-card>

          </form>
        </md-tab>
        <md-tab md-label="or" md-disabled>
        </md-tab>
        <md-tab md-label="Đăng nhập bằng Facebook" md-icon='timeline'>
          <template>
            <fb-signin-button
              :params="fbSignInParams"
              @success="onSignInSuccess"
              @error="onSignInError">
              ĐĂNG NHẬP BẰNG FACEBOOK
            </fb-signin-button>
          </template>
        </md-tab>

      </md-tabs>
    </md-dialog>
  </div>
</template>

<script>
/* global FB */
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength
} from 'vuelidate/lib/validators'
export default {
  name: 'FormValidation',
  mixins: [validationMixin],
  props: ['showDialog'],
  data: () => ({
    apiUrl: 'https://trendez-server.herokuapp.com',
    show: this.showDialog,
    registerForm: {
      firstName: null,
      lastName: null,
      username: null,
      password: null,
      avatar: null
    },
    loginForm: {
      username: null,
      password: null
    },
    sending: false,
    lastUser: null,
    fbSignInParams: {
      scope: 'email',
      return_scopes: true
    }
  }),
  watch: {
    showDialog: function (n, o) {
      this.show = this.showDialog
    }
  },
  validations: {
    registerForm: {
      firstName: {
        required,
        minLength: minLength(2)
      },
      lastName: {
        required,
        minLength: minLength(2)
      },
      username: {
        required
      },
      password: {
        required
      }
    },
    loginForm: {
      username: {
        required
      },
      password: {
        required
      }
    }
  },
  methods: {
    updateShowDialog () {
      this.$emit('closeDialog', false)
    },
    getValidationClass (fieldName) {
      const field = this.$v.registerForm[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    },
    validateLoginUser () {
      this.$v.loginForm.$touch()
      if (!this.$v.loginForm.$invalid) {
        this.login()
      }
    },
    login () {
      this.sending = true
      this.$http.post(`${this.apiUrl}/api/login`, {
        username: this.loginForm.username,
        password: this.loginForm.password
      }).then((res) => {
        this.sending = false
        if (!res.ok) {
          this.showErrorToast('Lỗi hệ thống !')
        } else if (res.body.error) {
          this.showErrorToast(res.body.error)
        } else {
          this.lastUser = res.body.user
          this.clearLoginForm()
          this.updateShowDialog()
          this.showSuccessToast(`Chào mừng ${this.lastUser.firstName} ${this.lastUser.lastName} quay trở lại !`)
          this.$emit('userLoggedIn', this.lastUser)
        }
      })
    },
    clearLoginForm () {
      this.$v.$reset()
      this.loginForm.username = null
      this.loginForm.password = null
    },
    validateRegisterUser () {
      this.$v.registerForm.$touch()
      if (!this.$v.registerForm.$invalid) {
        this.register()
      }
    },
    register () {
      this.sending = true
      this.$http.post(`${this.apiUrl}/api/register`, {
        firstName: this.registerForm.firstName,
        lastName: this.registerForm.lastName,
        username: this.registerForm.username,
        password: this.registerForm.password,
        avatar: this.registerForm.avatar
      }).then((res) => {
        this.sending = false
        if (!res.ok) {
          this.showErrorToast('Lỗi hệ thống !')
        } else if (res.body.error) {
          this.showErrorToast(res.body.error)
        } else {
          this.lastUser = res.body.user
          this.clearRegisterForm()
          this.updateShowDialog()
          this.showSuccessToast(`Chào mừng ${this.lastUser.firstName} ${this.lastUser.lastName} đến với TRENDEZ !`)
          this.$emit('userLoggedIn', this.lastUser)
        }
      })
    },
    clearRegisterForm () {
      this.$v.$reset()
      this.registerForm.firstName = null
      this.registerForm.lastName = null
      this.registerForm.username = null
      this.registerForm.password = null
      this.registerForm.avatar = null
    },
    showErrorToast: function (message) {
      this.$toasted.error(message, {
        theme: 'bubble',
        position: 'top-right',
        duration: 3000
      })
    },
    showSuccessToast: function (message) {
      this.$toasted.success(message, {
        theme: 'bubble',
        position: 'top-right',
        duration: 3000
      })
    },
    onSignInSuccess (res) {
      let userID = res.authResponse.userID
      FB.api(`/${userID}?fields=name,first_name,last_name,picture{url}`, doc => {
        let checkUser = {
          user: {
            username: doc.id,
            firstName: doc.first_name,
            lastName: doc.last_name,
            avatar: doc.picture.data.url
          }
        }
        this.$http.post(`${this.apiUrl}/api/facebook-log-in`, checkUser).then(data => {
          if (data.body.error) {
            this.showErrorToast(data.error)
          } else {
            this.lastUser = data.body.user
            this.updateShowDialog()
            this.showSuccessToast(`Chào mừng ${this.lastUser.firstName} ${this.lastUser.lastName} đến với TRENDEZ !`)
            this.$emit('userLoggedIn', this.lastUser)
          }
        })
      })
    },
    onSignInError () {
      this.showErrorToast('Đăng nhập không thành công !')
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
  max-width: 240px;
  size: 16px;
}
</style>
