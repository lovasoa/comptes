D = React.DOM

@UserSelect = React.createClass(
  displayName: "UserSelect"
  attachSelect2: ->
    $(@getDOMNode()).select2(
      tags: @props.userNames
      tokenSeparators: [","]
      maximumSelectionSize: (if @props.multiple then -1 else 1)
      formatNoMatches: ""
      width: "100%"
      sortResults: (results, container, query) ->
        if results.length > 0 and results[0].text is query.term
            results.push results.shift()
        results
    )
      .select2 "val",@props.value
      .on "change", @change

  componentDidMount: ->
    @attachSelect2()
    return

  componentWillUnmount: ->
    $(@getDOMNode()).off "change", @change
    return

  componentDidUpdate: ->
    @attachSelect2()
    return

  shouldComponentUpdate: (nextProps, nextState) ->
    return true unless @isMounted()
    val = $(@getDOMNode()).select2("val")
    if val? and val.length is nextProps.value.length and
       nextProps.value.every((prop,i) -> prop is val[i]) and
       nextProps.userNames.every((prop,i) => prop is @props.userNames[i])
          return false
    true
    
  change: ({val}) ->
    @props.onChange(if @props.multiple then val else val[0])
    return

  render: ->
    D.input
      type: "hidden"
      placeholder: @props.placeholder
      defaultValue: (if @props.multiple then @props.userNames.join(", ") else "")
)
