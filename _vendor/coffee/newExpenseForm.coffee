D = React.DOM

@NewExpenseForm = React.createClass
  displayName: "NewExpenseForm"

  getInitialState: ->
    from: ""
    tos: []
    amount: ""

  handleSubmit: (evt) ->
    evt.preventDefault()
    try
      amount = @computeAmount()
    catch
      return false
    doc =
      description: @val("description").trim()
      from: @from.trim()
      tos: @to
      amount: amount
      date: new Date().toISOString()

    return  if not doc.description or not doc.from or not doc.tos.length
    @props.addExpense doc
    @to = @from = undefined
    @setState @getInitialState()
    @refs.form.getDOMNode().reset()
    @refs.description.getDOMNode().focus()

  # Always use it inside a try..catch: @state.amount is not necessarily valid
  computeAmount: ->
    Math.round(100 * calculator.parse @state.amount) / 100

  handleAmountChange: (e) -> @setState amount:e.target.value

  val: (name) ->
    if (name of @refs) then @refs[name].getDOMNode().value else ""

  setFunc: (name) ->
    (val) =>
      this[name] = val

  render: render = ->
    D.article className:"panel panel-default",

      D.div(className:"panel-heading",
        D.h2 className: "panel-title",
              "Add a new expense"),
      D.form
        onSubmit: @handleSubmit
        ref: "form"
        role: "form"
        ,
        D.label(
          htmlFor: "expense-form-description"
          className: "control-label"
          "Description"
        ),
        D.input(
          id: "expense-form-description"
          className: "form-control"
          placeholder: "What was bought?"
          ref: "description"
          required: true),

        D.label(
          htmlFor: "expense-form-from"
          className: "control-label"
          "Person who made the expense"
        ),

        UserSelect(
          id: "expenses-form-from"
          onChange: @setFunc("from")
          userNames: @props.userNames
          value: if @from? then [@from] else []
          multiple: false
          placeholder: "Who paid?"),

        D.label(
          htmlFor: "expense-form-for"
          className: "control-label"
          "Persons concerned by the expense"
        )

        UserSelect(
          onChange: @setFunc("to")
          userNames: @props.userNames
          value: @to or []
          multiple: true
          placeholder: "For who?"),

        D.label(
          htmlFor: "expense-form-amount"
          className: "control-label"
          "Amount of the expense (can be a simple formula, e.g. '13+5%')"
        )

        D.input(
          id:"expense-form-amount"
          className: "form-control"
          type: "tel"
          pattern: "[0-9\\-][0-9+\\-*/%]*"
          title: "The amount that was spent, as a number, or a formula"
          onChange: @handleAmountChange
          placeholder: "How much money?"
          ref: "amount"
          required: true
          min: 0
          step: 0.01)

        D.div(
          className:"control-label calculator-result"
          if @state.amount.trim() in ["", String parseFloat @state.amount]
            ""
          else
            try
              " = " + Utils.amount @computeAmount()
            catch e
              D.span className:"invalid", "Invalid number"
        )

        D.button className: "btn btn-primary",
          D.span(className:"fa fa-plus"),
          "Add this expense"
