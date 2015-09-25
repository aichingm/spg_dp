$(document).ready(function () {
    $(".snackbar.showSimulationBar .controls .cancel").click(function (e) {
        $(e.target).parent().parent().hide();
        clearInterval(VIEWER.simulationData.simulationInterval);
        VIEWER.simulationData.edges = [];
        VIEWER.draw(true);
    });
});