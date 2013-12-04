var argv = require('optimist').argv,
    colors = require('colors'),
    conf = require('./config.json'),
    sync = require('./sync'),
    list = require('./list'),
    view = require('./view');

var mongo_uri = conf.mongo_uri,
    db_name = conf.db_name,
    coll_name = conf.coll_name,
    localdb = process.env['PWD']+'/'+db_name+'.db';

if(argv.sync || argv.s){
  
  sync(mongo_uri,db_name,coll_name)
    .on('end',function(){
      console.log('Sync Done!'.green);
      process.exit();
    })
    .on('empty',function(){
      console.log('Collection is empty.'.red);
      process.exit();
    })
    .on('error',function(err){
      console.log('error');
      process.exit();
    });
  
}
else if(argv.list || argv.l){
  list(localdb);
}
else if(argv.browser || argv.b){
  var key = argv.browser || argv.b;
  view(localdb, key)
    .on('data', function(err,data){
      if(err) console.log('Error: '.red+err);
      
      var json = JSON.stringify(data);
      require('http').createServer(function(req,res){
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
      }).listen(12345);
      
      console.log('Open http://localhost:12345/');
    })
    .on('error',function(err){
      console.log('Error: '.red+err);
    });
}
else if(argv._.length!=0){
  var key = argv._[0];
  view(localdb, key)
    .on('data', function(err,data){
      if(err) console.log('Error: '.red+err);
      console.log(data);
    })
    .on('error',function(err){
      console.log('Error: '.red+err);
    });
}
else{
  console.log('TODO: SHOW HELP');
}
