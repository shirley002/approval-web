<template>
    <div>
        <div class="app-container" style="padding-bottom: 10px;">
            <div class="filter-container">
              <div class="filter-block">
                <span>管辖范围：</span>
                <el-select clearable size="small" @change="queryChange" v-model="queryList.office_id" placeholder="请选择">
                    <el-option v-for="item in officeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                <span>日期区间：</span>
                <el-date-picker
                    style="width:350px"
                    class="search-time"
                    v-model="queryList.date"
                    @change="queryChange"
                    type="daterange"
                    size="small"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
              </div>
            </div>
        </div>
        <div class="dashborad">
            <el-row>
                <el-col :span="9">
                    <div class="dashborad-item" style="height:500px">
                        <div class="header clearfix">
                            <div class="title l">流程类型统计</div>
                            <div class="total r" style="font-size:16px">共计<span>{{typeTotal}}</span>条申请记录</div>
                        </div>
                        <div class="drawing">
                            <ECharts :autoresize=true style="width:100%;" :options="typeOption"></ECharts>
                        </div>
                    </div>
                </el-col>
                <el-col :span="15">
                    <div class="dashborad-item" style="height:500px">
                        <el-table :data="tableData" style="margin:20px 0 10px;min-width: 550px" border show-overflow-tooltip>
                            <el-table-column label="类型" prop="name" align="center" />
                            <el-table-column label="申请数量" align="center">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row.total == 0 ? '#999999' : '#02b2b5'}">{{scope.row.total}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="审批中" align="center">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row['1'] == 0 ? '#999999' : '#02b2b5'}">{{scope.row['1']}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="审批通过" align="center">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row['2'] == 0 ? '#999999' : '#02b2b5'}">{{scope.row['2']}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="审批退回" align="center">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row['4'] == 0 ? '#999999' : '#02b2b5'}">{{scope.row['4']}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="审批不通过" align="center">
                                <template slot-scope="scope">
                                    <span :style="{color:scope.row['3'] == 0 ? '#999999' : '#02b2b5'}">{{scope.row['3']}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
            <el-row >
                <el-col :span="6">
                    <div class="dashborad-item" style="margin-bottom:10px;">
                        <div class="header clearfix">
                            <div class="title">教职工请假</div>
                            <div class="total">共计<span>{{teacherLeaveTotal}}</span>条申请记录</div>
                        </div>
                        <div class="drawing" style="height:300px;">
                            <ECharts :autoresize=true style="width:100%;height:100%" :options="teacherLeaveOption"></ECharts>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="dashborad-item">
                        <div class="header clearfix">
                            <div class="title">学生请假</div>
                            <div class="total">共计<span>{{studentLeaveTotal}}</span>条申请记录</div>
                        </div>
                        <div class="drawing" style="height:300px;">
                            <ECharts :autoresize=true style="width:100%;height:100%" :options="studentLeaveOption"></ECharts>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="dashborad-item">
                        <div class="header clearfix">
                            <div class="title">物品领用</div>
                            <div class="total">共计<span>{{materialBorrowTotal}}</span>条申请记录</div>
                        </div>
                        <div class="drawing" style="height:300px;">
                            
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="dashborad-item">
                        <div class="header clearfix">
                            <div class="title">报修</div>
                            <div class="total">共计<span>{{warrantyTotal}}</span>条申请记录</div>
                        </div>
                        <div class="drawing" style="height:300px;">
                            
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
  import {getDashboradAll,getAccessOffice,getDashboradLeave} from '@/api/approval/api'
  import {deepCopy} from '@/utils/approval'
  import ECharts from 'vue-echarts'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legend'
  import {mapGetters} from 'vuex'
  export default {
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    components: {
        ECharts
    },
    data() {
      return {
        schoolId : sessionStorage.getItem("schoolId"),
        queryList:{date : '', office_id : ''},
        officeList: [],
        tableData :[],
        defaultOption : {
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
//            legend: {
//                orient: 'vertical',
//                x: 'left',
//                data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
//            },
            color:['#ff9157','#f8d63e','#04b6bd','#35ebeb','#28d6e1','#4dddbf','#7feea9','#3c96e9','#aaa2fd','#ed57a1','#fe885c'],
            series: [
                {
                    name:'',
                    type:'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '24',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[]
                }
            ]},
        typeOption : {},
        typeTotal : 0,
        teacherLeaveOption : {},
        teacherLeaveTotal : 0,
        studentLeaveOption : {},
        studentLeaveTotal : 0,
        materialBorrowOption : {},
        materialBorrowTotal : 0,
        warrantyOption : {},
        warrantyTotal : 0
      }
    },
    methods: {
        getMainData() {
            getDashboradAll(this.queryList).then(res => {
                if(res.code == 200) {
                    this.tableData = res.data;
                    this.typeTotal = 0;
                    let typeData = [];
                    let legendData = [];
                    for(let i in res.data) {
                        typeData.push({name:res.data[i]['name'],value:res.data[i]['total']});
                        this.typeTotal += res.data[i]['total'];
                        legendData.push({name:res.data[i]['name'], icon:'circle'})
                    }
                    this.typeOption = deepCopy(this.defaultOption);
                    this.typeOption.series[0].data = typeData;
                    this.typeOption.legend = {
                        data:legendData,
                        bottom:0
                    }
                } else {
                    this.$message.error(res.msg);
                }
            })
        }, 
        getleaveData() {
            getDashboradLeave(this.queryList).then(res => {
                if(res.code == 200) {
                    this.teacherLeaveTotal = res.data.total.teacher;
                    this.studentLeaveTotal = res.data.total.student;
                    
                    this.teacherLeaveOption = deepCopy(this.defaultOption);
                    let data = [];
                    for(let i in res.data.teacher) {
                        data.push(res.data.teacher[i]);
                    }
                    this.teacherLeaveOption.series[0].data = data;
                    
                    this.studentLeaveOption = deepCopy(this.defaultOption);
                    data = []
                    for(let i in res.data.student) {
                        data.push(res.data.student[i]);
                    }
                    this.studentLeaveOption.series[0].data = data;
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        getAccessOffice() {
            getAccessOffice().then(res => {
                if(res.code == 200) {
                    this.officeList = res.data;
                    this.getMainData();
                    this.getleaveData();
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        queryChange() {
            this.getMainData();
            this.getleaveData()
        }
    },
    created() {
       this.getAccessOffice();
    }
  }
</script>
<style>
    .dashborad{width:calc(100% + 56px);margin-left: -28px;background: #e6eaef}
    .dashborad-item{margin:10px 10px 0 0;background: #FFFFFF;padding: 20px 28px;}
    .dashborad-item .header{text-align: center}
    .dashborad-item .header .title{font-size: 16px;color:#333333;margin-bottom:5px}
    .dashborad-item .header .total{font-size:14px;color:#999999}
    .dashborad-item .header .l{float:left}
    .dashborad-item .header .r{float:right}
    .dashborad-item .header .total span{color:#02b2b5}
</style>
