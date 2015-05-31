var DistanceCalculators = {
    calculateByMetric: function (direction, edge, a, b, data) {
        return edge.metric[direction];
    },
    calculateByVectorDistance2D: function (direction, edge, a, b, data) {
        var vac = new THREE.Vector2(a.x, a.y);
        var d = vac.distanceTo(new THREE.Vector2(b.x, b.y));
        return d;
    },
    calculateByVectorDistance3D: function (direction, edge, a, b, data) {
        var aZ, bZ, vac, d;
        aZ = data.modelManager.floors[a.floorIndex].offset.z;
        bZ = data.modelManager.floors[b.floorIndex].offset.z;
        vac = new THREE.Vector3(a.x, a.y, aZ);
        d = vac.distanceTo(new THREE.Vector3(b.x, b.y, bZ));
        return d;
    },
    calculateByVectorDistance3DTimesMetric: function (direction, edge, a, b, data) {
        var aZ, bZ, vac, d;
        aZ = data.modelManager.floors[a.floorIndex].offset.z;
        bZ = data.modelManager.floors[b.floorIndex].offset.z;
        vac = new THREE.Vector3(a.x, a.y, aZ);
        d = vac.distanceTo(new THREE.Vector3(b.x, b.y, bZ));
        return d * edge.metric[direction];
    },
    calculateByVectorDistance3DPercentMetric: function (direction, edge, a, b, data) {
        var aZ, bZ, vac, d;
        aZ = data.modelManager.floors[a.floorIndex].offset.z;
        bZ = data.modelManager.floors[b.floorIndex].offset.z;
        vac = new THREE.Vector3(a.x, a.y, aZ);
        d = vac.distanceTo(new THREE.Vector3(b.x, b.y, bZ));
        return (d/100)*edge.metric[direction];
    }
};