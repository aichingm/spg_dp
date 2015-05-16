$(document).ready(function (e) {
    VIEWER = new Viewer();
    VIEWER.init();
    VIEWER.animate();


    //bind storage events
    $(window).bind('storage', function (e) {
        if (e.originalEvent.key === "PieceofShit.exports") {
            buildShowDiv();
            VIEWER.setData(JSON.parse(e.originalEvent.newValue));
            VIEWER.draw(true);
        }
    });
    //check if exportObjects are cached and if load them
    if (typeof (Storage) !== "undefined") {
        var exports = localStorage.getItem("PieceofShit.exports");
        //check if they are valid
        if (exports !== null && exports !== undefined && exports.length > 0) {
            //draw them
            buildShowDiv();
            VIEWER.setData(JSON.parse(exports));
            VIEWER.draw(false);
        }
    }
});