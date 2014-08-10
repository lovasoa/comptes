D = React.DOM

@DebtsList = React.createClass
  displayName: "DebtsList"
  render: ->
    D.article
      className: "panel panel-default"
      id: "DebtsList"

      D.div(className:"panel-heading",
        D.h3 className: "panel-title",
              "Who owes what?"),

      D.table className: "panel-body table table-stripped table-hover",
        D.thead(null,
          D.tr null,
              D.th null, "From",
              D.th null, "To",
              D.th null, "Amount"),
        D.tbody null,
          @props.debts.map (debt) ->
              D.tr null,
                  D.td null, debt.from,
                  D.td null, debt.to,
                  D.td null, debt.amount

