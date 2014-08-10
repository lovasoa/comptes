var host = "";

(function(){

var d = react.dom;





var app = react.createclass({displayname: 'expensesapp',
  getinitialstate: function() {
    return {expenses: [], text: ''};
  },

  componentdidmount: function() {
    this.changes = this.props.db.changes();
    this.changes.onchange(this.fetchdata);
    this.fetchdata();
  },
  
  componentwillunmount: function() {
    this.changes.stop();
  },

  fetchdata: function() {
    this.props.db.view("expenseslist/listofexpenses", {
      success: function success (view) {
                if (this.ismounted()) this.setstate({
                  expenses: view.rows.map(function(r){return r.value})
                });
               }.bind(this),
      error: console.error.bind(console),
      reduce: false
    });
  },

  removedoc: function(doc, n){
    this.props.db.removedoc(doc);
  },

  addexpense: function(exp) {
    var doc = exp;
    this.props.db.savedoc(doc);
    this.state.expenses.push(doc);
    this.setstate({expenses: this.state.expenses});
  },

  expand: function() {
    var expenses = [];
    this.state.expenses.foreach(function(exp){
      exp.tos.foreach(function(to) {
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
    var userdebts = debts.totalize(this.expand());
    for (var user in userdebts) users.push({name:user, amount:userdebts[user]});
    return users;
  },

  render: function() {
    return d.div(null, 
       d.h3(null, "who owes what?"), 
        debtslist({debts: this.simplify()}), 
        newexpenseform({
            addexpense: this.addexpense,
            usernames: this.allusers().map(function(u){return u.name})
        }),
        expenseslist({expenses: this.state.expenses,
                      removedoc: this.removedoc}),
        d.h3(null, "user accounts"), 
        userslist({users: this.allusers()})
     );
  }
});

function start() {
  var mountnode = document.getelementbyid('expenses');
  $.couch.urlprefix = host;
  var app = app({db: $.couch.db('comptes')});

  react.rendercomponent(app, mountnode);
}

start();
})();
