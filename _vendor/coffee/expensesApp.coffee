class @ExpensesApp
  HOST: ''

  expenses: []

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
        expenses: @expenses
      ),
      @mountNode)

@Utils =
  # Round the amounts to the nearest cent
  amount: (x) -> if x is (x|0) then x else parseFloat(x).toFixed(2)

  # Split one expense that concerns several persons to
  # several expenses (one per person) this function manages the cents,
  # so that the balance is always balanced
  expandExpense: (exp) ->
    exp.tos.reduce(
      (prev, to, i) ->
        part =  -Math.floor(100 * exp.amount/exp.tos.length)/100
        prev.push
          from: exp.from
          to: to
          amount: part - if i<((100*exp.amount)%exp.tos.length) then .01 else 0
        prev
      , [])

document.addEventListener 'DOMContentLoaded', =>
  @app = new @ExpensesApp document.getElementById 'expenses'
  @app.render()

