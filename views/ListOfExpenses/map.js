function(doc) {
  emit([doc.tag, doc.date, doc.description], doc);
}