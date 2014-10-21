D = React.DOM

@ExpensesList = React.createClass
  displayName: "ExpensesList"
  mkDeleteFunc: (doc, n) -> (evt) =>
      @props.removeDoc doc, n if confirm("Are you sure?")

  render: ->
    D.article
      className: "panel panel-default"
      id: "ExpensesList"

      D.div(className:"panel-heading",
        D.h3 className: "panel-title",
              "List of all expenses"),
      
      D.ul className: "panel-body list-group",

        @props.expenses
          .filter (exp) -> exp.repaid isnt true
          .sort ({date:a}, {date:b}) ->
            if a is b then 0 else if a<b then 1 else -1
          .map (exp, n) =>
            D.li
              className: "list-group-item row"
              key:exp.date+exp.description,

              D.div(className:"col-md-3 col-sm-2",
                  ColoredAmount tagName:"h4", amount:exp.amount)

              D.div( className:"col-md-5 col-sm-7",
                D.h4 null, exp.description
                D.p className:"expenseBy", "By ", D.b null, exp.from
                D.p className:"expenseFor", "For " + exp.tos.join(", ") + ".")
              D.div( className:"col-md-3 col-sm-2",
                  D.p className:"expenseDate", new Date(exp.date).toLocaleString())
              D.button(
                className: "btn btn-danger col-md-1 col-sm-1"
                onClick: @mkDeleteFunc(exp, n)
                , D.span(className: "fa fa-trash-o"))
