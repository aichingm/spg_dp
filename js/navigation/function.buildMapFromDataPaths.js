function buildMapFromDataPaths(data) {
    var map = {}, eIndex, paths = new Paths(), e;
    paths.load(data);
    for (eIndex in paths.edges) {
        e = paths.edges[eIndex];
        try {
            if (map[paths.getVertex(e.Ax, e.Ay, e.Afloor).name] === undefined) {
                map[paths.getVertex(e.Ax, e.Ay, e.Afloor).name] = {};
            }
            if (map[paths.getVertex(e.Bx, e.By, e.Bfloor).name] === undefined) {
                map[paths.getVertex(e.Bx, e.By, e.Bfloor).name] = {};
            }
            map[paths.getVertex(e.Ax, e.Ay, e.Afloor).name][paths.getVertex(e.Bx, e.By, e.Bfloor).name] = e.metric[0]; //distance calculation todo
            map[paths.getVertex(e.Bx, e.By, e.Bfloor).name][paths.getVertex(e.Ax, e.Ay, e.Afloor).name] = e.metric[1]; //distance calculation todo
        } catch (e) {
            console.log("Edge not found", e.data);
        }
    }
    return map;
}
