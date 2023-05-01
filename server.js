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
app.use(express.urlencoded());

app.get('/', (req, res)=> res.redirect('/todos'));

app.get('/todos', async(req, res, next)=> {
  try {
    const todos = await Todo.findAll();
    res.send(`
      <html>
        <head>
          <title>Todos</title>
        </head>
        <body>
          <h1>Todos</h1>
          <a href='/todos/create'>Create A todo</a>
          <ul>
            ${
              todos.map( todo => {
                return `
                  <li>
                    <a href='/todos/${todo.id}'>
                      ${todo.name}
                    </a>
                  </li>
                `;
              }).join('')
            }
          </ul>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

//next route here
app.get('/todos/create', async(req, res, next)=> {
  try {
    res.send(`
      <html>
        <head>
          <title>Todos</title>
        </head>
        <body>
          <h1><a href='/todos'>Todos</a></h1>
          <form method='POST' action='/todos'>
            <input name='name'/>
            <button>Create</button>
          </form>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

app.get('/todos/:id', async(req, res, next)=> {
  try {
    const todo = await Todo.findByPk(req.params.id);
    res.send(`
      <html>
        <head>
          <title>Todos</title>
        </head>
        <body>
          <h1><a href='/todos'>Todos</a></h1>
          <h2>${ todo.name }</h2>
        </body>
      </html>
    `);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/todos', async(req, res, next)=> {
  try {
    const todo = await Todo.create(req.body);
    res.redirect(`/todos/${todo.id}`);

  }
  catch(ex){
    next(ex);
  }
});



app.use((err, req, res, next)=> {
  console.log(err);
  res.status(500).send(err);
});

const port = process.env.PORT || 3000;

app.listen(port, async()=> {
  try{
    console.log(`listening on port ${port}`);
    await conn.sync({ force: true });
    console.log('connected');
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
