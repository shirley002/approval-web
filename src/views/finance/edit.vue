<template>
  <div class="app-container">
     <el-form ref="financeform" :model="approvalInfo" :rules="approvalRules" label-width="150px">
        <el-form-item class="form-item" label="名称" prop="name">
            <el-input class="form-input" v-model="approvalInfo.name"></el-input>
            <div class="tips">不超过30个汉字</div>
        </el-form-item>
         <el-form-item class="form-item" label="附件" prop="files">
            <el-upload
                ref="upload"
                class="upload-demo"
                action="http://dev.icampus.local/approval/apply/save/attachment"
                multiple
                accept=".doc,.docx,.xls,.xlsx,.pdf,.rar,.zip,.7z"
                :file-list="this.approvalInfo.files"
                :data="uploadData"
                :on-change="onChange"
                :on-success="uploadSuccess"
                :on-remove="removeUpload">
                <el-button size="small" type="primary">点击上传</el-button>
                <span class="tips" style="margin-left: 20px;">仅支持doc、docx、xls、xlsx、pdf、rar、zip、7z格式上传，每个文件不超过10M</span>
            </el-upload>
        </el-form-item>
         <el-form-item class="form-item" label="备注" prop="remark">
            <el-input style="width:80%" type="textarea" :rows="3" v-model="approvalInfo.remark"></el-input>
        </el-form-item>
    </el-form>
    <div class="finance-opt-buttons">
        <el-button class="opt-button" :disabled="addDisable" type="primary" @click="save">提交</el-button>
        <el-button class="opt-button" @click="goBack">取消</el-button>
    </div>
    
  </div>

</template>

<script>
  import {saveApply,getApplyDetail,editApply} from '@/api/approval/api'
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
        applyId : this.$route.params.id,
        uploadData : {flow_id:11},
        approvalInfo : {apply_id:'', flow_id:11 , name:'' , remark:'', files:[]},
        approvalRules : {
            name:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { max: 30, message: '名称不得超过30个字符', trigger: 'blur' }
            ],
            files:[
                { required: true, message: '请选择附件文件' },
            ],
            remark:[
                { max: 200, message: '备注不得超过200个字符', trigger: 'blur' }
            ],
        },
        addDisable : false
      }
    },
    methods: {
        save() {
            this.$refs['financeform'].validate((valid) => {
                if(valid) {
                    this.addDisable = true;
                    editApply(this.approvalInfo).then(res => {
                        this.addDisable = false;
                        if(res.code == 200) {
                            this.$message.success(res.msg);
                            setTimeout(function() {
                                this.$router.back(-1);
                            },3000)
                        } else if (res.status === 422) {
                            if(res.data && res.data.errors) {
                                for(let i in res.data.errors) {
                                    this.$message.error(res.data.errors[i][0]);
                                    return false;
                                }
                            }
                        } else {
                            this.$message.error(res.msg);
                        }
                    })
                }
            })
        },
        onChange(file,fileList) {
            if (file.size > 1024 * 1024 * 10) {
                this.$message.error(`文件大小不得超过10M`);
                fileList.pop()
            }
        },
        uploadSuccess(response, file, fileList) {
            if(response.code == 200) {
                this.approvalInfo.files.push(response.data);
            } else {
                this.$message.error(response.msg);
            }
        },
        removeUpload(file, fileList) {
            for(let i in this.approvalInfo.files) {
                if(this.approvalInfo.files[i].url == file.response.data.url) {
                    this.approvalInfo.files.splice(i,1);
                    break;
                }
            }
        },
        getApplyDetail() {
            getApplyDetail({id:this.applyId,basic:1}).then(res => {
                if(res.code == 200) {
                    this.approvalInfo.apply_id = res.data.id; 
                    this.approvalInfo.name = res.data.searchable;
                    this.approvalInfo.remark = res.data.remark;
                    this.approvalInfo.files = res.data.attachment;
                } else {
                    this.$message.error(res.msg);
                }
            })
        },
        //取消返回上一页
        goBack() {
            this.$router.back(-1);
        }
    },
    created() {
       this.getApplyDetail();
    }
  }
</script>
<style>
    .form-item{ margin:15px 0 20px;}
    .form-input{ width:350px;}
    .tips{line-height: 20px;color:#aaa;}
    .upload-demo .el-upload-list{width: 350px}
    .finance-opt-buttons{text-align: center;}
    .finance-opt-buttons .opt-button{width:150px;}
    .finance-opt-buttons .opt-button:first-child{margin-right: 50px;}
</style>
