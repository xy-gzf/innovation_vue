import service from '@/utils/request'

export const createMember = (data) => {
    return service({
        url: "/member/createMember",
        method: 'post',
        data
    })
}
