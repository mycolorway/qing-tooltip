QingTooltip = require '../src/qing-tooltip'
expect = chai.expect

describe 'QingTooltip', ->

  describe 'Basic Test', ->
    $el = null
    qingTooltip = null

    before ->
      $el = $('<div class="test-el"></div>').appendTo 'body'

    after ->
      $el.remove()
      $el = null

    beforeEach ->
      qingTooltip = new QingTooltip
        el: '.test-el'
        position: 'left'
        offset: 10,
        trigger: 'hover'

    afterEach ->
      qingTooltip.destroy()
      qingTooltip = null

    it 'should inherit from QingModule', ->
      expect(qingTooltip).to.be.instanceof QingModule
      expect(qingTooltip).to.be.instanceof QingTooltip

    it 'should throw error when element not found', ->
      spy = sinon.spy QingTooltip
      try
        new spy
          el: '.not-exists'
      catch e

      expect(spy.calledWithNew()).to.be.true
      expect(spy.threw()).to.be.true

  describe 'More options', ->
    $el = null
    qingTooltip = null

    before ->
      $el = $('<div class="test-el"></div>').appendTo 'body'

    after ->
      $el.remove()
      $el = null

    afterEach ->
      qingTooltip.destroy() if qingTooltip
      qingTooltip = null


    it 'should show on left', ->
      qingTooltip = new QingTooltip
        el: '.test-el'
        position: 'left'
      qingTooltip.show()
      expect($('.qing-tooltip.left')).to.have.lengthOf(1)

    it 'should show on right', ->
      qingTooltip = new QingTooltip
        el: '.test-el'
        position: 'right'
      expect([].push).to.be.ok
      qingTooltip.show()
      expect($('.qing-tooltip.right')).to.have.lengthOf(1)

    it 'should show on top', ->
      qingTooltip = new QingTooltip
        el: '.test-el'
        position: 'top'
      expect([].push).to.be.ok
      qingTooltip.show()
      expect($('.qing-tooltip.top')).to.have.lengthOf(1)

    it 'should show on bottom', ->
      qingTooltip = new QingTooltip
        el: '.test-el'
        position: 'bottom'
      expect([].push).to.be.ok
      qingTooltip.show()
      expect($('.qing-tooltip.bottom')).to.have.lengthOf(1)

    it 'should show on default position', ->
      qingTooltip = new QingTooltip
        el: '.test-el'
        position: 'wrong'
      expect([].push).to.be.ok
      qingTooltip.show()
      expect($('.qing-tooltip.bottom')).to.have.lengthOf(1)

    it 'should hide', ->
      qingTooltip = new QingTooltip
        el: '.test-el'
      qingTooltip.show()
      expect($('.qing-tooltip')).to.have.lengthOf(1)
      qingTooltip.hide()
      expect($('.qing-tooltip')).to.have.lengthOf(0)

    it 'should support hover interaction', ()->
      qingTooltip = new QingTooltip
        el: '.test-el'
        offset: 10,
        trigger: 'hover'
        cls: 'test'
      $('.test-el').trigger('mouseenter')
      expect($('.qing-tooltip')).to.have.lengthOf(1)
      $('.test-el').trigger('mouseleave')
      expect($('.qing-tooltip')).to.have.lengthOf(0)

    it 'should support click interaction', (done)->
      qingTooltip = new QingTooltip
        el: '.test-el'
        offset: 10,
        trigger: 'click'
        cls: 'test'
      $('.test-el').trigger('click')
      expect($('.qing-tooltip')).to.have.lengthOf(1)
      setTimeout ->
        $('.qing-tooltip').trigger('click')
        expect($('.qing-tooltip')).to.have.lengthOf(1)
        $('body').trigger('click')
        expect($('.qing-tooltip')).to.have.lengthOf(0)
        done()

