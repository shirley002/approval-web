<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-block">
        <span>流程名称：</span>
        <el-input size="small" v-model="queryList.name"></el-input>
        <span>状态：</span>
        <el-select clearable size="small" v-model="queryList.status" placeholder="请选择" @change="fetchData(true)">
          <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </div>

      <div class="filter-btn-area">
        <el-button type="primary" size="small" @click="fetchData(true)">查询</el-button>
        <el-button size="small" type="none" @click="initListQuery">清除</el-button>
      </div>

      <div class="ope-btn-area">
          <div class="table-info">总计<span>{{page.total}}</span>条，已发布<span>{{page.status1}}</span>条，已停用<span>{{page.status2}}</span>条</div>
          <el-tooltip content="功能即将更新，敬请期待" effect="light" placement="top">
            <el-button size="small" icon="el-icon-edit" style="margin-left: 10px;">新增</el-button>
          </el-tooltip>
      </div>
    </div>

    <el-table :data="tableData" border show-overflow-tooltip style="width: 100%">
      <el-table-column label="流程名称" prop="name" align="center" />
      <el-table-column label="排序" prop="sort" align="center"/>
      <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            {{getStatusText(scope.row.status)}}
          </template>
      </el-table-column>
      <el-table-column label="最后修改时间" prop="updated_at" align="center"/>
      <el-table-column
        label="操作"
        show-overflow-tooltip
        align="center">
          <template slot-scope="scope">
            <template v-if="permissions.indexOf('approval:setting:edit') !== -1">
                <el-link :underline="false" type="primary" @click='goEditPage(scope.row)'>编辑</el-link>
            </template>
            <template v-if="permissions.indexOf('approval:setting:switch') !== -1">
                <el-link :underline="false" v-if='scope.row.status == 1' type="danger" @click='switchOnOffConfirm(scope.row)'>停用</el-link>
                <el-link :underline="false" v-else type="primary" @click='switchOnOff(scope.row)'>启用</el-link>
            </template>
          </template>
      </el-table-column>
    </el-table>

    
  </div>

</template>

<script>
  import {getFlowList,switchOnOff} from '@/api/approval/api'
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
        statusList :[{id:0,name:'全部'},{id:1,name:'已发布'},{id:2,name:'已停用'}],
        queryList :{status : 0,name:''},
        page : {total:0, status1:0, status2:0}
      }
    },
    methods: {
        //获取流程列表
        fetchData() {
            getFlowList(this.queryList).then(res => {
                if (res.code === 200) {
                    this.tableData = res.data;
                    this.page = res.page;
                } else {
                  this.$message.error("获取流程数据失败！" + res.msg);
                }
            })
        },
        
        //清除搜索条件
        initListQuery() {
            this.queryList = {status : 0,name:''}
        },
        
        //获取状态值
        getStatusText(status) {
            let text = '未知';
            if(status == 1) {
                text = '已发布';
            } else if(status == 2) {
                text = '已停用';
            }
            return text;
        },
        
        //启用/停用流程确认
        switchOnOffConfirm(row) {
            this.$confirm('停用后，所有相关业务均无法进行，是否确认停用？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.switchOnOff(row);
            }).catch(() => {

            });
        },
        switchOnOff(row) {
            switchOnOff({id:row.id,action:(row.status == 1 ? 'off' : 'on')}).then(res => {
                if (res.code == 200) {
                    this.$message.success(res.msg);
                    this.fetchData(); 
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        
        //跳转编辑页
        goEditPage(row) {
            this.$router.push('/flow/edit/' + row.id)
        }
    },
    created() {
        this.fetchData();
    }
  }
</script>
<style>
  .width-300{
    width: 300px;
  }
  .table-info{
      font-size: 14px;float:left;color:#666666;
  }
  .table-info span{
      color:#02B2B5
  }
</style>
