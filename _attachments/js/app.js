// Generated by CoffeeScript 1.7.1
(function() {
  var D, render,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty;

  D = React.DOM;

  this.ColoredAmount = React.createClass({
    displayName: "ColoredAmount",
    mixins: [React.addons.PureRenderMixin],
    getDefaultProps: function() {
      return {
        tagName: 'span',
        stops: [20, 50, 100, 200, Infinity],
        labels: ["info", "success", "warning", "danger", "highdanger"]
      };
    },
    render: function() {
      var i, label, stop, _i, _len, _ref;
      _ref = this.props.stops;
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        stop = _ref[i];
        label = this.props.labels[i];
        if (this.props.amount < stop) {
          break;
        }
      }
      return D[this.props.tagName]({
        className: "coloredAmount label label-" + label
      }, Utils.amount(this.props.amount));
    }
  });

  D = React.DOM;

  this.DebtsList = React.createClass({
    displayName: "DebtsList",
    render: function() {
      return D.article({
        className: "panel panel-default",
        id: "DebtsList"
      }, D.div({
        className: "panel-heading"
      }, D.h3({
        className: "panel-title"
      }, "Who owes what?")), D.table({
        className: "panel-body table table-stripped table-hover"
      }, D.thead(null, D.tr(null, D.th(null, "From", D.th(null, "To", D.th(null, "Amount"))))), D.tbody(null, this.props.debts.sort(function(a, b) {
        return b.amount - a.amount;
      }).map(function(debt) {
        return D.tr({
          key: debt.from + '/' + debt.to
        }, D.td(null, debt.from, D.td(null, debt.to, D.td(null, ColoredAmount({
          amount: debt.amount
        })))));
      }))));
    }
  });

  this.ExpensesApp = (function() {
    ExpensesApp.prototype.HOST = '';

    ExpensesApp.prototype.expenses = [];

    function ExpensesApp(mountOn) {
      if (mountOn == null) {
        mountOn = document.body;
      }
      this.fetchData = __bind(this.fetchData, this);
      this.mountNode = mountOn;
      this.db = $.couch.db('comptes');
      $.couch.urlprefix = this.HOST;
      this.changes = this.db.changes();
      this.changes.onChange(this.fetchData);
      this.fetchData();
    }

    ExpensesApp.prototype.fetchData = function() {
      return this.db.view("expenseslist/ListOfExpenses", {
        success: (function(_this) {
          return function(view) {
            return _this.set('expenses', view.rows.map(function(r) {
              return r.value;
            }));
          };
        })(this),
        error: function(err) {
          return console.error("Unable to fetch expenses", err);
        },
        reduce: false
      });
    };

    ExpensesApp.prototype.set = function(key, value) {
      this[key] = value;
      return this.render();
    };

    ExpensesApp.prototype.render = function() {
      return React.renderComponent(ExpensesAppUI({
        db: this.db,
        expenses: this.expenses
      }), this.mountNode);
    };

    return ExpensesApp;

  })();

  this.Utils = {
    amount: function(x) {
      if (x === (x | 0)) {
        return x;
      } else {
        return parseFloat(x).toFixed(2);
      }
    },
    expandExpense: function(exp) {
      return exp.tos.reduce(function(prev, to, i) {
        var part;
        part = -Math.floor(100 * exp.amount / exp.tos.length) / 100;
        prev.push({
          from: exp.from,
          to: to,
          amount: part - (i < ((100 * exp.amount) % exp.tos.length) ? .01 : 0)
        });
        return prev;
      }, []);
    }
  };

  document.addEventListener('DOMContentLoaded', (function(_this) {
    return function() {
      _this.app = new _this.ExpensesApp(document.getElementById('expenses'));
      return _this.app.render();
    };
  })(this));

  D = React.DOM;

  this.ExpensesAppUI = React.createClass({
    displayName: "ExpensesAppUI",
    removeDoc: function(doc, n) {
      return this.props.db.removeDoc(doc);
    },
    addExpense: function(doc) {
      return this.props.db.saveDoc(doc);
    },
    expand: function() {
      return this.props.expenses.reduce((function(p, c) {
        return p.concat(Utils.expandExpense(c));
      }), []);
    },
    simplify: function() {
      return debts.simplify(this.expand());
    },
    allUsers: function() {
      var name, userDebts, users;
      users = [];
      userDebts = debts.totalize(this.expand());
      for (name in userDebts) {
        if (!__hasProp.call(userDebts, name)) continue;
        users.push({
          name: name,
          amount: userDebts[name]
        });
      }
      return users;
    },
    render: function() {
      return D.section({
        id: "app"
      }, D.div({
        className: "col-md-6"
      }, NewExpenseForm({
        addExpense: this.addExpense,
        userNames: this.allUsers().map(function(u) {
          return u.name;
        })
      }), ExpensesList({
        expenses: this.props.expenses,
        removeDoc: this.removeDoc
      })), D.div({
        className: "col-md-6"
      }, DebtsList({
        debts: this.simplify()
      }), UsersList({
        users: this.allUsers()
      })));
    }
  });

  D = React.DOM;

  this.ExpensesList = React.createClass({
    displayName: "ExpensesList",
    mkDeleteFunc: function(doc, n) {
      return (function(_this) {
        return function(evt) {
          if (confirm("Are you sure?")) {
            return _this.props.removeDoc(doc, n);
          }
        };
      })(this);
    },
    render: function() {
      return D.article({
        className: "panel panel-default",
        id: "ExpensesList"
      }, D.div({
        className: "panel-heading"
      }, D.h3({
        className: "panel-title"
      }, "List of all expenses")), D.ul({
        className: "panel-body list-group"
      }, this.props.expenses.filter(function(exp) {
        return exp.repaid !== true;
      }).sort(function(e1, e2) {
        return e1.date < e2.date;
      }).map((function(_this) {
        return function(exp, n) {
          return D.li({
            className: "list-group-item row",
            key: exp.date + exp.description
          }, D.div({
            className: "col-md-3 col-sm-2"
          }, ColoredAmount({
            tagName: "h4",
            amount: exp.amount
          })), D.div({
            className: "col-md-5 col-sm-7"
          }, D.h4(null, exp.description), D.p({
            className: "expenseBy"
          }, "By ", D.b(null, exp.from)), D.p({
            className: "expenseFor"
          }, "For " + exp.tos.join(", ") + ".")), D.div({
            className: "col-md-3 col-sm-2"
          }, D.p({
            className: "expenseDate"
          }, new Date(exp.date).toLocaleString())), D.button({
            className: "btn btn-danger col-md-1 col-sm-1",
            onClick: _this.mkDeleteFunc(exp, n)
          }, D.span({
            className: "fa fa-trash-o"
          })));
        };
      })(this))));
    }
  });

  D = React.DOM;

  this.NewExpenseForm = React.createClass({
    displayName: "NewExpenseForm",
    getInitialState: function() {
      return {
        amount: ""
      };
    },
    handleSubmit: function(evt) {
      var amount, doc;
      evt.preventDefault();
      try {
        amount = this.computeAmount();
      } catch (_error) {
        return false;
      }
      doc = {
        description: this.val("description").trim(),
        from: this.from.trim(),
        tos: this.to,
        amount: amount,
        date: new Date().toISOString()
      };
      if (!doc.description || !doc.from || !doc.tos.length) {
        return;
      }
      this.props.addExpense(doc);
      this.to = this.from = void 0;
      this.setState(this.getInitialState());
      this.refs.form.getDOMNode().reset();
      return this.refs.description.getDOMNode().focus();
    },
    computeAmount: function() {
      return Math.round(100 * calculator.parse(this.state.amount)) / 100;
    },
    handleAmountChange: function(e) {
      return this.setState({
        amount: e.target.value
      });
    },
    val: function(name) {
      if (name in this.refs) {
        return this.refs[name].getDOMNode().value;
      } else {
        return "";
      }
    },
    setFunc: function(name) {
      return (function(_this) {
        return function(val) {
          return _this[name] = val;
        };
      })(this);
    },
    render: render = function() {
      var e;
      return D.article({
        className: "panel panel-default"
      }, D.div({
        className: "panel-heading"
      }, D.h2({
        className: "panel-title"
      }, "Add a new expense")), D.form({
        onSubmit: this.handleSubmit,
        ref: "form",
        role: "form"
      }, D.label({
        htmlFor: "expense-form-description",
        className: "control-label"
      }, "Description"), D.input({
        id: "expense-form-description",
        className: "form-control",
        placeholder: "What was bought?",
        ref: "description",
        required: true
      }), D.label({
        htmlFor: "expense-form-from",
        className: "control-label"
      }, "Person who made the expense"), UserSelect({
        id: "expenses-form-from",
        onChange: this.setFunc("from"),
        userNames: this.props.userNames,
        value: this.from != null ? [this.from] : [],
        multiple: false,
        placeholder: "Who paid?"
      }), D.label({
        htmlFor: "expense-form-for",
        className: "control-label"
      }, "Persons concerned by the expense"), UserSelect({
        onChange: this.setFunc("to"),
        userNames: this.props.userNames,
        value: this.to || [],
        multiple: true,
        placeholder: "For who?"
      }), D.label({
        htmlFor: "expense-form-amount",
        className: "control-label"
      }, "Amount of the expense (can be a simple formula, e.g. '13+5%')"), D.input({
        id: "expense-form-amount",
        className: "form-control",
        type: "tel",
        pattern: "[0-9\\-][0-9+\\-*/%]*",
        title: "The amount that was spent, as a number, or a formula",
        onChange: this.handleAmountChange,
        placeholder: "How much money?",
        ref: "amount",
        required: true,
        min: 0,
        step: 0.01
      }), D.div({
        className: "control-label calculator-result"
      }, (function() {
        var _ref;
        if ((_ref = this.state.amount.trim()) === "" || _ref === String(parseFloat(this.state.amount))) {
          return "";
        } else {
          try {
            return " = " + Utils.amount(this.computeAmount());
          } catch (_error) {
            e = _error;
            return D.span({
              className: "invalid"
            }, "Invalid number");
          }
        }
      }).call(this)), D.button({
        className: "btn btn-primary"
      }, D.span({
        className: "fa fa-plus"
      }), "Add this expense")));
    }
  });

  D = React.DOM;

  this.UsersList = React.createClass({
    displayName: "UserList",
    render: function() {
      return D.article({
        className: "panel panel-default"
      }, D.div({
        className: "panel-heading"
      }, D.h3({
        className: "panel-title"
      }, "User accounts")), D.table({
        className: "panel-body table table-stripped table-hover"
      }, D.thead(null, D.tr(null, D.th(null, "User", D.th(null, "Total")))), D.tbody(null, this.props.users.sort(function(a, b) {
        return b.amount - a.amount;
      }).map(function(user) {
        return D.tr({
          key: user.name
        }, D.td(null, user.name), D.td(null, ColoredAmount({
          amount: user.amount,
          stops: [0, Infinity],
          labels: ["danger", "success"]
        })));
      }))));
    }
  });

  D = React.DOM;

  this.UserSelect = React.createClass({
    displayName: "UserSelect",
    attachSelect2: function() {
      console.log(this.props.value);
      return $(this.getDOMNode()).select2({
        tags: this.props.userNames,
        tokenSeparators: [","],
        maximumSelectionSize: (this.props.multiple ? -1 : 1),
        formatNoMatches: "",
        width: "100%",
        sortResults: function(results, container, query) {
          if (results.length > 0 && results[0].text === query.term) {
            results.push(results.shift());
          }
          return results;
        }
      }).val(this.props.value).on("change", this.change);
    },
    componentDidMount: function() {
      this.attachSelect2();
    },
    componentWillUnmount: function() {
      $(this.getDOMNode()).off("change", this.change);
    },
    componentDidUpdate: function() {
      this.attachSelect2();
    },
    shouldComponentUpdate: function(nextProps, nextState) {
      var val;
      if (!this.isMounted()) {
        return true;
      }
      val = $(this.getDOMNode()).select2("val");
      if ((val != null) && val.length === nextProps.value.length && nextProps.value.every(function(prop, i) {
        return prop === val[i];
      }) && nextProps.userNames.every((function(_this) {
        return function(prop, i) {
          return prop === _this.props.userNames[i];
        };
      })(this))) {
        return false;
      }
      return true;
    },
    change: function(_arg) {
      var val;
      val = _arg.val;
      this.props.onChange(this.props.multiple ? val : val[0]);
    },
    render: function() {
      return D.input({
        type: "hidden",
        placeholder: this.props.placeholder,
        defaultValue: (this.props.multiple ? this.props.userNames.join(", ") : "")
      });
    }
  });

}).call(this);
