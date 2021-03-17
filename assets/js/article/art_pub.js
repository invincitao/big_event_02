$(function () {
    let layer = layui.layer;
    let form = layui.form;

    // 1.初始化分类
    initCate();
    function initCate() {
        $.ajax({
            url: '/my/article/cates',
            type: 'GET',
            data: {},
            success: (res) => {
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                let htmlStr = template('tpm_cate', { data: res.data })
                $('[name=cate_id]').html(htmlStr);
                form.render();
            }
        })
    };

    // 2.初始化富文本编辑器
    initEditor()
    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 3.选择文件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    });
    // 换照片
    $('#coverFile').on('change', function (e) {
        let file = e.target.files[0];
        if (file == undefined) return layer.msg('请选择照片作为封面', { icon: 7 });
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 设置状态
    let state = '已发布'
    $('#btnSave2').on('click', function () {
        state = '草稿'
    });

    // 文章发布
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();

        let fd = new FormData(this);
        fd.append('state', state);
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob);
                // console.log(...fd);
                publishArticle(fd);
            });
    })

    // 函数封装  发布
    function publishArticle(fd) {
        $.ajax({
            url: '/my/article/add',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: (res) => {
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                layer.msg('恭喜您，文章发布成功!');
                // 跳转
                // location.href = '/article/art_list.html';
                // 解决跳转bug
                setTimeout(function () {
                    window.parent.document.querySelector('#art_list').click();
                }, 1000)
            }
        })
    }
})