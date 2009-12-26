/* $Id: floatingregion.js 1641 2009-12-26 03:10:41Z bangpound $ */
/*global jQuery,Drupal,$,window */
"use strict";
(function ($) {
  $.widget("ui.drawer", {
    _init: function() {
      var self = this,
        options = this.options,

        // The drawer is the widget.
        drawer = (this.drawer = this.element),

        // The container is the element that encapsulates all the blocks. In
        // some cases, this will be the same as the drawer.
        container = (this.container = $('div.block', drawer).parent())
          .css({
            top: 0,
            left: 0,
            bottom: 0,
            position: 'fixed',
            width: 200,
            height: $(window).height()
          }),

        // The accordion needs container of its own.
        accordion = (this.accordion = $('div.block', drawer))
          .wrapAll("<div></div>")
          .parent()
          .accordion({
            active: $("div.block", drawer).index($('#' + this._getState('open'))),
            header: "h2",
            fillSpace: true,
            change: function (event, ui) {
              if ($(ui.options.header, this).index(ui.newHeader) === $(ui.options.header, this).index(ui.oldHeader)) {
                drawer.data('drawer')._setState('open', false);
              }
              else {
                drawer.data('drawer')._setState('open', ui.newHeader.parent().attr('id'));
              }
            }
          });
      (options.resizable && $.fn.resizable && this._makeResizable());
      $(document.body).css('marginLeft', container.width());
    },
    _getState: function (key) {
      var state = this._getData('state');
      if (!state) {
        var state = {};
        var cookie = $.cookie('floatingRegion');
        var query = cookie ? cookie.split('&') : [];
        if (query) {
          for (var i in query) {
            var values = query[i].split('=');
            if (values.length === 2) {
              state[values[0]] = values[1];
            }
          }
        }
        this._setData('state', state);
      }
      return state[key] ? state[key] : false;
    },
    _setState: function(key, value) {
      var existing = this._getState(key);
      if (existing != value) {
        var state = this._getData('state');
        state[key] = value;
        var query = [];
        for (var i in state) {
          query.push(i + '=' + state[i]);
        }
        $.cookie('floatingRegion', query.join('&'), {expires: 7, path: '/'});
      }
    },
    _makeResizable: function (handles) {
      handles = (handles === undefined ? this.options.resizable : handles);
      var self = this,
        options = this.options,
        resizeHandles = typeof handles == 'string'
          ? handles
          : 'n,e,s,w,se,sw,ne,nw';

      this.container.resizable({
        handles: resizeHandles,
        minWidth: 200,
        alsoResize: (this.container === this.drawer) ? false : this.drawer,
        stop: function (event, ui) {
          if (ui.options.alsoResize) {
            $(ui.options.alsoResize).data('drawer')._setState('width', ui.size.width);
          }
          else {
            this.data('drawer')._setState('width', ui.size.width);
          }
        },
        resize: function (event, ui) {
          $(document.body).css('marginLeft', ui.size.width);
        }
      });
      this.container.css({
        width: parseInt(this._getState('width')),
      });
    }
  });
})(jQuery);


Drupal.behaviors.floatingRegion = function (context) {
  $("#floating-region:not(.floating-region-processed)", context).drawer({resizable: 'e'}).addClass('floating-region-processed');
};

/*jslint white: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, indent: 2 */
