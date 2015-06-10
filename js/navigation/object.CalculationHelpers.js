var CalculationHelpers = {
    calculatePathLength3D: function (data, path) {
        var a, b, aZ, bZ, vac, distance = 0;
        for (var i = 0; i < path.length - 1; i++) {
            a = data.paths.vertices[data.paths.vshadow[path[i]]];
            b = data.paths.vertices[data.paths.vshadow[path[i + 1]]];
            aZ = data.modelManager.floors[a.floorIndex].offset.z;
            bZ = data.modelManager.floors[b.floorIndex].offset.z;
            vac = new THREE.Vector3(a.x, a.y, aZ);
            distance += vac.distanceTo(new THREE.Vector3(b.x, b.y, bZ));
        }
        return distance;
    },
    calculatePathLength3DPercentMetric: function (data, path) {
        var a, b, aZ, bZ, vac, aHash, bHash, percentage, distance = 0;
        for (var i = 0; i < path.length - 1; i++) {
            a = data.paths.vertices[data.paths.vshadow[path[i]]];
            b = data.paths.vertices[data.paths.vshadow[path[i + 1]]];
            aZ = data.modelManager.floors[a.floorIndex].offset.z;
            bZ = data.modelManager.floors[b.floorIndex].offset.z;
            vac = new THREE.Vector3(a.x, a.y, aZ);
            aHash = a.x + "|" + a.y + "|" + a.floorIndex;
            bHash = b.x + "|" + b.y + "|" + b.floorIndex;
            if (data.paths.eabShadow[aHash+"|"+bHash]) {
                percentage = data.paths.edges[data.paths.eabShadow[aHash+"|"+bHash]].metric[0];
            } else if (data.paths.eabShadow[bHash+"|"+aHash]) {
                percentage = data.paths.edges[data.paths.eabShadow[bHash+"|"+aHash]].metric[1];
            } else {
                throw new Error("no edge found from " + aHash + " to " + bHash);
            }

            distance += vac.distanceTo(new THREE.Vector3(b.x, b.y, bZ)) / 100 * percentage;
        }
        return distance;
    }
};