var $dialog = [];

jQuery.showModalDialog = function (options) {

    var defaultOptns = {
        url: null,
        dialogArguments: null,
        height: 'auto',
        width: 'auto',
        position: 'center',
        resizable: true,
        scrollable: true,
        draggable: true,
        onClose: function () { },
        returnValue: null,
        doPostBackAfterCloseCallback: false,
        postBackElementId: null,
        closeText: 'close'
    };

    var fns = {
        close: function () {
            opts.returnValue = $dialog[opts.level].returnValue;
            opts.onClose();
            $dialog.pop();

            if (opts.doPostBackAfterCloseCallback) {
                postBackForm(opts.postBackElementId);
            }
            // 清空內容
            $('#iframeDialog_' + opts.level).attr('src', 'about:blank');
        },
        adjustWidth: function () { $frame.css("width", "100%"); }
    };

    // build main options before element iteration

    var opts = $.extend({}, defaultOptns, options);
    opts.level = $dialog.length; // 目前對話框所在層級

    // 移除前一次留下的物件
    $('#iframeDialog_' + opts.level).remove();

    // 重新建立新的 iframe
    $frame = $('<iframe id="iframeDialog_' + opts.level + '" />');

    if (opts.scrollable)
        $frame.css('overflow', 'auto');
    else
        $frame.attr('scrolling', 'no'); //for chrome

    $frame.css({
        'padding': 0,
        'margin': 0,
        'padding-bottom': '1px'
    });

    var $dialogWindow = $frame.dialog({
        autoOpen: true,
        modal: true,
        width: opts.width,
        height: opts.height,
        resizable: opts.resizable,
        position: opts.position,
        draggable: opts.draggable,
        overlay: {
            opacity: 0.5,
            background: "black"
        },
        close: fns.close,
        resizeStop: fns.adjustWidth,
        closeText: opts.closeText
    });

    $frame.attr('src', opts.url);
    fns.adjustWidth();

    $frame.load(function () {
        try {
            if ($dialogWindow) {
                var maxTitleLength = 50;
                var title = $(this).contents().find("title").html();

                if (title.length > maxTitleLength) {
                    title = title.substring(0, maxTitleLength) + '...';
                }

                $dialogWindow.dialog('option', 'title', title);
                $(".ui-dialog-title").css('font-size', '16px');
            }
        }
        catch (e) { }
    });

    $dialog[opts.level] = new Object();
    $dialog[opts.level].dialogArguments = opts.dialogArguments;
    $dialog[opts.level].dialogWindow = $dialogWindow;
    $dialog[opts.level].returnValue = null;

    if (opts.level > 0) { // Auto adjust to center of parent window
        var $alignTarget = $('div[aria-describedby=iframeDialog_' + (opts.level - 1) + ']');
        var pos = $alignTarget.position();
        var $parentDiv = $frame.parent();
        var new_left = parseInt(pos.left), new_top = parseInt(pos.top);

        var wDiff = $alignTarget.width() - $frame.width();
        new_left += parseInt(wDiff / 2);

        var hDiff = $alignTarget.height() - $frame.height();
        new_top += parseInt(hDiff / 2);
        $parentDiv.css({ 'left': new_left + 'px', 'top': new_top + 'px' });
    }
}

function postBackForm(targetElementId) {
    var theform;
    theform = document.forms[0];
    theform.__EVENTTARGET.value = targetElementId;
    theform.__EVENTARGUMENT.value = "";
    theform.submit();
}
