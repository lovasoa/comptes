HOST = ''

boot = ->
  mountNode = document.getElementById 'expenses'
  $.couch.urlprefix = HOST
  app = ExpensesApp {db: $.couch.db 'comptes'}

  React.renderComponent app, mountNode

document.addEventListener 'DOMContentLoaded', boot
