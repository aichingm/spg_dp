Geometries = {
    floorGemometry: function (points, z) {
        var geometry = new THREE.Geometry();
        if (points.length === 4) {
            geometry.vertices.push(
                    new THREE.Vector3(points[0][0], z, points[0][1]),
                    new THREE.Vector3(points[1][0], z, points[1][1]),
                    new THREE.Vector3(points[2][0], z, points[2][1]),
                    new THREE.Vector3(points[3][0], z, points[3][1])
                    );
            //every geometry must be built out of triangles the parameter are the points used to create the triangle
            //a square is made out of 2 triangles remeber to keep the correct order of the points!
            geometry.faces.push(new THREE.Face3(0, 1, 2));
            geometry.faces.push(new THREE.Face3(0, 2, 3));
        } else if (points.length === 3) {
            geometry.vertices.push(
                    new THREE.Vector3(points[0][0], z, points[0][1]),
                    new THREE.Vector3(points[1][0], z, points[1][1]),
                    new THREE.Vector3(points[2][0], z, points[2][1])
                    );
            geometry.faces.push(new THREE.Face3(0, 1, 2));
        }
        return geometry;
    },
    wallGemometry: function (points, z, height) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
                new THREE.Vector3(points[0][0], z, points[0][1]),
                new THREE.Vector3(points[0][0], z + height, points[0][1]),
                new THREE.Vector3(points[1][0], z + height, points[1][1]),
                new THREE.Vector3(points[1][0], z, points[1][1])
                );
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));
        return geometry;
    },
    doorGemometry: function (points, z, height) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
                new THREE.Vector3(points[0][0], z, points[0][1]),
                new THREE.Vector3(points[0][0], z + (height / 100 * 75), points[0][1]),
                new THREE.Vector3(points[1][0], z + (height / 100 * 75), points[1][1]),
                new THREE.Vector3(points[1][0], z, points[1][1])
                );
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));
        return geometry;
    },
    overDoorGemometry: function (points, z, height) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
                new THREE.Vector3(points[0][0], z + (height / 100 * 75), points[0][1]),
                new THREE.Vector3(points[0][0], z + height, points[0][1]),
                new THREE.Vector3(points[1][0], z + height, points[1][1]),
                new THREE.Vector3(points[1][0], z + (height / 100 * 75), points[1][1])
                );
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));
        return geometry;
    },
    windowGeometry: function (points, z, height) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
                new THREE.Vector3(points[0][0], z + (height / 100 * 25), points[0][1]),
                new THREE.Vector3(points[0][0], z + (height / 100 * 75), points[0][1]),
                new THREE.Vector3(points[1][0], z + (height / 100 * 75), points[1][1]),
                new THREE.Vector3(points[1][0], z + (height / 100 * 25), points[1][1])
                );
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));
        return geometry;
    },
    interfloorFloorGeometry: function (points, floors, selectedFloors) {
        var geometry = new THREE.Geometry();
        if (points.length === 4) {
            if ($.inArray(points[0].floorIndex, selectedFloors) === -1 ||
                    $.inArray(points[1].floorIndex, selectedFloors) === -1 ||
                    $.inArray(points[2].floorIndex, selectedFloors) === -1 ||
                    $.inArray(points[3].floorIndex, selectedFloors) === -1) {
                return;
            }
            geometry.vertices.push(
                    new THREE.Vector3(points[0].x, floors[points[0].floorIndex].offset.z, points[0].y),
                    new THREE.Vector3(points[1].x, floors[points[1].floorIndex].offset.z, points[1].y),
                    new THREE.Vector3(points[2].x, floors[points[2].floorIndex].offset.z, points[2].y),
                    new THREE.Vector3(points[3].x, floors[points[3].floorIndex].offset.z, points[3].y)
                    );
            //every geometry must be built out of triangles the parameter are the points used to create the triangle
            //a square is made out of 2 triangles remeber to keep the correct order of the points!
            geometry.faces.push(new THREE.Face3(0, 1, 2));
            geometry.faces.push(new THREE.Face3(0, 2, 3));
        } else if (points.length === 3) {
            if ($.inArray(points[0].floorIndex, selectedFloors) === -1 ||
                    $.inArray(points[1].floorIndex, selectedFloors) === -1 ||
                    $.inArray(points[2].floorIndex, selectedFloors) === -1) {
                return;
            }
            geometry.vertices.push(
                    new THREE.Vector3(points[0].x, floors[points[0].floorIndex].offset.z, points[0][1]),
                    new THREE.Vector3(points[1].x, floors[points[1].floorIndex].offset.z, points[1][1]),
                    new THREE.Vector3(points[2].x, floors[points[2].floorIndex].offset.z, points[2][1])
                    );
            geometry.faces.push(new THREE.Face3(0, 1, 2));
        }
        return geometry;
    },
    interfloorWallGeometry: function (points, floors, selectedFloors) {
        if ($.inArray(points[0].floorIndex, selectedFloors) === -1 ||
                $.inArray(points[1].floorIndex, selectedFloors) === -1) {
            return;
        }
        var geometry = new THREE.Geometry();
        geometry.vertices.push(
                new THREE.Vector3(points[0].x, floors[points[0].floorIndex].offset.z, points[0].y),
                new THREE.Vector3(points[0].x, floors[points[0].floorIndex].offset.z + floors[points[0].floorIndex].height, points[0].y),
                new THREE.Vector3(points[1].x, floors[points[1].floorIndex].offset.z + floors[points[1].floorIndex].height, points[1].y),
                new THREE.Vector3(points[1].x, floors[points[1].floorIndex].offset.z, points[1].y)
                );
        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));
        return geometry;
    },
    edgeGeometry: function (pointX, pointY, geometryOptions, material) {
        var direction = new THREE.Vector3().subVectors(pointY, pointX);
        var arrow = new THREE.ArrowHelper(direction, pointX);
        var edgeGeometry = new THREE.CylinderGeometry(
                geometryOptions.radiusAtTop,
                geometryOptions.radiusAtBottom,
                direction.length(),
                geometryOptions.radiusSegments,
                geometryOptions.heightSegments);
        var edge = new THREE.Mesh(edgeGeometry, material);
        edge.rotation.x = arrow.rotation.x;
        edge.rotation.y = arrow.rotation.y;
        edge.rotation.z = arrow.rotation.z;
        var finalPosition = new THREE.Vector3().addVectors(pointX, direction.multiplyScalar(0.5));
        edge.position.x = finalPosition.x;
        edge.position.y = finalPosition.y;
        edge.position.z = finalPosition.z;
        return edge;
    }
};