QingTooltip = require '../src/qing-tooltip'
expect = chai.expect

describe 'QingTooltip', ->

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
