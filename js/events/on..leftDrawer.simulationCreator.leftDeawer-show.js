$(document).ready(function (e) {
    $(".leftDrawer.simulationCreator").on("leftDrawer-open", function (e) {
        var clist, list, exports = STORAGE.getData();
        list = buildVetexNameList(exports.paths);
        clist = buildVetexCategoryList(exports.paths);
        $(".leftDrawer.simulationCreator div table tbody").html("");

        $(".leftDrawer.simulationCreator div select[name='habitat']").html("");
        $(".leftDrawer.simulationCreator div select[name='objective'] optgroup[label='Room']").html("");
        $(".leftDrawer.simulationCreator div select[name='objective'] optgroup[label='Category']").html("");
        for (var i = 0; i < list.length; i++) {
            $(".leftDrawer.simulationCreator div select[name='habitat']").append("<option>" + list[i] + "</option>");
        }

        for (var i = 0; i < list.length; i++) {
            $(".leftDrawer.simulationCreator div select[name='objective'] optgroup[label='Room']").append("<option>" + list[i] + "</option>");
        }
        for (var i = 0; i < clist.length; i++) {
            $(".leftDrawer.simulationCreator div select[name='objective'] optgroup[label='Category']").append("<option>" + clist[i] + "</option>");
        }

    });
    $(".leftDrawer.simulationCreator div button[name='add']").click(function () {
        if ($($(".leftDrawer.simulationCreator div select[name='objective'] optgroup :selected")[0]).parent().attr("label") === "Category") {
            $(".leftDrawer.simulationCreator div table tbody").append("<tr><td>" + $(".leftDrawer.simulationCreator div select[name='habitat']").val() + "</td><td>" + $(".leftDrawer.simulationCreator div input[name='population']").val() + "</td><td>" + $(".leftDrawer.simulationCreator div select[name='objective']").val() + "</td><td>Category</td><td><button name=\"delete\">Delete</button></td></tr>");
        } else {
            $(".leftDrawer.simulationCreator div table tbody").append("<tr><td>" + $(".leftDrawer.simulationCreator div select[name='habitat']").val() + "</td><td>" + $(".leftDrawer.simulationCreator div input[name='population']").val() + "</td><td>" + $(".leftDrawer.simulationCreator div select[name='objective']").val() + "</td><td>Room</td><td><button name=\"delete\">Delete</button></td></tr>");
        }
        $(".leftDrawer.simulationCreator div table tbody tr:last-child td button").click(function (e) {
            $(this).parent().parent().remove();
        });
    });

    $(".leftDrawer.simulationCreator div button[name='save']").click(function () {
        var arr = [];
        $.each($(".leftDrawer.simulationCreator div table tbody tr"), function () {
            arr.push({habitat: $($(this).children()[0]).html(),
                population: parseInt($($(this).children()[1]).html()),
                objective: $($(this).children()[2]).html(),
                objectiveType: $($(this).children()[3]).html()});
        });
        var textToWrite = JSON.stringify(arr);
        var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
        var fileNameToSaveAs = "populationMap.json";
        var downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = function (e) {
            document.body.removeChild(e.target);
        };
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
        downloadLink.click();
    });
    $(".leftDrawer.simulationCreator div button[name='load']").click(function () {
        var f = $(".leftDrawer.simulationCreator div input[name='loadFile']")[0].files[0];
        if (f) {
            var r = new FileReader();
            r.onload = function (e) {
                var pMap = JSON.parse(e.target.result);
                $(".leftDrawer.simulationCreator div table tbody").html("");
                for (var i = 0; i < pMap.length; i++) {
                    var e = pMap[i];
                    $(".leftDrawer.simulationCreator div table tbody").append("<tr><td>" + e.habitat + "</td><td>" + e.population + "</td><td>" + e.objective + "</td><td>" + e.objectiveType + "</td><td><button name=\"delete\">Delete</button></td></tr>");
                }



            };
            r.readAsText(f);
        }




    });

});