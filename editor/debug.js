Debug = new function() {
    this.doLogging = true;
    this.log = function(log) {
        if (this.doLogging && console && console.log) {
            console.log(log);
        }
    };
    this.setLogging = function(bool){
        this.doLogging = bool === true;
    };
};


