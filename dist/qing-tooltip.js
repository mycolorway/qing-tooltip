/**
 * qing-tooltip v0.0.1
 * http://mycolorway.github.io/qing-tooltip
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-tooltip/license.html
 *
 * Date: 2016-09-22
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
var QingTooltip,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

QingTooltip = (function(superClass) {
  extend(QingTooltip, superClass);

  QingTooltip.opts = {
    el: null,
    content: '',
    position: 'bottom',
    tpl: "<div class=\"qing-tooltip\">\n</div>",
    cls: '',
    offset: 0,
    trigger: 'hover'
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
    this.tooltip.addClass(this.opts.position);
    return this.tooltip.addClass(this.opts.cls);
  };

  QingTooltip.prototype._bind = function() {
    switch (this.opts.trigger) {
      case 'hover':
        this.el.on('mouseenter.qingTooltip', (function(_this) {
          return function() {
            return _this.show();
          };
        })(this));
        return this.el.on('mouseleave.qingTooltip', (function(_this) {
          return function() {
            return _this.hide();
          };
        })(this));
      case 'click':
        return this.el.on('mousedown.qingTooltip', (function(_this) {
          return function() {
            if (_this.shown) {
              return _this.hide;
            } else {
              _this.show();
              return setTimeout(function() {
                return $(document).on('mousedown.qingTooltip', function(e) {
                  if (!($.contains(_this.tooltip, e.target)) && (_this.tooltip[0] !== e.target)) {
                    return _this.hide();
                  }
                });
              });
            }
          };
        })(this));
    }
  };

  QingTooltip.prototype._targetDimension = function() {
    var position;
    position = this.el.position();
    return {
      width: this.el.outerWidth(true),
      height: this.el.outerHeight(true)
    };
  };

  QingTooltip.prototype._tooltipPosition = function(targetDimension) {
    switch (this.opts.position) {
      case 'top':
        return {
          marginTop: -(this.tooltip.outerHeight() + this.opts.offset),
          marginLeft: -targetDimension.width / 2
        };
      case 'bottom':
        return {
          marginTop: targetDimension.height + this.opts.offset,
          marginLeft: -targetDimension.width / 2
        };
      case 'left':
        return {
          marginTop: targetDimension.height / 2,
          marginLeft: -(targetDimension.width + this.tooltip.outerWidth() + this.opts.offset)
        };
      case 'right':
        return {
          marginTop: targetDimension.height / 2,
          marginLeft: this.opts.offset
        };
    }
  };

  QingTooltip.prototype.show = function() {
    this.shown = true;
    this.tooltip.insertAfter(this.el);
    return this.tooltip.css(this._tooltipPosition(this._targetDimension()));
  };

  QingTooltip.prototype.hide = function() {
    this.shown = false;
    this.tooltip.detach();
    return $(document).off('mousedown.qingTooltip');
  };

  QingTooltip.prototype.destroy = function() {
    this.hide();
    this.tooltip.remove();
    this.el.off('.qingTooltip');
    $(document).off('.qingTooltip');
    return this.el.removeData('qingTooltip');
  };

  return QingTooltip;

})(QingModule);

module.exports = QingTooltip;

},{}]},{},[]);

return b('qing-tooltip');
}));
