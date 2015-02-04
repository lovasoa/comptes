D = React.DOM

@ExpensesAppUI = React.createClass
  displayName: "ExpensesAppUI"

  expand: ->
    @props.expenses.reduce ((p,c)->p.concat Utils.expandExpense c), []

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
          addExpense: @props.addExpense
          userNames: @allUsers().map (u) -> u.name
        ExpensesList
          expenses: @props.expenses
          removeExpense: @props.removeExpense
       )

      D.div(className:"col-md-6",
        DebtsList debts: @simplify()
        UsersList users: @allUsers())

