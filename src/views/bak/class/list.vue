<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="filter-block">
        <span>年级：</span>
        <el-select clearable size="small" v-model="listQuery.distanceYear" placeholder="请选择" @change="fetchData(true)">
          <el-option v-for="item in gradeOptionList" :key="item.distanceYear" :label="item.name" :value="item.distanceYear">
          </el-option>
        </el-select>
      </div>

      <div class="filter-btn-area">
        <el-button type="primary" size="small" @click="fetchData(true)">查询</el-button>
        <el-button size="small" type="none" @click="initListQuery">清除</el-button>
      </div>

      <div class="ope-btn-area">
        <template v-if="permissions.indexOf('busi:class:add') !== -1">
          <el-button size="small" type="primary" icon="el-icon-edit" style="margin-left: 10px;" @click="addNewClass">新增</el-button>
        </template>
        <template v-if="permissions.indexOf('busi:class:import') !== -1">
          <el-button size="small" type="primary" icon="el-icon-download" @click="classImport">数据导入</el-button>
        </template>
        <template v-if="permissions.indexOf('busi:class:export') !== -1">
          <el-button size="small" type="primary" icon="el-icon-upload2" @click="classExport">数据导出</el-button>
        </template>
      </div>
    </div>

    <el-table :data="tableData" border show-overflow-tooltip style="width: 100%">
      <el-table-column label="班级名称" align="center">
        <template slot-scope="scope">
          <span class="link" @click="previewClass(scope.row)">{{scope.row.busiClass.className}}</span>
        </template>
      </el-table-column>
      <el-table-column label="年级" prop="busiClass.gradeName" align="center"/>
      <el-table-column label="别名" prop="busiClass.alias" align="center"/>
      <el-table-column label="所属届" prop="busiClass.grade" align="center"/>
      <el-table-column label="班号" prop="busiClass.classCode" align="center"/>
      <el-table-column label="学生数量" prop="studentCount" align="center"/>
      <el-table-column label="班主任" align="center">
        <template slot-scope="scope">
          <div class="align-left">班主任：{{scope.row.headTeacher ? scope.row.headTeacher.realName || '' : ''}}</div>
          <div class="align-left">副班主任：{{scope.row.deputyHeadTeacher ? scope.row.deputyHeadTeacher.realName || '' : ''}}
            {{scope.row.deputyHeadTeacher && scope.row.deputyHeadTeacher2 ? '、' : ''}}
            {{scope.row.deputyHeadTeacher2 ? scope.row.deputyHeadTeacher2.realName || '' : ''}}</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip
        align="center"
        width="260">
        <template slot-scope="scope">
          <div class="table-ope-btn-around">
            <template v-if="permissions.indexOf('busi:class:edit') !== -1">
              <el-link type="primary" :underline="false" icon="el-icon-edit" @click="editClass(scope.row)">编辑</el-link>
            </template>
            <el-link type="primary" :underline="false" icon="el-icon-edit" @click="editHeadTeacher(scope.row)">设置班主任</el-link>
            <template v-if="scope.row.busiClass.id">
              <template v-if="permissions.indexOf('busi:class:delete') !== -1">
                <el-link type="danger" :underline="false" @click="deleteClass(scope.row.id)">删除</el-link>
              </template>
            </template>
            <template v-else>
              <span>班级信息不全，请编辑补全</span>
            </template>
          </div>
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

    <!--编辑班级弹框-->
    <el-dialog
      :title="editClassData.title"
      :visible.sync="editClassData.dialog"
      width="500px"
      center
      :before-close="editClassCancel">
      <el-form :model="editClassData.form" :rules="editClassRules" ref="editClassForm"
               label-position="left" label-width="88px" size="small" style="width: 360px;margin: auto;">
        <el-form-item label="班级名称：" required>
          <div>{{(editClassData.form.gradeOption ? editClassData.form.gradeOption.name : "") + (editClassData.form.classCode ? "（" + editClassData.form.classCode.trim() + "）班" : "")}}</div>
        </el-form-item>
        <el-form-item label="年级：" prop="distanceYear">
          <el-select  v-model="editClassData.form.distanceYear" style="width: 100%;" placeholder="请选择" @change="gradeSelChange">
            <el-option v-for="item in gradeOptionList" :key="item.distanceYear" :label="item.name" :value="item.distanceYear"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班号：" prop="classCode">
          <el-input v-model="editClassData.form.classCode"></el-input>
        </el-form-item>
        <el-form-item label="别名：" prop="alias">
          <el-input v-model="editClassData.form.alias"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea"  v-model="editClassData.form.remark" :rows="4" placeholder="最多100字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="editClassConfirm">确 定</el-button>
        <el-button @click="editClassCancel">取 消</el-button>
      </span>
    </el-dialog>

    <!--班级详情弹框-->
    <el-dialog
      title="班级详情"
      :visible.sync="previewData.dialog"
      width="500px"
      center
      :before-close="previewCancel">
      <div>
        <div>
          <label class="ele-form-label">班级名称：</label>
          <div class="ele-form-content">{{previewData.item.busiClass.className}}</div>
        </div>
        <div>
          <label class="ele-form-label">年级：</label>
          <div class="ele-form-content">{{previewData.item.busiClass.gradeName}}</div>
        </div>
        <div>
          <label class="ele-form-label">班号：</label>
          <div class="ele-form-content">{{previewData.item.busiClass.classCode}}</div>
        </div>
        <div>
          <label class="ele-form-label">别名：</label>
          <div class="ele-form-content">{{previewData.item.busiClass.alias}}</div>
        </div>
        <div>
          <label class="ele-form-label">班主任：</label>
          <div class="ele-form-content" style="line-height: 20px;margin-top: 10px;">
            <div class="align-left">班主任：{{previewData.item.headTeacher ? previewData.item.headTeacher.realName || '' : ''}}</div>
            <div class="align-left">副班主任：{{previewData.item.deputyHeadTeacher ? previewData.item.deputyHeadTeacher.realName || '' : ''}}
              {{previewData.item.deputyHeadTeacher && previewData.item.deputyHeadTeacher2 ? '、' : ''}}
              {{previewData.item.deputyHeadTeacher2 ? previewData.item.deputyHeadTeacher2.realName || '' : ''}}</div>
          </div>
        </div>
        <div>
          <label class="ele-form-label">学生数量：</label>
          <div class="ele-form-content">{{previewData.item.studentCount}}</div>
        </div>
        <div>
          <label class="ele-form-label">备注：</label>
          <div class="ele-form-content">{{previewData.item.remark}}</div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="previewCancel">关 闭</el-button>
      </span>
    </el-dialog>


    <!--设置班主任弹框-->
    <el-dialog
      title="设置班主任"
      :visible.sync="editHeadTeacherData.dialog"
      width="500px"
      center
      :before-close="editHeadTeacherCancel">
      <el-form :model="editHeadTeacherData.form" :rules="editHeadTeacherRules" ref="editHeadTeacherForm"
               label-position="left" label-width="110px" size="small" style="width: 360px;margin: auto;">
        <el-form-item label="班主任：" prop="headTeacher">
          <el-select  v-model="editHeadTeacherData.form.headTeacher" style="width: 100%;" placeholder="请选择（搜索）" filterable>
            <el-option v-for="item in staffList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="副班主任一：" prop="deputyHeadTeacher">
          <el-select  v-model="editHeadTeacherData.form.deputyHeadTeacher" style="width: 100%;" placeholder="请选择（搜索）" filterable clearable>
            <el-option v-for="item in staffList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="副班主任二：" prop="deputyHeadTeacher2">
          <el-select  v-model="editHeadTeacherData.form.deputyHeadTeacher2" style="width: 100%;" placeholder="请选择（搜索）" filterable clearable>
            <el-option v-for="item in staffList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="editHeadTeacherConfirm">确 定</el-button>
        <el-button @click="editHeadTeacherCancel">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="学生导入" :visible.sync="classImportDialog">
      <div style="width: 500px;margin: auto;height: 200px;">
        <div class="el-form-item">
          <label class="ele-form-label">下载模板：</label>
          <div class="ele-form-content"><a :href="classImportTemplateUrl" target="_blank" style="color: #409eff;">班级导入模板.xlsx</a> </div>
        </div>

        <div class="el-form-item">
          <label class="ele-form-label">上传文件：</label>
          <div class="ele-form-content">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="importClassUrl"
              :data="{schoolToken : schoolId, schoolId : schoolId, platform : 'bms'}"
              :before-upload="beforeUpload"
              :on-success="handleUploadSuccess"
              :file-list="importFileList"
              :on-change="fineListChange"
              :with-credentials="true"
              :auto-upload="false">
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">开始上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传xls、xlsx文件，且不超过2MB</div>
            </el-upload>
          </div>
        </div>
      </div>
      <el-dialog
        width="30%"
        title="上传文件内容有误"
        :visible.sync="importValidateErrorDialog"
        append-to-body>
        <span>上传的excel内容有问题，请点击链接<a :href="validateFileUrl" download="校验结果.xlsx" style="color: #409eff;">校验结果</a>下载错误提示！</span>
      </el-dialog>
    </el-dialog>
  </div>

</template>

<script>
  import {getClassOptionList, saveOrUpdateClass, classList, deleteClass, staffList, updateHeadTeacher} from '@/api/api'
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
          distanceYear : ''
        },
        gradeOptionList : [],

        editClassRules : {
          distanceYear : [
            { required: true, message: '请选择班级', trigger: 'blur' }
          ],
          classCode: [
            { required: true, message: '请输入班号', trigger: 'blur' }
          ],
          alias: [
            { max: 50, message: '最多 50 个字符', trigger: 'blur' }
          ],
          remark: [
            { max: 100, message: '最多 100 个字符', trigger: 'blur' }
          ]
        },

        editClassData : {
          dialog : false,
          title : '',
          form : {
            id : '',
            distanceYear : '',
            classCode : '',
            remark : '',
            gradeOption : '',
            officeId : '',
            alias : ''
          }
        },


        staffList : [],

        editHeadTeacherRules : {
          headTeacher : [
            { required: true, message: '请选择班主任', trigger: 'blur' }
          ]
        },
        editHeadTeacherData : {
          dialog : false,
          form : {
            officeId : '',
            headTeacher : '',
            deputyHeadTeacher : '',
            deputyHeadTeacher2 : ''
          }
        },

        previewData : {
          dialog : false,
          item : {
            busiClass : {}
          }
        },

        classImportDialog : false,
        importFileList : [],
        classImportTemplateUrl : process.env.VUE_APP_BASE_API + "/busi/class/importTemplate",
        importClassUrl : process.env.VUE_APP_BASE_API + "/busi/class/import",
        importValidateErrorDialog : false,
        validateFileUrl : "",
        exportUrl : process.env.VUE_APP_BASE_API + "/busi/class/export"
      }
    },

    methods: {
      previewClass(item) {
        this.previewData.item = item;
        this.previewData.dialog = true;
      },
      previewCancel() {
        this.previewData.dialog = false;
      },
      /**   设置班主任  **/
      editHeadTeacher(item) {
        this.getStaffList();
        this.initEditClassData();
        this.editHeadTeacherData.form.officeId = item.id;
        this.editHeadTeacherData.form.headTeacher = item.headTeacher ? item.headTeacher.id : '';
        this.editHeadTeacherData.form.deputyHeadTeacher = item.deputyHeadTeacher ? item.deputyHeadTeacher.id : '';
        this.editHeadTeacherData.form.deputyHeadTeacher2 = item.deputyHeadTeacher2 ? item.deputyHeadTeacher2.id : '';
        this.editHeadTeacherData.dialog = true;
      },
      initEditHeadTeacherData() {
        this.editHeadTeacherData = {
          dialog : false,
          form : {
            officeId : '',
            headTeacher : '',
            deputyHeadTeacher : '',
            deputyHeadTeacher2 : ''
          }
        };
      },
      editHeadTeacherCancel() {
        this.editHeadTeacherData.dialog = false;
        this.$refs.editHeadTeacherForm.clearValidate();
        setTimeout(this.initEditHeadTeacherData, 1000);
        // this.initEditHeadTeacherData();
      },
      editHeadTeacherConfirm() {
        this.$refs.editHeadTeacherForm.validate(valid => {
          if (valid) {
            let params = {
              schoolId : this.schoolId,
              officeId : this.editHeadTeacherData.form.officeId,
              headTeacher : this.editHeadTeacherData.form.headTeacher,
              deputyHeadTeacher : this.editHeadTeacherData.form.deputyHeadTeacher,
              deputyHeadTeacher2 : this.editHeadTeacherData.form.deputyHeadTeacher2
            }
            updateHeadTeacher(params).then(res => {
              if (res.code === 200) {
                this.$message.success("设置成功！")
                this.editHeadTeacherCancel();
                this.fetchData();
              } else {
                this.$message.error("设置失败！" + res.message);
              }
            })

          }
        });
      },
      /**   设置班主任 end  **/

      getStaffList() {
        staffList().then(res => {
          if (res.code === 200) {
            this.staffList = res.result || [];
          } else {
            this.$message.error("获取教职工信息失败！" + res.message);
          }
        })
      },

      /**   编辑班级信息  **/
      initEditClassData() {
        this.editClassData = {
          dialog : false,
          title : '',
          form : {
            id : '',
            distanceYear : '',
            classCode : '',
            remark : '',
            gradeOption : '',
            officeId : '',
            alias : ''
          }
        }
      },

      editClassCancel() {
        this.editClassData.dialog = false;
        this.$refs.editClassForm.clearValidate();
        setTimeout(this.initEditClassData, 1000);
      },

      //编辑班级信息
      editClass(item) {
        this.initEditClassData();
        this.editClassData.form.id = item.busiClass.id;
        this.editClassData.form.officeId = item.id;
        this.editClassData.form.classCode = item.busiClass.classCode;
        this.editClassData.form.distanceYear = item.busiClass.distanceYear;
        this.editClassData.form.remark = item.busiClass.remark;
        this.editClassData.form.alias = item.busiClass.alias;
        this.gradeSelChange();
        this.editClassData.title = "修改班级";
        this.editClassData.dialog = true;
      },
      //新增或更新班级信息
      editClassConfirm() {
        this.$refs.editClassForm.validate(valid => {
          if (valid) {
            let params = {
              schoolId : this.schoolId,
              id : this.editClassData.form.id,
              officeId : this.editClassData.form.officeId,
              alias : this.editClassData.form.alias,
              classCode : this.editClassData.form.classCode,
              distanceYear : this.editClassData.form.distanceYear,
              remark : this.editClassData.form.remark
            }
            saveOrUpdateClass(params).then(res => {
              if (res.code === 200) {
                this.$message.success("保存成功！");
                this.editClassCancel();
                this.fetchData();
              } else {
                this.$message.error("保存失败！" + res.message);
              }
            })
          }
        });
      },
      gradeSelChange() {
        if (this.gradeOptionList && this.gradeOptionList.length && this.gradeOptionList.length > 0) {
          for (let i = 0; i < this.gradeOptionList.length; i ++) {
            if (this.gradeOptionList[i].distanceYear === this.editClassData.form.distanceYear) {
              this.editClassData.form.gradeOption = this.gradeOptionList[i];
              break;
            }
          }
        }
      },
      //添加新的班级信息
      addNewClass() {
        this.initEditClassData();
        this.editClassData.title = "添加班级";
        this.editClassData.dialog = true;
      },
      //获取班级备选信息
      getClassOptionList() {
        getClassOptionList().then(res => {
          if (res.code === 200) {
            if (res.result && res.result.length && res.result.length > 0) {
              this.gradeOptionList = res.result;
            } else {
              this.$alert('学校还未维护年级选项信息，请联系华育技术支持进行初始化！', '提示', {
                confirmButtonText: '我知道了',
              });
            }
          } else {
            this.$message.error("获取年级选项列表失败！" + res.message);
          }
        });
      },
      /**   编辑班级信息 end  **/

      deleteClass(officeId) {
        this.$confirm('确定删除此班级?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteClass({officeId : officeId}).then(res => {
            if (res.code === 200) {
              this.$message.success("删除成功！");
              this.fetchData(true);
            } else {
              this.$message.error("删除失败！" + res.message);
            }
          })
        }).catch(() => {
        });

      },

      classExport() {
        let url = this.exportUrl + "?schoolToken=" + this.schoolId + "&schoolId=" + this.schoolId + "&platform=bms";
        url += "&distanceYear=" + this.listQuery.distanceYear;
        window.open(url);
      },
      fineListChange(file, fileList) {
        this.importFileList = [];
        this.importFileList.push(file);
      },
      handleUploadSuccess(res, file) {
        if (res.code === 200) {
          this.$message.success("上传成功！");
          this.classImportDialog = false;
          this.fetchData();
        } else if (res.code === 5001) {
          this.importValidateErrorDialog = true;
          this.validateFileUrl = res.result;
        } else {
          this.$message.error(res.message);
        }
      },
      beforeUpload(file) {
        const isExcel = file.name.indexOf(".xls") !== -1 || file.name.indexOf(".xlsx");
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isExcel) {
          this.$message.error('只能上传xls、xlsx文件!');
          return false;
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 2MB!');
          return false;
        }
        return true;
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      classImport() {
        this.importFileList = [];
        this.classImportDialog = true;
      },

      initListQuery() {
        this.listQuery = {
          distanceYear : ""
        };
        this.fetchData(true);
      },
      fetchData(initPageInfo) {
        if (initPageInfo) {
          this.pageInfo.pageNum = 1;
        }
        let param = {
          pageNum : this.pageInfo.pageNum,
          pageSize : this.pageInfo.pageSize,
          distanceYear: this.listQuery.distanceYear
        };
        classList(param).then(res => {
          if (res.code === 200) {
            if (res.result) {
              this.tableData = res.result && res.result.list ? res.result.list : [];
              this.pageInfo.total = res.result.total;
            }
          } else {
            this.$message.error("获取班级数据失败！" + res.message);
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
      this.getClassOptionList();
      this.fetchData()
    },
  }
</script>
<style>
  .width-300{
    width: 300px;
  }
</style>
