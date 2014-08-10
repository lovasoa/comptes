function(doc) {
  var amount = doc.amount,
      part   = amount / doc.tos.length;
  emit([doc.tag, doc.from], -amount);
  doc.tos.forEach(function(to) {
    emit([doc.tag, to], part);
  });
}
