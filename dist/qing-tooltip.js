/**
 * qing-tooltip v0.0.1
 * http://mycolorway.github.io/qing-tooltip
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-tooltip/license.html
 *
 * Date: 2016-11-6
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

  function QingTooltip() {
    return QingTooltip.__super__.constructor.apply(this, arguments);
  }

  QingTooltip.opts = {
    el: null,
    pointTo: null,
    content: null,
    position: 'bottom',
    tpl: "<div class=\"qing-tooltip\">\n</div>",
    cls: '',
    offset: 0,
    trigger: 'hover',
    appendTo: 'body'
  };

  QingTooltip.prototype.tooltip = null;

  QingTooltip.prototype._setOptions = function(opts) {
    QingTooltip.__super__._setOptions.apply(this, arguments);
    return $.extend(this.opts, QingTooltip.opts, opts);
  };

  QingTooltip.prototype._init = function() {
    if (!this.opts.content) {
      return;
    }
    this.el = $(this.opts.el);
    if (!(this.el.length > 0)) {
      throw new Error('QingTooltip: option el is required');
    }
    if (this.el.data('qingTooltip')) {
      return this.el.data('qingTooltip');
    }
    if ($.inArray(this.opts.position, ['top', 'bottom', 'left', 'right']) < 0) {
      this.opts.position = 'bottom';
    }
    this.pointTo = this.el.find(this.opts.pointTo).filter(":visible").first();
    if (!this.pointTo.length) {
      this.pointTo = this.el;
    }
    if (this.opts.appendTo) {
      this.appendTo = $(this.opts.appendTo);
    }
    this._render();
    this._bind();
    this.el.data('qingTooltip', this);
    return this.trigger('ready');
  };

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
    var containerOffset, dimension, position, targetOffset;
    dimension = {
      width: this.pointTo.outerWidth(true),
      height: this.pointTo.outerHeight(true),
      innerWidth: this.pointTo.outerWidth(false),
      innerHeight: this.pointTo.outerHeight(false),
      margin: {
        left: parseInt(this.pointTo.css('marginLeft')) || 0,
        right: parseInt(this.pointTo.css('marginRight')) || 0,
        top: parseInt(this.pointTo.css('marginTop')) || 0,
        bottom: parseInt(this.pointTo.css('marginBottom')) || 0
      }
    };
    if (this.appendTo) {
      containerOffset = this.tooltip.offsetParent().offset();
      targetOffset = this.pointTo.offset();
      return $.extend(dimension, {
        top: targetOffset.top - containerOffset.top - dimension.margin.top,
        left: targetOffset.left - containerOffset.left - dimension.margin.left
      });
    } else {
      position = this.pointTo.position();
      return $.extend(dimension, {
        top: position.top,
        left: position.left
      });
    }
  };

  QingTooltip.prototype._tooltipPosition = function(targetDimension) {
    switch (this.opts.position) {
      case 'top':
        return {
          top: targetDimension.top - (this.tooltip.outerHeight() + this.opts.offset),
          left: targetDimension.left + targetDimension.width - targetDimension.width / 2
        };
      case 'bottom':
        return {
          top: targetDimension.top + targetDimension.margin.top + targetDimension.innerHeight + this.opts.offset,
          left: targetDimension.left + targetDimension.width / 2
        };
      case 'left':
        return {
          top: targetDimension.top + targetDimension.height / 2,
          left: targetDimension.left + targetDimension.margin.left - (this.tooltip.outerWidth() + this.opts.offset)
        };
      case 'right':
        return {
          top: targetDimension.top + targetDimension.height / 2,
          left: targetDimension.left + targetDimension.margin.left + targetDimension.innerWidth + this.opts.offset
        };
    }
  };

  QingTooltip.prototype.show = function() {
    this.shown = true;
    if (this.appendTo) {
      this.appendTo.append(this.tooltip);
    } else {
      this.tooltip.insertAfter(this.pointTo);
    }
    this.tooltip.css(this._tooltipPosition(this._targetDimension()));
    this.tooltip[0].offsetHeight;
    return this.tooltip.addClass('active');
  };

  QingTooltip.prototype.hide = function() {
    this.shown = false;
    this.tooltip.removeClass('active');
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
