function clearScene() {
    var obj, i;
    for (i = scene.children.length - 1; i >= 0; i--) {
        obj = scene.children[ i ];
        if (obj !== camera) {
            scene.remove(obj);
        }
    }
}