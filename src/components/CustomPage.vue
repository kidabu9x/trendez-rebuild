<template>
  <div>
  </div>
</template>

<script>
export default {
  name: 'customPage',
  props: ['user'],
  data: () => ({
    apiUrl: 'https://trendez-server.herokuapp.com'
  })
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
