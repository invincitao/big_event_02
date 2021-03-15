$(function () {
    // 自定义规则
    let form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.trim().length < 2 || value.trim().length > 6) {
                return '昵称长度为2-6位'
            }
        },
    });

    // 用户渲染
    let layer = layui.layer;
    initUserInfo();
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            type: 'GET',
            data: {},
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                form.val('formUserInfo', res.data);
            }
        })
    };
    // 重置
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    });
    // 修改用户信息
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/userinfo',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('恭喜，修改成功', { icon: 6 })
                // 页面渲染
                window.parent.getUserInfo();
                // alert(1)
            }
        })
    })
})