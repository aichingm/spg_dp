function StorageControler(storageKey) {
    this.storage;
    //test storage:
    try {
        if ('localStorage' in window && window["localStorage"] !== null) {
            this.storage = window["localStorage"];
        }
    } catch (e) {
        throw "Cant access the local storage";
    }
    this.storageKey = storageKey;
    this.changeListeners = [];
    this.data;
    this.updateOnChange = true;
    this.jsonConvert = true;
    this.dataManipulator;
    this.setupChangeListener = function () {
        var f;
        var handler = function (obj) {
            return function (e) {
                if (!e) {
                    e = window.event;
                }
                if (e.originalEvent.key === obj.storageKey) {
                    if (obj.updateOnChange) {
                        obj.reloadData();
                    }
                    for (f in obj.changeListeners) {
                        if (obj.jsonConvert) {
                            f(JSON.parse(e.originalEvent.newValue), e, obj);
                        } else {
                            f(e.originalEvent.newValue, e, obj);
                        }
                    }
                }
            };
        }(this);
        if (window.addEventListener) {
            window.addEventListener("storage", handler, false);
        } else {
            window.attachEvent("onstorage", handler);
        }
    };
    this.onChange = function (listener) {
        if (typeof listener === "function") {
            this.changeListeners.push(listener);
        } else {
            throw "listener is not a function";
        }
    };
    this.reloadData = function () {
        if (this.jsonConvert) {
            this.data = JSON.parse(this.storage.getItem(this.storageKey));
        } else {
            this.data = this.storage.getItem(this.storageKey);
        }
        if(typeof this.dataManipulator === "function"){
            this.data = this.dataManipulator(this.data, this);
        }
    };
    this.getData = function () {
        return this.data;
    };
    this.putData = function (data) {
        if (this.jsonConvert) {
            this.data = this.storage.setItem(this.storageKey, JSON.stringify(data));
        } else {
            this.data = this.storage.setItem(this.storageKey, data);
        }
    };
    return this;
}