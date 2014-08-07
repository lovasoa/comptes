var HOST = "";

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
    return D.article({className:'panel panel-default', id:'ExpensesList'},
            D.div({className:'panel-heading'}, D.h3(null, "List of all expenses")),
            D.div({className:'panel-body'},
              D.ul({className:'list-group'},
                this.props.expenses.map(function(exp, n){
                  return D.li({className: 'list-group-item'},
                              exp.description,
                              D.i(null, exp.from),
                              D.span({className:'badge'}, exp.amount)
                            );
                })
             )
            )
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

var NewExpenseForm = React.createClass({displayName:'NewExpenseForm',
  getInitialState: function() {
    return {
      description: "",
             from: "",
               to: "",
           amount: ""
    }; 
  },

  handleSubmit: function(evt) {
    evt.preventDefault();
    this.props.addExpense({
      description: this.state.date,
             from: this.state.from,
              tos: this.getTosArray(),
           amount: this.state.amount,
             date: new Date().toISOString()
    });
    this.setState(this.getInitialState());
    this.refs.form.getDOMNode().reset();
    this.refs.description.getDOMNode().focus();
  },

  getTosArray: function() {
    return  this.state.to.split(',')
              .map(function(x){return x.trim()})
              .filter(function(x){return x.length});
  },

  val: function(name) {
    return (name in this.refs) ? this.refs[name].getDOMNode().value : '';
  },

  changeState: function() {
    this.setState({
      description: this.val('description'),
      from: this.val('from'),
      amount: Math.round(parseFloat(this.val('amount')) * 100) / 100 || '',
      to: this.val('to')
    });
  },

  render: function render() {
     return D.form({onSubmit: this.handleSubmit, ref:'form'}, 
      D.input({placeholder: 'Description',
                       ref: 'description',
                     value: this.state.description,
                  onChange: this.changeState,
                  required: true}),
      D.input({placeholder: 'Who paid?',
                       ref:'from',
                  required: true,
                     value: this.state.from,
                  onChange: this.changeState}),
      D.input({placeholder: 'For who?',
                     title: 'You can enter several names, ' +
                            'separated by a coma',
                       ref: 'to',
                  required: true,
                     value: this.state.to,
                  onChange: this.changeState}),
             D.input({type:'number',
               placeholder:'Amount',
                       ref:'amount',
                  required: true,
                       min: 0,
                      step: 0.01,
                     value: this.state.amount,
                  onChange: this.changeState}),
          D.button(null, 'Add')
    );
  }
});

var App = React.createClass({displayName: 'ExpensesApp',
  getInitialState: function() {
    return {expenses: [], text: ''};
  },

  componentDidMount: function() {
    this.props.db.changes().onChange(this.fetchData);
    this.fetchData();
  },
  
  fetchData: function() {
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

  addExpense: function(exp) {
    var doc = exp;
    this.props.db.saveDoc(doc);
    this.state.expenses.push(doc);
    this.setState({expenses: this.state.expenses});
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
        NewExpenseForm({addExpense: this.addExpense}),
        ExpensesList({expenses: this.state.expenses}),
        D.h3(null, "User accounts"), 
        UsersList({users: this.allusers()})
     );
  }
});

function start() {
  var mountNode = document.getElementById('expenses');
  $.couch.urlPrefix = HOST;
  var app = App({db: $.couch.db('comptes')});

  React.renderComponent(app, mountNode);
}

start();
})();
