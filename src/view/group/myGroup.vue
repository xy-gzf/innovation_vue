<template>
    <div>
        <el-table
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
            ref="multipleTable"
            stripe
            style="width: 100%"
            tooltip-effect="dark"
        >
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column label="年份" prop="groups.period" width="120"></el-table-column>

            <el-table-column label="赛事" prop="groups.competitionItem" width="200"></el-table-column>

            <el-table-column label="小组名称" prop="groups.groupName" width="120"></el-table-column>

            <el-table-column label="导师" prop="groups.mentor" width="120"></el-table-column>

            <el-table-column label="组长" prop="groups.master" width="120"></el-table-column>

            <el-table-column label="操作">
                <template slot-scope="scope">
                    <div class="view">
                        <el-button @click="viewUser(scope.row)" size="small" type="primary">查看</el-button>
                    </div>

                    <div class="addMember" v-show="isAddMember(scope.row)">
                        <el-button @click="addMember(scope.row.groups.ID)" size="small" type="info">添加队友</el-button>
                    </div>

                    <!-- 文件上传及查看 -->
                    <div v-if="isHaveFile(scope.row)" class="addPdf">
                        <el-button size="small" type="success" @click="addFile(scope.row)">上传文件</el-button>
                    </div>
                    <div v-else class="addPdf">
                        <el-button size="small" type="success" @click="viewPdf(scope.row)">查看文件</el-button>
                        <el-button size="small" type="primary" @click="downloadPdf(scope.row)">下载文件</el-button>
                        <el-button size="small" type="info" @click="addFile(scope.row)">更新文件</el-button>
                    </div>

                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[10, 30, 50, 100]"
            :style="{float:'right',padding:'20px'}"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>

        <el-dialog :before-close="closeTableDialog" :visible.sync="dialogTableVisible" title="小组详情">

            <div class="groupInfo">{{ userTableData.groups.period }}年 {{ userTableData.groups.competitionItem }}</div>
            <div class="groupInfo">小组名称：{{ userTableData.groups.groupName }}</div>
            <div class="groupInfo">导师：{{ userTableData.groups.mentor }}</div>
            <div class="groupInfo">组长：{{ userTableData.groups.master }}</div>

            <div class="tableTitle">小组成员</div>
            <el-table
                :data="userTableData.users"
                @selection-change="handleSelectionChange"
                border
                ref="multipleTable"
                stripe
                style="width: 100%"
                tooltip-effect="dark"
            >
                <el-table-column type="selection" width="55"></el-table-column>

                <el-table-column label="用户名" prop="nickName" width="120"></el-table-column>

                <el-table-column label="学号" prop="studentId" width="200"></el-table-column>

            </el-table>

        </el-dialog>

        <el-dialog :before-close="closeFormDialog" :visible.sync="dialogFormVisible" title="添加队友" width="30%">
            <!--表单 -->
            <el-form :model="formData" :rules="rules" label-position="right" label-width="90px">
                <el-form-item label="小组号:">
                    <el-input v-model="formData.groupId" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="成员学号:" prop="userId">
                    <el-input v-model="formData.userId" clearable placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="成员姓名:" prop="nickName">
                    <el-input v-model="formData.nickName" clearable placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="closeFormDialog">取 消</el-button>
                <el-button @click="enterFormDialog" type="primary">确 定</el-button>
            </div>

        </el-dialog>

        <el-dialog :before-close="closeFileDialog" :visible.sync="dialogFileVisible" title="上传文件" width="30%">
            <el-upload
                ref="upload"
                :action="`${path}/fileUploadAndDownload/uploadPdf`"
                :before-upload="handleBeforeUpload"
                :headers="{ 'x-token': token ,'groupId': groupId}"
                :on-error="handleError"
                :on-success="handleSuc"
                :on-exceed="handleExceed"
                :limit="1"
                accept=".pdf"
            >
                <i class="el-icon-upload"></i>
                <el-button size="small" type="primary">点击上传</el-button>
                <div class="el-upload__tip" slot="tip">只能上传pdf文件，且不超过10M</div>
            </el-upload>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closeFileDialog">取 消</el-button>
                <el-button type="primary" @click="closeFileDialog">确 定</el-button>
            </span>

        </el-dialog>

        <el-dialog :before-close="closePdfDialog" :visible.sync="dialogPdfVisible" title="文件" width="80%">
            <div ref="printContent" class="magnifer">
                <Pdf
                    v-for="i in numPages"
                    :key="i"
                    :src="pdf"
                    :page="i"
                />
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closePdfDialog">取消</el-button>
                <el-button type="primary" @click="printImg">转图片打印</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
const path = process.env.VUE_APP_BASE_API;
import {mapGetters} from "vuex";
import {getMyGroups} from "@/api/group";  //  此处请自行替换地址
import {createMember} from "@/api/participating_members"
import infoList from "@/mixins/infoList";
import Pdf from 'vue-pdf'
import {downloadPdf} from "@/api/pdf";

export default {
    name: "myGroups",
    components: {Pdf},
    mixins: [infoList],

    data() {
        return {
            listApi: getMyGroups,
            dialogTableVisible: false,
            dialogFormVisible: false,
            dialogFileVisible: false,
            dialogPdfVisible: false,
            path: path,
            type: "",
            multipleSelection: [],
            userTableData: {
                groups: {
                    groupName: "",
                    master: "",
                    mentor: "",
                },
                users: [],

            },

            formData: {
                userId: "",
                groupId: "",
                nickName:"",

            },
            rules: {
                userId: [
                    {required: true, message: '请输入学号', trigger: 'blur'},
                    {min: 10, max: 10, message: '长度必须为10', trigger: 'blur'}
                ],
                nickName: [
                    {required: true, message: '请输入名称', trigger: 'blur'},
                    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                ],
            },


            fileList: [],
            groupId: 0,
            pdf: '',
            numPages: undefined,
        };
    },
    computed: {
        ...mapGetters("user", ["userInfo", "token"])
    },
    // filters: {
    //     formatDate: function (time) {
    //         if (time != null && time != "") {
    //             var date = new Date(time);
    //             return date
    //             //return formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
    //         } else {
    //             return "";
    //         }
    //     }
    // },

    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val
        },

        //文件超出个数限制时的钩子
        handleExceed() {
            this.$notify.warning({
                title: '提示',
                message: '上传文件已存在,替换请先移除！',
                duration: 2000
            })
        },
        //上传文件之前的钩子
        handleBeforeUpload(file) {
            console.log(file.type)
            //判断文件格式
            if (file.type !== 'application/pdf') {
                this.$refs.upload.clearFiles()
                this.$notify.error({
                    title: '错误',
                    message: '上传文件只能是 pdf格式!',
                    duration: 2000
                })
                return
            }
            //判断文件大小
            if (!(file.size / 1024 / 1024 < 10)) {
                this.$refs.upload.clearFiles()
                this.$notify.error({
                    title: '错误',
                    message: '上传文件大小不能超过 10MB!',
                    duration: 2000
                })
                return
            }

            // return true
        },
        //文件列表移除文件时的钩子
        beforeRemove() {
            this.$refs.upload.clearFiles()
            this.fileList = []
        },

        //上传成功处理
        handleSuc(res) {
            if (res.code == 0) {
                this.$message({
                    type: "success",
                    message: "上传成功"
                });
                if (res.code == 0) {
                    this.getTableData();
                }
            } else {
                this.$message({
                    type: "warning",
                    message: res.msg
                });
            }
        },
        //上传失败处理
        handleError(err) {
            this.$notify.error({
                title: '失败',
                message: err,
                duration: 3000
            })
        },


        //打开查看
        viewUser(row) {
            this.userTableData = row;
            this.dialogTableVisible = true;
        },
        //关闭查看
        closeTableDialog() {
            this.dialogTableVisible = false;
            this.userTableData = {
                groups: {
                    groupName: "",
                    master: "",
                    mentor: "",
                },
                users: [],

            };
        },

        //打开添加队友
        addMember(id) {
            this.formData.groupId = id.toString();
            this.dialogFormVisible = true;
        },
        //关闭添加队友
        closeFormDialog() {
            this.dialogFormVisible = false;
            this.formData = {
                groupId: "",
                userId: "",
            }
        },

        //打开文件上传
        addFile(row) {
            this.groupId = row.groups.ID
            this.dialogFileVisible = true;
        },
        //关闭文件上传
        closeFileDialog() {
            this.dialogFileVisible = false;
            this.groupId = 0;
        },

        //打开pdf预览
        viewPdf(row) {
            let path = 'http://localhost:8080/' + row.groups.filePath
            this.pdf = Pdf.createLoadingTask(path)
            this.pdf.promise.then(pdf => {
                this.numPages = pdf.numPages
            })

            this.dialogPdfVisible = true;
        },
        //关闭Pdf预览
        closePdfDialog() {
            this.pdf = ""
            this.dialogPdfVisible = false;
        },


        //创建队友
        async enterFormDialog() {
            const res = await createMember(this.formData);
            if (res.code == 0) {
                this.$message({
                    type: "success",
                    message: "创建/更改成功"
                })
                this.closeFormDialog();
                this.getTableData();
            }
        },

        //下载pdf
        async downloadPdf(row) {
            console.log(row.groups.filePath)
            await downloadPdf(row.groups.filePath);
        },

        //是否显示添加队友按钮
        isAddMember(row) {
            if (row.users.length < 5) {
                return true
            }
            return false
        },
        //是否已经有文件
        isHaveFile(row) {
            if (row.groups.filePath === "") {
                return true
            }
            return false
        },


        printImg() {
            // html2canvas(this.$refs.printContent, {
            //     backgroundColor: null,
            //     useCORS: true,
            //     windowHeight: document.body.scrollHeight
            // }).then((canvas) => {
            //     const url = canvas.toDataURL()
            //     // printJS({
            //     //     printable: url,
            //     //     type: 'image',
            //     //     documentTitle: this.printName
            //     // })
            //     // console.log(url)
            // })
        },

    },
    async created() {
        await this.getTableData();
    }
}
</script>

<style>
.groupInfo {
    font-size: medium;
    margin: 10px;
}

.tableTitle {
    font-size: large;
    margin: 20px auto;
    text-align: center;
}

.view {
    display: inline-block;
    margin: 0 5px;
}

.addMember {
    display: inline-block;
    margin: 0 5px;
}

.addPdf {
    display: inline-block;
    margin: 0 5px;
}


</style>
