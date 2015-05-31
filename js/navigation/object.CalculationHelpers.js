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
    }
};