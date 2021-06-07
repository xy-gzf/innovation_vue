<template>
    <div id="global">
        <el-form :model="formData" :rules="rules" label-position="right" label-width="90px">
            <el-form-item label="标题:" prop="title">
                <el-input v-model="formData.title" clearable placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="作者:" prop="author">
                <el-input v-model="formData.author" clearable placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="内容:" prop="content">
                <el-input v-model="formData.content" clearable placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="back" type="primary">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {
    createDynamic,
} from "@/api/dynamic";  //  此处请自行替换地址
import infoList from "@/mixins/infoList";
export default {
    name: "dynamicForm",
    data() {
        return {
            type: "",
            formData: {
                title: "",
                author: "",
                content: "",

            },
            rules: {
                title: [
                    {required: true, message: '请输入标题', trigger: 'blur'},
                    {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                ],
                author: [
                    {required: true, message: '请输入作者', trigger: 'blur'},
                    {min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur'}
                ],
                content: [
                    {required: true, message: '请输入内容', trigger: 'blur'},
                ]
            }
        };
    },
    methods: {
        async save() {
            let res;
            await createDynamic(this.formData);
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
}
</script>

<style scoped>
    #global{
        width: 60%;
    }
</style>