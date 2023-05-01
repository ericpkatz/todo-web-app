const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost/todo_web_app_db');

const Todo = conn.define('todo', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.listen(port, async()=> {
  try{
    console.log(`listening on port ${port}`);
    await conn.sync({ force: true });
    console.log('connected');
    await Todo.create({ name: 'walk the dog'});
    await Todo.create({ name: 'buy a chew toy'});
    await Promise.all([
      Todo.create({ name: 'walk the dog'}),
      Todo.create({ name: 'buy a chew toy'}),
      Todo.create({ name: 'learn react'}),
      Todo.create({ name: 'take out garbage'})
    ]);
    console.log('seeded');
  }
  catch(ex){
    console.log(ex);
  }
});
