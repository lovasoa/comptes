class @ExpensesApp
  HOST: window.location.protocol + "//" + window.location.host

  expenses: []

  constructor: (mountOn = document.body) ->
    console.log "load at " + new Date
    @mountNode = mountOn
    @db = new PouchDB 'comptes'
    @refresh()
    @remoteDb = new PouchDB(@HOST+'/comptes')
    @syncData()
    @render()

  syncData: =>
    @db.sync(@remoteDb, live:true)
          .on 'change', (change) =>
            @refresh()
          .on 'error', (err) =>
            console.error(err)

  set: (key, value) ->
    @[key] = value
    @render()

  refresh: =>
    params =
        include_docs: true
        conflicts: false
        startkey: "expense-"
        endkey:   "expense_"

    console.log "call allDocs at " + new Date
    @db.allDocs params, (err, result) =>
      @expenses = result.rows.map (raw) -> raw.doc
      console.log "refresh at " + new Date
      @render()

  addExpense: (exp) =>
    id = "expense-" + exp.date + "-" + exp.from + "-" + exp.amount
    @db.put(exp, id).then @refresh

  removeExpense: (exp) =>
    @db.remove(exp).then @refresh

  render: ->
    React.renderComponent(
      ExpensesAppUI(
        expenses: @expenses
        addExpense: @addExpense
        removeExpense: @removeExpense
      ),
      @mountNode)

  update: =>
    # Update from the old schema
    @db.allDocs include_docs:true, (err, result) =>
      newdocs = []
      docs = result.rows.map (raw) -> raw.doc
      for exp in docs
        id = "expense-" + exp.date + "-" + exp.from + "-" + exp.amount
        if exp.tos and id isnt exp._id
          console.log exp._id
          newdocs.push {_id:exp._id, _rev:exp._rev, _deleted:true}
          exp._id = id
          delete exp._rev
          newdocs.push exp
      @db.bulkDocs(newdocs)



@Utils =
  # Round the amounts to the nearest cent
  amount: (x) -> if x is (x|0) then x else parseFloat(x).toFixed(2)

  # Split one expense that concerns several persons to
  # several expenses (one per person) this function manages the cents,
  # so that the balance is always balanced
  expandExpense: (exp) ->
    exp.tos.reduce(
      (prev, to, i) ->
        part =  -Math.floor(100 * exp.amount/exp.tos.length)/100
        prev.push
          from: exp.from
          to: to
          amount: part - if i<((100*exp.amount)%exp.tos.length) then .01 else 0
        prev
      , [])

document.addEventListener 'DOMContentLoaded', =>
  @app = new @ExpensesApp document.getElementById 'expenses'
  @app.render()

