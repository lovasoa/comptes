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
          .sort (e1,e2) -> e1.date < e2.date
          .map (exp, n) =>
            label = switch Math.floor exp.amount/50
                      when 0 then "success"
                      when 1 then "warning"
                      else "danger"
            D.li className: "list-group-item row",

              D.h4( className:"col-md-2 col-sm-1 label label-#{label}",
                        Utils.amount exp.amount)
              D.div( className:"col-md-6 col-sm-8",
                D.h4 null, exp.description
                D.p null, "By ", D.b null, exp.from)
              D.div( className:"col-md-3 col-sm-2",
                  D.p(null,
                    "For " + exp.tos.join(", ") + "."))
              D.button(
                className: "btn btn-danger col-md-1 col-sm-1"
                onClick: @mkDeleteFunc(exp, n)
                , D.span(className: "fa fa-trash-o"))
