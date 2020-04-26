<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-block">
        <span>申请时间：</span>
        <el-date-picker
            v-model="queryList.date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        <span>状态：</span>
        <el-select clearable size="small" v-model="queryList.status" placeholder="请选择">
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="filter-btn-area">
        <el-button type="primary" size="small" @click="fetchCount">查询</el-button>
        <el-button size="small" type="none" @click="initListQuery">清除</el-button>
      </div>

      <div class="ope-btn-area">
          <div class="table-info">总计<span>{{pageInfo.total}}</span>条记录</div>
      </div>
    </div>

    <el-table :data="tableData" border show-overflow-tooltip style="width: 100%">
      <el-table-column label="流程类型" prop="name" align="center" />
      <el-table-column label="申请时间" prop="created_at" align="center"/>
      <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{getStatusText(scope.row.apply_status)}}
            （{{(scope.row.approval_name)}}）
          </template>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip
        align="center">
          <template slot-scope="scope">
            <el-link :underline="false" v-if='scope.row.apply_flow_status == 1 && permissions.indexOf("appoval:apply:approval") !== -1' type="primary" @click='goEditPage(scope.row)'>审批</el-link>
            <el-link :underline="false" v-else type="primary" @click='goDetailPage(scope.row)'>详情</el-link>
          </template>
      </el-table-column>
    </el-table>
      
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="curPage"
      :page-sizes="[1,10, 20, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>
    
  </div>

</template>

<script>
  import {getApprovalList,getApprovalCount} from '@/api/approval/api'
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    data() {
      return {
        schoolId : sessionStorage.getItem("schoolId"),
        tableData: [],
        statusList :[{id:0,name:'全部'},{id:1,name:'审批中'},{id:2,name:'通过'},{id:3,name:'不通过'},{id:4,name:'退回'}],
        queryList :{status : 0,name:'', date:'',time:''},
        pageInfo : {total:0},
        curPage : 1,
        curPageSize : 10,
      }
    },
    methods: {
        //获取流程列表
        fetchData() {
            let params = this.queryList;
            params['page'] = this.curPage;
            params['limit'] = this.curPageSize;
            getApprovalList(params).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data;
                } else {
                  this.$message.error("获取流程数据失败！" + res.msg);
                }
            })
        },
        
        //获取流程列表
        fetchCount() {
            this.curPage = 1;
            getApprovalCount(this.queryList).then(res => {
                if (res.code === 200) {
                    this.pageInfo.total = res.data;
                    this.fetchData();
                } else {
                    this.$message.error("获取流程数据失败！" + res.msg);
                }
            })
        },
        
        //清除搜索条件
        initListQuery() {
            this.queryList = {status : 0, name:'', date:'',time:''}
        },
        
        //获取状态值
        getStatusText(status) {
            let text = '未知';
            for(let i in this.statusList) {
                if(status == this.statusList[i].id){
                    text = this.statusList[i].name;
                    break;
                }
            }
            return text;
        },
        
        handleSizeChange(size) {
            this.curPageSize = size;
            this.curPage = 1;
            this.fetchData();
        },
        handleCurrentChange(page) {
            this.curPage = page;
            this.fetchData();
        },
        goAddFinancePage() {
            this.$router.push('/finance/add/')
        },
        goDetailPage(row) {
            this.$router.push('/finance/detail/' + row.apply_id)
        },
        goEditPage(row) {
            this.$router.push('/approval/edit/' + row.apply_id + '/' + row.id)
        }
    },
    created() {
        this.fetchCount();
    }
  }
</script>
<style>
  .table-info{
      font-size: 14px;float:left;color:#666666;
  }
  .table-info span{
      color:#02B2B5
  }
</style>
