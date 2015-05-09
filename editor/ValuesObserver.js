ValuesObserver = function () {
    this.keyValue = [];
    this.events = [];



    this.set = function (key, value, trigger) {
        this.keyValue[key] = value;
        if(!trigger){
            this.trigger(key, [key, value]);
        }
    };
    this.get = function (key) {
        return this.keyValue[key];
    };
    this.equals = function (key, value) {
        return this.keyValue[key] === value;
    };


    this.on = function (key, func) {
        if (this.events[key] === undefined) {
            this.events[key] = new Array();
        }
        this.events[key].push(func);
    };

    this.trigger = function (key, args) {
        if (this.events[key] !== undefined) {
            for (var i = 0; i < this.events[key].length; i++) {
                var of = this.events[key][i];
                if (typeof of === "function") {
                    var dump = of.apply(this, args);
                }
            }
        }
    };
    return this;
};


