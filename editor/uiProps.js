function uiPropsSetUp() {
    var uiProps = new ValuesObserver();
    uiProps.on("maxSelect", function (key, val) {
        editor.getPointsManager().setOptions({"maxSelect": val});
        $("#settingsMaxSelected").val(val);
    });
    uiProps.on("autoSelect", function (key, val) {
        editor.setOptions({"autoSelect": val});
        //jQuery .attr() does not refresh the checkbox
        document.getElementById("settingsAutoSelect").checked = val;
    });
    uiProps.on("mouseMode", function (key, val) {
        $("#settingsMouseMode").val(val);
    });
    uiProps.on("drawingParts", function (key, val) {
        editor.getDrawer().setDrawingParts(val);
        editor.getDrawer().redraw();
    });
    
    



    uiProps.set("mouseMode", "points");
    uiProps.set("maxSelect", 4);
    uiProps.set("autoSelect", true);
    return uiProps;
}