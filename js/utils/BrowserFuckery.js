BrowserFuckery = {
    fixMouseEventButtons: function (mouseEvent) {
        var buttons = [];
        if (mouseEvent.buttons !== undefined && [1, 2, 2, 3, 4, 5, 6, 7].indexOf(mouseEvent.buttons) > -1) {
            switch (mouseEvent.buttons) {
                //1 = left
                //2 = right
                //4 = middle
                case 1:
                    buttons = [1];
                    break;
                case 2:
                    buttons = [3];
                    break;
                case 4:
                    buttons = [2];
                    break;
                case 3:
                    buttons = [1, 3];
                    break;
                case 5:
                    buttons = [1, 2];
                    break;
                case 6:
                    buttons = [2, 3];
                    break;
                case 7:
                    buttons = [1, 2, 3];
                    break;
                default :
                    buttons = [];
                    break;
            }
        } else if ([0, 1, 2, 3].indexOf(mouseEvent.which) !== -1) {
            buttons = [mouseEvent.which];
        } else {
            throw new Error("Some heavy BrowserFuckery is going on!!!1!!11 Can't fix mouse event buttons.");
        }
        mouseEvent.bf_mouseButtons = new BrowserFuckery.MouseButton(buttons);
        return mouseEvent;
    },
    fixMouseEventMovement: function (mouseEvent) {
        var x, y;
        if (mouseEvent.originalEvent.movementX !== undefined && mouseEvent.originalEvent.movementY !== undefined) {
            //chrome
            x = mouseEvent.originalEvent.movementX;
            y = mouseEvent.originalEvent.movementY;
        } else if (mouseEvent.originalEvent.mozMovementX !== undefined && mouseEvent.originalEvent.mozMovementY !== undefined) {
            //firefox
            x = mouseEvent.originalEvent.mozMovementX;
            y = mouseEvent.originalEvent.mozMovementY;
        } else {
            throw new Error("Some heavy BrowserFuckery is going on!!!1!!11 Can't fix mouse event movements.");
        }
        mouseEvent.bf_mouseMovement = new BrowserFuckery.MouseMovement(x, y);
        return mouseEvent;
    }

};
BrowserFuckery.MouseButton = function (buttons) {
    var _buttons = buttons;
    this.isDown = function (index) {
        if (index >= 1 && index <= 3) {
            return _buttons.indexOf(index) !== -1;
        }
        return false;
    };
    return this;
};
BrowserFuckery.MouseMovement = function (x, y) {
    var _x = x, _y = y;
    this.getX = function () {
        return _x;
    };
    this.getY = function () {
        return _y;
    };
    return this;
};