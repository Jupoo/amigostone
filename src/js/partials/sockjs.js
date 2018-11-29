var js_settings = $('#js_settings');

var sockjs_enable = js_settings.data('sockjs_enable');
var url = js_settings.data('sockjs_url');
var port = js_settings.data('sockjs_port');

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function setCookie(key, value) {
    document.cookie = escape(key) + '=' + escape(value);
}

function getNumEnding(iNumber, aEndings) {
    var sEnding, i;
    iNumber = iNumber % 100;
    if (iNumber>=11 && iNumber<=19) {
        sEnding=aEndings[2];
    }
    else {
        i = iNumber % 10;
        switch (i)
        {
            case (1): sEnding = aEndings[0]; break;
            case (2):
            case (3):
            case (4): sEnding = aEndings[1]; break;
            default: sEnding = aEndings[2];
        }
    }
    return sEnding;
}

var timezone = getCookie('timezone');

if (timezone == null) {
    setCookie("timezone", jstz.determine().name());
}


var conn;

// function start_chat_ws() {
//     var transports = [
//          'websocket',
//          'xdr-streaming',
//          'xhr-streaming',
//          'iframe-eventsource',
//          'iframe-htmlfile',
//          'xdr-polling',
//          'xhr-polling',
//          'iframe-xhr-polling',
//          'jsonp-polling'
//         ];
//
//     conn = new SockJS(url+':'+port+'/chat', transports);
//     console.log('Connecting...');
//     conn.onopen = function() {
//         console.log('Connected to alert.');
//         conn.send('{"type":"alert"}');
//     };
//     conn.onmessage = function(event) {
//         var message_data = JSON.parse(event.data);
//         console.log(message_data);
//         if (message_data.name == "alert") {
//             console.log("alert");
//             $(".messenger__alert-wrap").show();
//             $(".messenger__alert-wrap a").attr("href", location.origin+'/accounts/messenger/chat/'+message_data.thread+'/')
//         }
//
//     };
//     conn.onclose = function(){
//         // Try to reconnect in 5 seconds
//         console.log('Reconnecting...');
//         setTimeout(function() {start_chat_ws()}, 5000);
//     };
// }

//if(sockjs_enable) start_chat_ws();


function activate_chat(thread_id, user_name, number_of_messages, url, port, chat_enable) {
    if (chat_enable) {
        $("[data-chat-textarea]").focus();

        function scroll_chat_window() {
            $("[data-chat-conversation]").scrollTop($("[data-chat-conversation]")[0].scrollHeight);
        }

        function soundClick() {
            var audio = new Audio(); // Создаём новый элемент Audio
            audio.src = '/static/bb2.mp3'; // Указываем путь к звуку "клика"
            audio.autoplay = true; // Автоматически запускаем
        }

        scroll_chat_window();

    }


    function start_chat_ws() {
        var transports = [
                     'websocket',
                     'xdr-streaming',
                     'xhr-streaming',
                     'iframe-eventsource',
                     'iframe-htmlfile',
                     'xdr-polling',
                     'xhr-polling',
                     'iframe-xhr-polling',
                     'jsonp-polling'
                    ];
        conn = new SockJS(url+':'+port+'/chat', transports)
        conn.onopen = function() {
            if (chat_enable) {
                console.log('Connected to thread.');
                conn.send('{"type":"auth","thread_id":"'+thread_id+'"}');
                $("[data-chat-textarea]").focus();
            } else {
                console.log('Connected to alert.');
                conn.send('{"type":"alert"}');
            }
        };
        conn.onmessage = function(event) {
            var message_data = JSON.parse(event.data);
            console.log(message_data);
            if (message_data.name == "alert") {
                console.log("alert");
                $(".messenger__alert-wrap").show();
                $(".messenger__alert-wrap a").attr("href", location.origin+'/accounts/messenger/chat/'+message_data.thread+'/')
            }
            if (message_data.name == "message") {
                $('[data-chat-typing]').fadeOut();
                var date = new Date(message_data.timestamp*1000);
                var time = $.map([date.getDate(), date.getMonth()+1, date.getFullYear(), date.getHours(), date.getMinutes(), date.getSeconds()], function(val, i) {
                    return (val < 10) ? '0' + val : val;
                });

                if (message_data.sender == user_name) {
                    var template = $('#chat-template-right').html();
                } else {
                    var template = $('#chat-template-left').html();
                }

                Mustache.parse(template);
                var rendered = Mustache.render(
                    template, {
                        message: message_data.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g, '<br />'),
                        username: message_data.sender,
                        profile_name: message_data.profile_name,
                        date: time[0] + '.' + time[1] + '.' + time[2] +' ' + time[3] + ':' + time[4] + ':' + time[5]
                    }
                );

                $("[data-chat-messages]").append(rendered);

                //$("div.chat div.conversation div.im-messages").append(
                //    '<div class="dialog row '+ ((message_data.sender == user_name) ? '' : 'flex-row-reverse')+'">' +
                //   '<p class="author ' + ((message_data.sender == user_name) ? 'we' : 'partner') + '"><span class="datetime">' + time[0] + ':' + time[1] + ':' + time[2] + '</span> ' + message_data.sender + ':</p><p class="message">' + message_data.text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g, '<br />') + '</p></div>');

                scroll_chat_window();
                number_of_messages["total"]++;
                if (message_data.sender == user_name) {
                    number_of_messages["sent"]++;
                } else {
                    number_of_messages["received"]++;
                    soundClick();
                    if ( $("[data-chat-textarea]").is(":focus") ) {
                        conn.send('{"type":"viewed"}');
                    }
                }
                $("[data-chat-info]").html(number_of_messages["total"] + ' ' + getNumEnding(number_of_messages["total"], ["сообщение", "сообщения", "сообщений"]) + ' (' + number_of_messages["received"] + ' получено, ' + number_of_messages["sent"] + ' отправлено)');
                if (true) {}
            }
            if (message_data.name == "typing") {
                console.log(message_data.sender+' '+user_name);
                if (message_data.sender != user_name) {
                    if (message_data.typing) {
                        console.log("Печатает...");
                        $('[data-chat-typing]').text('Печатает...');
                        $('[data-chat-typing]').fadeIn();
                        scroll_chat_window();
                    } else {
                        console.log("Закончил печатать...");
                        //$('[data-chat-typing]').text('Закончил печатать...');
                        setTimeout(function() {
                            $('[data-chat-typing]').fadeOut();
                            scroll_chat_window();
                        },400);
                    }
                }
            }
            if (message_data.name == "viewed") {
                console.log("Прочитано");

                $('[data-comment]').each(function (index) {

                    if ($(this).data('userId') !=  message_data.sender) $(this).find('[data-comment-status]').text('Прочитано');

                });

            }
        };

        conn.onclose = function(){
            // Try to reconnect in 5 seconds
            console.log('Reconnecting...');
            setTimeout(function() {start_chat_ws()}, 5000);
        };
    }

    start_chat_ws();

    function send_message() {
        var textarea = $("[data-chat-textarea]");
        if (textarea.val() == "") {
            return false;
        }
        if (conn.readyState != SockJS.OPEN) {
            return false;
        }
        conn.send('{"type":"message","message":"'+textarea.val()+'"}');
        textarea.val("");
    }

    $("[data-chat-form-submit]").click(send_message);

    $("[data-chat-textarea]").keydown(function (e) {
        // Ctrl + Enter
        if (e.ctrlKey && e.keyCode == 13) {
            send_message();
        }
    });

    var timeout;
    var printing = 0;

    $("[data-chat-textarea]").on('keyup',function(e){
        if (!(e.ctrlKey && e.keyCode == 13) && !(!e.ctrlKey && e.keyCode == 17)) {
            printing = printing + 1;
            // Вызываем, только если изменилось значение
            if (printing == 1) {
                setTimeout(function() {
                    // console.log("Начал ввод...")
                    conn.send('{"type":"typing","typing":"1"}');
                },300);
            }

            if (printing != 0) {
                // Делаем задержку и обнуляем предыдущую
                if(timeout) { clearTimeout(timeout); }
                // Новый таймаут
                timeout = setTimeout(function() {
                    // Выполняем поиск
                    // console.log("Закончил ввод...")
                    conn.send('{"type":"typing","typing":"0"}');
                    printing = 0;
                },2000);
            }
        }
    });

    $("[data-chat-textarea]").on("focusin", function() {
        console.log("focusin");
        conn.send('{"type":"viewed"}');
    });
    // if ( $("[data-chat-textarea]").is(":focus") ) {
    //     console.log("focus");
    //     conn.send('{"type":"viewed"}');
    // } else {
    //     console.log("no focus");
    // }
}

$(document).ready(function () {
    var chat_settings = $('#chat_settings');

    var thread_id = chat_settings.data('thread_id');
    var email = chat_settings.data('email');
    var total = chat_settings.data('total');
    var sent = chat_settings.data('sent');
    var received = chat_settings.data('received');

    if (sockjs_enable) {

        activate_chat(thread_id, email, {
            "total": total,
            "sent": sent,
            "received": received
        }, url, port, chat_settings.length);
    }
});
