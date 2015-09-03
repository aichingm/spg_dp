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
    this.handler = function (obj) {
        return function (e) {
            var f;
            if (!e) {
                e = window.event;
            }
            if (e.key === obj.storageKey) {
                if (obj.updateOnChange) {
                    obj.reloadData();
                }
                for (f in obj.changeListeners) {
                    if (obj.jsonConvert) {
                        obj.changeListeners[f](obj.getData(), e, obj);
                    } else {
                        obj.changeListeners[f](e.newValue, e, obj);
                    }
                }
            }
        };
    }(this);
    this.setupChangeListener = function () {
        if (window.addEventListener) {
            window.addEventListener("storage", this.handler, false);
        } else {
            window.attachEvent("onstorage", this.handler);
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
        if (typeof this.dataManipulator === "function") {
            this.data = this.dataManipulator(this.data, this);
        }
    };
    this.getData = function () {
        return this.data;
    };
    this.putDataRaw = function (data) {
        this.storage.setItem(this.storageKey, data);
        this.handler({key: this.storageKey, newValue: data});
    };
    return this;
}