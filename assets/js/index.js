$(function () {
    // console.log(1);
    // 1.获取用户信息
    getuserInfo();


    // 2.退出登录,销毁token，回到login页面
    $('#btnLogout').on('click', function () {
        // console.log(1);
        // 弹出框
        layer.confirm('是否确认登录？', { icon: 3, title: '提示' }, function (index) {
            //do something
            // 销毁token
            localStorage.removeItem('mytoken');
            location.href = '/login.html';
            layer.close(index);
        });
    })
})
// 在碗面封装函数，方便后面调用
function getuserInfo() {
    $.ajax({
        url: '/my/userinfo',
        type: 'GET',
        data: {},
        // headers: { Authorization: localStorage.getItem('mytoken') || '' },
        // complete: function (res) {
        //     // console.log(res);
        //     let obj = res.responseJSON;
        //     if (obj.status == 1 && obj.message == '身份认证失败！') {
        //         localStorage.removeItem('mytoken');
        //         location.href = '/login.html';
        //     }
        // },
        success: (res) => {
            // console.log(res);
            if (res.status != 0) {
                return layui.layer.msg(res.massage, { icon: 5 });
            }
            // 请求成功渲染页面
            renderAvatar(res.data);
        }
    })
}
function renderAvatar(user) {
    // 获取渲染名字
    let name = user.nickname || user.username;
    $('#welcome').html(name);
    // 渲染头像
    // 如果有头像
    if (user.user_pic != null) {
        $('.layui-nav-img').attr('src', user.user_pic);
        $('.text-avatar').hide();
    } else {
        // 没有头像
        $('.layui-nav-img').hide();
        let text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
}