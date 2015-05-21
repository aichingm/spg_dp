function buildVetexCategoryList(data) {
    var list = [], i, paths = new Paths();
    paths.load(data);
    for (i = 0; i < paths.vertices.length; i++) {
        for (var j = 0; j < paths.vertices[i].categories.length; j++) {
            list.push(paths.vertices[i].categories[j]);
        }
    }
    return Arrays.unique(list.sort());
}