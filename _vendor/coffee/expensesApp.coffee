D = React.DOM

@ExpensesApp = React.createClass
  displayName: "ExpensesApp"
  getInitialState: ->
    expenses: []
    text: ""

  componentDidMount: ->
    @changes = @props.db.changes()
    @changes.onChange @fetchData
    @fetchData()

  componentWillUnmount: ->
    @changes.stop()

  fetchData: ->
    @props.db.view "expenseslist/ListOfExpenses",
      success: (view) =>
          @setState expenses: (view.rows.map (r) -> r.value) if @isMounted()
      error: console.error.bind(console)
      reduce: false

  removeDoc: (doc, n) ->
      @props.db.removeDoc doc

  addExpense: (doc) ->
    @props.db.saveDoc doc
    @state.expenses.push doc
    @setState expenses: @state.expenses

  expand: ->
    expenses = []
    @state.expenses.forEach (exp) ->
      exp.tos.forEach (to) ->
        expenses.push
          from: exp.from
          to: to
          amount: -exp.amount / exp.tos.length
    expenses

  simplify: ->
    debts.simplify @expand()

  allUsers: ->
    users = []
    userDebts = debts.totalize(@expand())
    for own name of userDebts
        users.push {name, amount:userDebts[name]}
    users

  render: ->
    D.section id:"app",

      D.div(className:"col-md-6",
        NewExpenseForm
          addExpense: @addExpense
          userNames: @allUsers().map (u) -> u.name
        ExpensesList
          expenses: @state.expenses
          removeDoc: @removeDoc
       )

      D.div(className:"col-md-6",
        DebtsList debts: @simplify()
        UsersList users: @allUsers())

