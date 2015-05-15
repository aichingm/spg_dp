$(document).ready(function () {
    $(".opener").click(function () {
        var index = $(this).index() + 1;
        $drawer = $(".leftDrawer:nth-child(" + index+ ")");
        $drawer.animate({
            left: "0%"
        }, 200).addClass("isIn");
        $(this).animate({
            "margin-left": $drawer.width()
        }, 200);
    });
});