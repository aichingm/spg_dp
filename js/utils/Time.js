Time = {
    secondsToReadable: function (seconds) {
        var mins = 0, secs = 0, hrs = 0, returnValue = "";
        hrs = ~~(seconds / 3600);
        mins = ~~((seconds % 3600) / 60);
        secs = seconds % 60;
        returnValue += "" + hrs + ":";
        returnValue += "" + (mins < 10 ? "0" : "") + mins + ":";
        returnValue += "" + (secs < 10 ? "0" : "") + secs;
        return returnValue;
    }
};