<template>
  <div id="app" style="background: #e6eaef;">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>

  .el-button+.el-button{
    margin-left: 0;
  }
  .form-item-small{
    display: inline-block;
    margin-right: 10px;
  }
  .width-250 {
    width: 250px;
  }
  .width-200 {
    width: 200px;
  }
  .ele-form-label {
    width: 120px;
    text-align: right;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .ele-form-content{
    line-height: 40px;
    position: relative;
    font-size: 14px;
  }
  .form-item-text{
    color: #606266;
    font-size: 14px;
  }
  .width-300{
    width: 300px;
  }
  .link-color {
    color: #3a8ee6;
  }
</style>
