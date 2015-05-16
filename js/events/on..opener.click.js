$(document).ready(function () {
    $(".opener").click(function () {
        var index = $(this).index() + 1;
        $drawer = $(".leftDrawer:nth-child(" + index + ")");
        $drawer.trigger("leftDrawer-open");
        $drawer.animate({
            left: "0%"
        }, {
            duration: 200,
            done: function () {
                $drawer.trigger("leftDrawer-opened");
            }
        }).addClass("isIn");
        $(this).animate({
            "margin-left": $drawer.width()
        }, 200);
    });
    $(".leftDrawer div button.cancel").click(function () {
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
    });

    $(".leftDrawer div button.apply").click(function () {
        $drawer = $(".leftDrawer.isIn");
        $drawer.trigger("leftDrawer-apply");
        $(".leftDrawer.isIn div button.cancel").trigger("click");
    });
});