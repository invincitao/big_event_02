// 测试阶段的接口
let baseURL = 'http://api-breakingnews-web.itheima.net';
$.ajaxPrefilter(function (options) {
    // console.log(options);
    options.url = baseURL + options.url;

    // 身份验证
    if (options.url.indexOf('/my/') != -1) {
        options.headers = {
            Authorization: localStorage.getItem('mytoken') || ''
        }
    };

    // 拦截所有响应，判断登录信息是否正确
    options.complete = function (res) {
        // console.log(res);
        let obj = res.responseJSON;
        if (obj.status == 1 && obj.message == '身份认证失败！') {
            localStorage.removeItem('mytoken');
            location.href = '/login.html';
        }
    }
})

