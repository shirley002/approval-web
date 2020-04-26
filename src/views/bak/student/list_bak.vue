<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input style="width: 200px;" class="filter-item" placeholder="学生姓名" v-model="listQuery.realName" @keyup.enter.native="fetchData">
      </el-input>
      <el-input class="filter-item width-200" placeholder="学号" v-model="listQuery.studentNo" @keyup.enter.native="fetchData">
      </el-input>
      <el-input class="filter-item width-200" placeholder="身份证" v-model="listQuery.idCard" @keyup.enter.native="fetchData">
      </el-input>
      <el-select clearable class="filter-item" style="width: 200px" v-model="listQuery.distanceYear" placeholder="年级" @change="gradeChanged">
        <el-option v-for="item in gradeOption" :key="item.distanceYear" :label="item.name" :value="item.distanceYear">
        </el-option>
      </el-select>
      <el-select clearable class="filter-item" style="width: 200px" v-model="listQuery.classCode" placeholder="班号" @change="fetchData">
        <el-option v-for="item in classCodeOption" :key="item.classCode" :label="'（' + item.classCode + '）班'" :value="item.classCode">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-remove-outline" @click="initListQuery">清除</el-button>

      <template v-if="permissions.indexOf('busi:student:add') !== -1">
        <el-button class="filter-item"  type="primary" icon="el-icon-edit" style="margin-left: 10px;" @click="addNewStudent">新增</el-button>
      </template>
      <template v-if="permissions.indexOf('busi:student:import') !== -1">
        <el-button class="filter-item"  type="primary" icon="el-icon-download" @click="userImport">数据导入</el-button>
      </template>
      <!--<el-button class="filter-item"  type="primary" icon="el-icon-upload2" @click="userExport">数据导出</el-button>-->
    </div>

    <el-table ref="form" :data="tableData"  border fit highlight-current-row
              style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label="学生照片：" style="float: left;width: 25%;" v-if="scope.row.student.photo">
              <div>
                <img :src="scope.row.student.photo" style="height: 160px;width: 135px;">
              </div>
            </el-form-item>
            <el-form-item label="姓名：">
              <span>{{ scope.row.realName }}</span>
            </el-form-item>
            <el-form-item label="性别：">
              <span>{{ scope.row.sex === 0 ? "男" : scope.row.sex === 1 ? "女" : "未知"}}</span>
            </el-form-item>
            <el-form-item label="学号：">
              <span>{{ scope.row.student.studentNo }}</span>
            </el-form-item>
            <el-form-item label="班级：">
              <span class="class-item" v-for="item in scope.row.classList">
                {{item.busiClass.className}}
              </span>
            </el-form-item>
            <el-form-item label="学籍号：">
              <span>{{ scope.row.student.studentCode }}</span>
            </el-form-item>
            <el-form-item label="入学年度：">
              <span>{{ formatEnrolmentYear(scope.row) }}</span>
            </el-form-item>
            <el-form-item label="入校时间：">
              <span>{{ formatInSchoolTime(scope.row) }}</span>
            </el-form-item>
            <el-form-item label="在校状态：">
              <span>{{formatSchoolStatus(scope.row)}}</span>
            </el-form-item>
            <el-form-item label="学生来源：">
              <span>{{formatSource(scope.row)}}</span>
            </el-form-item>
            <el-form-item label="独生子女：">
              <span>{{scope.row.student.isOneChild == 1 ? "是" : "否"}}</span>
            </el-form-item>
            <el-form-item label="家庭收入：">
              <span>{{scope.row.student.familySalary}}</span>
            </el-form-item>

            <el-form-item label="用户名：">
              <span>{{ scope.row.username }}</span>
            </el-form-item>
            <el-form-item label="曾用名：">
              <span>{{ scope.row.oldName }}</span>
            </el-form-item>
            <el-form-item label="出生日期：">
              <span>{{ scope.row.birthday && scope.row.birthday.trim() !== '' ? scope.row.birthday.substring(0, scope.row.birthday.indexOf(" ")) : ''}}</span>
            </el-form-item>
            <el-form-item label="国籍：">
              <span>{{ formatNationality(scope.row) }}</span>
            </el-form-item>
            <el-form-item label="民族：">
              <span>{{ formatNation(scope.row) }}</span>
            </el-form-item>
            <el-form-item label="政治面貌：">
              <span>{{ scope.row.politicalOutlook }}</span>
            </el-form-item>
            <el-form-item label="证件类型：">
              <span>{{ scope.row.papersType === 0 ? "身份证" : scope.row.papersType === 1 ? "护照" : ""}}</span>
            </el-form-item>
            <el-form-item label="证件号码：">
              <span>{{ scope.row.papersType === 0 ? scope.row.idCard : scope.row.papersType === 1 ? scope.row.passport : ""}}</span>
            </el-form-item>
            <el-form-item label="地址：">
              <span>{{ scope.row.address }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名">
        <template slot-scope="scope">
          <span class="link-color">{{scope.row.realName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 0 ? "男" : scope.row.sex === 1 ? "女" : "未知"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号">
        <template slot-scope="scope">
          <span>{{scope.row.student.studentNo}}</span>
        </template>
      </el-table-column>
      <el-table-column label="学籍号">
        <template slot-scope="scope">
          <span>{{scope.row.student.studentCode}}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件类型">
        <template slot-scope="scope">
          <span>{{scope.row.papersType === 0 ? "身份证" : scope.row.papersType === 1 ? "护照" : ""}}</span>
        </template>
      </el-table-column>
      <el-table-column label="证件号码">
        <template slot-scope="scope">
          <span>{{scope.row.papersType === 0 ? scope.row.idCard : scope.row.papersType === 1 ? scope.row.passport : ""}}</span>
        </template>
      </el-table-column>
      <el-table-column label="入校时间" :formatter="formatInSchoolTime">
      </el-table-column>
      <el-table-column label="独生子女">
        <template slot-scope="scope">
          <span>{{scope.row.student.isOneChild == 1 ? "是" : "否"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="在校状态" :formatter="formatSchoolStatus">
      </el-table-column>
      <el-table-column label="学生来源" :formatter="formatSource">
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip width="200" fixed="right">
        <template slot-scope="scope">
          <template v-if="permissions.indexOf('busi:student:edit') !== -1">
            <el-button type="primary" size="small" @click="editStudent(scope.row)">编辑</el-button>
          </template>
          <template v-if="scope.row.student.id">
            <template v-if="permissions.indexOf('busi:student:enableDisable') !== -1">
              <el-button type="success" v-if="scope.row.student.status === 1" size="small" @click="changeStatus(scope.row.student.id, 2)">停用</el-button>
              <el-button type="warning" v-if="scope.row.student.status === 2" size="small" @click="changeStatus(scope.row.student.id, 1)">启用</el-button>
            </template>
            <template v-if="permissions.indexOf('busi:student:delete') !== -1">
              <el-button type="danger" size="small" @click="deleteStudent(scope.row.student.id)">删除</el-button>
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

    <el-dialog v-el-drag-dialog title="学生导入" :visible.sync="studentImportDialog">
      <div style="width: 500px;margin: auto;height: 200px;">
        <div class="el-form-item">
          <label class="ele-form-label">下载模板：</label>
          <div class="ele-form-content"><a :href="studentImportTemplateUrl" target="_blank" style="color: #409eff;">学生导入模板.xlsx</a> </div>
        </div>

        <div class="el-form-item">
          <label class="ele-form-label">上传文件：</label>
          <div class="ele-form-content">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="importStudentUrl"
              :data="{schoolToken : schoolId, platform : 'bms'}"
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

    <el-dialog v-el-drag-dialog width="800px" :title="(studentOpeType === 0 ? '添加' : '更新') + '学生'" :visible.sync="editStudentDialog">
      <el-form :model="editForm"  ref="editForm" :rules="editFormRules" label-width="140px" style="overflow: auto;max-height: 60vh;">
        <div style="width: 650px;">
          <div style="overflow: auto;">
            <div class="left">
              <el-form-item label="照片：">
                <div class="width-185">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadImgUrl"
                    :show-file-list="false"
                    :data="{code : 2, schoolId : schoolId, platform : 'bms'}"
                    :on-success="handlePhotoSuccess"
                    :before-upload="beforePhotoUpload"
                    with-credentials>
                    <img v-if="editForm.photo" :src="editForm.photo" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-form-item>
            </div>
            <div class="left">
              <el-form-item label="姓名：" prop="realName">
                <el-input v-model="editForm.realName" class="width-185"></el-input>
              </el-form-item>
              <el-form-item label="曾用名：" prop="oldName">
                <el-input v-model="editForm.oldName" class="width-185"></el-input>
              </el-form-item>
              <el-form-item label="性别：" prop="sex">
                <el-radio-group v-model="editForm.sex" class="width-185">
                  <el-radio label="0">男</el-radio>
                  <el-radio label="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div style="overflow: auto">
            <el-form-item label="证件类型：" class="left" prop="papersType">
              <el-radio-group v-model="editForm.papersType" class="width-185">
                <el-radio label="0">身份证</el-radio>
                <el-radio label="1">护照</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="证件号码：" class="left" prop="papersNo">
              <el-input v-model="editForm.papersNo" class="width-185"></el-input>
            </el-form-item>
          </div>
          <div style="overflow: auto">
            <el-form-item label="生日：" class="left" prop="birthday">
              <el-date-picker
                v-model="editForm.birthday"
                type="date"
                class="width-185"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="独生子女：" class="left" prop="isOneChild">
              <el-radio-group v-model="editForm.isOneChild" class="width-185">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>


          <div style="overflow: auto">
            <el-form-item label="国籍：" class="left" prop="nationality">
              <el-select v-model="editForm.nationality" class="width-185" filterable placeholder="请选择">
                <el-option
                  v-for="(value, key) in nationalityOption"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="民族：" class="left" prop="nation">
              <el-select v-model="editForm.nation" class="width-185" filterable placeholder="请选择">
                <el-option
                  v-for="(value, key) in nationOption"
                  :key="key"
                  :label="value"
                  :value="key">
                </el-option>
              </el-select>
            </el-form-item>

          </div>
          <div style="overflow: auto">
            <el-form-item label="政治面貌：" class="left" prop="politicalOutlook">
              <el-input v-model="editForm.politicalOutlook" class="width-185"></el-input>
            </el-form-item>
            <el-form-item label="家庭收入：" class="left" prop="familySalary">
              <el-input v-model="editForm.familySalary" class="width-185"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="地址：" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>

          <el-form-item label="班级：" prop="studentCode">
            <span v-for="item in editForm.classList" class="class-item">{{item.className}}</span>
            <el-button type="primary" @click="chooseClass">选择班级</el-button>
          </el-form-item>
          <div style="overflow: auto">
            <el-form-item label="学号：" class="left" prop="studentNo">
              <el-input v-model="editForm.studentNo" class="width-185"></el-input>
            </el-form-item>
            <el-form-item label="学籍号：" class="left" prop="studentCode">
              <el-input v-model="editForm.studentCode" class="width-185"></el-input>
            </el-form-item>
          </div>
          <div style="overflow: auto">
            <el-form-item label="入学年份：" class="left" prop="enrolmentYear">
              <el-date-picker
                v-model="editForm.enrolmentYear"
                type="year"
                class="width-185"
                placeholder="请选择入学年份">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="入校时间：" class="left" prop="inSchoolTime">
              <el-date-picker
                v-model="editForm.inSchoolTime"
                type="date"
                class="width-185"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
          <div style="overflow: auto;">
            <el-form-item label="在校状态：" class="left" prop="schoolStatus">
              <el-select v-model="editForm.schoolStatus" class="width-185" filterable placeholder="请选择">
                <el-option
                  v-for="item in schoolStatusOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="学生来源：" class="left" prop="source">
              <el-select v-model="editForm.source" class="width-185" filterable placeholder="请选择">
                <el-option
                  v-for="item in sourceOption"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

      </el-form>
      <div style="text-align: center;margin-top: 10px;">
        <el-button type="primary" @click="saveOrUpdateForm">保存</el-button>
        <el-button @click="editFormClose">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog v-el-drag-dialog title="选择班级" width="500px" :visible.sync="chooseClassDialog">
      <div style="max-height: 60vh;overflow: auto;margin-left: 30px">
        <el-tree
          :data="classList"
          show-checkbox
          node-key="id"
          ref="chooseClassTree"
          :props="defaultProps">
        </el-tree>
      </div>
      <div style="margin-top: 10px;text-align: center;">
        <el-button type="primary" @click="chooseClassConfirm">确认</el-button>
        <el-button @click="chooseClassClose">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {getStudentList, countryDict, nationDict, classList, saveOrUpdateStudent, deleteStudent, studentClassList,
    changeStudentStatus, getClassesByGrade, getClassOptionList, allClassList} from '@/api/api'
  import waves from '@/directive/waves'
  import elDragDialog from '@/directive/el-dragDialog'
  import {mapGetters} from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    directives: {
      waves, elDragDialog
    },
    data() {
      return {
        chooseClassDialog : false,
        defaultProps: {
          label : "className"
        },

        tableData: [],
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        listQuery : {
          realName : '',
          distanceYear : '',
          classCode : '',
          studentNo : '',
          idCard : ''
        },


        nationOption : '',
        nationalityOption : '',
        //0正常、1毕业、2转学、3肄业、4休学、5其他
        schoolStatusOption : [
          {label : "正常", value : 0},
          {label : "毕业", value : 1},
          {label : "转学", value : 2},
          {label : "肄业", value : 3},
          {label : "休学", value : 4},
          {label : "其他", value : 5},
          ],
        sourceOption : [
          {label : "正常入学", value : 0},
          {label : "借读", value : 1},
          {label : "其他", value : 2},
        ],
        papersTypeOption : [
          {label : "身份证", value : 0},
          {label : "护照", value : 1}
        ],
        classList : [],
        gradeOption : [],
        classCodeOption : [],

        editForm : {
          userId : '',
          papersType : '0',
          papersNo : '',
          photo : '',
          realName : '',
          studentNo : '',
          studentCode : '',
          isOneChild : '1',
          oldName : '',
          sex : '',
          birthday : '',
          nationality : '',
          nation : '',
          politicalOutlook : '',
          address : '',
          familySalary : '',
          enrolmentYear : '',
          inSchoolTime : '',
          schoolStatus : 0,
          source : 0,
          classList : []
        },
        editStudentDialog : false,
        studentOpeType : 0,  //0新增 1更新
        editFormRules : {
          realName : [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { max: 10, message: '最多 10 个字符', trigger: 'blur' }
          ],
          studentNo : [
            { required: true, message: '请输入学号', trigger: 'blur' },
            { max: 100, message: '最多 100 个字符', trigger: 'blur' }
          ],
          papersType : [
            { required: true, message: '请选择证件类型', trigger: 'change' },
          ],
          papersNo : [
            { required: true, message: '请输入证件号码', trigger: 'blur' },
          ],
          sex : [
            { required: true, message: '请选择性别', trigger: 'change' },
          ],
        },

        pictureType : ["image/gif", "image/jpeg", "image/jpg", "image/bmp", "image/png"],
        uploadImgUrl : process.env.BASE_API + "/busi/upload/img",

        schoolId : sessionStorage.getItem("schoolId"),

        studentImportDialog : false,
        importFileList : [],
        studentImportTemplateUrl : process.env.BASE_API + "/busi/student/importTemplate",
        importStudentUrl : process.env.BASE_API + "/busi/student/import",
        importValidateErrorDialog : false,
        validateFileUrl : "",
        exportUrl : process.env.BASE_API + "/busi/student/export"
      }
    },

    methods: {
      gradeChanged() {
        this.classCodeOption = [];
        this.listQuery.classCode = '';
        if (this.listQuery.distanceYear || this.listQuery.distanceYear === 0) {
          getClassesByGrade({distanceYear : this.listQuery.distanceYear}).then(res => {
            if (res.code === 200) {
              this.classCodeOption = res.result;
            } else {
              this.$message.error("获取班号信息失败！" + res.message);
            }
          })
        }
        this.fetchData();
      },
      //获取班级备选信息
      getClassOptionList() {
        getClassOptionList().then(res => {
          if (res.code === 200) {
            if (res.result && res.result.length && res.result.length > 0) {
              this.gradeOption = res.result;
            }
          } else {
            this.$message.error("获取年级列表失败！" + res.message);
          }
        });
      },
      changeStatus(id, status) {
        changeStudentStatus({id : id, status : status}).then(res => {
          if (res.code === 200) {
            this.$message.success("操作成功！");
            this.fetchData();
          } else {
            this.$message.error("操作失败！" + res.message);
          }
        })
      },
      formatNation(row) {
        if (this.nationOption && row.nation && row.nation.trim() !== '') {
          for (let key in this.nationOption) {
            if (key === row.nation) {
              return this.nationOption[key];
            }
          }
        }
        return '';
      },
      formatNationality(row) {
        if (this.nationalityOption && row.nationality && row.nationality.trim() !== '') {
          for (let key in this.nationalityOption) {
            if (key === row.nationality) {
              return this.nationalityOption[key];
            }
          }
        }
        return '';
      },
      formatBirthday(row) {
        if (row.birthday && row.birthday.trim() !== '') {
          return row.birthday.substring(0, row.birthday.indexOf(" "));
        }
        return '';
      },
      formatSource(row) {
        if (row.student.source || row.student.source === 0) {
          for (let i = 0; i < this.sourceOption.length; i ++) {
            if (this.sourceOption[i].value === row.student.source) {
              return this.sourceOption[i].label;
            }
          }
        }
        return '';
      },
      formatSchoolStatus(row) {
        if (row.student.schoolStatus || row.student.schoolStatus === 0) {
          for (let i = 0; i < this.schoolStatusOption.length; i ++) {
            if (this.schoolStatusOption[i].value === row.student.schoolStatus) {
              return this.schoolStatusOption[i].label;
            }
          }
        }
        return '';
      },
      formatInSchoolTime(row) {
        if (row.student.inSchoolTime && row.student.inSchoolTime.trim() !== '') {
          return row.student.inSchoolTime.substring(0, row.student.inSchoolTime.indexOf(" "));
        }
        return '';
      },
      formatEnrolmentYear(row) {
        if (row.student.enrolmentYear && row.student.enrolmentYear.trim() !== '') {
          return row.student.enrolmentYear.substring(0, 4);
        }
        return '';
      },
      //编辑学生信息
      editStudent(item) {
        this.initEditForm();
        this.studentOpeType = 1;
        this.editStudentDialog = true;

        //初始化编辑信息
        this.editForm.userId = item.id;
        this.editForm.papersType = item.papersType + '';
        if (this.editForm.papersType === '0') {
          this.editForm.papersNo = item.idCard;
        } else if (this.editForm.papersType === '1') {
          this.editForm.papersNo = item.passport;
        }
        this.editForm.photo = item.student.photo;
        this.editForm.realName = item.realName;
        this.editForm.studentNo = item.student.studentNo;
        this.editForm.studentCode = item.student.studentCode;
        this.editForm.isOneChild = item.student.isOneChild == 0 ? '0' : '1';
        this.editForm.oldName = item.oldName;
        this.editForm.sex = item.sex + '';
        if (item.birthday) {
          let formatDate = item.birthday.replace(/-/g,"/");
          this.editForm.birthday = new Date(formatDate);
        }
        // this.editForm.birthday = item.birthday ? ;
        this.editForm.nationality = item.nationality;
        this.editForm.nation = item.nation;
        this.editForm.politicalOutlook = item.politicalOutlook;
        this.editForm.address = item.address;
        this.editForm.familySalary = item.student.familySalary;
        if (item.student.enrolmentYear) {
          let formatDate = item.student.enrolmentYear.replace(/-/g,"/");
          this.editForm.enrolmentYear = new Date(formatDate);
        }
        // this.editForm.enrolmentYear = item.student.enrolmentYear;

        if (item.student.inSchoolTime) {
          let formatDate = item.student.inSchoolTime.replace(/-/g,"/");
          this.editForm.inSchoolTime = new Date(formatDate);
        }
        // this.editForm.inSchoolTime = item.student.inSchoolTime;
        this.editForm.schoolStatus = item.student.schoolStatus;
        this.editForm.source = item.student.source;

        // this.editForm.classList = this.getStudentClassList(item.id);
        if (item.classList && item.classList.length) {
          let userClassList = [];

          item.classList.forEach(cTmp => {
            for (let i = 0; i < this.classList.length; i ++) {
              if (cTmp.id === this.classList[i].id) {
                userClassList.push(this.classList[i]);
                break;
              }
            }
          })
          this.editForm.classList = userClassList;
        }
      },
      //获取学生班级信息
      getStudentClassList(userId) {
        let userClassList = [];
        studentClassList({userId : userId}).then(res => {
          if (res.code === 200) {
            if (res.result && res.result.length && this.classList) {
              res.result.forEach(rTmp => {
                for (let i = 0; i < this.classList.length; i ++) {
                  if (rTmp.id === this.classList[i].id) {
                    userClassList.push(this.classList[i]);
                    break;
                  }
                }
              })
            }
          } else {
            this.$message.error("获取学生班级信息失败！" + res.message);
          }
        });
        return userClassList;
      },
      //选择班级确认按钮
      chooseClassConfirm() {
        this.editForm.classList = this.$refs.chooseClassTree.getCheckedNodes();
        this.chooseClassDialog = false;
      },
      //选择班级取消按钮
      chooseClassClose() {
        this.chooseClassDialog = false;
        this.initEditForm();
        this.$refs.editForm.clearValidate();
      },
      //选择班级信息
      chooseClass() {
        this.chooseClassDialog = true;
        this.$nextTick(() => {
          this.$refs.chooseClassTree.setCheckedNodes(this.editForm.classList);
        });
      },
      //新增或更新学生信息
      saveOrUpdateForm() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            let params = {};
            if (this.editForm.classList && this.editForm.classList.length) {
              let classIdList = [];
              this.editForm.classList.forEach((cTmp) => {
                classIdList.push(cTmp.id);
              });
              params.officeIdList = classIdList.join(",");
            }

            //组合参数
            params.studentNo = this.editForm.studentNo;
            params.studentCode = this.editForm.studentCode;
            params.isOneChild = this.editForm.isOneChild || '';
            params.familySalary = this.editForm.familySalary;
            params.enrolmentYear = this.editForm.enrolmentYear instanceof Date ? this.editForm.enrolmentYear.format("yyyy-MM-dd hh:mm:ss") : this.editForm.enrolmentYear;
            params.inSchoolTime = this.editForm.inSchoolTime instanceof Date ?  this.editForm.inSchoolTime.format("yyyy-MM-dd hh:mm:ss") : this.editForm.inSchoolTime;
            params.photo = this.editForm.photo;
            params.schoolStatus = this.editForm.schoolStatus;
            params.source = this.editForm.source;

            //用户参数
            let userParams = {};
            userParams.realName = this.editForm.realName;
            userParams.papersType = this.editForm.papersType;
            if (userParams.papersType === '0') {
              userParams.idCard = this.editForm.papersNo;
            } else if (userParams.papersType === '1') {
              userParams.passport = this.editForm.papersNo;
            }
            userParams.nationality = this.editForm.nationality;
            userParams.nation = this.editForm.nation;
            userParams.oldName = this.editForm.oldName;
            userParams.sex = this.editForm.sex;
            userParams.birthday = this.editForm.birthday instanceof Date ? this.editForm.birthday.format("yyyy-MM-dd hh:mm:ss") : this.editForm.birthday;
            userParams.politicalOutlook = this.editForm.politicalOutlook;
            userParams.address = this.editForm.address;
            userParams.id = this.editForm.userId;
            params.userParamsStr = JSON.stringify(userParams);

            saveOrUpdateStudent(params).then(res => {
              if (res.code === 200) {
                this.$message.success("保存成功！");
                this.initListQuery();
                this.editFormClose();
              } else {
                this.$message.error("保存失败！" + res.message);
              }
            });
          } else {
            this.$message.warning("输入信息有误，请确认！");
          }
        });
      },

      handlePhotoSuccess(res, file) {
        if (res.code === 200) {
          this.editForm.photo = res.result;
        } else {
          this.$message.error("上传失败！" + res.message)
        }
      },
      beforePhotoUpload(file) {
        const isPicture = this.pictureType.indexOf(file.type) !== -1;
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isPicture) {
          this.$message.error('只能上传图片!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isPicture && isLt2M;
      },
      getCountryDict() {
        countryDict().then(res => {
          if (res.code === 200) {
            this.nationalityOption = res.result;
          } else {
            this.$message.error("获取国家字典信息失败！" + res.message);
          }
        });
      },
      getNationDict() {
        nationDict().then(res => {
          if (res.code === 200) {
            this.nationOption = res.result;
          } else {
            this.$message.error("获取民族字典信息失败！" + res.message);
          }
        })
      },
      editFormClose() {
        this.editStudentDialog = false;
        this.initEditForm();
      },
      initEditForm() {
        this.editForm = {
          userId : '',
          papersType : '0',
          papersNo : '',
          photo : '',
          realName : '',
          studentNo : '',
          studentCode : '',
          isOneChild : '1',
          oldName : '',
          sex : '',
          birthday : '',
          nationality : '',
          nation : '',
          politicalOutlook : '',
          address : '',
          familySalary : '',
          enrolmentYear : '',
          inSchoolTime : '',
          schoolStatus : 0,
          source : 0,
          classList : []
        };
      },
      addNewStudent() {
        this.initEditForm();
        this.studentOpeType = 0;
        this.editStudentDialog = true;
      },
      deleteStudent(id) {
        deleteStudent({id : id}).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功！");
            this.fetchData();
          } else {
            this.$message.error("删除失败！" + res.message);
          }
        })

      },
      getClassList() {
        this.classList = [];
        allClassList().then(res => {
          if (res.code === 200) {
            if ( res.result && res.result.length) {
              res.result.forEach(cTmp => {
                this.classList.push({id : cTmp.id, className : cTmp.busiClass.className || cTmp.officeName});
              })
            }
          } else {
            this.$message.error("获取班级列表失败！" + res.message);
          }
        });
      },

      userExport() {
       /* let url = this.exportUrl + "?schoolToken=" + this.schoolId;
        url += "&realName=" +this.listQuery.realName;
        url += "&classId=" + this.listQuery.classId;
        url += "&parentName=" + this.listQuery.parentName;
        window.open(url);*/
      },


      fineListChange(file, fileList) {
        this.importFileList = [];
        this.importFileList.push(file);
      },
      handleUploadSuccess(res, file) {
        if (res.code === 200) {
          this.$message.success("上传成功！");
          this.studentImportDialog = false;
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
      userImport() {
        this.importFileList = [];
        this.studentImportDialog = true;
      },

      initListQuery() {
        this.listQuery = {
          realName : '',
          distanceYear : '',
          classCode : '',
          studentNo : '',
          idCard : ''
        };
        this.classCodeOption = [];
        this.fetchData();
      },

      fetchData() {
        let param = {
          pageNum : this.pageInfo.pageNum,
          pageSize : this.pageInfo.pageSize,
          realName : this.listQuery.realName,
          distanceYear : this.listQuery.distanceYear,
          classCode : this.listQuery.classCode,
          studentNo : this.listQuery.studentNo,
          idCard : this.listQuery.idCard
        };

        getStudentList(param).then((res) => {
          if (res.code === 200) {
            if (res.result) {
              this.tableData = res.result && res.result.list ? res.result.list : [];
              this.pageInfo.total = res.result.total;
            }
          } else {
            this.$message.error("获取学生列表失败！" + res.message);
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
      this.getCountryDict();
      this.getNationDict();
      this.getClassOptionList();
    },
  }
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 135px;
    height: 160px;
    line-height: 158px;
    text-align: center;
  }
  .avatar {
    width: 135px;
    height: 160px;
    display: block;
  }
  .width-185{
    width: 185px!important;
  }
  .left{
    float: left;
  }

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    /*color: #99a9bf;*/
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    min-width: 25%;
  }
  .class-item{
    border: 1px solid #dcdfe6;border-radius: 5px;margin-left: 5px;padding: 5px; display: inline-block;height: 28px;line-height: 18px;
  }
</style>
