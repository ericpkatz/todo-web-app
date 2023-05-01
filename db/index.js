const Sequelize = require('sequelize');
const conn = new Sequelize('postgres://localhost/todo_web_app_db');

const Todo = conn.define('todo', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
});

const Category = conn.define('category', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
});

Todo.belongsTo(Category);
Category.hasMany(Todo);

const seedData = async()=> {
  const categories = await Promise.all([
    Category.create({ name: 'pets'}),
    Category.create({ name: 'learning'}),
    Category.create({ name: 'chores'}),
  ]);
  const [pets, learning, chores] = categories;

  await Promise.all([
    Todo.create({ name: 'walk the dog', categoryId: pets.id}),
    Todo.create({ name: 'buy a chew toy', categoryId: pets.id}),
    Todo.create({ name: 'learn react', categoryId: learning.id}),
    Todo.create({ name: 'take out garbage', categoryId: chores.id })
  ]);
};

module.exports = {
  Todo,
  Category,
  conn,
  seedData
};

