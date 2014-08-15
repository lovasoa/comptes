D = React.DOM

@ExpensesAppUI = React.createClass
  displayName: "ExpensesAppUI"

  removeDoc: (doc, n) ->
      @props.db.removeDoc doc

  addExpense: (doc) ->
    @props.db.saveDoc doc

  expand: ->
    expenses = []
    @props.expenses.forEach (exp) ->
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
          expenses: @props.expenses
          removeDoc: @removeDoc
       )

      D.div(className:"col-md-6",
        DebtsList debts: @simplify()
        UsersList users: @allUsers())

