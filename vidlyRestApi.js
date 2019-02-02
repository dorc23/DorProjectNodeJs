
const express = require('express');
const app = express();

const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi'); // validate input
const Logger = require('./logger');
const Authentication = require('./authentication');


//configuration
console.log('Name App : ' + config.get('name'));
console.log('password : ' + config.get('password'));

if(app.get('env')==='development')
    app.use(morgan('tiny'))

//to parsing up json object in the body of the request
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public '));
app.use(Logger);
app.use(Authentication);
app.use(helmet());



const genres = [
    {id:1,name:'Action'},
    {id:2,name:'Comedy'}
    ];

app.get('/api/genres' , (req,res) =>{

    res.send(genres);
});

app.get('/api/genres/:id' , (req,res) =>{

    const genre  = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) // 404 not found
        return res.status(404).send(`Genre with id ${req.params.id} didnt exist!`);
    return res.send(genre);
});

app.post('/api/genres' , (req,res) => {

    const {error} = validate(req.body);
    if(error) // 400 bad request
        return res.status(400).send(error.details[0].message);

    const genre = {
      id : genres.length +1,
      name:req.body.name
    };

    genres.push(genre);
    res.send(genre);

});

app.put('/api/genres/:id',(req,res) => {

    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if(!genre)  // 404 not found
        return res.status(404).send(`Genre with id ${req.params.id} didnt exist!`);

    // object destructuring is if we want just one property from an object
    const {error} = validate(req.body);
    if(error) // 400 bad request
        return res.status(400).send(error.details[0].message);

    genre.name = req.body.name;
    res.send(genre);

});

app.delete('/api/genres/:id',(req,res) => {

    const genre = genres.find((g) => g.id === parseInt(req.params.id));
    if(!genre)  // 404 not found
        return res.status(404).send(`Genre with id ${req.params.id} didnt exist!`);

    const index = genres.indexOf(genre);
    genres.splice(index,1);

    res.send(genre);
});



function validate(genre){

    const schema = {
        name : Joi.string().min(3).required()
    };

    return Joi.validate(genre,schema);
}

const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listening on port ${port}.....`));
