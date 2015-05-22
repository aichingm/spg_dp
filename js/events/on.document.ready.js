$(document).ready(function (e) {
    STORAGE = new StorageControler("PieceofShit.exports");
    STORAGE.jsonConvert = true;
    STORAGE.setupChangeListener();
    STORAGE.dataManipulator = function (data) {
        var i, e, paths = new Paths();
        if(!data.paths){
            data.paths = {};
        }
        if(!data.paths.vertices){
            data.paths.vertices = [];
        }
         if(!data.paths.edges){
            data.paths.edges = [];
        }
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
        return data;
    };
    STORAGE.reloadData();
    VIEWER = new Viewer();

    VIEWER.setStats(new Stats());
    VIEWER.getStats().setMode(0);
    VIEWER.getStats().domElement.style.position = 'absolute';
    VIEWER.getStats().domElement.style.left = '0px';
    VIEWER.getStats().domElement.style.bottom = '0px';
    VIEWER.getStats().domElement.style.zIndex = '1000';
    document.body.appendChild(VIEWER.getStats().domElement);

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