// 友善列印
function fd_print() {
    $("[id=header]").hide();
    $("[id=menu_list]").hide();
    $("[id*=footer]").hide();
    $(".nav_line").hide();
    window.print();
}

$(function () {
    var afterPrint = function () {
        $("[id=header]").show();
        $("[id=menu_list]").show();
        $("[id*=footer]").show();
        $(".nav_line").show();
    };

    if (window.matchMedia) { // Track printing from browsers using the Webkit engine

        var mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function (mql) {
            if (!mql.matches) {
                afterPrint();
            }
        });
    }

    window.onafterprint = afterPrint; // Internet Explorer
});

function trim(str)  {return str.replace(/^\s*(.*?)[\s\n]*$/g, '$1');}

var g_isIE=(navigator.userAgent.search("MSIE") > -1) ;
var g_IEVer = getIEVer() ;

// get the IE version
function getIEVer() {
    var ver = -1;

    if (g_isIE) {
        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
        if (re.exec(navigator.userAgent) != null)
            ver = parseFloat(RegExp.$1);
    }
    return ver;
}

// html encode
function htmlEscape(str) {
    return String(str)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
}

// 將控制項初始值設為str(用於下拉式選單)
function setOption(optCtl, str)
{
    if( !optCtl || str == null )
        return ;
    optCtl = optCtl.options ;
    var i ;
  	for(i=0; i < optCtl.length; i++)
  	{
  		if( str == optCtl[i].value )
  		{
  			optCtl[i].selected = true ;
  			return optCtl[i].text ;
  		}
  	}
}

// 將控制項初始值設為str(用於 radio, checkbox)
function setRadio(optCtl, str)
{
    if( ! optCtl.length )
    {
        optCtl.click() ;
        return ;
    }
    var i ;
  	for(i=0; i < optCtl.length; i++)
  	{
  		if( str == optCtl[i].value )
  		{
  			optCtl[i].click() ;
  			break ;
  		}
  	}
}

// 新增一個 <select> <option> 項目
function addOption() // objSel, optVal, optText, idx
{
    var objSel, optVal, optText, idx ;
    if( arguments.length < 3 )
        return false ;

    objSel = arguments[0] ;
    optVal = arguments[1] ;
    optText = arguments[2] ;
    if( !objSel || !objSel.options )
        return false ;

    if( arguments.length > 3 )
        idx = parseInt(arguments[3]) ;

    var objOpt=document.createElement("OPTION") ;
    if( isNaN(idx) )
        objSel.options.add(objOpt) ;
    else
        objSel.options.add(objOpt, idx) ;

    objOpt.innerHTML = optText ;
    objOpt.value = optVal ;
    return objOpt ;
}

// 修改一個 <select> <option> 項目文字
function modifyOptionText() // objSel, optVal, optText
{
    var objSel, optVal, optText, idx ;
    if (arguments.length < 3)
        return false;

    objSel = arguments[0];
    optVal = arguments[1];
    optText = arguments[2];
    if (!objSel || !objSel.options)
        return false;

    for(idx=0; idx < objSel.options.length; idx++)
        if( objSel.options[idx].value == optVal )
        {
            objSel.options[idx].text = optText ;
            return true;
        }
    return false;
}

// 移除一個 <select> <option> 項目
function removeOption() // objSel, optVal
{
    var objSel, optVal;
    if (arguments.length < 2)
        return false;

    objSel = arguments[0];
    optVal = arguments[1];
    if (!objSel || !objSel.options)
        return false;

    for (idx = 0; idx < objSel.options.length; idx++)
        if (objSel.options[idx].value == optVal) {
            objSel.options.remove(idx);
            return true;
        }
    return false;
}

// 開啟對話框
function showDialog(url, w, h)
{
    var width=isNaN(w) ? 360 : w ;
    var height=isNaN(w) ? 360 : w ;
    var left = Math.ceil((window.screen.availWidth-width)/2) ;
    var top = Math.ceil((window.screen.availHeight-height)/2) ;
    var sFeatures="scroll:yes; dialogLeft:"+left+"px;dialogTop:"+top+"px;dialogWidth:"+
                  width+"px;dialogHeight:"+height+"px;status:no;" ;

    return window.showModalDialog(url, window, sFeatures) ;
}

// 限制只能輸入小數
function ValidateFloat(e, pnumber) {
    if (!/^\d+[.]?\d*$/.test(pnumber)) {
        e.value = /^\d+[.]?\d*/.exec(e.value);
        if (e.value == "null")
            e.value = "0";
    }
    return false;
}

// 限制只能輸入數字
function ValidateNumber(e, number) {
    if (!/^\d+$/.test(number)) {
        e.value = /^\d+/.exec(e.value);
        if (e.value == "null")
            e.value = "0";
    }
    return false;
}

// 四捨五入到小數第N位
function MyRound(n, digit) {
    var mul = Math.pow(10, digit);
    return Math.round(n * mul) / mul;
}

// 將畫面元件對齊右方($elm 對齊 $elmTarget)
function alignElmRight($elm, $elmTarget) {
    if ($elm.length != 1 || $elmTarget.length != 1)
        return;

    var right = $elm.offset().left + $elm.width();
    var targetRight = $elmTarget.offset().left + $elmTarget.width();

    $elm.css('margin-left', parseInt(targetRight - right) + parseInt($elm.css('margin-left')) + 'px');
}

var g_closeTargetWin = null;
var g_customEscFunc = null;

// for cancelling window
function esc_key_close(e)
{
    var keyCode ;
	if( window.event )
        keyCode = window.event.keyCode ;
    else if( e )
        keyCode = e.which ;
	else
		return ;

    if( keyCode == 27 )
    {
        if (g_customEscFunc != null)
        {
            g_customEscFunc();
            return;
        }

        if (!g_closeTargetWin) {
            if (window.xclose != null)
                window.xclose();
            else
                window.close();
        }
        else {
            if (typeof (g_closeTargetWin) == "function")
                g_closeTargetWin();
            else
                g_closeTargetWin.style.display = 'none';
        }
    }
}

//  取得元素的絕對座標
function getAbsolutePos(el)
{
	var SL = 0, ST = 0;
	var is_div = /^div$/i.test(el.tagName);
	if (is_div && el.scrollLeft)
		SL = el.scrollLeft;
	if (is_div && el.scrollTop)
		ST = el.scrollTop;
	var r = { x: el.offsetLeft - SL, y: el.offsetTop - ST };
	if (el.offsetParent) {
		var tmp = getAbsolutePos(el.offsetParent);
		r.x += tmp.x;
		r.y += tmp.y;
	}
	return r;
}

// 自動調整對話框或 iframe 高度 (delayed call)
function adjustWindowHeight()
{
    setTimeout('resizeWin();', 100) ;
}

// 調校指定元件高度
function adjustHeight(id, hDiff, scrolling) {
    var objElm = $("#" + id);

    if (hDiff != 0)
        objElm.css("height", (objElm.height() + hDiff) + "px");

    if (scrolling)
        objElm.css("scrolling", scrolling);
}

// 自動調整對話框或 iframe 高度 (需搭配設定)
function resizeWin()
{
    var html=document.getElementsByTagName('html')[0] ;
    var n=0, objTail=$('#tail'); // 搭配 jquery

    if( objTail.length == 0 )
        return ;

    objTail = objTail[0];
    var bottom = objTail.offsetTop + objTail.clientHeight;
    n = bottom - html.clientHeight + 10 ;

    if( n != 0 ) {
        if( window.dialogHeight )
            window.dialogHeight = (parseInt(window.dialogHeight)+n) + "px" ;
        else if (baseWindow != null)
        {
            var iframeId = 'iframeDialog_' + (baseWindow.$dialog.length - 1);
            baseWindow.adjustHeight(iframeId, n, "no");
        }
    }
}

var g_topDlg=null ;
function init_fixed_dlg()
{
    if( arguments.length > 0 )
        g_closeTargetWin = arguments[0] ;
    document.onkeydown = esc_key_close ;
}

// AJAX helpers
function call_ajax() {
    var ajax_url, data={strParam:"{}"};
    if (arguments.length > 0)
        ajax_url = arguments[0];
    if (arguments.length > 1) {
        if (typeof (arguments[1]) == "object") {
            var obj = arguments[1];
            // force to string type
            for (var key in obj)
                obj[key] = '' + obj[key];
        }
        else {
            alert("The first parameter for calling 'call_ajax' function must be an object !");
            return;
        }

        data.strParam = JSON.encode(arguments[1]);
    }

    if (arguments.length > 2) {
        if (typeof (arguments[2]) == "function") {
            $.ajax_cust_handler = arguments[2] ;
        }
        else {
            alert("The second parameter for calling 'call_ajax' function must be a function !");
            return;
        }
    }

    $.ajax({
        'type': "POST",
        "contentType": "application/json; charset=utf-8",
        'cache': false,
        'url': ajax_url,
        'data': JSON.encode(data),
        'success': ajax_resp_handler,
        'async': true,
        'error': function (e) {
            var msg;
            try {
                msg = JSON.decode(e.responseText);
            }
            catch (ex1) {
            }

            if (msg != null && msg.Message != null)
                alert(msg.Message);
            else {
                if (window.top == window.self) // checks top window
                    document.body.innerHTML = e.responseText;
                // else skip error
            }
        }
    });
}

function myEval(script) {
    if (typeof (eval) == 'function')
        return eval(script);

    var tmp = Function(script);
    tmp();
}

function myFunc(func, args) {
    var arg_list = '';

    for (var i = 0; i < args.length; i++) {
        if (i > 0)
            arg_list += ",";

        if (typeof (args[i]) == 'string')
            arg_list += JSON.encode(args[i]) ;
        else
            arg_list += args[i];
    }

    var script = func + "(" + arg_list + ");";

    if (typeof (eval) == 'function')
        return eval(script);

    var tmp = Function(script);
    tmp();
}

function ajax_resp_handler(resp) {
    if( resp.d != null )
        resp = JSON.decode(resp.d);

    if( typeof(resp) != "object" || resp.length == null )
    {
        alert("Unknown AJAX response hanlder !") ;
        return ;
    }

    for(var i=0; i < resp.length; i++)
    {
        var actItem=resp[i] ;
        switch(actItem.type)
        {
            case "script":
                var elmScript = document.createElement("script");
                elmScript.type = 'text/javascript';
                elmScript.id = "ajax_js_res" ;
                elmScript.text = actItem.script ;
                document.body.appendChild(elmScript) ;
                break ;

            case "function":
                //var script = "var func = " + actItem.func;
                //eval(script);

                var args = actItem.args;
                switch(actItem.func)
                {
                    case 'alert':
                        alert(args[0]);
                        break ;

                    case 'ajax_done':
                        ajax_done.apply(this, args);
                        break;

                    default:
                        myFunc(actItem.func, args);
                        break ;
                }
                break;

            case "cust_handler":
                if (typeof ($.ajax_cust_handler) == "function") {
                    eval("var args = " + actItem.args[0]);
                    var cust_func = $.ajax_cust_handler;
                    $.ajax_cust_handler = null;
                    // prevents the reentrance for using 'ajax_cust_handler'
                    cust_func(args);
                }
                break;

            default:
                alert("Invalid handler !") ;
        }
    }
}

// preserved function for AJAX callback
function ajax_done(param) {
    $body = $("body:first");

    if (typeof (param) == 'function') {
        $body.queue('ajax', param);
    }
    else {
        if (param) {
            while ($body.queue('ajax').length > 0)
                $body.dequeue('ajax');
        }
        else
            $body.clearQueue('ajax');
    }
}

// preserved used defined result handler

// 預設 AJAX 回傳物件函式
var g_objAjaxRes = null ;
function ajax_set_result(data) { g_objAjaxRes = data; }

// dynamically loading a external javascript file
function load_js_file(filename) {
    var fileref = document.createElement('script');
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", filename);

    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

// dynamically loading a external css file
function load_css_file(filename) {
    var fileref = document.createElement('link');
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", filename);
    fileref.setAttribute("rel", "stylesheet");

    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

// chinese date picker convinient funcitons
function init_tw_date_picker() {
    // init Datepicker
    $.datepicker.regional['zh-TW'] = {
        clearText: '清除', clearStatus: '清除已選日期',
        closeText: '關閉', closeStatus: '取消選擇',
        prevText: '<上一月', prevStatus: '顯示上個月',
        nextText: '下一月>', nextStatus: '顯示下個月',
        currentText: '今天', currentStatus: '顯示本月',
        monthNames: ['一月', '二月', '三月', '四月', '五月', '六月',
		'七月', '八月', '九月', '十月', '十一月', '十二月'],
        monthNamesShort: ['一', '二', '三', '四', '五', '六',
		'七', '八', '九', '十', '十一', '十二'],
        monthStatus: '選擇月份', yearStatus: '選擇年份',
        weekHeader: '週', weekStatus: '',
        dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        dayNamesShort: ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
        dayNamesMin: ['日', '一', '二', '三', '四', '五', '六'],
        dayStatus: '設定每週第一天', dateStatus: '選擇 m月 d日, DD',
        dateFormat: 'yy/mm/dd', firstDay: 1,
        initStatus: '請選擇日期', isRTL: false,
        changeYear: true, showAnim: "fold"
    };

    // g_LANG zh-TW, en
    if( typeof g_LANG == 'undefined' )
        g_LANG = "zh-TW";
    $.datepicker.setDefaults($.datepicker.regional[g_LANG]);

    for(var i=0; i < arguments.length; i++)
    {
        var pickerName=arguments[i];
        $("[name="+pickerName+"]").datepicker({
            beforeShow: function (input, inst) {
                if (input.value != '') {
                    var tt = input.value.split('/');
                    input.value = parseInt(tt[0]) + 1911 + "/" + tt[1] + "/" + tt[2];
                    input.style.color = 'white';
                }
            },

            onClose: function (dateText, inst) {
                if (dateText == '')
                    return;
                var tt = dateText.split('/');
                dateText = parseInt(tt[0]) - 1911 + "/" + tt[1] + "/" + tt[2];
                $(this).val(dateText);
                $(this).css("color", "black");
            }
        });
    }
}

// 確認 jQuery 存在後，進行初始動作
if (typeof ($) == 'function')
    $(document).ready(init_by_css_name);

// 依據內建 CSS 名稱，自動將頁面格式化
function init_by_css_name()
{
    // table grid_view
    var e = $('.grid_view');
    e.find('tr:even').addClass("tr_even");
    e.find('tr').on('mouseenter mouseleave', function () {
            $(this).toggleClass('tr_hover');
    });

    // setup hint text
    $(":button,:submit").each(function () {
        if( $(this).attr('title') == null )
            $(this).attr('title', $(this).val());
    });

    // table list item check boxes
    e = $('.checkbox');
    var rowspan = e.find("th:first").attr("rowspan");
    if (typeof rowspan == "undefined")
      rowspan = 1;
    var trs = e.find('tr');
    if (trs.length > 1)
    {
        var rowId = 0;
        trs.each(function () {
            var objTD;
            if (rowId == 0) {
                objTD = this.insertBefore(document.createElement('th'), this.cells[0]);
                if (rowspan > 1)
                    $(objTD).attr("rowspan", rowspan);
                objTD.style.textAlign = 'center';
                objTD.style.width = '30px';
                objTD.innerHTML = "<input type='checkbox' id='check_all' value=''>";
            }
            else {
              if (rowspan > 1 && rowId < rowspan) {
                rowId++;
                return;
              }

                objTD = this.insertCell(0);
                var val = $(this).attr('data-key');
                if (val == undefined)
                    val = '';
                if( val != '' )
                    objTD.innerHTML = "<input type='checkbox' id='chk_" + rowId + "' value='" + val + "'>";
            }

            rowId++;
        });


        $(":checkbox[id=check_all]").click(function () {
            $(":checkbox[id*=chk_]").prop('checked', this.checked);
        });
    }

    var bat_btn = $(".btn_batch");
    bat_btn.prop('disabled', true);
    bat_btn.removeClass('btn_batch_enabled');
    bat_btn.addClass('btn_batch_disabled');

    // related batch selected button enabling
    if (e.length > 0) {
        var chks = $(":checkbox[id*=chk_],#check_all");
        chks.click(function () {
            var cnt = $(":checkbox[id*=chk_]:checked").length;

            bat_btn.prop('disabled', cnt == 0);
            bat_btn.removeClass(cnt == 0 ? 'btn_batch_enabled' : 'btn_batch_disabled');
            bat_btn.addClass(cnt == 0 ? 'btn_batch_disabled' : 'btn_batch_enabled');

            $('#check_all').prop('checked', cnt == chks.length-1); // select all ??

            if (cnt > 0) { // 子選單隱藏時，自動彈出顯示
                var elms = bat_btn.parents(".side-menu");
                if (elms.css('display') == 'none')
                    $(".side_control").trigger('click');
            }
        });
    }

    if( typeof g_NO_DATA == 'undefined' )
        g_NO_DATA = "目 前 沒 有 資 料";

    // empty table default html
    $('table.empty_html').each(function () {
        var rowspan = $(this).find("th:first").attr("rowspan");
        if (typeof rowspan == "undefined")
          rowspan = 1;

        var oTR = $(this).find('tr');
        if (oTR.length == rowspan) // only contains a header row
        {
            //var cols = oTR.find('th,td').length;
            var cols = 0;
            oTR.find('th,td').each(function () {
                if ($(this).attr('colspan')) {
                    cols += +$(this).attr('colspan');
                } else {
                    cols++;
                }
            });
            var objTR = this.insertRow(rowspan);
            var html = "<td colspan='" + (cols < 1 ? 1 : cols) +
                       "' style='vertical-align:middle; text-align:center; height:100px;'>" +
                       "<span style='color:gray; font-size:16px;'>" + g_NO_DATA  + "</span>";
            $(objTR).html(html);
        }
    });

    // 控制項目設定醒目提示
    if ($.qtip != null) {
        var tipOptsItems = {
            position: { at: 'top center', my: 'bottom right' },
            style: { classes: 'qtip-rounded red_tips' }
        };

        var tipOptsItemsAuto = {
            style: { classes: 'qtip-rounded red_tips' }
        };
        var tipOptsItemsBlue = {
            position: { at: 'top center', my: 'bottom right' },
            style: { classes: 'qtip-rounded blue_tips' }
        };

        $(".controls a").qtip(tipOptsItems);
        $(".controls :button,.controls :image, .controls :submit,.qtip_title").qtip(tipOptsItems);
        $(".qtip_title2").qtip(tipOptsItemsAuto);
        $(".qtip_title_blue").qtip(tipOptsItemsBlue);
    }
}

// 欄位提示文字
function init_place_holder() {
    $('[placeholder]').focus(function () {
        var input = $(this);

        if (input.val() == input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function () {
        var input = $(this);

        if (input.val() == '' || input.val() == input.attr('placeholder')) {
            input.addClass('placeholder');
            input.val(input.attr('placeholder'));
        }
    }).blur();
}

// 去除所有欄位提示文字
function end_place_holder()
{
    $('[placeholder]').each(function () {
        var $this = $(this);
        if ($this.val() == $this.attr('placeholder'))
            $this.val('');
        $this.removeClass('placeholder');
    });
}

// ListView
// 初始化
// 支援:data-sort="yes"  data-sel-mode="single"
function init_list(oElm) {
    oElm.selectable();
    // 初始排序
    if (oElm.attr("data-sort") == "yes")
        sort_list(oElm);

    // 檢查是否只能單選
    oElm.selectable({
        selected: function (event, ui) {
            // 該項目不可點取
            if ($(ui.selected).attr("data-disabled") == "1") {
                $(ui.selected).removeClass("ui-selected");
                return;
            }

            if ($(this).attr("data-sel-mode") != "multiple") {
                // 單選設定
                if (oElm.children(".ui-selected").length > 1)
                    $(ui.selected).removeClass("ui-selected");
            }
        }
    });

    // 自動加入 title 屬性
    oElm.find("li").each(function () {
        $(this).attr("title", $(this).text());
    });
}

// 新增一筆資料到 ListView
function list_add_item(oListItem, sTxt, dataVal) {
    if (oListItem == null)
        return;

    var oNewItem = oListItem.append("<li>" + htmlEscape(sTxt) + "</li>");
    if( dataVal != null )
        oNewItem.attr('data-value', dataVal);

    if (oListItem.attr("data-sort") == "yes")
        sort_list(oListItem);
}

// 排序 List (傳入 element)
// 範例: sort_list($("#list1"))
function sort_list(oElm) {
    var arrData = new Array();
    oElm.children("li").each(function () {
        arrData.push($(this));
    });
    arrData.sort(sort_by_text);
    oElm.children("li").remove();
    $.each(arrData, function () {
        oElm.append(this);
    });
}

// sort_list 專用排序函數
function sort_by_text(a, b) {
    var aValue = a.text();
    var bValue = b.text();
    return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
}

function sort_by_value(a, b) {
    var aValue = a.attr("data-value");
    var bValue = b.attr("data-value");
    return ((aValue < bValue) ? -1 : ((aValue > bValue) ? 1 : 0));
}

// 加入表格中的一列 (objTable, index, [items], class)
function insert_row() {
    if (arguments.length < 3 || arguments[2].length == null)
        return false;

    var objTable = arguments[0];
    var idx = arguments[1];

    if (idx < 0)
        idx = objTable.rows.length;

    var objTR = objTable.insertRow(idx);
    var clsName = arguments.length > 3 ? arguments[3] : '';

    for (var i = 0; i < arguments[2].length; i++) {
        var objTD = objTR.insertCell(i);
        objTD.innerHTML = arguments[2][i];

        if (clsName != null && clsName.length > 0)
            objTD.className = clsName;
    }

    return objTR;
}

// ------------------------------------------
// Select - selected
// ------------------------------------------
jQuery.fn.setSelected = function (selValue) {
    $(this).children().each(function () {
        if ($(this).val() == selValue)
            $(this).prop("selected", true);
        else
            $(this).prop("selected", false);
    });
}

// ------------------------------------------
// CheckBox - checked
// ------------------------------------------
jQuery.fn.setChecked = function(selValue) {
    $(this).each(function () {
        if ($(this).val() == selValue)
            $(this).prop("checked", true);
        else
            $(this).prop("checked", false);
    });
}

// ------------------------------------------
// Enable/Disable HTML elements
// ------------------------------------------
jQuery.fn.ReadOnly = function () {
    var flag = true;
    if (arguments.length > 0 && !arguments[0])
        flag = false;

    this.each(function () {
        switch (this.tagName) {
            case "TEXTAREA":
            case "INPUT":
                var sElmType = $(this).attr("type") || "";
                switch (sElmType.toUpperCase()) {
                    case "CHECKBOX":
                        if (!flag)
                            $(this).unbind("click");
                        else
                            $(this).click(function () { return !flag });
                        break;

                    case "RADIO":
                        if (!flag)
                            $(this).prop("disabled", flag);
                        else {
                            if (!$(this).prop("checked"))
                                $(this).prop("disabled", true);
                        }
                        break;

                    case "BUTTON":
                        $(this).prop("disabled", flag);
                        break;

                    default:
                        $(this).prop("readonly", flag);
                        //if (this.tagName == "TEXTAREA")
                        $(this).css('background-color', flag ? '#eee' : '#fff');
                        $(this).css('color', flag ? '#888' : '#000');
                }
                break;

            case "SELECT":
                if (flag) {
                    $(this).children("option").not(":selected").prop("disabled", flag);
                } else
                    $(this).children("option").prop("disabled", false);
                $(this).css('color', flag ? '#888' : '#000');
                break;
        }
    });
}

// ------------------------------------------
// 支援 Input(含Checkbox/Radio) 及 Select
// Checkbox 支援 同一 name 設定多個值 setValue 用 ,　隔開
// ex: $("#checkBox1").setValue("1,3,5");
// ------------------------------------------
jQuery.fn.setValue = function (setValue) {
    var obj = $(this);
    if (typeof obj.get(0) != "undefined") {
        var TagName = obj.get(0).tagName;
        switch (TagName) {
            // 處理INPUT
            case "TEXTAREA":
            case "INPUT":
                var sElmType = obj.prop("type") || "";
                if (sElmType == "checkbox" || sElmType == "radio") {
                    // INPUT > checkbox || radio
                    arrValue = setValue.toString().split(",");
                    obj.each(function () {
                        for (var curIdx in arrValue) {
                            if ($(this).val() == arrValue[curIdx])
                                $(this).prop("checked", true);
                        }
                    });
                } else
                    $(this).val(setValue);
                break;
            // 處理 SELECT
            case "SELECT":
                obj.children().each(function () {
                    if ($(this).val() == setValue)
                        $(this).prop("selected", true);
                });
                break;
        }
    }
};

// ------------------------------------------
// 檢測是否為 undefined 或 null
// ------------------------------------------
function isEmpty(obj) {
  if (typeof obj == "undefined")
    return true;
  if (typeof obj == "null")
    return true;
  return false;
};

/* 左邊補0 */
function padLeft(str, len) {
  str = str || "";
  return new Array(len - str.length + 1).join("0") + str;
}

//可在Javascript中使用如同C#中的string.format
//使用方式 : var fullName = String.format('Hello. My name is {0} {1}.', 'FirstName', 'LastName');
String.format = function () {
  var s = arguments[0];
  if (s == null) return "";
  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = getStringFormatPlaceHolderRegEx(i);
    s = s.replace(reg, (arguments[i + 1] == null ? "" : arguments[i + 1]));
  }
  return cleanStringFormatResult(s);
}
//可在Javascript中使用如同C#中的string.format (對jQuery String的擴充方法)
//使用方式 : var fullName = 'Hello. My name is {0} {1}.'.format('FirstName', 'LastName');
String.prototype.format = function () {
  var txt = this.toString();
  for (var i = 0; i < arguments.length; i++) {
    var exp = getStringFormatPlaceHolderRegEx(i);
    txt = txt.replace(exp, (arguments[i] == null ? "" : arguments[i]));
  }
  return cleanStringFormatResult(txt);
}
//讓輸入的字串可以包含{}
function getStringFormatPlaceHolderRegEx(placeHolderIndex) {
  return new RegExp('({)?\\{' + placeHolderIndex + '\\}(?!})', 'gm')
}
//當format格式有多餘的position時，就不會將多餘的position輸出
//ex:
// var fullName = 'Hello. My name is {0} {1} {2}.'.format('firstName', 'lastName');
// 輸出的 fullName 為 'firstName lastName', 而不會是 'firstName lastName {2}'
function cleanStringFormatResult(txt) {
  if (txt == null) return "";
  return txt.replace(getStringFormatPlaceHolderRegEx("\\d+"), "");
}

// 將 <form> 內的資料轉換成 JSON 物件
function serialize_form($form) {
    var retObj = {};

    $form.find('input,select,textarea').each(function () {
        var $elm = $(this);
        var name = $elm.attr('name');
        if (name == null || name.length == 0)
            return;

        var type = ($elm.attr('type') + '').toLowerCase();
        if (type == 'checkbox' || type == 'radio') {
            if (!$elm.prop('checked'))
                return; // skip none checked element
        }

        retObj[name] = $elm.val();
    });

    return retObj;
}