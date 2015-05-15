function buildShowDiv() {
    if (typeof (Storage) !== "undefined") {
        var exports = localStorage.getItem("PieceofShit.exports");
        //check if they are valid
        if (exports !== null && exports !== undefined && exports.length > 0) {
            //draw them
            var data = JSON.parse(exports);
            $("#drawFloors").html("");
            $(data.modelManager.floors).each(function (k) {
                $("#drawFloors").append("<option selected='selected' value='" + k + "'>" + this.name + "</option>");
            });
            $("#drawFloors").attr("size", data.modelManager.floors.length);
        }
        $("#drawFloors").change(function (e) {
            if (typeof (Storage) !== "undefined") {
                var exports = localStorage.getItem("PieceofShit.exports");
                //check if they are valid
                if (exports !== null && exports !== undefined && exports.length > 0) {
                    //draw them
                    draw(JSON.parse(exports), true);
                }
            }
        });
    }
}