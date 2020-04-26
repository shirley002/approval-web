<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-block">
        <span>姓名：</span>
        <el-input size="small" v-model="listQuery.realName" @keyup.enter.native="fetchData(true)"/>
      </div>
      <div class="filter-block">
        <span>学号：</span>
        <el-input size="small" v-model="listQuery.studentNo" @keyup.enter.native="fetchData(true)"/>
      </div>
      <div class="filter-block">
        <span>学籍号：</span>
        <el-input size="small" v-model="listQuery.studentCode" @keyup.enter.native="fetchData(true)"/>
      </div>
      <div class="filter-block">
        <span>在校状态：</span>
        <el-select clearable size="small" v-model="listQuery.schoolStatus" placeholder="请选择" @change="fetchData(true)">
          <el-option v-for="item in dict.schoolStatus" :key="item.code" :label="item.label" :value="item.code"/>
        </el-select>
      </div>
      <div class="filter-block">
        <span>证件类型：</span>
        <el-select clearable size="small" v-model="listQuery.papersType" placeholder="请选择" @change="fetchData(true)">
          <el-option label="身份证" value="0"/>
          <el-option label="护照" value="1"/>
        </el-select>
      </div>
      <div class="filter-block">
        <span>证件号码：</span>
        <el-input size="small" v-model="listQuery.papersNumber" @keyup.enter.native="fetchData(true)"/>
      </div>
      <div class="filter-block">
        <span>所在班级：</span>
        <el-select clearable size="small" v-model="listQuery.officeId" placeholder="请选择" @change="fetchData(true)">
          <el-option v-for="item in classList" :key="item.id" :label="item.busiClass && item.busiClass.className ? item.busiClass.className : item.officeName" :value="item.id"/>
        </el-select>
      </div>

      <div class="filter-btn-area">
        <el-button size="small" type="primary" @click="fetchData(true)">查询</el-button>
        <el-button size="small" type="none" @click="initListQuery">清除</el-button>
      </div>

      <div class="ope-btn-area">
        <template v-if="permissions.indexOf('busi:student:add') !== -1">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="addNewStudent">新增</el-button>
        </template>
        <template v-if="permissions.indexOf('busi:student:import') !== -1">
          <el-button type="primary" size="small" icon="el-icon-download" @click="userImport">数据导入</el-button>
        </template>
      </div>
    </div>

    <el-table ref="form" :data="tableData"  border show-overflow-tooltip style="width: 100%">
      <el-table-column label="学号" prop="student.studentNo" align="center"/>
      <el-table-column label="学籍号" prop="student.studentCode" align="center"/>
      <el-table-column label="姓名" prop="realName" align="center"/>
      <el-table-column label="在校状态" prop="student.schoolStatus" align="center"/>
      <el-table-column label="所在班级" align="center">
        <template slot-scope="scope">
          {{Array.isArray(scope.row.classList) && scope.row.classList.length > 0 ? scope.row.classList[0].busiClass.className : ''}}
        </template>
      </el-table-column>
      <el-table-column label="证件类型" align="center">
        <template slot-scope="scope">
          {{scope.row.papersType === 0 ? "身份证" : scope.row.papersType === 1 ? "护照" : ""}}
        </template>
      </el-table-column>
      <el-table-column label="证件号码" align="center">
        <template slot-scope="scope">
          {{scope.row.papersType === 0 ? scope.row.idCard : scope.row.papersType === 1 ? scope.row.passport : ""}}
        </template>
      </el-table-column>

      <el-table-column label="入校时间" prop="student.inSchoolTime" align="center"/>
      <el-table-column label="学生来源" prop="student.source" align="center"/>

      <el-table-column
        label="操作"
        show-overflow-tooltip width="200" fixed="right">
        <template slot-scope="scope">
          <template v-if="permissions.indexOf('busi:student:edit') !== -1">
            <el-link type="primary" :underline="false" icon="el-icon-edit" @click="editStudent(scope.row)">编辑</el-link>
          </template>
          <el-link type="primary" :underline="false" icon="el-icon-edit" @click="editStudent(scope.row)">分配班级</el-link>
          <template v-if="scope.row.student.id">
            <template v-if="permissions.indexOf('busi:student:delete') !== -1">
              <el-link type="danger" :underline="false" icon="el-icon-edit" @click="deleteStudent(scope.row.student.id)">删除</el-link>
            </template>
          </template>
          <template v-else>
            <span>学生信息不全，请编辑补全</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageInfo.pageNum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageInfo.total">
    </el-pagination>
  </div>
</template>

<script>
  import {getStudentList, allClassList} from '@/api/api'
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
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        listQuery : {
          realName : '',
          studentNo : '',
          studentCode : '',
          schoolStatus : '',
          papersType : '',
          papersNumber : '',
          officeId : ''
        },

        //字典数据
        dict : {
          schoolStatus : [],
        },

        //班级列表
        classList : []
      }
    },

    methods: {
      getClassList() {
        allClassList().then(res => {
          if (res.code === 200) {
            this.classList = res.result || [];
          } else {
            this.$message.error("获取班级数据失败！" + res.message);
          }
        })
      },
      fetchData(initPageInfo) {
        if (initPageInfo) {
          this.pageInfo.pageNum = 1;
        }
        let param = {
          schoolId : this.schoolId,
          pageNum : this.pageInfo.pageNum,
          pageSize : this.pageInfo.pageSize,
          realName : this.listQuery.realName,
          studentNo : this.listQuery.studentNo,
          studentCode : this.listQuery.studentCode,
          schoolStatus : this.listQuery.schoolStatus,
          papersType : this.listQuery.papersType,
          papersNumber : this.listQuery.papersNumber,
          officeId : this.listQuery.officeId
        };

        getStudentList(param).then((res) => {
          if (res.code === 200) {
            this.tableData = res.result ? res.result.list || [] : [];
            this.pageInfo.total = res.result.total;
          } else {
            this.$message.error("获取学生数据失败！" + res.message);
          }
        })
      },
      handleSizeChange(val) {
        this.pageInfo.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.pageInfo.pageNum = val
        this.fetchData()
      },
    },
    created() {
      this.fetchData();
      this.getClassList();
    },
  }
</script>
