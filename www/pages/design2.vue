<template>

  <div>
    <div class="e-test a-shadow">Why is this text here?</div>
    <div class="e-otherText">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce imperdiet egestas velit, quis vulputate mauris elementum eu. Quisque vestibulum justo ante, quis congue dui tincidunt vitae. Suspendisse potenti. Vivamus dui ex, euismod quis condimentum vitae, condimentum ut metus. Suspendisse lobortis mi non lacinia consectetur. Aliquam tempor nec purus et blandit. Quisque malesuada justo id erat sodales, dignissim pellentesque lorem eleifend. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur non porta nibh. </div>
  </div>

</template>

<style lang="scss">
.e-test {
  position: absolute;
  left: 20px;
  top: 20px;
  width: 300px;
  height: 200px;
  margin: 50px;
  background: #7f828b;
  z-index: 1000;
  color: green;
  font-size: 22px;
}
.a-shadow {
  &:before {
    display: block;
    content: '';
    position: absolute;
    z-index: -1;
    left: 11px;
    top: 11px;
    width: 100%;
    height: 100%;
    background: black;
  }
}
.e-otherText {
  width: 400px;
}
</style>
