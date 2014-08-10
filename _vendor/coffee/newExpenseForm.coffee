D = React.DOM

@NewExpenseForm = React.createClass
  displayName: "NewExpenseForm"
  handleSubmit: (evt) ->
    evt.preventDefault()
    doc =
      description: @val("description").trim()
      from: @from.trim()
      tos: @to
      amount: Math.round(parseFloat(@val("amount")) * 100) / 100
      date: new Date().toISOString()

    return  if not doc.description or not doc.from or not doc.tos.length
    @props.addExpense doc
    @refs.form.getDOMNode().reset()
    @refs.description.getDOMNode().focus()

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
        D.input(
          className: "form-control"
          placeholder: "Description"
          ref: "description"
          required: true)

        UserSelect(
          onChange: @setFunc("from")
          userNames: @props.userNames
          multiple: false
          placeholder: "Who paid?"),

        UserSelect(
          onChange: @setFunc("to")
          userNames: @props.userNames
          multiple: true
          placeholder: "For who?"),

        D.input(
          className: "form-control"
          type: "number"
          placeholder: "How much money?"
          ref: "amount"
          required: true
          min: 0
          step: 0.01),

        D.button({className: "btn btn-primary"}, "Add")


