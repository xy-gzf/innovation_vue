<template>
    <div>
        <div class="search-term">
            <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
                <el-form-item label="比赛项目:">
                    <el-select v-model="searchInfo.competitionItem" placeholder="请选择项目">
                        <el-option label="电子商务 “三创”赛" value="1"></el-option>
                        <el-option label="“互联网+”" value="2"></el-option>
                        <el-option label="大学生创新创业" value="3"></el-option>
                    </el-select>
                </el-form-item>
<!--                <el-form-item label="小组名称">-->
<!--                    <el-input placeholder="搜索条件" v-model="searchInfo.groupName"></el-input>-->
<!--                </el-form-item>-->
                <el-form-item label="导师">
                    <el-input placeholder="搜索条件" v-model="searchInfo.mentor"></el-input>
                </el-form-item>
                <el-form-item label="组长">
                    <el-input class="search" placeholder="搜索条件" v-model="searchInfo.master"></el-input>
                </el-form-item>
                <el-form-item label="年份">
                    <el-input class="search" placeholder="搜索条件" v-model="searchInfo.period"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="onSubmit" type="primary">查询</el-button>
                </el-form-item>
<!--                <el-form-item>-->
<!--                    <el-button @click="openDialog" type="primary">新增小组</el-button>-->
<!--                </el-form-item>-->
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

            <el-table-column label="年份" prop="period" width="120"></el-table-column>

            <el-table-column label="赛事" prop="competitionItem" width="200"></el-table-column>

            <el-table-column label="日期" width="180">
                <template slot-scope="scope">{{ scope.row.CreatedAt|formatDate }}</template>
            </el-table-column>

            <el-table-column label="小组名称" prop="groupName" width="120"></el-table-column>

            <el-table-column label="导师" prop="mentor" width="120"></el-table-column>

            <el-table-column label="组长" prop="master" width="120"></el-table-column>



            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button class="table-button" @click="updateGroup(scope.row)" size="small" type="primary"
                               icon="el-icon-edit">变更
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

        <el-dialog :before-close="closeDialog" :visible.sync="dialogFormVisible" title="弹窗操作">
            <el-form :model="formData" label-position="right" label-width="80px">
                <el-form-item label="小组名称:">
                    <el-input v-model="formData.groupName" clearable placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="导师:">
                    <el-input v-model="formData.mentor" clearable placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="组长:">
                    <el-input v-model="formData.master" clearable placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="赛事:">
                    <el-input v-model="formData.master" clearable placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="年份:">
                    <el-input v-model="formData.period" clearable placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button @click="enterDialog" type="primary">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import {
    createGroup,
    deleteGroup,
    deleteGroupByIds,
    updateGroup,
    findGroup,
    getGroupList
} from "@/api/group";  //  此处请自行替换地址
import {formatTimeToStr} from "@/utils/date";
import infoList from "@/mixins/infoList";
export default {
    name: "Group",
    mixins: [infoList],
    data() {
        return {
            listApi: getGroupList,
            dialogFormVisible: false,
            type: "",
            deleteVisible: false,
            multipleSelection: [], formData: {
                groupName: "",
                mentor: "",
                master: "",
                competitionItem: "",
                period: "",

            }
        };
    },
    filters: {
        formatDate: function (time) {
            if (time != null && time != "") {
                var date = new Date(time);
                return formatTimeToStr(date, "yyyy-MM-dd hh:mm:ss");
            } else {
                return "";
            }
        },
        formatBoolean: function (bool) {
            if (bool != null) {
                return bool ? "是" : "否";
            } else {
                return "";
            }
        }
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
                this.deleteGroup(row);
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
            const res = await deleteGroupByIds({ids})
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
        async updateGroup(row) {
            const res = await findGroup({ID: row.ID});
            this.type = "update";
            if (res.code == 0) {
                this.formData = res.data.regroup;
                this.dialogFormVisible = true;
            }
        },
        closeDialog() {
            this.dialogFormVisible = false;
            this.formData = {
                name: "",
                teacher: "",
                group_leader: "",

            };
        },
        async deleteGroup(row) {
            const res = await deleteGroup({ID: row.ID});
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
        async enterDialog() {
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
                this.closeDialog();
                this.getTableData();
            }
        },
        openDialog() {
            this.type = "create";
            this.dialogFormVisible = true;
        }
    },
    async created() {
        await this.getTableData();
    }
};
</script>

<style>
    .search{
        width: 110px;
    }
</style>
