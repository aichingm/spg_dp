$(document).ready(function (e) {
    //start up
    init();
    //request animation
    animate();


    //bind storage events
    $(window).bind('storage', function (e) {
        if (e.originalEvent.key === "PieceofShit.exports") {
            buildShowDiv();
            draw(JSON.parse(e.originalEvent.newValue), true);
        }
    });
    //check if exportObjects are cached and if load them
    if (typeof (Storage) !== "undefined") {
        var exports = localStorage.getItem("PieceofShit.exports");
        //check if they are valid
        if (exports !== null && exports !== undefined && exports.length > 0) {
            //draw them
            buildShowDiv();
            draw(JSON.parse(exports), false);
        }
    }
});