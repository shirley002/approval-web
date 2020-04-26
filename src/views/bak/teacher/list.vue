<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input class="filter-item width-200" placeholder="姓名" v-model="listQuery.realName" @keyup.enter.native="fetchData">
      </el-input>
      <el-input class="filter-item width-200" placeholder="工号" v-model="listQuery.staffNo" @keyup.enter.native="fetchData">
      </el-input>
      <el-input class="filter-item width-200" placeholder="身份证" v-model="listQuery.idCard" @keyup.enter.native="fetchData">
      </el-input>
      <el-select clearable class="filter-item" style="width: 200px" v-model="listQuery.schoolStatus" placeholder="在校状态" @change="fetchData">
        <el-option v-for="item in schoolStatusOption" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="fetchData">查询</el-button>
      <el-button class="filter-item" icon="el-icon-remove-outline" @click="initListQuery">清除</el-button>
      <template v-if="permissions.indexOf('busi:teacher:add') !== -1">
        <el-button class="filter-item"  type="primary" icon="el-icon-edit" style="margin-left: 10px;" @click="addNewTeacher">新增</el-button>
      </template>
      <template v-if="permissions.indexOf('busi:teacher:import') !== -1">
        <el-button class="filter-item"  type="primary" icon="el-icon-download" @click="userImport">数据导入</el-button>
      </template>
      <!--<el-button class="filter-item"  type="primary" icon="el-icon-upload2" @click="userExport">数据导出</el-button>-->
    </div>

    <el-table ref="form" :data="tableData"  border fit highlight-current-row
              style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="right" inline class="demo-table-expand">
            <el-form-item label="教师照片：" style="float: left;width: 25%;" v-if="scope.row.teacher.photo">
              <div>
                <img :src="scope.row.teacher.photo" style="height: 160px;width: 135px;">
              </div>
            </el-form-item>
            <el-form-item label="姓名：">
              <span>{{ scope.row.realName }}</span>
            </el-form-item>
            <el-form-item label="性别：">
              <span>{{ scope.row.sex === 0 ? "男" : scope.row.sex === 1 ? "女" : "未知"}}</span>
            </el-form-item>
            <el-form-item label="工号：">
              <span>{{ scope.row.teacher.staffNo }}</span>
            </el-form-item>
            <el-form-item label="在校状态：">
              <span>{{formatSchoolStatus(scope.row)}}</span>
            </el-form-item>
            <el-form-item label="编制：">
              <span>{{scope.row.teacher.organization === 0 ? "在编" : scope.row.teacher.organization === 1 ? "外聘" : ""}}</span>
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
            <el-form-item label="手机号：">
              <span>{{ scope.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="邮箱：">
              <span>{{ scope.row.email }}</span>
            </el-form-item>
            <el-form-item label="地址：">
              <span>{{ scope.row.address }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
            <span class="link-color">{{scope.row.realName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{scope.row.sex === 0 ? "男" : scope.row.sex === 1 ? "女" : "未知"}}</span>
        </template>
      </el-table-column>
      <el-table-column label="工号">
        <template slot-scope="scope">
          <span>{{scope.row.teacher.staffNo}}</span>
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
      <el-table-column label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.mobile}}</span>
        </template>
      </el-table-column>
      <el-table-column label="在校状态" :formatter="formatSchoolStatus">
      </el-table-column>
      <el-table-column label="编制">
        <template slot-scope="scope">
          <span>{{scope.row.teacher.organization === 0 ? "在编" : scope.row.teacher.organization === 1 ? "外聘" : ""}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        show-overflow-tooltip
        width="200px">
        <template slot-scope="scope">
          <template v-if="permissions.indexOf('busi:teacher:edit') !== -1">
            <el-button type="primary" size="small" @click="editTeacher(scope.row)">编辑</el-button>
          </template>
          <template v-if="scope.row.teacher.id">
            <template v-if="permissions.indexOf('busi:teacher:enableDisable') !== -1">
              <el-button type="success" v-if="scope.row.teacher.status === 1" size="small" @click="changeStatus(scope.row.teacher.id, 2)">停用</el-button>
              <el-button type="warning" v-if="scope.row.teacher.status === 2" size="small" @click="changeStatus(scope.row.teacher.id, 1)">启用</el-button>
            </template>
            <template v-if="permissions.indexOf('busi:teacher:delete') !== -1">
              <el-button type="danger" size="small" @click="deleteTeacher(scope.row.teacher.id)">删除</el-button>
            </template>
          </template>
          <template v-else>
            <span>教师信息不全，请编辑补全</span>
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

    <el-dialog v-el-drag-dialog title="教师导入" :visible.sync="teacherImportDialog">
      <div style="width: 500px;margin: auto;height: 200px;">
        <div class="el-form-item">
          <label class="ele-form-label">下载模板：</label>
          <div class="ele-form-content"><a :href="teacherImportTemplateUrl" target="_blank" style="color: #409eff;">教师导入模板.xlsx</a> </div>
        </div>

        <div class="el-form-item">
          <label class="ele-form-label">上传文件：</label>
          <div class="ele-form-content">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="importTeacherUrl"
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


    <el-dialog v-el-drag-dialog width="800px" :title="(teacherOpeType === 0 ? '添加' : '更新') + '教师'" :visible.sync="editTeacherDialog">
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
            <el-form-item label="手机号：" class="left" prop="mobile">
              <el-input v-model="editForm.mobile" class="width-185"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" class="left" prop="email">
              <el-input v-model="editForm.email" class="width-185"></el-input>
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
            <el-form-item label="政治面貌：" class="left" prop="politicalOutlook">
              <el-input v-model="editForm.politicalOutlook" class="width-185"></el-input>
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


          <el-form-item label="地址：" prop="address">
            <el-input v-model="editForm.address"></el-input>
          </el-form-item>

          <div style="overflow: auto">
            <el-form-item label="工号：" class="left" prop="staffNo">
              <el-input v-model="editForm.staffNo" class="width-185"></el-input>
            </el-form-item>
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
          </div>
          <div style="overflow: auto;">
            <el-form-item label="编制：" class="left" prop="source">
              <el-select v-model="editForm.organization" class="width-185" placeholder="请选择">
                <el-option
                  v-for="item in organizationOption"
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
  </div>

</template>

<script>
  import {countryDict, nationDict, getTeacherList, saveOrUpdateTeacher, deleteTeacher, changeTeacherStatus} from '@/api/api'
  import waves from '@/directive/waves'
  import elDragDialog from '@/directive/el-dragDialog'
  import {mapGetters} from 'vuex'
  export default {
    directives: {
      waves, elDragDialog
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    data() {
      return {
        tableData: [],
        pageInfo: {
          pageNum: 1,
          pageSize: 10,
          total: 0
        },
        listQuery : {
          realName : '',
          staffNo : '',
          schoolStatus : '',
          idCard : ''
        },
        classList : [],

        nationOption : '',
        nationalityOption : '',
        schoolStatusOption : [
          {label : "正常", value : 0},
          {label : "离职", value : 1},
          {label : "调离", value : 2},
          {label : "退休", value : 3},
          {label : "其他", value : 4}
        ],
        organizationOption : [
          {label : "在编", value : 0},
          {label : "外聘", value : 1}
        ],

        editFormRules : {
          realName : [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { max: 10, message: '最多 10 个字符', trigger: 'blur' }
          ],
          staffNo : [
            { required: true, message: '请输入工号', trigger: 'blur' },
            { max: 50, message: '最多 50 个字符', trigger: 'blur' }
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
         /* nationality : [
            { required: true, message: '请选择国籍', trigger: 'change' },
          ],
          nation : [
            { required: true, message: '请选择民族', trigger: 'change' },
          ],*/
        },

        pictureType : ["image/gif", "image/jpeg", "image/jpg", "image/bmp", "image/png"],
        uploadImgUrl : process.env.BASE_API + "/busi/upload/img",

        editTeacherDialog : false,
        teacherOpeType : 0, //0新增 1更新
        editForm : {
          userId : '',
          papersType : '0',
          papersNo : '',
          photo : '',
          realName : '',
          oldName : '',
          sex : '',
          birthday : '',
          nationality : '',
          nation : '',
          politicalOutlook : '',
          address : '',
          staffNo : '',
          email : '',
          mobile : '',
          schoolStatus : 0,
          organization : 0
        },

        schoolId : sessionStorage.getItem("schoolId"),

        //导入导出
        teacherImportDialog : false,
        importFileList : [],
        teacherImportTemplateUrl : process.env.BASE_API + "/busi/teacher/importTemplate",
        importTeacherUrl : process.env.BASE_API + "/busi/teacher/import",
        importValidateErrorDialog : false,
        validateFileUrl : "",
        exportUrl : process.env.BASE_API + "/busi/teacher/export"
      }
    },

    methods: {
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
      deleteTeacher(id) {
        deleteTeacher({id : id}).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功！");
            this.fetchData();
          } else {
            this.$message.error("删除失败！" + res.message);
          }
        })

      },
      changeStatus(id, status) {
        changeTeacherStatus({id : id, status : status}).then(res => {
          if (res.code === 200) {
            this.$message.success("操作成功！");
            this.fetchData();
          } else {
            this.$message.error("操作失败！" + res.message);
          }
        })
      },
      formatSchoolStatus(row) {
        if (row.teacher.schoolStatus || row.teacher.schoolStatus === 0) {
          for (let i = 0; i < this.schoolStatusOption.length; i ++) {
            if (this.schoolStatusOption[i].value === row.teacher.schoolStatus) {
              return this.schoolStatusOption[i].label;
            }
          }
        }
        return '';
      },
      //编辑教师信息
      editTeacher(item) {
        this.initEditForm();
        this.teacherOpeType = 1;
        this.editTeacherDialog = true;

        //初始化编辑信息
        this.editForm.userId = item.id;
        this.editForm.mobile = item.mobile;
        this.editForm.email = item.email;
        this.editForm.papersType = item.papersType + '';
        if (this.editForm.papersType === '0') {
          this.editForm.papersNo = item.idCard;
        } else if (this.editForm.papersType === '1') {
          this.editForm.papersNo = item.passport;
        }
        this.editForm.photo = item.teacher.photo;
        this.editForm.realName = item.realName;
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
        this.editForm.schoolStatus = item.teacher.schoolStatus;
        this.editForm.organization = item.teacher.organization;
        this.editForm.staffNo = item.teacher.staffNo;
      },

      saveOrUpdateForm() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            let params = {};

            //组合参数
            params.staffNo = this.editForm.staffNo;
            params.photo = this.editForm.photo;
            params.schoolStatus = this.editForm.schoolStatus;
            params.organization = this.editForm.organization;

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
            userParams.mobile = this.editForm.mobile;
            userParams.email = this.editForm.email;
            params.userParamsStr = JSON.stringify(userParams);

            saveOrUpdateTeacher(params).then(res => {
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
      editFormClose() {
        this.initEditForm();
        this.editTeacherDialog = false;
        this.$refs.editForm.clearValidate();
      },
      initEditForm() {
        this.editForm = {
          userId : '',
          papersType : '0',
          papersNo : '',
          photo : '',
          realName : '',
          oldName : '',
          sex : '',
          birthday : '',
          nationality : '',
          nation : '',
          politicalOutlook : '',
          address : '',
          staffNo : '',
          schoolStatus : 0,
          organization : 0
        };
      },
      addNewTeacher() {
        this.initEditForm();
        this.editTeacherDialog = true;
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

      userExport() {
        let url = this.exportUrl + "?schoolToken=" + this.schoolId;
        url += "&realName=" +this.listQuery.realName;
        url += "&classId=" + this.listQuery.classId;
        url += "&parentName=" + this.listQuery.parentName;
        window.open(url);
      },

      fineListChange(file, fileList) {
        this.importFileList = [];
        this.importFileList.push(file);
      },
      handleUploadSuccess(res, file) {
        if (res.code === 200) {
          this.$message.success("上传成功！");
          this.teacherImportDialog = false;
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
        this.teacherImportDialog = true;
      },

      initListQuery() {
        this.listQuery = {
          realName : '',
          staffNo : '',
          schoolStatus : '',
          idCard : ''
        };
        this.fetchData();
      },
      fetchData() {
        let param = {
          pageNum : this.pageInfo.pageNum,
          pageSize : this.pageInfo.pageSize,
          realName : this.listQuery.realName,
          staffNo : this.listQuery.staffNo,
          schoolStatus : this.listQuery.schoolStatus,
          idCard : this.listQuery.idCard
        };
        getTeacherList(param).then((res) => {
          if (res.code === 200) {
            if (res.result) {
              this.tableData = res.result && res.result.list ? res.result.list : [];
              this.pageInfo.total = res.result.total;
            }
          } else {
            this.$message.error("获取教师数据失败！" + res.message);
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
    },
    created() {
      this.fetchData();
      this.getCountryDict();
      this.getNationDict();
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
</style>
