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
    uiProps.on("editorStyle", function (key, val) {
        editor.setOptions({"style": Styles[val]});
        //jQuery .attr() does not refresh the checkbox
        $("#settingsMaxSelected").val(val);
    });
    
    uiProps.on("mouseMode", function (key, val) {
        $("#settingsMouseMode").val(val);
    });
    uiProps.on("drawingParts", function (key, val) {
        editor.getDrawer().setDrawingParts(val);
        editor.getDrawer().redraw();
    });
    uiProps.on("mouseMode", function (key, val) {
        if(val === "autoWall"){
            uiProps.set("maxSelect", 2);
            uiProps.set("autoSelect", true);
        }
    });
    uiProps.on("maxSelect", function (key, val) {
        if(uiProps.equals("mouseMode","autoWall") && val !== 2){
            uiProps.set("mouseMode", "points");
        }
    });
    uiProps.on("autoSelect", function (key, val) {
        if(uiProps.equals("mouseMode","autoWall") && val !== true){
            uiProps.set("mouseMode", "points");
        }
    });
    
    



    uiProps.set("mouseMode", "points");
    uiProps.set("maxSelect", 4);
    uiProps.set("autoSelect", true);
    return uiProps;
}