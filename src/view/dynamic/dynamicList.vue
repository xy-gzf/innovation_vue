<template>
    <div>
        <div class="search-term">
            <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
                <el-form-item label="标题">
                    <el-input placeholder="搜索条件" v-model="searchInfo.mentor"></el-input>
                </el-form-item>
                
                <el-form-item label="作者">
                    <el-input class="search" placeholder="搜索条件" v-model="searchInfo.master"></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button @click="onSubmit" type="primary">查询</el-button>
                </el-form-item>
                
                <el-form-item>
                    <el-popover placement="top" v-model="deleteVisible" width="160">
                        <p>确定要删除吗？</p>
                        <div style="text-align: right; margin: 0">
                            <el-button @click="deleteVisible = false" size="mini" type="text">取消</el-button>
                            <el-button @click="onDelete" size="mini" type="primary">确定</el-button>
                        </div>
                        <el-button icon="el-icon-delete" size="mini" slot="reference" type="danger">批量删除</el-button>
                    </el-popover>
                </el-form-item>
            </el-form>
        </div>
        
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

            <el-table-column label="标题" prop="title" width="300"></el-table-column>

            <el-table-column label="作者" prop="author" width="80"></el-table-column>
            
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button class="table-button" @click="updateDynamic(scope.row)" size="small" type="primary"
                               icon="el-icon-edit">查看内容
                    </el-button>
                    
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRow(scope.row)">删除
                    </el-button>
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


        <el-dialog :before-close="closeDialog" :visible.sync="dialogContentVisible" title="动态">
            <div>标题：{{contentData.title}}</div>
            <div>作者：{{contentData.author}}</div>
            <div>内容：{{contentData.content}}</div>

            <div class="dialog-footer" slot="footer">
                <el-button @click="closeDialog">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import {
    createDynamic,
    deleteDynamic,
    deleteDynamicByIds,
    updateDynamic,
    findDynamic,
    getDynamicList
} from "@/api/dynamic";  //  此处请自行替换地址
import infoList from "@/mixins/infoList";
export default {
    name: "dynamicList",
    mixins: [infoList],
    data() {
        return {
            listApi: getDynamicList,
            dialogContentVisible: false,
            type: "",
            deleteVisible: false,
            multipleSelection: [], contentData: {
                title: "",
                author: "",
                content: "",

            }
        };
    },
    methods: {
        //条件搜索前端看此方法
        onSubmit() {
            this.page = 1
            this.pageSize = 10
            this.getTableData()
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
        },
        deleteRow(row) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteDynamic(row);
            });
        },
        async onDelete() {
            const ids = []
            if (this.multipleSelection.length == 0) {
                this.$message({
                    type: 'warning',
                    message: '请选择要删除的数据'
                })
                return
            }
            this.multipleSelection &&
            this.multipleSelection.map(item => {
                ids.push(item.ID)
            })
            const res = await deleteDynamicByIds({ids})
            if (res.code == 0) {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                if (this.tableData.length == ids.length) {
                    this.page--;
                }
                this.deleteVisible = false
                this.getTableData()
            }
        },
        async updateDynamic(row) {
            const res = await findDynamic({ID: row.ID});
            this.type = "update";
            if (res.code == 0) {
                this.contentData = res.data.reDynamic;
                this.dialogContentVisible = true;
            }
        },
        closeDialog() {
            this.dialogContentVisible = false;
            this.contentData = {
                title: "",
                author: "",
                content: "",

            };
        },
        async deleteDynamic(row) {
            const res = await deleteDynamic({ID: row.ID});
            if (res.code == 0) {
                this.$message({
                    type: "success",
                    message: "删除成功"
                });
                if (this.tableData.length == 1) {
                    this.page--;
                }
                this.getTableData();
            }
        },
        openDialog() {
            this.dialogContentVisible = true;
        }
    },
    async created() {
        await this.getTableData();
    }
}
</script>

<style scoped>

</style>