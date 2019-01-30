
const express = require('express');
const app = express();
const Joi = require('joi');

//to parsing up json object in the body of the request
app.use(express.json());

const genres = [
    {id:1,name:'Action'},
    {id:2,name:'Comedy'}
    ];

app.get('/api/genres' , (req,res) =>{

    res.send(genres);
});

app.get('/api/genres/:id' , (req,res) =>{

    const genre  = genres.find(c => c.id === parseInt(req.params.id));
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



function validate(genre){

    const schema = {
        name : Joi.string().min(3).required()
    };

    return Joi.validate(genre,schema);
}

const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listening on port ${port}.....`));
