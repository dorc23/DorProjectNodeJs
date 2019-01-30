

const express = require( 'express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const courses = [
    {id:1,name: 'c1'},
    {id:2,name: 'c2'},
    {id:3,name: 'c3'}
];

app.get('/',(req,res)=>{

    res.send('Hello World');
});

app.get('/api/courses',(req,res)=>{

    res.send(courses);
});

app.get('/api/courses/:id',(req,res)=>{

  let course = courses.find(c => c.id === parseInt(req.params.id));

  if(!course)
      return res.status(404).send(`There is no course with id ${req.params.id}`);

      return res.send(course);
});

app.post('/api/courses/',(req,res)=>{

    const {error} = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    const course = {
        id : courses.length +1 ,
        name : req.body.name
    };
    courses.push(course);
    res.send(course);
});


app.put('/api/courses/:id',(req,res)=>{
    //check if the course exist
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)
        return res.status(404).send(`There is no course with id ${req.params.id}`);

    // check if the update that send the client is validate.
    const {error} = validate(req.body);

    if(error)
        return res.status(400).send(error.details[0].message);

    //update the course and sent the update to client
    course.name = req.body.name;
    res.send(course);
});



app.delete('/api/courses/:id' , (req,res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course)
        return res.status(404).send(`There is no course with id ${req.params.id}`);

    const index = courses.indexOf(course);
    delete courses[index];
    res.send(course);

});

const port  = process.env.PORT || 3000;
app.listen(port,() => console.log(`Listening on port ${port}.....`));


function validate(course){

    const schema = {
        name: Joi.string().min(3).required()
    }
    return Joi.validate(course,schema);
}
