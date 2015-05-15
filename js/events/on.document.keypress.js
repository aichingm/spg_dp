$(document).ready(function (e) {
    $(document).on("keypress keyup", function (e) {
//hide open leftDrawer
        if (e.keyCode === 27) {
            $drawer = $(".leftDrawer.isIn");
            $drawer.trigger("leftDrawer-close")
                    .removeClass("isIn")
                    .animate({
                        left: "-100%"
                    }, {
                        duration: 200,
                        done: function () {
                            $drawer.trigger("leftDrawer-closed");
                        }
                    });
            //animates all .opener to margin-left: 0 which is preatty dirty!! fix this todo
            $(".opener").animate({
                "margin-left": 0
            }, 200);
            ;
        }

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
    });
});