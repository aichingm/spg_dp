/**
 * Remove all values which are equal to the parameter value from the Array array
 * @param {mixed} value
 * @param {Array} array
 * @returns {Array}
 */
function removeFromArray(value, array) {
    array = jQuery.grep(array, function(tempValue) {
        return value !== tempValue;
    });
    return array;
}
function containsEqualItems(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    var flag = true;
    for (var i = 0; i < array1.length; i++) {
        if (!$.inArray(array1[i], array2)) {
            flag = false;
        }
    }
    return flag;
}
function countSameItems(array1, array2) {
    var count = 0;
    for (var i = 0; i < array1.length; i++) {
        if ($.inArray(array1[i], array2)) {
            count++;
        }
    }
    return count;
}