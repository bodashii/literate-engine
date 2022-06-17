const inquirer = require("inquirer");
const db = require("../db/connection");

class Magic {
  constructor() {
    this.departments = [];
    this.roles = [];
    this.employees = [];
  }
}

Magic.prototype.seedDatabase = async function () {
  const getDepartments = await db
    .promise()
    .query(`SELECT * FROM  departments`)
    .then((results) => {
      this.departments = results[0];
    });

  const getRoles = await db
    .promise()
    .query(`SELECT * FROM  roles`)
    .then((results) => {
      this.roles = results[0];
    });

  const getEmployees = await db
    .promise()
    .query(`SELECT * FROM employees`)
    .then((results) => {
      this.employees = results[0];
    });
};

Magic.prototype.options = function (table) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: ["Main Menu", "Exit"],
      },
    ])
    .then((menu) => {
      console.clear();
      if (menu.choice === "Main Menu") {
        this.mainMenu();
      }
      if (menu.choice === "Exit") {
        this.exitProg();
      }
    });
};

Magic.prototype.exitProg = function () {
  console.log("Engine stopped, Goodbye!");
  process.exit();
};

// departments CRUD

// GET select all departments
Magic.prototype.selectDepartments = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

// roles CRUD

// GET select all roles
Magic.prototype.selectRoles = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(
      `SELECT roles.*, departments.name
                AS department
                FROM roles
                LEFT JOIN departments
                ON roles.department_id = departments.id`
    )
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

// employees CRUD

// GET select all employees
Magic.prototype.selectEmployees = async function () {
  console.clear();
  const getTable = await db
    .promise()
    .query(
      `SELECT employee.id, employee.first_name, employee.last_name, roles.title
                AS position, departments.name
                AS department, roles.salary
                AS salary,
                CONCAT(manager.first_name, ' ', manager.last_name)
                AS manager FROM employees employee
                INNER JOIN roles on employee.role_id = roles.id
                INNER JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees manager ON manager.id = employee.manager_id
                ORDER BY id`
    )
    .then(([rows, fields]) => {
      console.table(rows);
    });
};

Magic.prototype.mainMenu = async function () {
  console.clear();
  console.log(`Literate engine is up and running!`);

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "choice",
        message: "What would you like to do?",
        choices: [
          "Show all departments",
          "Show all roles",
          "Show all employees",
          "Exit",
        ],
      },
    ])
    .then((menu) => {
      if (menu.choice === "Show all departments") {
        this.selectDepartments().then(() => {
          this.options("department");
        });
      } else if (menu.choice === "Show all roles") {
        this.selectRoles().then(() => {
          this.options("role");
        });
      } else if (menu.choice === "Show all employees") {
        this.selectEmployees().then(() => {
          this.options("employee");
        });
      } else if (menu.choice === "Exit") {
        this.exitProg();
      }
    });
};

module.exports = Magic;
