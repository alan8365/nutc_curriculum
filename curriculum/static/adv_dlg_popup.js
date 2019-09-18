
var baseWindow = getBaseWindow();
var $dlg=null ;
if (baseWindow && baseWindow.$dialog.length > 0) {
    $dlg = baseWindow.$dialog[baseWindow.$dialog.length - 1];
    jQuery.showModalDialog = baseWindow.$.showModalDialog;

    if ($dlg) window.dialogArguments = $dlg.dialogArguments;
    if ($dlg)
        window.xclose = function () { if ($dlg) $dlg.dialogWindow.dialog('close'); };
    else
        window.xclose = window.close;
}
else
    window.xclose = function () { window.location.href = "/"; }

