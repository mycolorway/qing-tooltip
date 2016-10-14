class QingTooltip extends QingModule

  @opts:
    el: null
    pointTo: null
    content: null
    position: 'bottom' # 'right' 'left' 'top' 'bottom'
    tpl: """
    <div class="qing-tooltip">
    </div>
    """
    cls: ''
    offset: 0
    trigger: 'hover' # 'hover' 'click'
    appendTo: 'body'

  tooltip: null

  _setOptions: (opts) ->
    super
    $.extend @opts, QingTooltip.opts, opts

  _init: ->
    return unless @opts.content

    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingTooltip: option el is required'
    if @el.data 'qingTooltip'
      return @el.data 'qingTooltip'

    if $.inArray(@opts.position, ['top','bottom','left','right']) < 0
      @opts.position = 'bottom'

    @pointTo = @el.find(@opts.pointTo).filter(":visible").first()
    unless @pointTo.length
      @pointTo = @el

    if @opts.appendTo
      @appendTo = $ @opts.appendTo

    @_render()
    @_bind()

    @el.data 'qingTooltip', @
    @trigger 'ready'

  _render: ->
    @tooltip = $ @opts.tpl
    @tooltip.html @opts.content
    @tooltip.addClass @opts.position
    @tooltip.addClass @opts.cls

  _bind: ->
    switch @opts.trigger
      when 'hover'
        @el.on 'mouseenter.qingTooltip', ()=> @show()
        @el.on 'mouseleave.qingTooltip', ()=> @hide()
      when 'click'
        @el.on 'mousedown.qingTooltip', ()=>
          if @shown
            @hide
          else
            @show()
            setTimeout ()=>
              $(document).on 'mousedown.qingTooltip', (e)=>
                if not ($.contains @tooltip, e.target) and
                (@tooltip[0] isnt e.target)
                  @hide()

  _targetDimension: ->
    dimension =
      width: @pointTo.outerWidth(true)
      height: @pointTo.outerHeight(true)
      innerWidth: @pointTo.outerWidth(false)
      innerHeight: @pointTo.outerHeight(false)
      margin: {
        left: parseInt(@pointTo.css('marginLeft')) || 0
        right: parseInt(@pointTo.css('marginRight')) || 0
        top: parseInt(@pointTo.css('marginTop')) || 0
        bottom: parseInt(@pointTo.css('marginBottom')) || 0
      }
    if @appendTo
      containerOffset = @tooltip.offsetParent().offset()
      targetOffset = @pointTo.offset()

      $.extend dimension, {
        top: targetOffset.top - containerOffset.top - dimension.margin.top
        left:  targetOffset.left - containerOffset.left - dimension.margin.left
      }
    else
      position = @pointTo.position()

      $.extend dimension, {
        top: position.top
        left: position.left
      }

  _tooltipPosition: (targetDimension) ->
    switch @opts.position
      when 'top' then {
        top: targetDimension.top - (@tooltip.outerHeight() + @opts.offset)
        left: targetDimension.left + targetDimension.width -
        targetDimension.width / 2
      }
      when 'bottom' then {
        top: targetDimension.top + targetDimension.margin.top +
        targetDimension.innerHeight + @opts.offset
        left: targetDimension.left + targetDimension.width / 2
      }
      when 'left' then {
        top: targetDimension.top + targetDimension.height / 2
        left: targetDimension.left + targetDimension.margin.left -
        (@tooltip.outerWidth() + @opts.offset)
      }
      when 'right' then {
        top: targetDimension.top + targetDimension.height / 2
        left: targetDimension.left + targetDimension.margin.left +
        targetDimension.innerWidth + @opts.offset
      }


  show: ->
    @shown = true
    if @appendTo
      @appendTo.append(@tooltip)
    else
      @tooltip.insertAfter @pointTo
    @tooltip.css @_tooltipPosition @_targetDimension()

  hide: ->
    @shown = false
    @tooltip.detach()
    $(document).off 'mousedown.qingTooltip'

  destroy: ->
    @hide()
    @tooltip.remove()
    @el.off('.qingTooltip')
    $(document).off('.qingTooltip')
    @el.removeData 'qingTooltip'

module.exports = QingTooltip
