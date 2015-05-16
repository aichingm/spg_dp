function buildVetexNameList(data) {
    var list = [], i, paths = new Paths();
    paths.load(data);
    for (i = 0; i < paths.vertices.length; i++) {
        list.push(paths.vertices[i].name);
    }
    return list.sort();
}