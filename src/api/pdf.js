import service from "@/utils/request";
import { Message } from 'element-ui';

const handleFileError = (res, fileName) => {
    if (typeof(res.data) !== "undefined") {
        if (res.data.type == "application/json") {
            const reader = new FileReader();
            reader.onload = function() {
                let message = JSON.parse(reader.result).msg;
                Message({
                    showClose: true,
                    message: message,
                    type: 'error'
                })
            };
            reader.readAsText(new Blob([res.data]));
        }
    } else {
        var downloadUrl = window.URL.createObjectURL(new Blob([res]));
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = downloadUrl;
        a.download = fileName;
        var event = new MouseEvent("click");
        a.dispatchEvent(event);
    }
}

export const downloadPdf = (filePath) => {
    return service({
        url: "/fileUploadAndDownload/downloadPdf",
        method: 'get',
        params: {
            filePath: filePath
        },
        responseType: 'blob'
    }).then((res) => {
        handleFileError(res, filePath)
    })
}
