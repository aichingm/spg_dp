Materials = new function () {
    this.window = new THREE.MeshBasicMaterial({
        color: 0x0030ee,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });
    this.wall = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });
    this.door = new THREE.MeshBasicMaterial({
        color: 0xee00ee,
        opacity: 0.5,
        transparent: true,
        side: THREE.DoubleSide
    });
    this.floor = new THREE.MeshBasicMaterial({
        color: 0x555555,
        transparent: false,
        side: THREE.DoubleSide
    });
    this.pathStartPoint = new THREE.MeshBasicMaterial({color: 0xF2470C});
    this.pathEndPoint = new THREE.MeshBasicMaterial({color: 0xffff00});
    this.pathPoint = new THREE.MeshBasicMaterial({color: 0x624D8C});

    return this;
};