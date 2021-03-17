$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 获取列表
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            data: {},
            success: (res) => {
                // console.log(res);
                let htmlStr = template('list', { content: res.data });
                $('tbody').html(htmlStr);
            }
        })
    };
    let indexAdd = null;
    $('#btnAdd').on('click', function () {
        // console.log(1);
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#tpl-add').html()
        });
    });

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/addcates',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.massage, { icon: 5 });
                };
                initArtCateList();
                layer.msg('添加成功');
                layer.close(indexAdd);
            }
        })
    })

    let indexEdit = null;
    $('tbody').on('click', '#btn-edit', function () {
        // console.log(1);
        indexEdit = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#tpl-edit').html()
        });

        let id = $(this).attr('data-id');
        $.ajax({
            url: '/my/article/cates/' + id,
            type: 'get',
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.massage, { icon: 5 });
                };
                form.val('form-edit', res.data);
            }
        })
    });

    // 修改提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '/my/article/updatecate',
            type: 'post',
            data: $(this).serialize(),
            success: (res) => {
                if (res.status != 0) {
                    return layui.layer.msg(res.massage, { icon: 5 });
                };
                initArtCateList();
                layer.msg('添加成功');
                layer.close(indexEdit);
            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        layer.confirm('删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/deletecate/' + id,
                type: 'get',
                success: (res) => {
                    if (res.status != 0) {
                        return layui.layer.msg(res.massage, { icon: 5 });
                    };
                    initArtCateList();
                    layer.msg("删除成功");
                    layer.close(index);
                }
            })

        });

    })

})