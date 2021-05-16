<template>
    <div id="global">
        <el-form :model="formData" :rules="rules" label-position="right" label-width="90px">
            <el-form-item label="小组名称:" prop="groupName">
                <el-input v-model="formData.groupName" clearable placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="导师:" prop="mentor">
                <el-input v-model="formData.mentor" clearable placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="比赛项目:" prop="competitionItem">
                <el-select v-model="formData.competitionItem" placeholder="请选择项目">
                    <el-option label="电子商务 “三创”赛" value="1"></el-option>
                    <el-option label="“互联网+”" value="2"></el-option>
                    <el-option label="大学生创新创业" value="3"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="比赛年份:" prop="period">
                <el-input v-model="formData.period" clearable placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button :plain="true" @click="open">提示</el-button>
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="back" type="primary">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    createGroup,
    updateGroup,
    findGroup
} from "@/api/group";  //  此处请自行替换地址
import infoList from "@/mixins/infoList";
export default {
    name: "Group",
    mixins: [infoList],
    data() {
        return {
            type: "",
            formData: {
                groupName: "",
                mentor: "",
                master: "",
                competitionItem: "",
                period: "",

            },
            rules: {
                groupName: [
                    {required: true, message: '请输入小组名称', trigger: 'blur'},
                    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                ],
                mentor: [
                    {required: true, message: '请输入导师名称', trigger: 'blur'},
                    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                ],
                // master: [
                //     {required: true, message: '请输入组长id', trigger: 'blur'},
                //     {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                // ],
                competitionItem: [
                    { required: true, message: '请选择比赛项目', trigger: 'change' }
                ],
                period: [
                    { required: true, message: '请输入比赛年份 届数', trigger: 'blur' }
                ],
            }
        };
    },
    methods: {
        open() {
            this.$message('创建小组者默认为组长');
        },
        async save() {
            let res;
            switch (this.type) {
                case "create":
                    res = await createGroup(this.formData);
                    break;
                case "update":
                    res = await updateGroup(this.formData);
                    break;
                default:
                    res = await createGroup(this.formData);
                    break;
            }
            if (res.code == 0) {
                this.$message({
                    type: "success",
                    message: "创建/更改成功"
                })
            }
        },
        back() {
            this.$router.go(-1)
        }
    },
    async created() {
        // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
        if (this.$route.query.id) {
            const res = await findGroup({ID: this.$route.query.id})
            if (res.code == 0) {
                this.formData = res.data.regroup
                this.type == "update"
            }
        } else {
            this.type == "create"
        }

    }
};
</script>

<style>
    #global{
        width: 60%;
    }
</style>