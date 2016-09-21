class QingTooltip extends QingModule

  @opts:
    el: null
    content: ''
    position: 'bottom' # 'right' 'left' 'top' 'bottom'
    tpl: """
    <div class="qing-tooltip">
    </div>
    """
    cls: ''
    offset: 0
    trigger: 'hover' # 'hover' 'click'

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
    position = @el.position()

    width : @el.outerWidth(true)
    height : @el.outerHeight(true)

  _tooltipPosition: (targetDimension) ->
    switch @opts.position
      when 'top' then {
        marginTop: - (@tooltip.outerHeight() + @opts.offset)
        marginLeft: - targetDimension.width / 2
      }
      when 'bottom' then {
        marginTop: targetDimension.height + @opts.offset
        marginLeft: - targetDimension.width / 2
      }
      when 'left' then {
        marginTop: targetDimension.height / 2
        marginLeft: -(targetDimension.width + @tooltip.outerWidth() +
        @opts.offset)
      }
      when 'right' then {
        marginTop: targetDimension.height / 2
        marginLeft: @opts.offset
      }

  show: ->
    @shown = true
    @tooltip.insertAfter @el
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
