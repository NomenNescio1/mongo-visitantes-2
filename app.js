const express = require('express');
const mongoc = require('mongoose');

const app = express();

var schema = mongoc.Schema({
    count: {type: Number, default: 1},
    name: {type:String, default: 'Anónimo'}
    //published: {type: Boolean, default: false}
});
var Visitor = mongoc.model('Visitor', schema);

/*var first = new Visitor({title: 'Articulo 1', body: 'cuerpo del articulo'});
first.save((err)=>{if(err)return console.log(err)}) */

mongoc.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-4', {useNewUrlParser:true,  useUnifiedTopology: true });

mongoc.connection.on('error', (e)=>{console.error(e)});


app.get('/', (req, res) => {
    var $table = "<table><thead><tr><td>id</td><td>name</td><td>count</td></tr></thead>";

    Visitor.findOneAndUpdate({name:req.query.name}, {$inc : {count : 1}}, {useFindAndModify : false},(err, docs)=>{
        if(!docs){
            //lo crea si no lo encuentra
            Visitor.create({name: req.query.name}, (err, element)=>{
                Visitor.find({}, (err, elem)=>{
                    //res.send(elem);
                    elem.forEach(element => {
                        $table += "<tr><td>"+element._id+"</td>";
                        $table += "<td>"+element.name+"</td>";
                        $table += "<td>"+element.count+"</td></tr>";
                    });
                    res.send($table+"</table>");

                });
            });
            
        }
        else{
            //le suma 1
            Visitor.find({}, (err, elem)=>{
                //console.log(elem);
                //res.send(elem);
                elem.forEach(element => {
                    $table += "<tr><td>"+element._id+"</td>";
                    $table += "<td>"+element.name+"</td>";
                    $table += "<td>"+element.count+"</td></tr>";
                });          
                res.send($table+"</table>");

            });
           
        }
    
    }) 
     
    // executes
    
    /*Visitor.findOne({name: req.query.name}, function (err, documents) {
        console.log(documents);
        res.send(documents);
        
        if(documents){
            documents.count = documents.count + 1;
            documents.save(function(err) {
                if (err) return console.error(err);
                res.send('bbb');

              });
        }
        else{
            Visitor.create({name: req.query.name}, ()=>{
                res.send('aaaaa');
            });
        }
    });   */
});


app.listen(3000, () => console.log('Listening on port 3000!'));

/* Visitor.count({}, function(err, count){
                console.log( "Number of docs: ", count );

            for(var i=0; i <= count; i++){
                $table += `<table><tr><td>id</td><td>name</td><td>count</td></tr>`;
                $table += `<tr><td>${el[i]._id}</td>`;
                $table += `<td>${el[i].name}</td>`;
                $table += `<td>${el[i].count}</td></tr></table>`;
            }
            res.send($table);

            });           
            */