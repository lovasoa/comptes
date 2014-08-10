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
          @props.users.map (user) ->
            D.tr null,
              D.td(null, user.name),
              D.td(null, user.amount)

