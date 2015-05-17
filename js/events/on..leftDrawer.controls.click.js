$(document).ready(function () {
    $(".leftDrawer div button.cancel").click(function () {
        $drawer = $(".leftDrawer.isIn");
        var event = jQuery.Event("leftDrawer-close");
        $drawer.trigger(event);
        if (!event.isDefaultPrevented()) {
            $drawer.removeClass("isIn")
                    .animate({
                        left: "-100%"
                    }, {
                        duration: 200,
                        done: function () {
                            var event = jQuery.Event("leftDrawer-closed");
                            $drawer.trigger(event);
                        }
                    });
        }
        //animates all .opener to margin-left: 0 which is preatty dirty!! fix this todo
        $(".opener").animate({
            "margin-left": 0
        }, 200);
    });

    $(".leftDrawer div button.apply").click(function () {
        $drawer = $(".leftDrawer.isIn");
        var event = jQuery.Event("leftDrawer-apply");
        $drawer.trigger(event);
        if (!event.isDefaultPrevented()) {
            $(".leftDrawer.isIn div button.cancel").trigger("click");
        }
    });
});