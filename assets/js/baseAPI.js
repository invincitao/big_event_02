let baseURL = 'http://api-breakingnews-web.itheima.net';
$.ajaxPrefilter(function (options) {
    // console.log(options);
    options.url = baseURL + options.url;

})