includes = (array, item)->
  result = false
  for i in array
    result = true if i is item
  result

class QingTooltip extends QingModule

  @opts:
    el: null
    content: ''
    position: 'bottom' # 'right' 'left' 'top' 'bottom'
    tpl: """
    <div class="qing-tooltip">
    </div>
    """

  tooltip: null
  constructor: (opts) ->
    super

    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingTooltip: option el is required'
    if @el.data 'qingTooltip'
      return @el.data 'qingTooltip'

    @opts = $.extend {}, QingTooltip.opts, @opts
    if $.inArray(@opts.position, ['top','bottom','left','right']) < 0
      @opts.position = 'bottom'

    @_render()
    @_bind()

    @el.data 'qingTooltip', @
    @trigger 'ready'

  _render: ->
    @tooltip = $ @opts.tpl
    @tooltip.html @opts.content
    @tooltip.addClass @opts.position

  _bind: ->
    @el.on 'mouseenter', ()=>
      @show()
    @el.on 'mouseleave', ()=>
      @hide()
  _setPosition: ->
    position = @el.position()
    width = @el.outerWidth()
    height = @el.outerHeight()

    targetPosition =
      top: (position.top || 0) + parseInt(@el.css('margin-top'))
      left: (position.left || 0) + parseInt(@el.css('margin-left'))

    tooltipPosition = switch @opts.position
      when 'top' then {
        top: targetPosition.top - @tooltip.outerHeight()
        left: targetPosition.left + width / 2
      }
      when 'bottom' then {
        top: targetPosition.top + @el.outerHeight()
        left: targetPosition.left + width / 2
      }
      when 'left' then {
        top: targetPosition.top + height / 2
        left: targetPosition.left - @tooltip.outerWidth()
      }
      when 'right' then {
        top: targetPosition.top + height / 2
        left: targetPosition.left + @el.outerWidth()
      }

    @tooltip.css tooltipPosition

  show: ->
    @el.after @tooltip
    @_setPosition()

  hide: ->
    @tooltip.detach()

  destroy: ->
    @tooltip.remove()
    @el.removeData 'qingTooltip'

module.exports = QingTooltip
