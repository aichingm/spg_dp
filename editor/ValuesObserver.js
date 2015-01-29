ValuesObserver = function () {
    this.keyValue = [];
    this.events = [];



    this.set = function (key, value) {
        this.keyValue[key] = value;
        this.trigger("change", [key, value, event]);
    };
    this.get = function (key) {
        return this.keyValue[key];
    };
    this.equals = function (key, value) {
        return this.keyValue[key] === value;
    };


    this.on = function (event, func) {
        if (this.events[event] === undefined) {
            this.events[event] = new Array();
        }
        this.events[event].push(func);
    };

    this.trigger = function (event, args) {
        if (this.events[event] !== undefined) {
            for (var i = 0; i < this.events[event].length; i++) {
                var of = this.events[event][i];
                if (typeof of === "function") {
                    var dump = of.apply(this, args);
                }
            }
        }
    };
    return this;
};


