function UiOverlay(options) {
    //setup defaults
    this.defaultOptions = {
        "activeOpenClass": "showen",
        "uiOverlayClass": "ui-overlay ",
        "closeClass": "cancel",
        "applyClass": "apply",
        "closedEvent": "closed",
        "closedApplyEvent": "closed-apply",
        "openedEvent": "showen"
    };
    this.onBeforeCloseFunctions = [];
    /**
     * contains the count of opened uiOverlays
     */
    this.openCount = 0;
    //extend options
    this.options = $.extend(this.defaultOptions, options);
    /**
     * close an opened ui-overlay
     * @param {mixed} selector jqery selector
     * @returns {void}
     */
    this.close = function (selector, closedEventType) {
        closedEventType = closedEventType?closedEventType:this.options.closedEvent;
        var closeIsHandled = false;
        var closeFunction = function (ui) {
            return function () {
                //hide
                $(selector).hide();
                //trigger the closed event
                $(selector).trigger(closedEventType);
                //remove the activeOpenClass
                $(selector).removeClass(ui.options.activeOpenClass);
                //decriment the open count
                ui.openCount--;
            };
        }(this);
        //call all on before cloes functions
        for (var i = 0; i < this.onBeforeCloseFunctions.length; i++) {
            var fn = this.onBeforeCloseFunctions[i];
            if (typeof fn === "function") {
                var closeIsHandled = closeIsHandled || fn.apply(this, [selector, closeFunction]);
            }
        }
        if (!closeIsHandled) {
            closeFunction();
        }
    };
    /**
     * open a ui overlay
     * @param {type} selector jqery selector
     * @returns {void}
     */
    this.open = function (selector) {
        //display
        $(selector).show();
        //add the activeOpenClass
        $(selector).addClass(this.options.activeOpenClass);
        //trigger the opend event
        $(selector).trigger(this.options.openedEvent);
        //incriment the open count
        this.openCount++;
    };
    /**
     * enable the automatic close of the ui-overlay if the DomElement with the class options.closeClass
     * @returns {void}
     */
    this.enableAutoClose = function () {
        //setup an onClick listner for all childen, of all element with the class options.uiOverlayClass, which have the class options.closeClass
        $("." + this.options.uiOverlayClass + ".controls ." + this.options.closeClass).click(function (uioverlay) {
            return function () {
                //close the ui-overlay
                uioverlay.close($(this).parent().parent(), uioverlay.options.closedEvent);
            };
        }(this));
        $("." + this.options.uiOverlayClass + ".controls ." + this.options.applyClass).click(function (uioverlay) {
            return function () {
                //close the ui-overlay
                uioverlay.close($(this).parent().parent(), uioverlay.options.closedApplyEvent);
            };
        }(this));
    };
    /**
     * Checks if a ui-overlay is visible
     * @returns {Boolean}
     */
    this.hasOpen = function () {
        return this.openCount === 0;
    };

    this.addOnBeforeCloseFunction = function (func) {
        this.onBeforeCloseFunctions.push(func);
    };

    return this;
}




