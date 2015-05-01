Arrays = new function () {
    this.removeFromArray = function (value, array) {
        array = jQuery.grep(array, function (tempValue) {
            return value !== tempValue;
        });
        return array;
    };
    this.equals = function (a, b) {
        if (Array.isArray(a) && Array.isArray(b)) {
            if (a.length !== b.length) {
                return false;
            }
            var flag = true;
            for (var i = 0; i < a.length; i++) {
                if (a[i] === b[i] || typeof a[i] === "object" && this.equals(a[i], b[i])) {
                    flag = true;
                } else {
                    flag = false;
                    break;
                }
            }
            return flag;
        } else if (typeof a === "object" && typeof b === "object") {
            var aProps = Object.getOwnPropertyNames(a);
            var bProps = Object.getOwnPropertyNames(b);
            if (aProps.length !== bProps.length) {
                return false;
            }
            for (var i = 0; i < aProps.length; i++) {
                var propName = aProps[i];
                if (a[propName] !== b[propName]) {
                    return false;
                }
            }
            return true;
        } else if (a === b) {
            return true;
        } else {
            return false;
        }
    };
    this.containsEqualItems = function (array1, array2) {
        if (array1.length !== array2.length) {
            return false;
        }
        for (var i = 0; i < array1.length; i++) {
            var isIn = false;
            for (var j = 0; j < array1.length; j++) {
                if (array1[i] === array2[j] || (typeof array1[i] === "object") && this.equals(array1[i], array2[j])) {
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
    this.containsEqualObject = function (array, obj) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === obj || (typeof array[i] === "object" && typeof obj === "object" && this.equals(array[i], obj))) {
                return true;
            }
        }
        return false;
    };
    this.countSameItems = function (array1, array2) {
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
    this.deleteIndicesFromArray = function (array, indices) {
        console.log(indices);
        return $.grep(array, function (n, i) {
            return $.inArray(i, indices) === -1;
        });
    };
    this.boolInArray = function (value, array) {
        return $.inArray(value, array) !== -1;
    };

    return this;
};
