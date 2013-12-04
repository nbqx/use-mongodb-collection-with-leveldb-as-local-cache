var levelup = require('level'),
    EventEmitter = require('events').EventEmitter;

module.exports = function(db_path,key){
  var event_emitter = new EventEmitter;
  levelup(db_path,{valueEncoding: 'json'},function(err,db){
    if(err) event_emitter.emit('error',err);
    
    db.get(key,function(x_x, val){
      event_emitter.emit('data',x_x,val);
    });
  });

  return event_emitter
};

