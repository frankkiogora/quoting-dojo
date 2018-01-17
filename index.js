var express = require('express');
var app = express();


//=========== view engine set up  ====================
var ejs = require('ejs');
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// ============ Body-parser middleware ==================
var bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended:true}));


//=======   Data base stuff ============================
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/quoting_dojo');
mongoose.Promise = global.Promise;

//=========== schema setup  ==============
var QuoteSchema = new mongoose.Schema({
    name:   {type: String, required: true, minlength: 3},
    quote: { type: String, required: true, maxlength: 20 }
    }, {timestamps: true })
    
    mongoose.model('Quote', QuoteSchema);
    var Quote = mongoose.model('Quote');

//=======   GET methods =================================
app.get('/',function(req,res){
    res.render('index');
});


//quote  GET route
app.get('/quotes', function(req,res){
   Quote.find({},function(err,quotes){
    if(quotes){
        console.log(quotes);
        res.render('quotes',{quotes:quotes });
    }else{
        console.log(err);
        res.render('index',{errors:quotes.errors});
        }
    });
});


//=======  POST method ============

app.post('/quotes', function (req, res){
    console.log('This is the request body :', req.body);

        var quote = new Quote({
            name:req.body.name,
            quote:req.body.quote
        });

        console.log('quotes: ', quote)

        quote.save(function(err){

            if(err){
                console.log('something went wrong :', err);

                res.render('index',{errors:quote.errors})
            }
            else {
                console.log('Success')
                res.redirect('/quotes');
            }
        });
    });
        

//===  Don't disturb, server listening @ port: 4000 =====

app.listen(process.env.port || 4000,function(){
    console.log('<<<<< ++++++  listening in port 4000 +++++>>>')
});
