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
    @_render()
    @_bind()
    @el.data 'qingTooltip', @
    @trigger 'ready'

  _render: ->
    @tooltip = $ @opts.tpl
    @tooltip.html @opts.content

  _bind: ->
    @el.on 'mouseenter', ()=>
      @show()
    @el.on 'mouseleave', ()=>
      @hide()
  _setPosition: ->
    position = @el.position()
    @_addClass()
    @tooltip.css @_adjustPosition
      top: (position.top || 0) + parseInt(@el.css('margin-top'))
      left: (position.left || 0) + parseInt(@el.css('margin-left'))

  _normalizePositioin: ->
    if includes ['top','bottom','left','right'], @opts.position
      @opts.position
    else
      'bottom'

  _adjustPosition: (original)->
    console.log original
    width = @el.outerWidth()
    height = @el.outerHeight()

    switch @_normalizePositioin()
      when 'top' then {
        top: original.top - @tooltip.outerHeight()
        left: original.left + width / 2
      }
      when 'bottom' then {
        top: original.top + @el.outerHeight()
        left: original.left + width / 2
      }
      when 'left' then {
        top: original.top + height / 2
        left: original.left - @tooltip.outerWidth()
      }
      when 'right' then {
        top: original.top + height / 2
        left: original.left + @el.outerWidth()
      }
  _addClass: ->
    @tooltip.addClass @_normalizePositioin()

  show: ->
    @el.after @tooltip
    @_setPosition()

  hide: ->
    @tooltip.detach()

  destroy: ->
    @tooltip.remove()
    @el.removeData 'qingTooltip'

module.exports = QingTooltip
