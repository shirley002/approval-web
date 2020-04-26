<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-block">
        <span>名称：</span>
        <el-input size="small" v-model="queryList.name"></el-input>
        <span>日期区间：</span>
        <el-date-picker
            class="search-time"
            v-model="queryList.date"
            type="daterange"
            size="small"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
        <span>时间区间：</span>
        <el-time-picker
            class="search-time"
            is-range
            v-model="queryList.time"
            size="small"
            value-format="HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
        </el-time-picker>
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
          <div class="table-info">总计<span>{{pageInfo.total}}</span>条，审批中<span>{{pageInfo.status1}}</span>条，
              审批通过<span>{{pageInfo.status2}}</span>条，审批不通过<span>{{pageInfo.status3}}</span>条，审批退回<span>{{pageInfo.status4}}</span>条</div>
          <el-button href="/finance/add/" @click="goAddFinancePage" size="small" icon="el-icon-edit" style="margin-left: 10px;">添加</el-button>
      </div>
    </div>

    <el-table :data="tableData" border show-overflow-tooltip style="width: 100%">
      <el-table-column label="名称" prop="searchable" align="center" />
      <el-table-column label="上报时间" prop="created_at" align="center"/>
      <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{getStatusText(scope.row.status)}}
          </template>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip
        align="center">
          <template slot-scope="scope">
            <el-link :underline="false" v-if='scope.row.status == 4' type="primary" @click='goEditPage(scope.row)'>编辑</el-link>
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
  import {getFinanceList,getFinanceCount} from '@/api/approval/api'
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
        pageInfo : {total:0, status1:0, status2:0, status3:0, status4:0},
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
            getFinanceList(params).then(res => {
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
            getFinanceCount(this.queryList).then(res => {
                if (res.code === 200) {
                    Object.assign(this.pageInfo, res.data);
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
            this.$router.push('/finance/detail/' + row.id)
        },
        goEditPage(row) {
            this.$router.push('/finance/edit/' + row.id)
        }
    },
    created() {
        this.fetchCount();
    }
  }
</script>
<style>
  .filter-container .filter-block > div.search-time{width:300px}
  .filter-container .filter-block > div.search-time span{text-align: center;min-width: 30px}
  
  .table-info{
      font-size: 14px;float:left;color:#666666;
  }
  .table-info span{
      color:#02B2B5
  }
</style>
