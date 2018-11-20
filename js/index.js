;
(function($) {
    //李龙涛本地地址
    //http://10.1.26.142:8081
    //测试环境地址
    //10.1.26.202:8084  
    //准生产环境
    //http://120.26.131.205:8084 
    //生产环境
    //http://118.31.251.171:8084
    //网关-生产环境
    //http://gateway.nuoyuan.com.cn/thirdAuth
    FastClick && FastClick.attach(document.body);
    //进入页面首先获取参数
    var phone = getUrlParam('phone');
    var name = getUrlParams('name');
    var id_card_num = getUrlParam('id_card_num');
    var user_id = getUrlParams('user_id');

    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    };

    function getUrlParams(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
    };
    console.log(getUrlParam('phone'))
    console.log(phone + "***" + name + "***" + id_card_num + "***" + user_id);
    var //phone = '15803416315', //18610166526  18519146839李龙涛
        //password = '', //'463089','766289-158' '880916曹朦' '158293李龙涛'//手机服务密码
        //name = '岳燕燕', //真实姓名
        //id_card_num = '533527198909210238', //身份证号
        //user_id='陈道华-32098119941121447X-app',
        token = '',
        flage = '';
    var tt;
    //var newMobile = phone.substr(0, 3) + '****' + phone.substr(7);
    if (flage == 1) {
        $('#sectionThree .section_footer').css('display', 'block');
    } else {
        $('#sectionThree .section_footer').css('display', 'none');
    };

    function init() {
        console.log('$$$$$$$$$$$$$$9999');
        $.ajax({
            type: 'GET',
            dataType: 'json',
            url: 'http://120.26.131.205:8084/carrier/location/' + phone,
            success: function(data) {
                console.log(data);
                if (data.statusCode == 200) {
                    //手机号码
                    $('.mobile').html(phone);
                    //运营商
                    $('.QCellCore').html(data.data.type);
                } else if (data.statusCode == 500) {
                    $('.loader').css('display', 'none');
                    $("#errorNotice span").html('系统异常！');
                    $("#errorNotice").show();
                    setTimeout(function() {
                        $("#errorNotice").hide();
                    }, 1500);
                }
            },
            error: function() {

            }
        })
    };
    init();
    //点击提交按钮，跳到第二个页面
    $('.first_footer p').on('click', function() {
        /*if ($('.paddword_p input').val().length > 0 && $('.paddword_p input').val().length != 6) {
            $("#errorNotice span").html('密码错误，请重新输入！');
            $("#errorNotice").show();
            setTimeout(function() {
                $("#errorNotice").hide();
            }, 1500);
            $('.paddword_p input').val('');
        } else */if ($('.paddword_p input').val().length == 0) {
            $("#errorNotice span").html('服务密码不能为空！');
            $("#errorNotice").show();
            setTimeout(function() {
                $("#errorNotice").hide();
            }, 1500);
        } else {
            password = $('.paddword_p input').val();
            $('.loader').css('display', 'flex');
            judgeStatu();
        }
    });
    //第一个页面提交和验证码获取
    function judgeStatu() {
        $.ajax({
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            url: 'http://120.26.131.205:8084/carrier/auth/submit',
            data: JSON.stringify({ "mobile": phone, "password": password, "custName": name, "certCode": id_card_num, "userId": user_id }),
            success: function(result) {
                //token = result.data.token;
                if (result.statusCode == 200) {
                    token = result.data.token;
                    if (result.data.step == '1') {
                        //等待输入验证码 
                        $('.loader').css('display', 'none');
                        $('#sectionFirst').hide();
                        $('#sectionSeond').show();
                        clearInterval(tt) //清除定时器
                        sendCode();
                    } else if (result.data.step == '2') {
                        //登录成功
                        $('.loader').css('display', 'none');
                        $('#sectionFirst').hide();
                        $('#sectionSeond').hide();
                        $('#sectionThree').show();
                    } else if (result.data.step == '3') {
                        //验证码或服务密码有误，重新提交认证
                        $('.loader').css('display', 'none');
                        $("#errorNotice span").html('服务密码有误，重新提交认证！');
                        $("#errorNotice").show();
                        setTimeout(function() {
                            $("#errorNotice").hide();
                        }, 1500);
                        $('#sectionFirst').show();
                        $('#sectionSeond').hide();
                        $('#sectionThree').hide();
                    }
                } else if (result.statusCode == 700) {
                    $('.loader').css('display', 'none');
                    $("#errorNotice span").html(result.msg);
                    /*if (result.data && result.data.step == '3') {
                        $("#errorNotice span").html('查询次数过多，请稍后重试！');
                    };*/
                    $("#errorNotice").show();
                    setTimeout(function() {
                        $("#errorNotice").hide();
                    }, 1500);

                } else if (result.statusCode == 900) {
                    $('.loader').css('display', 'none');
                    $("#errorNotice span").html('服务密码输入错误！');
                    $('.paddword_p input').val('');
                    $('.loader').css('输入错误');
                    $("#errorNotice").show();
                    setTimeout(function() {
                        $("#errorNotice").hide();
                    }, 1500);
                } else if (result.statusCode == 500) {
                    $('.loader').css('display', 'none');
                    $("#errorNotice span").html('系统异常！');
                    $("#errorNotice").show();
                    setTimeout(function() {
                        $("#errorNotice").hide();
                    }, 1500);
                };;
            },
            error: function(result) {
                console.log($('.loader'))
                $('.loader').css('display', 'none');
                console.log($('.loader'))
                $("#errorNotice span").html(result);
                $("#errorNotice").show();
                setTimeout(function() {
                    $("#errorNotice").hide();
                }, 1500);
            }
        })
    };
    //点击提交按钮，跳到第三个页面
    $('.section_footer p').on('click', function() {
        var code = $('.input_text').val();
        //token="70fbcc4e68cd4751946c6e11a0505687";
        if (code) {
            $('.loader').css('display', 'flex');
            $.ajax({
                type: 'POST',
                contentType: "application/json; charset=utf-8",
                dataType: 'json',
                url: 'http://120.26.131.205:8084/carrier/input',
                data: JSON.stringify({ "code": code, "token": token }),
                success: function(res) {
                    if (res.statusCode == 200) {
                        $('.loader').css('display', 'none');
                        if (res.data.step == '1') {
                            $('#sectionFirst').hide();
                            $('#sectionThree').hide();
                            $('#sectionSeond').show();
                            $("#errorNotice span").html('重新输入验证码！');
                            $("#errorNotice").show();
                            $('.input_text').val('');
                            setTimeout(function() {
                                $("#errorNotice").hide();
                            }, 1500);
                            clearInterval(tt);
                            sendCode();
                        } else if (res.data.step == '2') {
                            $('#sectionSeond').hide();
                            $('#sectionThree').show();
                        } else if (res.data.step == '3') {
                            $("#errorNotice span").html('服务密码有误，重新提交认证！');
                            $("#errorNotice").show();
                            setTimeout(function() {
                                $("#errorNotice").hide();
                            }, 1500);
                            $('#sectionFirst').show();
                            $('#sectionSeond').hide();
                            $('#sectionThree').hide();
                        };
                    } else if (res.statusCode == 700) {
                        $('.loader').css('display', 'none');
                        $("#errorNotice span").html('验证码输入错误！');
                        $("#errorNotice").show();
                        $('.paddword_p input').val('');
                        setTimeout(function() {
                            $("#errorNotice").hide();
                        }, 1500);
                    } else if (res.statusCode == 900) {
                        if (res.data.step == '3') {
                            $('.loader').css('display', 'none');
                            $("#errorNotice span").html('服务密码输入错误！');
                            $("#errorNotice").show();
                            setTimeout(function() {
                                $("#errorNotice").hide();
                            }, 1500);
                            $('#sectionFirst').show();
                            $('.paddword_p input').val('');
                            $('#sectionSeond').hide();
                            $('#sectionThree').hide();
                        }
                    } else if (res.statusCode == 500) {

                        $('.loader').css('display', 'none');
                        $("#errorNotice span").html('系统异常！');
                        $("#errorNotice").show();
                        setTimeout(function() {
                            $("#errorNotice").hide();
                        }, 1500);
                    };
                },
                error: function(res) {

                },
            })
        } else {
            $("#errorNotice span").html('请输入验证码！');
            $("#errorNotice").show();
            $('.input_text').val('');
            setTimeout(function() {
                $("#errorNotice").hide();
            }, 1500);
        };

    });
    //点击显示或加密密码
    $('.paddword_p span').on('click', function() {
        console.log($('.paddword_p span')[0].className);
        if ($('.paddword_p span')[0].className == 'nonePassword') {
            $('.paddword_p span').removeClass('nonePassword');
            $('.paddword_p span').addClass('showPassword');
            $('.paddword_p input[type="password"]').attr('type', 'text');

        } else if ($('.paddword_p span')[0].className == 'showPassword') {
            $('.paddword_p span').removeClass('showPassword');
            $('.paddword_p span').addClass('nonePassword');
            $('.paddword_p input[type="text"]').attr('type', 'password');
        }
    });
    //获取验证码页面-input框获取焦点并且有输入时，显示清空图标
    $(".section_top input").on('blur', function() {
        if ($(".section_top input").val()) {
            $('.close').css('display', 'block');
        } else {
            $('.close').css('display', 'none');
        }
    });
    //获取验证码页面-点击清空图标，清空input框
    $(".close").on('click', function() {
        $(".section_top input").val('');
    });
    //sendCode();
    function sendCode() {
        //console.log(token);
        console.log("^^^^^^^^^^^^^^^^^^^^^^^");
        //120秒后重新发送
        var waitCode = $('.waitCode');
        var resetCode = $('.resetCode');
        resetCode.css('display', 'none');
        waitCode.css('display', 'block');
        var left_time = 120;
        console.log(left_time);
        tt = window.setInterval(function() {
            left_time = left_time - 1;
            if (left_time <= 0) {
                waitCode.html('120秒');
                waitCode.css('display', 'none');
                resetCode.css('display', 'block');
            } else {
                waitCode.html(left_time + '秒');
            }
        }, 1000);
    };
    //获取验证码
    function resetCode() {
        console.log('999999');
        $('#errorNotice span').html('');
        $('.input_text').val('');
        clearInterval(tt) //清除定时器
        sendCode();
        judgeStatu();
    };
    $('.resetCode').on('click', function() {
        resetCode();
    });
    //返回首页
    $('.goBack').on('click', function() {
        window.location.href = ''; //首页地址
    });

})(Zepto)