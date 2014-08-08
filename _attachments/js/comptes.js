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
  mkDeleteFunc: function (doc, n) {
    return function(evt) {
      if (confirm("Are you sure?")) this.props.removeDoc(doc, n);
    }.bind(this);
  },

  render: function() {
    return D.article({className:'panel panel-default', id:'ExpensesList'},
            D.div({className:'panel-heading'}, D.h3(null, "List of all expenses")),
            D.div({className:'panel-body'},
              D.ul({className:'list-group'},
                this.props.expenses.map(function(exp, n){
                  return D.li({className: 'list-group-item'},
                              D.h4({className: 'list-group-item-heading'},
                                    D.span({className:'label label-info'},
                                      exp.amount),
                                    " ",
                                    exp.description
                                ),
                              D.div({className:'list-group-item-text'},
                                D.p(null, "By ",D.b(null, exp.from), "."),
                                D.p(null, "For "+exp.tos.join(', ')+"."),
                                D.button({className:'btn',
                                          onClick: this.mkDeleteFunc(exp, n)
                                          }, 
                                    D.span({className:"glyphicon glyphicon-trash"}),
                                    "Delete"
                                  )
                              )
                            );
                }.bind(this))
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

var UserSelect = React.createClass({displayName:'UserSelect',
  change: function(){
    this.props.onChange(this.value);  
  },

  attachSelect2: function() {
    $(this.getDOMNode()).select2({
        tags: this.props.userNames,
        tokenSeparators: [','],
        maximumSelectionSize: this.props.multiple ? -1 : 1,
        sortResults: function (results, container, query) {
          if (results[0].text === query.term) results.push(results.shift());
          return results;
        }
    })
      .select2('val', [])
      .on('change', this.change);
  },

  componentDidMount: function() {
    this.attachSelect2();
  },

  componentWillUnmount: function() {
    $(this.getDOMNode()).off('change', this.change);
  },

  componentDidUpdate: function() {
    this.attachSelect2();
  },

  change: function() {
    var val = $(this.getDOMNode()).select2('val');
    this.props.onChange(this.props.multiple ? val : val[0]);
  },

  render: function () {
    return D.input({
      type: 'hidden',
      placeholder: this.props.placeholder,
      defaultValue: this.props.multiple ? userNames.join(', ') : ''
    });
  }
});


var NewExpenseForm = React.createClass({displayName:'NewExpenseForm',

  handleSubmit: function(evt) {
    evt.preventDefault();
    var doc = {
      description: this.val('description').trim(),
             from: this.from.trim(),
              tos: this.getTosArray(),
           amount: Math.round(parseFloat(this.val('amount')) * 100) / 100,
             date: new Date().toISOString()
    };
    if (!doc.description || !doc.from) return;
    this.props.addExpense(doc);
    this.refs.form.getDOMNode().reset();
    this.refs.description.getDOMNode().focus();
  },

  getTosArray: function() {
    return  this.val('to').split(',')
              .map(function(x){return x.trim()})
              .filter(function(x){return x.length});
  },

  val: function(name) {
    return (name in this.refs) ? this.refs[name].getDOMNode().value : '';
  },

  setFunc: function (name) {
    return (function(val){
      this[name] = val;
    }).bind(this);
  },

  render: function render() {
     return D.article({className: 'panel'},
         D.h2({className:'panel-header'}, 'Add new expense'),
         D.form({onSubmit: this.handleSubmit,
                    ref:'form',
                    role: 'form'}, 
      D.input({className: 'form-control',
               placeholder: 'Description',
                       ref: 'description',
                  required: true}),
            UserSelect({onChange: this.setFunc('from'),
                   userNames: this.props.userNames,
                    multiple: false,
                 placeholder: "Who paid?"
                        }),
            D.input({className: 'form-control',
                    placeholder: 'For who?',
                     title: 'You can enter several names, ' +
                            'separated by a coma',
                       ref: 'to',
                  required: true}),
             D.input({className: 'form-control',
                    type:'number',
               placeholder:'Amount',
                       ref:'amount',
                  required: true,
                       min: 0,
                      step: 0.01}),
          D.button({className:'btn btn-primary'}, 'Add')
        )
    );
  }
});

var App = React.createClass({displayName: 'ExpensesApp',
  getInitialState: function() {
    return {expenses: [], text: ''};
  },

  componentDidMount: function() {
    this.changes = this.props.db.changes();
    this.changes.onChange(this.fetchData);
    this.fetchData();
  },
  
  componentWillUnmount: function() {
    this.changes.stop();
  },

  fetchData: function() {
    this.props.db.view("expenseslist/ListOfExpenses", {
      success: function success (view) {
                if (this.isMounted()) this.setState({
                  expenses: view.rows.map(function(r){return r.value})
                });
               }.bind(this),
      error: console.error.bind(console),
      reduce: false
    });
  },

  removeDoc: function(doc, n){
    this.props.db.removeDoc(doc);
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

  allUsers: function() {
    var users = [];
    var userDebts = debts.totalize(this.expand());
    for (var user in userDebts) users.push({name:user, amount:userDebts[user]});
    return users;
  },

  render: function() {
    return D.div(null, 
       D.h3(null, "Who owes what?"), 
        DebtsList({debts: this.simplify()}), 
        NewExpenseForm({
            addExpense: this.addExpense,
            userNames: this.allUsers().map(function(u){return u.name})
        }),
        ExpensesList({expenses: this.state.expenses,
                      removeDoc: this.removeDoc}),
        D.h3(null, "User accounts"), 
        UsersList({users: this.allUsers()})
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
