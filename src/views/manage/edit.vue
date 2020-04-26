<template>
  <div>
        <div class="approval-form">
            <span>审批意见&nbsp;&nbsp;&nbsp;&nbsp;</span>
            <el-input class="approval-comments" v-model="comments"></el-input>
            <el-button class="approval-button" @click='approval(2)' type="primary">通过</el-button>
            <el-button class="approval-button" @click='approval(4)' type="primary">退回</el-button>
            <el-button class="approval-button" @click='approval(3)'>不通过</el-button>
        </div>
        <ApplyDetail />
  </div>

</template>

<script>
  import ApplyDetail from '../finance/detail'
  import {approval} from '@/api/approval/api'
  import {mapGetters} from 'vuex'
  export default {
    components: {
        ApplyDetail
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    data() {
        return {
            schoolId : sessionStorage.getItem("schoolId"),
            applyId : this.$route.params.id,
            applyFlowId : this.$route.params.apply_flow_id,
            comments : '',
        }
    },
    methods: {
        approval(status){
            let params = {status:status, id:this.applyFlowId, comments:this.comments};
            approval(params).then(res => {
                if(res.code == 200) {
                    this.$message.success(res.msg);
                    setTimeout(function() {
                        this.$router.back(-1);
                    },3000)
                } else {
                    this.$message.error(res.msg);
                }
            })
        }
    },
    created() {
       
    }
  }
</script>
<style>
   .approval-form{margin:10px 30px;font-size: 14px}
   .approval-form .approval-comments{width: calc(100% - 342px)}
   .approval-form .approval-button{margin-left:10px}
</style>
