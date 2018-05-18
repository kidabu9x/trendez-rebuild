<template>
  <div>
    <form style="padding: 10px;">
        <p class="h4 text-center mb-4">Sign up</p>
        <!-- Material input text -->
        <div class="md-form">
            <input type="text" id="materialFormRegisterNameEx" class="form-control">
            <label for="materialFormRegisterNameEx">Your name</label>
        </div>
        <!-- Material input email -->
        <div class="md-form">
            <input type="email" id="materialFormRegisterEmailEx" class="form-control">
            <label for="materialFormRegisterEmailEx">Your email</label>
        </div>

        <!-- Material input email -->
        <div class="md-form">
            <input type="email" id="materialFormRegisterConfirmEx" class="form-control">
            <label for="materialFormRegisterConfirmEx">Confirm your email</label>
        </div>

        <!-- Material input password -->
        <div class="md-form">
            <input type="password" id="materialFormRegisterPasswordEx" class="form-control">
            <label for="materialFormRegisterPasswordEx">Your password</label>
        </div>
        <div class="text-center mt-4">
            <button class="btn btn-primary"  type="submit">Submit</button>
            <button class="btn btn-primary"  type="submit">{{title}}</button>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',
  props: ['title'],
  data () {
    return {
      test: this.title
    }
  },
  methods: {
    toggleMenu () {
      this.menuVisible = !this.menuVisible
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
