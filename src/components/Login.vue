<template>
  <div>
    <md-dialog :md-active.sync="show" @md-closed="updateShowDialog" :md-backdrop='true'>
      <md-dialog-title>Chào mừng bạn đến với TrendEz</md-dialog-title>

      <md-tabs md-dynamic-height md-alignment="centered">
        <md-tab md-label="Đăng nhập" md-icon='timeline'>
          <form novalidate class="md-layout" @submit.prevent="validateUser">
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

            <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
          </form>
        </md-tab>
        <md-tab md-label="Đăng ký" md-icon='create'>
          <form novalidate class="md-layout" @submit.prevent="validateUser">
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
              </md-card-content>

              <md-progress-bar md-mode="indeterminate" v-if="sending" />

              <md-card-actions>
                <md-button type="submit" class="md-primary" :disabled="sending">Đăng ký</md-button>
              </md-card-actions>
            </md-card>

            <md-snackbar :md-active.sync="userSaved">The user {{ lastUser }} was saved with success!</md-snackbar>
          </form>
        </md-tab>
        <md-tab md-label="or" md-disabled>
        </md-tab>
        <md-tab md-label="Đăng nhập bằng Facebook" md-icon='timeline'>
        </md-tab>

      </md-tabs>
    </md-dialog>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength
  // maxLength
} from 'vuelidate/lib/validators'
export default {
  name: 'FormValidation',
  mixins: [validationMixin],
  props: ['showDialog'],
  data: () => ({
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
    userSaved: false,
    sending: false,
    lastUser: null
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
    clearRegisterForm () {
      this.$v.$reset()
      this.registerForm.firstName = null
      this.registerForm.lastName = null
      this.registerForm.username = null
      this.registerForm.password = null
      this.registerForm.avatar = null
    },
    register () {
      this.sending = true

      // Instead of this timeout, here you can call your API
      window.setTimeout(() => {
        this.lastUser = `${this.form.firstName} ${this.form.lastName}`
        this.userSaved = true
        this.sending = false
        this.clearRegisterForm()
      }, 1500)
    },
    validateUser () {
      this.$v.$touch()

      if (!this.$v.$invalid) {
        this.saveUser()
      }
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
</style>
