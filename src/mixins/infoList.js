import { getDict } from "@/utils/dictionary";
export default {
    data() {
        return {
            page: 1,
            total: 10,
            pageSize: 10,
            tableData: [],
            searchInfo: {}
        }
    },
    methods: {
        filterDict(value, type) {
            const rowLabel = this[type + "Options"] && this[type + "Options"].filter(item => item.value == value)
            return rowLabel && rowLabel[0] && rowLabel[0].label
        },
        async getDict(type) {
            const dicts = await getDict(type)
            this[type + "Options"] = dicts
            return dicts
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getTableData()
        },
        handleCurrentChange(val) {
            this.page = val
            this.getTableData()
        },
        async getTableData(page = this.page, pageSize = this.pageSize) {
            const table = await this.listApi({ page, pageSize, ...this.searchInfo })
            if (table.code == 0) {
                this.tableData = table.data.list
                for (var i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].groups != null) {
                        if (this.tableData[i].groups.competitionItem === "1") {
                            this.tableData[i].groups.competitionItem = "电子商务“三创”赛"
                        } else if (this.tableData[i].groups.competitionItem === "2") {
                            this.tableData[i].groups.competitionItem = "“互联网+”挑战赛"
                        } else {
                            this.tableData[i].groups.competitionItem = "全国大学生创新创业挑战赛"
                        }
                        continue
                    }
                    if (this.tableData[i].competitionItem === "1") {
                        this.tableData[i].competitionItem = "电子商务“三创”赛"
                    } else if (this.tableData[i].competitionItem === "2") {
                        this.tableData[i].competitionItem = "“互联网+”挑战赛"
                    } else {
                        this.tableData[i].competitionItem = "全国大学生创新创业挑战赛"
                    }
                }
                this.total = table.data.total
                this.page = table.data.page
                this.pageSize = table.data.pageSize
            }
        }
    }
}