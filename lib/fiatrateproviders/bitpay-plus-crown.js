var _ = require('lodash');

var provider = {
  name: 'BitPayPlus',
  url: ['https://bitpay.com/api/rates/', 'https://api.coinmarketcap.com/v1/ticker/crown/'],
  parseFn: function(raw) {
    var rates = _.compact(_.map(raw[0], function(d) {
      if (!d.code || !d.rate) return null;
      return {
        code: d.code,
        value: d.rate,
      };
    }));

    // Theoretically Bitpay's API may return "CRW". In this case we replace it with ours
    // rather than throw error.
    var crwRate = rates.find(m => m.code === 'CRW');

    if (crwRate === undefined) {
      crwRate = {code: 'CRW'};
      rates.push(crwRate);
    }
    crwRate.value = parseFloat(raw[1][0].price_btc);
    return rates;
  },
};

module.exports = provider;
