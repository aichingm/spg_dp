function buildShowDiv() {
    if (typeof (Storage) !== "undefined") {
        var data = STORAGE.getData();
        $("#drawFloors").html("");
        var selectedFloors = [];
        $(data.modelManager.floors).each(function (k) {
            selectedFloors.push(parseInt(k));
            $("#drawFloors").append("<option selected='selected' value='" + k + "'>" + this.name + "</option>");
        });
        VIEWER.setSelectedFloors(selectedFloors);
        $("#drawFloors").attr("size", data.modelManager.floors.length);

        $("#drawFloors").change(function (e) {
            var selectedFloors = [];
            if ($("#drawFloors").val()) {
                $.each($("#drawFloors").val(), function (v, k) {
                    selectedFloors.push(parseInt(k));
                });
            }
            VIEWER.setSelectedFloors(selectedFloors);
            VIEWER.draw(true);
        });
    }
}