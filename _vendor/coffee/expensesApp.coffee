class @ExpensesApp
  HOST: ''

  constructor: (mountOn = document.body) ->
    @mountNode = mountOn
    @db = $.couch.db 'comptes'
    $.couch.urlprefix = @HOST
    @changes = @db.changes()
    @changes.onChange @fetchData
    @fetchData()

  fetchData: =>
    @db.view "expenseslist/ListOfExpenses",
      success: (view) =>
          @set 'expenses', (view.rows.map (r) -> r.value)
      error: (err) -> console.error "Unable to fetch expenses", err
      reduce: false

  set: (key, value) ->
    @[key] = value
    @render()

  render: ->
    React.renderComponent(
      ExpensesAppUI(
        db: @db
        users: @users
        expenses: @expenses
      ),
      @mountNode)

document.addEventListener 'DOMContentLoaded', =>
  @app = new @ExpensesApp document.getElementById 'expenses'
  @app.render()

