$(document).ready(function (e) {
    $(document).on("keypress keyup", function (e) {
//hide open leftDrawer
        if (e.keyCode === 27) {
            $(".leftDrawer.isIn div button.cancel").trigger("click");
        }
        //init settings drawer
        if (e.charCode === 46) { //.
            $("#settings .opener").trigger("click");
        }
    });
});