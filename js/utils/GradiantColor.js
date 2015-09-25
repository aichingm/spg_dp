GradiantColor = {
    getTriColor: function (percent, left, centre, right)
    {
        if (percent < 0 || percent > 1)
            throw new "Percent must be between 0 and 1";
        //double weight = Math.Sin(percent * Math.PI);
        weight = (Math.cos((percent * 2 - 1) * Math.PI) + 1) / 2;
        return GradiantColor.getColorFromLinearGradient(weight, percent < 0.5 ? left : right, centre);
    },
    getColorFromLinearGradient: function (percent, start, end)
    {
        var r, g, b;
        if (percent < 0 || percent > 1)
            throw new "Percent must be between 0 and 1";
        var npercent = 1.0 - percent;
        r = Math.min(start.R, end.R) + Math.abs(start.R - end.R) * (start.R > end.R ? npercent : percent);
        g = Math.min(start.G, end.G) + Math.abs(start.G - end.G) * (start.G > end.G ? npercent : percent);
        b = Math.min(start.B, end.B) + Math.abs(start.B - end.B) * (start.B > end.B ? npercent : percent);
        return new Color(Math.floor(r), Math.floor(g), Math.floor(b));
    }

};

Color = function (r, g, b) {
    this.R = r;
    this.G = g;
    this.B = b;

    this.toHtml = function () {
        return "#" + (this.R > 15 ? this.R.toString(16) : "0" + this.R.toString(16)) + (this.G > 15 ? this.G.toString(16) : "0" + this.G.toString(16)) + (this.B > 15 ? this.B.toString(16) : "0" + this.B.toString(16));
    };
    return this;
};

//console.log(GradiantColor.getTriColor(.2, new Color(0, 255, 0), new Color(255, 255, 0), new Color(255, 0, 0)).toHtml());