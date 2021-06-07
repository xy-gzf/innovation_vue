import service from '@/utils/request'

// @Tags Dynamic
// @Summary 创建Dynamic
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Dynamic true "创建Dynamic"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /dynamic/createDynamic [post]
export const createDynamic = (data) => {
    return service({
        url: "/dynamic/createDynamic",
        method: 'post',
        data
    })
}

// @Tags Dynamic
// @Summary 删除Dynamic
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Dynamic true "删除Dynamic"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /Dynamic/deleteDynamic [delete]
export const deleteDynamic = (data) => {
    return service({
        url: "/dynamic/deleteDynamic",
        method: 'delete',
        data
    })
}

// @Tags Dynamic
// @Summary 删除Dynamic
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除Dynamic"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /Dynamic/deleteDynamic [delete]
export const deleteDynamicByIds = (data) => {
    return service({
        url: "/dynamic/deleteDynamicByIds",
        method: 'delete',
        data
    })
}

// @Tags Dynamic
// @Summary 更新Dynamic
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Dynamic true "更新Dynamic"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /Dynamic/updateDynamic [put]
export const updateDynamic = (data) => {
    return service({
        url: "/dynamic/updateDynamic",
        method: 'put',
        data
    })
}


// @Tags Dynamic
// @Summary 用id查询Dynamic
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Dynamic true "用id查询Dynamic"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /Dynamic/findDynamic [get]
export const findDynamic = (params) => {
    return service({
        url: "/dynamic/findDynamic",
        method: 'get',
        params
    })
}


// @Tags Dynamic
// @Summary 分页获取Dynamic列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.PageInfo true "分页获取Dynamic列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /Dynamic/getDynamicList [get]
export const getDynamicList = (params) => {
    return service({
        url: "/dynamic/getDynamicList",
        method: 'get',
        params
    })
}
