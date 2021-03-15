$(function () {
    // 自定义规则
    let form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新密码跟原密码相同'
            }
        },
        rePwd: function (value) {
            if (value != $('[name=newPwd]').val()) {
                return '两次输入的新密码不相同'
            }
        }
    });

    // 表单提交
    let layer = layui.layer;
    $('form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/updatepwd',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('恭喜，密码修改成功', { icon: 6 })
                $('form')[0].reset();
                // location.href = '/login.html'
            }
        })
    })

})