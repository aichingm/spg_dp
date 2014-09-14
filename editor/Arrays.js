Arrays = new function() {
    this.removeFromArray = function(value, array) {
        array = jQuery.grep(array, function(tempValue) {
            return value !== tempValue;
        });
        return array;
    };

    
    this.equals = function(array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i] || typeof array1[i] === "object" && this.equals(array1[i],array2[i])) {
                return false;
            }
        }
        return true;
    };
    this.containsEqualItems = function(array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0; i < array1.length; i++) {
            var isIn = false;
            for (var j = 0; j < array1.length; j++) {
                if (array1[i] === array2[j] || typeof array1[i] === "object" && this.equals(array1[i], array2[j])) {
                    isIn = true;
                    break;
                }
            }
            if (!isIn) {
                return false;
            }
        }
        return true;
    };
    this.countSameItems = function(array1, array2) {
        var count = 0;
        for (var i = 0; i < array1.length; i++) {
            for (var j = 0; j < array2.length; j++) {
                if (array1[i] === array2[j] || typeof array1[i] === "object" && this.equals(array1[i], array2[j])) {
                    count++;
                }
            }
        }
        return count;
    };
    this.deleteIndicesFromArray = function(array, indices) {
        return $.grep(array, function(n, i) {
            return $.inArray(i, indices) === -1;
        });
    };
    return this;
};
