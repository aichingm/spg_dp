$(document).ready(function () {
    $(".settingsLine .drawingHeightPercentage").change(function (e) {
        VIEWER.setDrawingHeightPercentage(parseInt($(e.target).val()));
        VIEWER.draw(true);
    });
});