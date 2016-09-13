class QingTooltip extends QingModule

  @opts:
    el: null

  constructor: (opts) ->
    super

    @el = $ @opts.el
    unless @el.length > 0
      throw new Error 'QingTooltip: option el is required'

    @opts = $.extend {}, QingTooltip.opts, @opts
    @_render()
    @trigger 'ready'

  _render: ->
    @el.append """
      <p>This is a sample component.</p>
    """
    @el.addClass ' qing-tooltip'
      .data 'qingTooltip', @

  destroy: ->
    @el.empty()
      .removeData 'qingTooltip'

module.exports = QingTooltip
