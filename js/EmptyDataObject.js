function EmptyDataObject() {
    this.modelManager = {
        floors: [],
        settings: {
            pxPerMeter: 100
        }
    };
    this.interFloorObjects = [];
    this.paths = {
        vertices: [],
        edges: []
    };
}