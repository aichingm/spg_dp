function buildMapFromDataPaths(data, distanceCalculator, options) {
    this.options = {onlyPublic: true, onlyAccessible: false};
    for (var i in options) {
        if (options.hasOwnProperty(i)) {
            this.options[i] = options[i];
        }
    }
    distanceCalculator = distanceCalculator ? distanceCalculator : DistanceCalculators.calculateByVectorDistance3D;
    var map = {}, eIndex, paths = new Paths(), e, a, b;
    paths.load(data.paths);
    for (eIndex in paths.edges) {
        e = paths.edges[eIndex];
        try {
            if (
                    (this.options.onlyAccessible && !e.accessible) ||
                    (this.options.onlyPublic && !e.public)
                    ) {

            } else {
                a = paths.getVertex(e.Ax, e.Ay, e.Afloor);
                b = paths.getVertex(e.Bx, e.By, e.Bfloor);
                if (map[a.name] === undefined) {
                    map[a.name] = {};
                }
                if (map[b.name] === undefined) {
                    map[b.name] = {};
                }
                map[a.name][b.name] = distanceCalculator(0, e, a, b, data);
                map[b.name][a.name] = distanceCalculator(1, e, a, b, data);
            }
        } catch (e) {
            console.log("Vertex not found", e, e.data);
        }
    }
    return map;
}
