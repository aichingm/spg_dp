function UiOverlay(options) {
    //setup defaults
    this.defaultOptions = {
        "activeOpenClass":"showen",
        "uiOverlayClass":".oi-overlay ",
        "closeClass":"close",
        "closedEvent":"closed",
        "openedEvent":"showen"
    };
    /**
     * contains the count of opened uiOverlays
     */
    this.openCount = 0;
    //extend options
    this.options = $.extend(this.defaultOptions,options);
    /**
     * close an opened ui-overlay
     * @param {mixed} selector jqery selector
     * @returns {void}
     */
    this.close = function(selector) {
        //hide
        $(selector).hide();
        //trigger the closed event
        $(selector).trigger(this.options.closedEvent);
        //remove the activeOpenClass
        $(selector).removeClass(this.options.activeOpenClass);
        //decriment the open count
        this.openCount--;
    };
    /**
     * open a ui overlay
     * @param {type} selector jqery selector
     * @returns {void}
     */
    this.open = function(selector) {
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
    this.enableAutoClose = function() {
        //setup an onClick listner for all childen, of all element with the class options.uiOverlayClass, which have the class options.closeClass
        $("."+this.options.uiOverlayClass+" ."+this.options.closeClass).click(function() {
            //close the ui-overlay
            close($(this).parent());
        });
    };
    /**
     * Checks if a ui-overlay is visible
     * @returns {Boolean}
     */
    this.hasOpen = function(){
        return this.openCount===0;
    };
    
    return this;
}




