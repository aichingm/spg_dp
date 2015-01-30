function uiPropsSetUp() {
    var uiProps = new ValuesObserver();
    uiProps.on("maxSelect", function (key, val) {
        editor.getPointsManager().setOptions({"maxSelect": val});
    });
    uiProps.on("autoSelect", function (key, val) {
        //editor.getPointsManager().setOptions({"autoSelect": val});
        editor.setOptions({"autoSelect": val});

    });



    uiProps.set("mouseMode", "points");
    uiProps.set("maxSelect", 4);
    uiProps.set("autoSelect", true);
    return uiProps;
}