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

Magic.prototype.mainMenu = async function () {
  console.clear();
  console.log(`Literate engine is up and running!`);

  const prompt = await inquirer.prompt([
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
