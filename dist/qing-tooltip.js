/**
 * qing-tooltip v0.0.1
 * http://mycolorway.github.io/qing-tooltip
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-tooltip/license.html
 *
 * Date: 2016-09-15
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('qing-module'));
  } else {
    root.QingTooltip = factory(root.jQuery,root.QingModule);
  }
}(this, function ($,QingModule) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"qing-tooltip":[function(require,module,exports){
var QingTooltip, includes,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

includes = function(array, item) {
  var i, j, len, result;
  result = false;
  for (j = 0, len = array.length; j < len; j++) {
    i = array[j];
    if (i === item) {
      result = true;
    }
  }
  return result;
};

QingTooltip = (function(superClass) {
  extend(QingTooltip, superClass);

  QingTooltip.opts = {
    el: null,
    content: '',
    position: 'bottom',
    tpl: "<div class=\"qing-tooltip\">\n</div>"
  };

  QingTooltip.prototype.tooltip = null;

  function QingTooltip(opts) {
    QingTooltip.__super__.constructor.apply(this, arguments);
    this.el = $(this.opts.el);
    if (!(this.el.length > 0)) {
      throw new Error('QingTooltip: option el is required');
    }
    if (this.el.data('qingTooltip')) {
      return this.el.data('qingTooltip');
    }
    this.opts = $.extend({}, QingTooltip.opts, this.opts);
    if ($.inArray(this.opts.position, ['top', 'bottom', 'left', 'right']) < 0) {
      this.opts.position = 'bottom';
    }
    this._render();
    this._bind();
    this.el.data('qingTooltip', this);
    this.trigger('ready');
  }

  QingTooltip.prototype._render = function() {
    this.tooltip = $(this.opts.tpl);
    this.tooltip.html(this.opts.content);
    return this.tooltip.addClass(this.opts.position);
  };

  QingTooltip.prototype._bind = function() {
    this.el.on('mouseenter', (function(_this) {
      return function() {
        return _this.show();
      };
    })(this));
    return this.el.on('mouseleave', (function(_this) {
      return function() {
        return _this.hide();
      };
    })(this));
  };

  QingTooltip.prototype._setPosition = function() {
    var height, position, targetPosition, tooltipPosition, width;
    position = this.el.position();
    width = this.el.outerWidth();
    height = this.el.outerHeight();
    targetPosition = {
      top: (position.top || 0) + parseInt(this.el.css('margin-top')),
      left: (position.left || 0) + parseInt(this.el.css('margin-left'))
    };
    tooltipPosition = (function() {
      switch (this.opts.position) {
        case 'top':
          return {
            top: targetPosition.top - this.tooltip.outerHeight(),
            left: targetPosition.left + width / 2
          };
        case 'bottom':
          return {
            top: targetPosition.top + this.el.outerHeight(),
            left: targetPosition.left + width / 2
          };
        case 'left':
          return {
            top: targetPosition.top + height / 2,
            left: targetPosition.left - this.tooltip.outerWidth()
          };
        case 'right':
          return {
            top: targetPosition.top + height / 2,
            left: targetPosition.left + this.el.outerWidth()
          };
      }
    }).call(this);
    return this.tooltip.css(tooltipPosition);
  };

  QingTooltip.prototype.show = function() {
    this.el.after(this.tooltip);
    return this._setPosition();
  };

  QingTooltip.prototype.hide = function() {
    return this.tooltip.detach();
  };

  QingTooltip.prototype.destroy = function() {
    this.tooltip.remove();
    return this.el.removeData('qingTooltip');
  };

  return QingTooltip;

})(QingModule);

module.exports = QingTooltip;

},{}]},{},[]);

return b('qing-tooltip');
}));
