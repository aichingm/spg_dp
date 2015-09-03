$(document).ready(function (e) {
    STORAGE = new StorageControler("BuildingExplorer.exports");
    STORAGE.jsonConvert = true;
    STORAGE.setupChangeListener();
    STORAGE.dataManipulator = function (data) {
        var i, j, k, e, floor, element, object, area, paths = new Paths();
        if (!data) {
            data = new EmptyDataObject();
        } else {
            if (!data.paths) {
                data.paths = {};
            }
            if (!data.paths.vertices) {
                data.paths.vertices = [];
            }
            if (!data.paths.edges) {
                data.paths.edges = [];
            }
        }

        area = {x: {max: 0, min: 0}, y: {max: 0, min: 0}, z: {max: 0, min: 0}};
        for (i = 0; i < data.modelManager.floors.length; i++) {
            floor = data.modelManager.floors[i];
            for (j = 0; j < floor.elements.length; j++) {
                element = floor.elements[j];
                for (k = 0; k < element.points.length; k++) {
                    object = element.points[k];
                    area.x.max = Math.max(area.x.max, object[0]);
                    area.x.min = Math.min(area.x.min, object[0]);
                    area.y.max = Math.max(area.y.max, object[1]);
                    area.y.min = Math.min(area.y.min, object[1]);
                }
            }
            area.z.max = Math.max(area.z.max, floor.offset.z + floor.height);
            area.z.min = Math.min(area.z.min, floor.offset.z);
        }
        area.x.max = Math.abs(area.x.max);
        area.x.min = Math.abs(area.x.min);
        area.y.max = Math.abs(area.y.max);
        area.y.min = Math.abs(area.y.min);
        data.center = {x: (area.x.max + area.x.min) / 2, z: (area.y.max + area.y.min) / 2, y: (area.z.max + area.z.min) / 2};

        paths.load(data.paths);
        for (i = 0; i < paths.edges.length; i++) {
            e = paths.edges[i];
            e.A = paths.getVertex(e.Ax, e.Ay, e.Afloor);
            e.B = paths.getVertex(e.Bx, e.By, e.Bfloor);
        }
        data.paths.vshadow = {};
        for (i = 0; i < paths.vertices.length; i++) {
            data.paths.vshadow[paths.vertices[i].name] = i;
        }
        data.paths.eabShadow = {};
        for (i = 0; i < paths.edges.length; i++) {
            data.paths.eabShadow[paths.edges[i].Ax + "|" + paths.edges[i].Ay + "|" + paths.edges[i].Afloor + "|" +
                    paths.edges[i].Bx + "|" + paths.edges[i].By + "|" + paths.edges[i].Bfloor] = i;
        }
        return data;
    };
    STORAGE.reloadData();
    VIEWER = new Viewer();

    //VIEWER.setStats(new Stats());
    //VIEWER.getStats().setMode(0);
    //VIEWER.getStats().domElement.style.position = 'absolute';
    //VIEWER.getStats().domElement.style.left = '0px';
    //VIEWER.getStats().domElement.style.bottom = '0px';
    //VIEWER.getStats().domElement.style.zIndex = '1000';
    //document.body.appendChild(VIEWER.getStats().domElement);

    VIEWER.init();
    VIEWER.animate();

    //bind storage events
    STORAGE.onChange(function (data, event, controler) {
        buildShowDiv();
        VIEWER.setData(data);
        VIEWER.draw(true);
    });
    var exports = STORAGE.getData();
    //check if the exports are valid
    if (exports !== undefined) {
        //build settings drawer
        buildShowDiv();
        //set draw data
        VIEWER.setData(exports);
        //draw them
        VIEWER.draw(false);
    }
});
