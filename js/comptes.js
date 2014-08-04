(function(){

var D = React.DOM;

var ExpensesList = React.createClass({displayName: 'ExpensesList',
  render: function() {
    var getTo = function getTo(to, tos) {
      if ( !to ) {
        to = tos.map(function(to, n){
             var str = n === tos.length-1 ? '' :
                       n === tos.length-2 ? ' and ' :
                                            ', ';
              return [D.b(null, to), str];
            });
      }
      return to;
    };
                     
    return D.table(null,
             D.thead(null,
                D.tr(null,
                   D.th(null, 'From'),
                   D.th(null, 'To'),
                   D.th(null, 'Amount')
                 )
               ),
             D.tbody(null,
               this.props.expenses.map(function(exp) {
                 return (
                   D.tr(null,
                     D.td(null, exp.from),
                     D.td(null, getTo(exp.to, exp.tos)),
                     D.td(null, exp.amount)
                   )
                  )
               })
             )
           );
  }
});

var UsersList = React.createClass({displayName:'UserList',
  render: function() {
    return D.table(null,
        D.thead(null,
          D.tr(null,
            D.th(null, "User"),
            D.th(null, "Total")
          )
        ),
        this.props.users.map(function(user){
          return D.tr(null,
              D.td(null, user.name),
              D.td(null, user.amount)
          );
        }) 
     );
  } 
});

var App = React.createClass({displayName: 'ExpensesApp',
  getInitialState: function() {
    return {expenses: [], text: ''};
  },

  handleSubmit: function(e) {
    e.preventDefault();
    var from = this.refs.from.getDOMNode();
    var tos = this.refs.to.getDOMNode();
    var amount = this.refs.amount.getDOMNode();
    this.state.expenses.push({
      from  : from.value,
      amount: parseFloat(amount.value),
      tos   : tos.value.split(',')
                 .map(function(x){return x.trim()})
                 .filter(function(x){return x !== ''})
    });
    this.setState({expenses: this.state.expenses});
    this.refs.form.getDOMNode().reset();
    from.focus();
  },

  expand: function() {
    var expenses = [];
    this.state.expenses.forEach(function(exp){
      exp.tos.forEach(function(to) {
        expenses.push({
          from  : exp.from,
          to    : to,
          amount: exp.amount / (exp.tos.length)
        });
      });
    });
    return expenses;
  },

  simplify: function() {
    return debts.simplify(this.expand());
  },

  allusers: function() {
    var users = [];
    var userDebts = debts.totalize(this.expand());
    for (var user in userDebts) users.push({name:user, amount:userDebts[user]});
    return users;
  },

  render: function() {
    return D.div(null, 
       D.h3(null, "Expenses"), 
        ExpensesList({expenses: this.simplify()}), 
         D.form({onSubmit: this.handleSubmit, ref:'form'}, 
          D.input({placeholder: 'From', ref:'from', required:true}),
          D.input({placeholder: 'To',   ref:'to',   required:true}),
          D.input({type:'number',
                    placeholder:'Amount',
                    ref:'amount',
                    min: 0,
                    step: 0.01
          }),
          D.button(null, 'Add')
        ),
        ExpensesList({expenses: this.state.expenses}),
        UsersList({users: this.allusers()})
     );
  }
});

mountNode = document.getElementById('expenses');
React.renderComponent(App(null), mountNode);

})();
