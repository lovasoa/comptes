(function(){

var debts = {
  totalize: function totalize (debts) {
    return debts.reduce(function(memo, cur) {
      memo[cur.from] = (memo[cur.from]||0) - cur.amount;
      memo[cur.to  ] = (memo[cur.to  ]||0) + cur.amount;
      return memo;
    }, {});
  },

  simplify: function simplify (debts) {
      var total = this.totalize(debts);
      var people = [];
      for (var person in total) {
        if (total.hasOwnProperty(person)) {
          people.push({name: person, amount: total[person]});
        }
      }
      people.sort(function(a,b){return a.amount - b.amount});
      
      var finalDebts = [],
          begin = 0,
          end   = people.length - 1;
      while (begin < end) {
        var from = people[begin], to = people[end];
        var amount;
        if (to.amount >= -from.amount) {
          begin++;
          if (to.amount === from.amount) end--;
          amount = -from.amount;
          to.amount  -= amount;
        } else if (to.amount < -from.amount) {
          end--;
          amount = to.amount;
          from.amount += amount;
        }
        if (from.name != to.name && amount !== 0) {
          finalDebts.push({
            from  : from.name,
            to    : to.name,
            amount: amount
          });
        }
      }
      return finalDebts;
  }
}

if (typeof window !== "undefined") window.debts = debts;
if (typeof module !== "undefined") module.exports = debts;
})();
