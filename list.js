var levelup = require('level');

module.exports = function(db){
  var db = levelup(db, {valueEncoding:'json'});
  db.createReadStream({keys: true, values: false}).on('data',function(k){
    console.log(k);
  }).on('error',function(err){
    console.log(err);
  });
};
