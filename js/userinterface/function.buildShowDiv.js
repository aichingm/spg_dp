function buildShowDiv() {
    if (typeof (Storage) !== "undefined") {
        var data = STORAGE.getData();
        $("#drawFloors").html("");
        $(data.modelManager.floors).each(function (k) {
            $("#drawFloors").append("<option selected='selected' value='" + k + "'>" + this.name + "</option>");
        });
        $("#drawFloors").attr("size", data.modelManager.floors.length);
        $("#drawFloors").change(function (e) {
            VIEWER.draw(true);
        });
    }
}