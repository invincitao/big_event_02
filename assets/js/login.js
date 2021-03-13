$(function () {
    // 需求一:点击按钮能去到指定的页面
    $('#reg_link').on('click', function () {
        $('.reg_box').show();
        $('.login_box').hide();
    })
    $('#login_link').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    })

    // 需求二:登录表单的校验
    // 要先从layui里面拿到form
    // console.log(layui);
    let form = layui.form;
    // console.log(form);
    // 密码规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 再次确认密码
        repwd: function (value) {
            // console.log(value);
            // 对密码进行再次确认
            let pwd = $('.reg_box input[name=password]').val();
            if (value != pwd) {
                return "两次密码输入不一致,请重新输入";
            }
        }
    })

    // 需求三 注册提交功能
    let layer = layui.layer;
    $('#reg_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/reguser',
            type: 'POST',
            data: {
                username: $('.reg_box input[name=username]').val(),
                password: $('.reg_box input[name=password]').val()
            },
            success: (res) => {
                // console.log(res);
                // 注册失败
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 注册成功,清空列表,并且返回登录页
                layer.msg('注册成功,请登录', { icon: 6 });
                $('#reg_form')[0].reset();
                $('#login_link').click();
            }
        })
    })


    // 登录功能:实现登录,并跳转页面
    $('#login_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            type: 'POST',
            data: $(this).serialize(),
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg("登录成功", { icon: 6 });
                // 保存token值,后面要用,用处进行登录拦截
                localStorage.setItem('mytoken', res.token);
                // 跳转到index
                location.href = '/index.html';
            }
        })
    })
})
