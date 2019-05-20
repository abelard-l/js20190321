const COINS_URL = 'https://api.coinpaprika.com/v1/coins';

const getSingleCoinUrl = id => `https://api.coinpaprika.com/v1/coins/${id}/ohlcv/today/`;

const DataService = {

  _httpRequest(url, method = "GET") {
    return new Promise((resolve, reject) => {
        const xml = new XMLHttpRequest();
        xml.open(method, url);
        xml.send();
        xml.onload = function() {
            if (this.status === 200) {
                resolve(this.responseText);
            } else {
                const error = new Error(this.statusText);
                error.code = this.status;
                reject(error);
            }
        }
    });  
  },


  getCurrencies(callback) {
    let currencies = [];

    DataService._httpRequest(COINS_URL).then(
    result => {
        return result;
    }).then(
        result => {
            return JSON.parse(result).slice(0, 10);
        }
    ).then(
        currencies => {
            let currenciesURLs = [];
            currencies.forEach(value => {
                currenciesURLs.push(getSingleCoinUrl(value.id));
            })

            Promise.all(currenciesURLs.map(value => {
                return DataService._httpRequest(value);
            })).then(result => {
               return result.map(value => {
                   return JSON.parse(value);
               });
            }).then( result => {
                result.forEach( (value, index) => {
                    currencies[index].price = value[0].close.toFixed(2);
                })
                callback(currencies);
            });

        }
    ).catch(error => {
        console.log(error);
    })
  },

}

export default DataService;

