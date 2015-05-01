$(document).ready(function () {

    $("#settingsMaxSelected").change(function () {
        uiProps.set("maxSelect", $(this).val());
    });
    $("#settingsMouseMode").change(function () {
        uiProps.set("mouseMode", $(this).val());
    });
    $("#settingsAutoSelect").change(function () {
        uiProps.set("autoSelect", $(this).is(":checked"));
    });
    $("#settingsDrawingParts").on("change",function () {
        uiProps.set("drawingParts", $(this).val());
    });



});