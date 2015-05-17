$(document).ready(function () {
    $(".opener").click(function () {
        var index = $(this).index() + 1;
        $drawer = $(".leftDrawer:nth-child(" + index + ")");
        var event = jQuery.Event("leftDrawer-open");
        $drawer.trigger(event);
        if (!event.isDefaultPrevented()) {
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
        }
    });
});