<template>
  <div class="app-container">
      <div class="flow">
          <div class="flow-title">业务进度</div>
          <div class="flow-data">
                <el-timeline>
                    <el-timeline-item
                        v-for="(flow, index) in flow"
                        :key="index"
                        :hide-timestamp=true
                        type="primary"
                        :class="flow.flow_approver != undefined && flow.flow_approver.method == 2 ? 'dashed' : ''"
                        timestamp="index">
                        <span class='operate'>{{flow.flow_approver == undefined ? '发起申请' : '审批人'}}</span>
                        <span class='name'>{{flow.name}}</span>
                        <span class='status'>{{getStatusText(flow.status)}}</span>
                        <span v-show="flow.comments ? true : false" class='comments'>{{flow.comments}}</span>
                        <span class='time'>{{flow.status != 1 && flow.status != 5 ? flow.updated_at : ''}}</span>
                    </el-timeline-item>
                </el-timeline>
          </div>
      </div>
      <div class='apply-info'>
          <div class='item clearfix'>
              <div class='label'><span>*</span>名称</div>
              <div class='info'>{{applyData.searchable}}</div>
          </div>
          <div class='item clearfix'>
              <div class='label'><span>*</span>附件</div>
              <div class='info'>
                  <div v-for='(item, index) in applyData.attachment'><el-link :href="item.url" type="primary" target="_blank">{{item.name}}</el-link></div>
              </div>
          </div>
          <div class='item clearfix'>
              <div class='label'>备注</div>
              <div class='info'>{{applyData.remark ? applyData.remark : '-'}}</div>
          </div>
      </div>
  </div>

</template>

<script>
  import {getApplyDetail} from '@/api/approval/api'
  import {mapGetters} from 'vuex'
  export default {
    name: 'ApplyDetail',
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    data() {
      return {
        schoolId : sessionStorage.getItem("schoolId"),
        applyId : this.$route.params.id,
        applyData : {searchable:'',attachment:[]},
        flow : [],
      }
    },
    methods: {
        getApplyDetail() {
            getApplyDetail({id:this.applyId}).then(res => {
                if(res.code == 200) {
                    this.applyData = res.data;
                    this.flow = res.flow;
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        getStatusText(status) {
            let text = '';
            if(status == 1) {
                text = '审批中';
            } else if(status == 2) {
                text = '通过';
            } else if(status == 3) {
                text = '不通过';
            } else if(status == 4) {
                text = '退回';
            } else if(status == 5) {
                text = '已失效';
            }
            return text;
        }
    },
    created() {
       this.getApplyDetail();
    }
  }
</script>
<style>
    .flow{font-size: 14px; margin:20px 30px 10px;}
    .flow .flow-data{padding: 30px 15px;border: 1px solid #ccc;margin-top: 10px;}
    /*.flow .el-timeline-item .el-timeline-item__tail{border-color: #02B2B5}*/
    .flow .el-timeline-item.dashed .el-timeline-item__tail{border-left-style: dashed}
    .flow .el-timeline-item:last-child{padding-bottom: 0}
    .flow .el-timeline-item span{color:#aaa;margin-right: 10px}
    .flow .el-timeline-item span.operate{color:#666}
    .apply-info{font-size: 14px;margin:20px 30px}
    .apply-info .item{line-height : 30px;margin-bottom: 20px;}
    .apply-info .item > div{float:left}
    .apply-info .item > div.label{width:60px;text-align: right}
    .apply-info .item > div.label span{color:#E95454}
    .apply-info .item > div.info{padding-left: 30px}
</style>
