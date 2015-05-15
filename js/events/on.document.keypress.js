$(document).ready(function (e) {
    $(document).on("keypress", function (e) {
        //init settings drawer
        if (e.charCode === 46) { //.
            if ($("#settings").hasClass("isIn")) {
                $("#settings").removeClass("isIn");
                $("#settings").animate({
                    right: "-200px"
                }, 200);
            } else {
                $("#settings").addClass("isIn");
                $("#settings").animate({
                    right: "0px"
                }, 200);
            }
        }
    })
});