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
          @props.debts
            .sort (a,b) -> b.amount-a.amount
            .map (debt) ->
              D.tr key:debt.from+'/'+debt.to,
                  D.td null, debt.from,
                  D.td null, debt.to,
                  D.td null, ColoredAmount amount:debt.amount

