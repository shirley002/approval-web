<template>
    <div class="app-container">
        <el-tabs class="mainPanel" v-model="activeTab">
            <el-tab-pane name="basic">
                <span slot="label"><i class="icon-basic"></i>基本信息</span>
                <el-form ref="basicform" :model="basicInfo" :rules="basicRules" label-width="150px">
                    <el-form-item class="form-item" label="流程名称" prop="name">
                        <el-input class="form-input" v-model="basicInfo.name"></el-input>
                        <div class="tips">不超过15个汉字</div>
                    </el-form-item>
                    <el-form-item class="form-item" label="列表排序" prop="sort">
                        <el-input class="form-input" v-model.number="basicInfo.sort"></el-input>
                        <div class="tips">从1开始，1是最高排序</div>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane name="process">
                <span slot="label"><i class="icon-process"></i>流程设计</span>
                <div class="title" style='margin:45px 0 30px;'>审批流程</div>
                <div class="flow">
                    <div class="label">审批人</div>
                    <div class="approver"   v-for="(item,i) in defaultApporver.approver">
                      <i v-show="i>0" class="el-icon-right"></i>
                      <button type="button" @contextmenu.prevent="contextmenu($event,'default_' + i)" class="el-button el-button--default  opt-button"><span>{{item.name}}</span></button>
                    </div>
                    <i class="el-icon-circle-plus-outline add-icon" @click="addApproverDialog('default_')"></i>
                </div>
                <div class="title" v-show="flowId != 11" style='margin:30px 0'>分条件审批</div>
                <div class="flow" v-show="flowId != 11">
                    <div class="condition">
                        <el-button  type="primary" class='opt-button' @click="addCondition">添加</el-button>
                        <draggable v-model="conditionApprover"  @update="datadragEnd" :options = "{animation:500,handle:'.condition-item-header,.sort-button'}">
                            <transition-group>
                            <div class='condition-area clearfix' v-for="(item,i) in conditionApprover" :key="item.id">
                                <button type="button" style='float:left;margin-right: 10px;cursor: move' class="el-button el-button--default  opt-button sort-button"><span>优先级{{i + 1}}</span></button>
                                <div class="condition-item">
                                    <div class="condition-item-header">
                                        条件：{{getConditionText(item.condition)}} 
                                        <el-link class="condition-item-delete" @click="deleteCondition(item.id)" :underline=false type="danger">删除</el-link>
                                        <el-link class="condition-item-edit" @click="editCondition(item.id)" :underline=false type="primary">编辑</el-link>
                                    </div>
                                    <div class="condition-item-flow">
                                        <div class="label">审批人</div>
                                        <div class="approver" v-for="(it,ii) in item.approver">
                                          <i v-show="ii>0" class="el-icon-right"></i>
                                          <button type="button" @contextmenu.prevent="contextmenu($event,item.id + '_' + ii)" class="el-button el-button--default opt-button"><span>{{it.name}}</span></button>
                                        </div>
                                        <i class="el-icon-circle-plus-outline add-icon" @click="addApproverDialog(item.id + '_')"></i>
                                    </div>
                                </div>
                            </div>
                            </transition-group>
                        </draggable>
                    </div>
                </div>
                <div class="title" v-show="flowId != 11" style='margin:30px 0 40px'>抄送人员</div>
                <div class="flow" v-show="flowId != 11">
                    <div class="label">抄送人</div>
                    <button type="button" v-show="flowCC.name != ''"  class="el-button el-button--default opt-button" style='background:#f2f2f2'><span>{{flowCC.name}}</span></button>
                    <i class="el-icon-circle-plus-outline add-icon" @click="editCc('cc')"></i>
                </div>
            </el-tab-pane>
            <el-tab-pane name="form">
                <span slot="label"><i class="icon-form"></i>表单设计</span>
                <span style='float:left;margin-right: 15px;color:#02B2B5'>暂不支持表单修改，修改功能即将上线，敬请期待！</span>
                <img src="../../assets/1.png" alt="" />
            </el-tab-pane>
            <el-tab-pane name="visible">
                <span slot="label"><i class="icon-visible"></i>可见范围</span>
                <div class="visible-title">校内范围<el-link style='margin-left:15px' @click='editVisibleRange' :underline=false type="primary">去设置</el-link></div>
                <div class="visible-content">{{visibleRange.name}}</div>
            </el-tab-pane>
            <el-tab-pane name="advance">
                <span slot="label"><i class="icon-advance"></i>高级设置</span>
              <el-form ref="form" :model="advanceInfo" label-width="150px">
                  <el-form-item class="form-item" label="审批人去重">
                      <el-select clearable size="small" v-model="advanceInfo.approver_unique" placeholder="请选择"">
                          <el-option v-for="item in approverUniqueList" :key="item.id" :label="item.name" :value="item.id">
                          </el-option>
                      </el-select>
                  </el-form-item>
                  <el-form-item class="form-item" label="审批意见">
                      <el-checkbox v-model="advanceInfo.comments_require" >必填</el-checkbox>
                  </el-form-item>
              </el-form>
          </el-tab-pane>
        </el-tabs>

        <div class="opt-buttons">
            <el-button class="opt-button" type="primary" @click="save">保存</el-button>
            <el-button class="opt-button" @click="goBack">取消</el-button>
        </div>
        
        <el-dialog title="编辑条件" :visible.sync="conditionDialogVisible" width="40%" class="edit-dialog" :close-on-click-modal=false >
            <el-form :model="curConditionEdit" class="dialog-content">
                <div class="tips">以下条件均为且的关系</div>
                <el-form-item class="dialog-form-item" label="">
                    <el-checkbox v-model="curConditionEdit.time">时间类</el-checkbox>
                    <span class="tips">（默认24小时=1天，多个条件时，需保证区间有交集）</span>
                </el-form-item>
                
                <el-form-item v-for='(item,i) in curConditionEdit.timeCondition' label-width="80px" >
                    <span v-show='i==0' slot='label'>时间（D）</span>
                    <el-select :disabled="!curConditionEdit.time" v-model="item['sign']" placeholder="请选择">
                        <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input :disabled="!curConditionEdit.time" v-model="item['value']" class="dialog-form-input"></el-input>&nbsp;天
                    <i v-show="i==0 && curConditionEdit.timeCondition.length < 2" class="el-icon-circle-plus-outline" @click="addTimeCondition"></i>
                    <i v-show="i > 0" class="el-icon-remove-outline" @click="removeTimeCondition(i)"></i>
                </el-form-item>
                
                <el-form-item class="dialog-form-item" label="">
                    <el-checkbox v-model="curConditionEdit.num">数量类</el-checkbox>
                    <span class="tips">（请填写整数）</span>
                </el-form-item>
                <el-form-item v-for='(item,i) in curConditionEdit.numCondition' label-width="80px" >
                    <span v-show='i==0' slot='label'>数量（S）</span>
                    <el-select :disabled="!curConditionEdit.num" v-model="item['sign']" placeholder="请选择">
                        <el-option v-for="item in conditionOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input :disabled="!curConditionEdit.num" v-model="item['value']" class="dialog-form-input"></el-input>
                    <i v-show="i == 0 && curConditionEdit.numCondition.length < 2" class="el-icon-circle-plus-outline" @click="addNumCondition"></i>
                    <i v-show="i > 0" class="el-icon-remove-outline" @click="removeNumCondition(i)"></i>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveCondition">确 定</el-button>
                <el-button @click="conditionDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        
        <el-dialog title="选择人员" :visible.sync="approverDialogVisible" width="40%"  class="edit-dialog" :close-on-click-modal=false >
            <div class="dialog-content">
                <el-row style="margin:10px 0 20px">
                    <el-col :span="24">
                        <el-radio v-model="curApprovalEdit.type" @change='changeApproverType' label="1">指定人员</el-radio>
                        <el-radio v-model="curApprovalEdit.type" @change='changeApproverType' label="2">职务类型</el-radio>
                        <el-radio v-model="curApprovalEdit.type" @change='changeApproverType' label="3">职务</el-radio>
                        <span class="tips">仅可选择一类，切换时会清除已选数据</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" style="border-right:1px solid #02B2B5;padding-right:15px;">
                        <el-input v-model='filterTreeText' style="width:calc(100% - 80px)"></el-input>
                        <el-button type="primary">搜 索</el-button>
                        <div class="dialog-area">
                            <div style="background: #eee;line-height: 30px;text-align: center">部 门</div>
                            <el-tree v-show="curApprovalEdit.type == '1'" ref="type1Tree" :filter-node-method="filterTreeNode" :data="type1TreeData" 
                                     :props="defaultTreeProps" node-key="key" show-checkbox :render-after-expand=false 
                                     @check-change="checkTreeData" style="height:260px;overflow-y: auto">
                            </el-tree>
                            <el-tree v-show="curApprovalEdit.type == '2'" ref="type2Tree" :filter-node-method="filterTreeNode" :data="type2TreeData" 
                                     :props="defaultTreeProps" node-key="key" show-checkbox :render-after-expand=false 
                                     @check-change="checkTreeData" style="height:260px;overflow-y: auto">
                            </el-tree>
                            <el-tree  v-show="curApprovalEdit.type == '3'" ref="type3Tree" :filter-node-method="filterTreeNode" :data="type3TreeData" 
                                     :props="defaultTreeProps" node-key="key" show-checkbox :render-after-expand=false 
                                     @check-change="checkTreeData" style="height:260px;overflow-y: auto">
                            </el-tree>
                        </div>
                    </el-col>
                    <el-col :span="12" style="padding-left:15px;">
                        <el-button style="width:100%">已选入</el-button>
                        <div class="dialog-area" style="padding-top:30px">
                            <div v-for="(item,key) in selectedApprovers" class="item">{{item.name}}<i class="el-icon-close" @click="removeSelectedApprover(key)"></i></div>
                        </div>
                    </el-col>
                </el-row>
                <el-row style="margin-top:20px;" v-show='curApprovalEdit.method != 0'>
                    <el-col :span="24">
                        <el-radio v-model="curApprovalEdit.method" label="1">会签</el-radio><span class="tips">（须所有审批人都通过）</span><br />
                        <el-radio v-model="curApprovalEdit.method" label="2">或签</el-radio><span class="tips">（一名审批人审批通过或不通过即可）</span>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveApprover">确 定</el-button>
                <el-button @click="approverDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
        
        <div class='contextmenu' @mouseleave='contextmenuInfo.show = false' v-show='contextmenuInfo.show' v-bind:style='{top:contextmenuInfo.top,left:contextmenuInfo.left}'>
            <div class='item'><el-link @click='editApprover' :underline=false >编辑</el-link></div>
            <div class='item'><el-link @click='deleteApprover' :underline=false >删除</el-link></div>
        </div>
    </div>
</template>

<script>
  import {getFlowDetail,saveBasic,saveAdvance,getAllDepartmentAndUser,saveProcess,saveVisibleRange,getJobAndJobType} from '@/api/approval/api'
  import {deepCopy} from '@/utils/approval'
  import {mapGetters} from 'vuex'
  import draggable from 'vuedraggable'
  export default {
    components: {
        draggable
    },
    computed: {
      ...mapGetters([
        'permissions'
      ])
    },
    data() {
      return {
        schoolId : sessionStorage.getItem("schoolId"),
        flowId : this.$route.params.id,
        activeTab : 'basic',
        basicInfo : {name:'',sort:''},
        basicRules : {
            name:[
                { required: true, message: '请输入流程名称', trigger: 'blur' },
                { max: 15, message: '流程名称不得超过15个字符', trigger: 'blur' }
            ],
            sort:[
                { required: true, message: '请输入排序字段', trigger: 'blur' },
                { type : 'number', message: '排序字段必须为数字', trigger: 'blur' }
            ]
        },
        advanceInfo : {approver_unique :0,comments_require :0},
        approverUniqueList : [{id:0,name:'不去重'},{id:1,name:'自动去重'}],
        defaultApporver : {id:'new0',condition:'',approver:[]},
        conditionApprover : [],
        conditionDialogVisible : false,
        newConditionId:1,
        curConditionEdit:{condition_id:'',time:true,timeCondition:[{sign:'',value:''}],num:true,numCondition:[{sign:'',value:''}]},
        conditionOptions:[{value:'>=',label:'大于等于'},{value:'>',label:'大于'},{value:'=',label:'等于'},
                          {value:'<=',label:'小于等于'},{value:'<',label:'小于'}],
        approverDialogVisible : false,
        curApprovalEdit : {id:'',type:"1",method:'1',selectedApprover:''},
        selectedApprovers : [],
        type1TreeData : [],
        type2TreeData : [],
        type3TreeData : [],
        defaultTreeProps : {children: 'children',label: 'name'},
        flowCC :{id:'cc_',type:'1',name:'',method:0,selectedApprover:''},
        selectedApproverStage : '',
        contextmenuInfo : {show : false, top:'0px', left:'0px'},
        filterTreeText : '',
        visibleRange :{id:'visible_',type:'1',name:'',method:0,selectedApprover:''},
      }
    },
    methods: {
        //获取流程列表
        getFlowDetail() {
            getFlowDetail({id:this.flowId}).then(res => {
                if (res.code == 200) {
                    this.basicInfo = {name:res.data.name,sort:res.data.sort};
                    this.advanceInfo = {approver_unique:res.data.approver_unique,comments_require:res.data.comments_require ? true : false};
                    if(res.data.condition.length > 0) {
                        let conditions = res.data.condition;
                        for(let i in conditions) {
                            if(conditions[i].condition == '') {
                                this.defaultApporver = {'id':conditions[i].id,'condition':'',approver:[]};
                                for(let ii in conditions[i].approvers) {
                                    let item = conditions[i].approvers[ii];
                                    let data = {id:item.id,condition_id:item.flow_condition_id,type:item.type.toString(), name:item.name,
                                                method:item.method.toString(),selectedApprover:item.approver}
                                    this.defaultApporver.approver.push(data);
                                }
                            } else {
                                let newdata = {'id':conditions[i].id,'condition':conditions[i].condition,approver:[]};
                                for(let ii in conditions[i].approvers) {
                                    let item = conditions[i].approvers[ii];
                                    let data = {id:item.id, condition_id:item.flow_condition_id, type:item.type.toString(), name:item.name,
                                                method:item.method.toString(), selectedApprover:item.approver}
                                    newdata.approver.push(data);
                                }
                                this.conditionApprover.push(newdata);
                            }
                        }
                    }
                    if(res.data.cc != null) {
                        this.flowCC = {id:'cc_',type:res.data.cc.type.toString(),name:res.data.cc.name,selectedApprover:res.data.cc.cc,method:0}
                    }
                    if(res.data.visible != null) {
                        this.visibleRange = {id:'visible_',type:res.data.visible.type.toString(),name:res.data.visible.name,selectedApprover:res.data.visible.range,method:0}
                    }
                } else {
                    this.$message.error("获取流程数据失败！" + res.msg);
                }
            })
        },
        //保存数据
        save() {
            switch(this.activeTab){
                case 'basic':
                    this.saveBasic();
                    break;
                case 'process':
                    this.saveProcess();
                    break;
                case 'visible':
                    this.saveVisible();
                    break;
                case 'advance':
                    this.saveAdvance();
                    break;
            }
        },
        //保存基础信息
        saveBasic() {
            this.$refs['basicform'].validate((valid) => {
                if(valid) {
                    let params = this.basicInfo;
                    params['flow_id'] = this.flowId;

                    saveBasic(params).then(res => {
                        if(res.code == 200) {
                            this.$message.success(res.msg);
                        } else if (res.status === 422) {
                            if(res.data && res.data.errors) {
                                for(let i in res.data.errors) {
                                    this.$message.error(res.data.errors[i][0]);
                                    return false;
                                }
                            }
                        }
                    })
                }
            })
        },
        //保存高级设置
        saveAdvance() {
            let params = this.advanceInfo;
            params['flow_id'] = this.flowId;

            saveAdvance(params).then(res => {
                if(res.code == 200) {
                    this.$message.success(res.msg);
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
        },
        //保存流程设计
        saveProcess() {
            let params = {defaultApporver:this.defaultApporver,conditionApprover:this.conditionApprover,cc:this.flowCC};
            params['flow_id'] = this.flowId;
            saveProcess(params).then(res => {
                if(res.code == 200) {
                    this.$message.success(res.msg);
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
        },
        //保存可见范围
        saveVisible() {
            let params = {visible : this.visibleRange};
            params['flow_id'] = this.flowId;
            saveVisibleRange(params).then(res => {
                if(res.code == 200) {
                    this.$message.success(res.msg);
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
        },
        
        /***********  分条件审批  *********/
        //获取条件文本信息
        getConditionText(condition){
            let timetext = '';
            let numtext = '';
            if(condition.time) {
                timetext += '时长（天）'
                for(let i in condition.timeCondition) {
                    if(condition.timeCondition[i].sign == '>=' || condition.timeCondition[i].sign == '>')
                        timetext = condition.timeCondition[i].value + (condition.timeCondition[i].sign == '>=' ? ' <= ' : ' < ') + timetext;
                    else
                        timetext += ' ' + condition.timeCondition[i].sign + ' ' + condition.timeCondition[i].value;
                }
            }
            if(condition.num) {
                numtext += '数量'
                for(let i in condition.numCondition) {
                    if(condition.numCondition[i].sign == '>=' || condition.numCondition[i].sign == '>')
                        numtext = condition.numCondition[i].value + (condition.numCondition[i].sign == '>=' ? ' <= ' : ' < ') + numtext;
                    else
                        numtext += ' ' + condition.numCondition[i].sign + ' ' + condition.numCondition[i].value;
                }
            }
            
            return timetext + (timetext && numtext ? '  且  ' : '') + numtext;
        },
        //添加新的审批条件弹窗
        addCondition() {
            this.curConditionEdit = {condition_id:'',time:true,timeCondition:[{sign:'',value:''}],num:true,numCondition:[{sign:'',value:''}]};
            this.conditionDialogVisible = true;
        },
        //编辑审批条件
        editCondition(id) {
            for(let i in this.conditionApprover) {
                if(id == this.conditionApprover[i].id) {
                    this.curConditionEdit = deepCopy(this.conditionApprover[i].condition);
                    this.curConditionEdit.condition_id = id;
                    this.conditionDialogVisible = true;
                    break;
                }
            }
        },
        //删除审批条件
        deleteCondition(id) {
            for(let i in this.conditionApprover) {
                if(id == this.conditionApprover[i].id) {
                    this.conditionApprover.splice(i,1);
                    break;
                }
            }
        },
        //保存修改/添加的条件流程
        saveCondition() {
            if(this.validateCondition()) {
                if(this.curConditionEdit.condition_id) {
                    for(let i in this.conditionApprover) {
                        if(this.curConditionEdit.condition_id == this.conditionApprover[i].id) {
                            this.conditionApprover[i].condition = deepCopy(this.curConditionEdit);
                            break;
                        }
                    }
                } else {
                    this.curConditionEdit.condition_id = 'new' + this.newConditionId++;
                    this.conditionApprover.push({id:this.curConditionEdit.condition_id,condition:this.curConditionEdit,approver:[]});
                }
                this.conditionDialogVisible = false;
            }
        },
        //验证条件
        validateCondition() {
            if(!this.curConditionEdit.time && !this.curConditionEdit.num) {
                this.$message.error("未选择任何条件，请选择");
                return false;
            }
            let flag = true;
            if(this.curConditionEdit.time) {
                for(let i in this.curConditionEdit.timeCondition) {
                    if(!this.curConditionEdit.timeCondition[i].sign){
                        flag = false;
                        this.$message.error("时间条件未选择，请选择");
                        break;
                    }
                    if(!this.curConditionEdit.timeCondition[i].value){
                        flag = false;
                        this.$message.error("请输入正确的天数");
                        break;
                    }
                }
                if(flag && this.curConditionEdit.timeCondition.length > 1) {
                    if(!this.checkConditionConflict(this.curConditionEdit.timeCondition)) {
                        this.$message.error("时间条件冲突");
                        return false;
                    }
                }
                if(!flag)
                    return false;
            }
            if(this.curConditionEdit.num) {
                for(let i in this.curConditionEdit.numCondition) {
                    if(!this.curConditionEdit.numCondition[i].sign){
                        flag = false;
                        this.$message.error("数量条件未选择，请选择");
                        break;
                    }
                    if(!this.curConditionEdit.numCondition[i].value){
                        flag = false;
                        this.$message.error("请输入正确的数量");
                        break;
                    }
                }
                if(flag && this.curConditionEdit.numCondition.length > 1) {
                    if(!this.checkConditionConflict(this.curConditionEdit.numCondition)) {
                        this.$message.error("数量条件冲突");
                        return false;
                    }
                }
                if(!flag)
                    return false;
            }
            return true;
        },
        //添加时间条件限制
        addTimeCondition() {
            this.curConditionEdit.timeCondition.push({sign:'',value:''});
        },
        //移除时间条件限制
        removeTimeCondition(i) {
            this.curConditionEdit.timeCondition.splice(i,1);
        },
        //添加数量条件限制
        addNumCondition() {
            this.curConditionEdit.numCondition.push({sign:'',value:''});
        },
        //移除数量条件限制
        removeNumCondition(i) {
            this.curConditionEdit.numCondition.splice(i,1);
        },
        //检查条件冲突
        checkConditionConflict(data) {
            if(data[0]['sign'] == '>=' && data[1]['sign'] == '<=') {
                if(data[0]['value'] > data[1]['value'])
                    return false;
            }
            if(data[0]['sign'] == '<=' && data[1]['sign'] == '>=') {
                if(data[0]['value'] < data[1]['value'])
                    return false;
            }
            if((data[0]['sign'] == '>' || data[0]['sign'] == '>=') && (data[1]['sign'] == '<' || data[0]['sign'] == '<=')) {
                if(data[0]['value'] >= data[1]['value'])
                    return false;
            }
            if((data[0]['sign'] == '<' || data[0]['sign'] == '<=') && (data[1]['sign'] == '>' || data[0]['sign'] == '>=')) {
                if(data[0]['value'] <= data[1]['value'])
                    return false;
            }
            return true;
        },
        
        /***********  审批人  *********/
        //获取选取人员的数据
        getType1TreeData() {
            getAllDepartmentAndUser().then(res => {
                if(res.code == 200) {
                    this.type1TreeData = res.data;
                }
            })
        },
        //获取选取职务和职务类型的数据
        getType23TreeData() {
            getJobAndJobType().then(res => {
                if(res.code == 200) {
                    this.type2TreeData = res.data.jobsType;
                    this.type3TreeData = res.data.jobs;
                }
            })
        },
        //选择审批人
        checkTreeData(a,b,c) {
            if(this.curApprovalEdit.type == 1 && a.type != 2) 
                return false;
            if(b) {
                this.selectedApprovers.push({'id':a.id,'name':a.name,'key' : a.key})
            } else {
                for(let i in this.selectedApprovers) {
                    if(this.selectedApprovers[i].key == a.key) {
                        this.selectedApprovers.splice(i,1);
                        break;
                    }
                }
            }
        },
        //移除审批人
        removeSelectedApprover(i) {
            let user = this.selectedApprovers[i];
            this.selectedApprovers.splice(i,1);
            this.$refs["type" + this.curApprovalEdit.type + "Tree"].setChecked(user.key,false);
        },
        //添加新的审批人流程
        addApproverDialog(id) {
            if(id == 'default') {
                this.curApprovalEdit = {id:'default_',type:"1",method:'1',selectedApprover:''}
            } else {
                this.curApprovalEdit = {id:id + '_',type:"1",method:'1',selectedApprover:''}
            }
            this.approverDialogVisible = true;
            this.$nextTick(() => {
                this.checkTreeNode('');
            })
        },
        //保存编辑的审批人
        saveApprover() {
            let ids = this.curApprovalEdit.id.split('_');
            if(ids[0] == 'cc' || ids[0] == 'visible' || this.selectedApprovers.length != 0) {
                let selectedApprover = this.getApproverName(this.selectedApprovers,ids[0] == 'cc' || ids[0] == 'visible' ? 50 : 10);
                this.curApprovalEdit['name'] = selectedApprover['name'];
                this.curApprovalEdit['selectedApprover'] = selectedApprover['ids'];
                if(ids[0] == 'default') {
                    if(ids[1] == '') {
                        this.defaultApporver.approver.push(deepCopy(this.curApprovalEdit));
                    } else {
                        this.defaultApporver.approver[ids[1]] = deepCopy(this.curApprovalEdit);
                    }
                } else if(ids[0] == 'cc') {
                    this.flowCC = deepCopy(this.curApprovalEdit);
                } else if(ids[0] == 'visible') {
                    this.visibleRange = deepCopy(this.curApprovalEdit);
                }  else {
                    for(let i in this.conditionApprover) {
                        if(this.conditionApprover[i].id == ids[0]) {
                            if(ids[1] == '') {
                                this.conditionApprover[i].approver.push(deepCopy(this.curApprovalEdit));
                            } else {
                                this.conditionApprover[i].approver[ids[1]] = deepCopy(this.curApprovalEdit);
                            }
                            break;
                        }
                    }
                }
            }
            this.approverDialogVisible = false;
        },
        //获取审批人名称
        getApproverName(approvers,len) {
            let exitIds = '';
            let name = '';
            for(let i in approvers) {
                if(exitIds.indexOf(approvers[i].id) === -1) {
                    name += (name == '' ? '' : '、') + approvers[i]['name'];
                    exitIds += (exitIds == '' ? '' : ',') + approvers[i].id;
                }
            }

            if(name.length > len) {
                name = name.substr(0,len);
                name = name.replace(/、$/,'') + '...'
            } 
            return {name : name, ids : exitIds};
        },
        //右键点击事件
        contextmenu(e,sid) {
            this.selectedApproverStage = sid;
            this.contextmenuInfo.show = true;
            this.contextmenuInfo.left = e.clientX - 5 + 'px';
            this.contextmenuInfo.top = e.clientY - 5 + 'px';
        },
        //编辑审批人
        editApprover() {
            let ids = this.selectedApproverStage.split('_');
            if(ids[0] == 'default') {
                this.curApprovalEdit = deepCopy(this.defaultApporver.approver[ids[1]]);
            } else if(ids[0] == 'cc') {
                this.curApprovalEdit = deepCopy(this.flowCC);
            } else if (ids[0] == 'visible') {
                this.curApprovalEdit = deepCopy(this.visibleRange);
            } else {
                for(let i in this.conditionApprover) {
                    if(ids[0] == this.conditionApprover[i].id) {
                        this.curApprovalEdit = deepCopy(this.conditionApprover[i].approver[ids[1]]);
                    }
                }
            }
            this.curApprovalEdit.id = this.selectedApproverStage;
            this.selectedApproverStage = '';
            this.contextmenuInfo.show = false;
            this.approverDialogVisible = true;   
            this.$nextTick(() => {
                this.checkTreeNode(this.curApprovalEdit.selectedApprover);
            })
        },
        //删除审批人
        deleteApprover() {
            this.$confirm('确定要删除该审批人吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let ids = this.selectedApproverStage.split('_');
                if(ids[0] == 'default') {
                    this.defaultApporver.approver.splice(ids[1],1);
                } else {
                    for(let i in this.conditionApprover) {
                        if(ids[0] == this.conditionApprover[i].id) {
                            this.conditionApprover[i].approver.splice(ids[1],1);
                        }
                    }
                }
                this.selectedApproverStage = '';
                this.contextmenuInfo.show = false;
            }).catch(() => {

            });
            
        },
        //设置树状结构默认被选择值
        checkTreeNode(selectedApprover) {
            this.selectedApprovers = [];
            this.$refs["type" + this.curApprovalEdit.type + "Tree"].setCheckedKeys([]);
            if(selectedApprover != '') {
                this.$nextTick(() => {
                    selectedApprover = selectedApprover.split(',');
                    let keys = [];
                    keys = this.getTreeNodeKeyById(selectedApprover,this.$refs["type" + this.curApprovalEdit.type + "Tree"].data);
                    this.$refs["type" + this.curApprovalEdit.type + "Tree"].setCheckedKeys(keys);
                })
            }
        },
        filterTreeNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        //根据ID获取树形结构的key
        getTreeNodeKeyById(selectedApprover,treedata) {
            let keys = [];
            for(let i in selectedApprover) {
                for(let ii in treedata) {
                    if(treedata[ii].children && treedata[ii].children.length != 0) {
                        keys = keys.concat(this.getTreeNodeKeyById([selectedApprover[i]],treedata[ii].children));
                    }
                    if(treedata[ii].id == selectedApprover[i]) {
                        keys.push(treedata[ii].key);
                        break;
                    }
                }
            }
            return keys;
        },
        //切换审批人类型清除选项
        changeApproverType(type) {
            this.curApprovalEdit.selectedApprover = '';
            this.$refs["type1Tree"].setCheckedKeys([]);
            this.$refs["type2Tree"].setCheckedKeys([]);
            this.$refs["type3Tree"].setCheckedKeys([]);
            this.selectedApprovers = [];
        },
        
        //编辑抄送人
        editCc() {
            this.selectedApproverStage = 'cc_';
            this.editApprover();
        },
        //编辑可见范围
        editVisibleRange() {
            this.selectedApproverStage = 'visible_';
            this.editApprover();
        },
        //拖拽调整优先级
        datadragEnd(evt) {
            
        },
        //取消返回上一页
        goBack() {
            this.$router.back(-1);
        }
    },
    watch: {
        'filterTreeText': function(val){
            this.$refs["type" + this.curApprovalEdit.type + "Tree"].filter(val);
        }
    },
    created() {
        this.getFlowDetail();
        this.getType1TreeData();
        this.getType23TreeData();
    }
  }
</script>
<style>
    .opt-buttons{text-align: left;margin-top: 40px}
    .mainPanel .opt-button,.opt-buttons .opt-button{height:33px;padding: 8px 20px}
    .opt-buttons .opt-button:first-child{margin-right: 20px}
    .mainPanel{min-height: 360px;font-size: 14px;margin-top:34px}
    .mainPanel i.icon-basic{width:28px;height:32px;background: url(../../assets/icons/basic.png) no-repeat;display: block;margin:0 auto}
    .mainPanel .is-active i.icon-basic,.mainPanel .el-tabs__item:hover i.icon-basic{background-image: url(../../assets/icons/basic-active.png)}
    .mainPanel i.icon-process{width:30px;height:30px;background: url(../../assets/icons/process.png) no-repeat;display: block;margin:0 auto}
    .mainPanel .is-active i.icon-process,.mainPanel .el-tabs__item:hover i.icon-process{background-image: url(../../assets/icons/process-active.png)}
    .mainPanel i.icon-form{width:30px;height:30px;background: url(../../assets/icons/form.png) no-repeat;display: block;margin:0 auto}
    .mainPanel .is-active i.icon-form,.mainPanel .el-tabs__item:hover i.icon-form{background-image: url(../../assets/icons/form-active.png)}
    .mainPanel i.icon-visible{width:35px;height:30px;background: url(../../assets/icons/visible.png) no-repeat;display: block;margin:0 auto}
    .mainPanel .is-active i.icon-visible,.mainPanel .el-tabs__item:hover i.icon-visible{background-image: url(../../assets/icons/visible-active.png)}
    .mainPanel i.icon-advance{width:30px;height:30px;background: url(../../assets/icons/advance.png)no-repeat;display: block;margin:0 auto}
    .mainPanel .is-active i.icon-advance,.mainPanel .el-tabs__item:hover i.icon-advance{background-image: url(../../assets/icons/advance-active.png)}
    .mainPanel .el-tabs__item{height:60px;line-height: 30px;padding: 0 30px;}
    .mainPanel .form-item{ margin:15px 0 20px;}
    .mainPanel .form-input{ width:350px;}
    .mainPanel .tips{line-height: 20px;color:#aaa;}
    .mainPanel .title{margin:15px 0;background: #f2f2f2;color:#333333;line-height: 33px;}
    .mainPanel .title:before{content:url(../../assets/icons/edit.png);display: inline-block;width:30px;
                                margin-right: 10px;text-align: center;background: #999999}
    .mainPanel .flow{padding: 0 30px;}
    .mainPanel .label{width:50px;display: inline-block;}
    .mainPanel .approver{display: inline-block}
    .mainPanel .add-icon{font-size: 20px;cursor: pointer;color:#02a0a3}
    .mainPanel .condition{display: inline-block;font-size: 14px;width:100%}
    .mainPanel .condition-area{margin: 30px 0;width:calc(100% - 200px);}
    .mainPanel .condition-area:last-child{margin-bottom: 0}
    .mainPanel .condition-item{border: 1px solid #ccc;float:left;width:calc(100% - 120px);}
    .mainPanel .condition-item-header{padding: 5px 20px;border-bottom: 1px solid #ccc;cursor: move}
    .mainPanel .condition-item-flow{padding: 25px 15px;}
    .mainPanel .condition-item-edit,.condition-item-delete{float: right;}
    .mainPanel .condition-item-edit{margin-right: 20px}
    .mainPanel .visible-title{font-weight: bold;line-height: 30px;}
    .mainPanel .visible-content{line-height: 30px;}
    .edit-dialog{}
    .edit-dialog .el-dialog__body{padding: 0 20px;}
    .edit-dialog .dialog-content{border-top: 1px solid #02B2B5;padding: 10px 0}
    .edit-dialog .dialog-content .dialog-form-item{margin-bottom: 0;}
    .edit-dialog .dialog-content .dialog-form-input{width:100px;}
    .edit-dialog .dialog-content .dialog-form-input input{text-align: center}
    .edit-dialog .dialog-area{border: 1px solid #D2D6DE;margin-top: 20px;height:300px;border-radius: 4px;overflow-y: auto}
    .edit-dialog .dialog-area .item{padding: 5px 30px;}
    .edit-dialog .dialog-area .item i{color:#02B2B5;float: right;cursor:pointer}
    .contextmenu{position: fixed;border: 1px solid #D2D6DE;border-radius: 4px;width:100px;line-height: 30px;text-align: center;background: #FFF;z-index: 10}
    .contextmenu .item:first-child{border-bottom: 1px solid #D2D6DE;}
</style>
