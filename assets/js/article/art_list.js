$(function () {
    let layer = layui.layer;
    let form = layui.form;
    // 向模板引擎中导入
    template.defaults.imports.deteFormat = function (dateStr) {
        let date = new Date(dateStr)

        let y = date.getFullYear();
        let m = padZero(date.getMonth() + 1);
        let d = padZero(date.getDate());
        let hh = padZero(date.getHours());
        let mm = padZero(date.getMinutes());
        let ss = padZero(date.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
    }

    // 在数字前面加0
    function padZero(num) {
        return num < 10 ? "0" + num : num;
    }

    // 定义提交参数
    let q = {
        pagenum: 1,     // 页码
        pagesize: 5,    // 每页显示多少数据
        cate_id: "",    // 文章分类得Id
        state: "",      // 文章的状态
    };
    // 获取列表
    initTable();
    function initTable() {
        $.ajax({
            url: '/my/article/list',
            type: 'get',
            data: q,
            success: (res) => {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                let htmlStr = template('tpm-table', { data: res.data })
                $('tbody').html(htmlStr);
                // 调用分页
                renderPage(res.total);
            }
        })
    };

    // 初始化分类
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

    //筛选
    $('#form-search').on('submit', function (e) {
        e.preventDefault();

        // 获取选择框里面的值
        let state = $('[name=state]').val();
        let cate_id = $('[name=cate_id]').val();
        // 赋值
        q.cate_id = cate_id;
        q.state = state;
        // 刷新列表
        initTable();
    })
    let laypage = layui.laypage;
    console.log(laypage);
    // 分页,可以知道有篇多少文章
    function renderPage(total) {
        // alert(total);
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,//显示每页条数
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(first); //得到每页显示的条数
                //首次不执行
                if (!first) {
                    //do something
                    // obj.curr把obj里的页码赋值给q里面得页码值q.pagenum
                    q.pagenum = obj.curr;
                    // 将页数里面的文章条数进行赋值
                    q.pagesize = obj.limit;
                    // 再重新渲染列表
                    initTable();
                }
            }
        });
    };

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // console.log(Id);
        let id = $(this).attr('data-id')
        // console.log(id);
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                url: '/my/article/delete/' + id,
                type: 'GET',
                success: (res) => {
                    if (res.status != 0) {
                        return layui.layer.msg(res.message, { icon: 5 })
                    }

                    layer.msg('恭喜，删除成功！')
                    // 页面删除按钮个数为1，并且页码数大于一
                    if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--;
                    initTable();
                }
            })
            layer.close(index);
        });
    });

})