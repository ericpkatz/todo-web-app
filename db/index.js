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

module.exports = {
  Todo,
  Category,
  conn
};

