D = React.DOM

@UsersList = React.createClass
  displayName: "UserList"
  render: ->
    D.article className:"panel panel-default",

      D.div(className:"panel-heading",
        D.h3 className: "panel-title",
              "User accounts"),

      D.table className: "panel-body table table-stripped table-hover",
        D.thead(null,
          D.tr null,
            D.th null, "User",
            D.th null, "Total"),

        D.tbody null,
          @props.users
            .sort (a,b) -> b.amount-a.amount
            .map (user) ->
              D.tr null,
                D.td(null, user.name),
                D.td(null, ColoredAmount
                              amount: user.amount
                              stops:  [0, Infinity]
                              labels: ["danger", "success"])

