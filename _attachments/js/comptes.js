(function(){

var D = React.DOM;

var DebtsList = React.createClass({displayName: 'debtsList',
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

var ExpensesList = React.createClass({displayName:'ExpensesList',
  render: function() {
    return D.ul({className:'list-group'},
              this.props.expenses.map(function(exp, n){
                return D.li({className: 'list-group-item'},
                            exp.description,
                            D.i(null, exp.from),
                            D.span({className:'badge'}, exp.amount)
                          );
              })
           );
  }
});

var UsersList = React.createClass({displayName:'UserList',
  render: function() {
    return D.table({className:'table table-bordered table-condensed'},
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

  componentDidMount: function() {
    var that = this;
    this.props.db.view("expenseslist/ListOfExpenses", {
      success: function success (view) {
                that.setState({
                  expenses: view.rows.map(function(r){return r.value})
                });
               },
      error: console.error.bind(console),
      reduce: false
    });
  },
  
  handleSubmit: function(e) {
    e.preventDefault();
    var from = this.refs.from.getDOMNode();
    var tos = this.refs.to.getDOMNode();
    var amount = this.refs.amount.getDOMNode();
    var description = this.refs.description.getDOMNode();
    var doc = {
     description: description.value,
            from: from.value,
          amount: parseFloat(amount.value),
             tos: tos.value.split(',')
                     .map(function(x){return x.trim()})
                     .filter(function(x){return x !== ''}),
             date: (new Date()).toISOString()
    };
    this.props.db.saveDoc(doc);
    this.state.expenses.push(doc);
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
          amount: - exp.amount / (exp.tos.length)
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
       D.h3(null, "Who owes what?"), 
        DebtsList({debts: this.simplify()}), 
         D.form({onSubmit: this.handleSubmit, ref:'form'}, 
          D.input({placeholder: 'Description',
                           ref:'description',
                      required: true}),
          D.input({placeholder: 'Who paid?', ref:'from', required:true}),
          D.input({placeholder: 'For who?',
                         title: 'You can enter several names, ' +
                                'separated by a coma',
                           ref: 'to',
                      required: true}),
          D.input({type:'number',
                    placeholder:'Amount',
                    ref:'amount',
                    min: 0,
                    step: 0.01
          }),
          D.button(null, 'Add')
        ),
        D.h3(null, "List of all expenses"), 
        ExpensesList({expenses: this.state.expenses}),
        D.h3(null, "User accounts"), 
        UsersList({users: this.allusers()})
     );
  }
});

function start() {
  var mountNode = document.getElementById('expenses');
  var app = App({db: $.couch.db('comptes')});

  React.renderComponent(app, mountNode);
}

start();
})();
