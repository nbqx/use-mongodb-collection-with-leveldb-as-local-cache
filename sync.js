var colors = require('colors'),
    Mongolian = require('mongolian'),
    levelup = require('level'),
    EventEmitter = require('events').EventEmitter;

module.exports = function(db_path, db_name, coll_name){
  var event_emitter = new EventEmitter;
  
  var mongo = new Mongolian(db_path);
  mongo.log = {
    debug: function(){},
    info: function(){},
    warn: function(){},
    error: function(){}
  };
  var db = mongo.db(db_name);
  
  var coll = db.collection(coll_name);
  coll.find().toArray(function(err,a){
    if(err) return event_emitter.emit(err);

    if(a.length!=0){

      var leveldb = levelup(process.env['PWD']+'/'+db_name+'.db', {valueEncoding: 'json'},function(){
        a.forEach(function(itm){
          var _id = itm._id.toString();
          var _data = itm;
          _data._id = _id;
          var json = JSON.stringify(_data);

          leveldb.put(_id, json,function(x_x){
            if(x_x) event_emitter.emit('error',x_x);
          });
        
        });
        
        event_emitter.emit('end');
      });
    }else{
      event_emitter.emit('empty');
    }
  });

  return event_emitter
};
