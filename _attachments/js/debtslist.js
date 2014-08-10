(function(){

var D = React.DOM;

this.DebtsList = React.createClass({displayName: 'debtsList',
  render: function() {
    return D.table({className:"table table-stripped table-hover"},
             D.thead(null,
                D.tr(null,
                   D.th(null, 'From'),
                   D.th(null, 'To'),
                   D.th(null, 'Amount')
                 )
               ),
             D.tbody(null,
               this.props.debts.map(function(debt) {
                 return (
                   D.tr(null,
                     D.td(null, debt.from),
                     D.td(null, debt.to),
                     D.td(null, debt.amount)
                   )
                  )
               })
             )
           );
  }
});

}).apply(this);
