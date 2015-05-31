$(document).ready(function(){
    $(".snackbar.showPathBar .controls .cancel").click(function(e){
        $(e.target).parent().parent().hide();
        VIEWER.setPath([]);
        VIEWER.draw(true);
    });
});