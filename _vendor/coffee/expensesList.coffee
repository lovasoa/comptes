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

        @props.expenses.map (exp, n) =>
          D.li className: "list-group-item",

            D.h4( className: "list-group-item-heading",
               D.span( className: "label label-info", exp.amount),
               " ", exp.description),

            D.div className: "list-group-item-text",
                D.p(null,
                     "By ", D.b(null, exp.from), "."),
                D.p(null,
                  "For " + exp.tos.join(", ") + "."),
                D.button(
                  className: "btn"
                  onClick: @mkDeleteFunc(exp, n)
                  , D.span(className: "glyphicon glyphicon-trash")
                  , "Delete")
