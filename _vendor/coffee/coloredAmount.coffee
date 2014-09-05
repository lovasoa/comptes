D = React.DOM

@ColoredAmount = React.createClass
  displayName: "ColoredAmount"

  getDefaultProps: ->
    tagName: 'span'
    stops:  [     20,         50,       100,     200,    Infinity]
    labels: ["info", "success", "warning", "danger", "highdanger"]

  render: ->
    for stop,i in @props.stops
      label = @props.labels[i]
      break if @props.amount < stop

    D[@props.tagName](className: "coloredAmount label label-#{label}",
                      Utils.amount @props.amount)
