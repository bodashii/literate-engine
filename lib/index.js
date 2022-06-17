const inquirer = require("inquirer");
const { promise } = require("../db/connection");
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
      if (menu.choice === `Add ${table}`) {
        if (table === "employee") {
          this.addEmployee();
        }
      }
      if (menu.choice === "Exit") {
        this.exitProg();
      }
    });
};

Magic.prototype.showDepartmentEmployees = async function () {
  const departments = this.departments.map((department) => {
    return department.name;
  });

  const deptIds = this.departments.map((department) => {
    return department.id;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose department",
        choices: departments,
      },
    ])
    .then(async (response) => {
      console.clear();
      const prompt = await db
        .promise()
        .query(
          `SELECT 
            employee.id, employee.first_name, employee.last_name,
            roles.title
            AS position, departments.name
            AS department, roles.salary
            AS salary, CONCAT(
            manager.first_name, ' ', manager.last_name)
            AS manager
            FROM employees employee
            INNER JOIN roles
            ON employee.role_id = roles.id
            INNER JOIN departments
            ON roles.department_id = departments.id
            LEFT JOIN employees manager ON manager.id = employee.manager_id
            WHERE roles.department_id = ${
            deptIds[departments.indexOf(response.department)]
            }
            ORDER BY id`
        )
        .then(([rows, fields]) => {
          console.table(rows);
        })
        .catch((err) => console.log(err));
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

// POST create department
Magic.prototype.addDepartment = async function () {
  const departments = this.departments.map((department) => {
    return department.name;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "Enter department name.",
        validate: function (input) {
          if (departments.includes(input)) {
            console.log("Department already exists.");
            return false;
          }
          return true;
        },
      },
    ])
    .then((data) => {
      db.query(`INSERT INTO departments (name)
                        VALUE
                        ('${data.department}')`);
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const note = `${data.department} added to database.`;
      this.mainMenu(note);
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

// POST create role
Magic.prototype.addRole = async function () {
  const departments = this.departments.map((department) => {
    return department.name;
  });
  const departmentId = this.departments.map((department) => {
    return department.id;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "role",
        message: "Enter name of role:",
      },
      {
        type: "number",
        name: "salary",
        message: "Enter salary for role:",
      },
      {
        type: "list",
        name: "department",
        message: "Which department has this role?",
        choices: departments,
      },
    ])
    .then(async (data) => {
      await db.promise().query(`INSERT INTO roles (title, salary, department_id)
                      VALUE
                      ('${data.role}',
                       '${data.salary}', 
                       '${
                         departmentId[departments.indexOf(data.department)]
                       }')`);
      return data;
    })
    .then((data) => {
      this.seedDatabase();
      const note = `${data.role} added to database.`;
      this.mainMenu(note);
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

// POST add employee
Magic.prototype.addEmployee = async function () {
  const roleTitles = this.roles.map((role) => {
    return role.title;
  });

  const roleIds = this.roles.map((role) => {
    return role.id;
  });

  const managers = this.employees.map((employee) => {
    return `${employee.first_name} ${employee.last_name}`;
  });

  const managerIds = this.employees.map((employee) => {
    return employee.id;
  });

  const prompt = await inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Please enter first name.",
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter last name.",
      },
      {
        type: "list",
        name: "role",
        message: "Please provide the employees position/role.",
        choices: roleTitles,
      },
      {
        type: "list",
        name: "manager",
        message: "Please provide the employee's manager.",
        choices: managers,
      },
    ])
    .then(async (data) => {
      await db.promise()
        .query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                      VALUE
                      ('${data.firstName}',
                        '${data.lastName}',
                        '${roleIds[roleTitles.indexOf(data.role)]}',
                        '${managerIds[managers.indexOf(data.manager)]}')`);
      return data;
    })
    .then(async (data) => {
      this.seedDatabase();
      const note = `${data.firstName} ${data.lastName} added to database.`;
      this.mainMenu(note);
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
          "Add Department",
          "Add Role",
          "Add Employee",
          "Show employees by Department",
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
      } else if (menu.choice === "Add Department") {
        this.addDepartment();
      } else if (menu.choice === "Add Role") {
        this.addRole();
      } else if (menu.choice === "Add Employee") {
        this.addEmployee();
      } else if (menu.choice === "Show employees by Department") {
        this.showDepartmentEmployees().then(() => {
          this.options("employee");
        });
      } else if (menu.choice === "Exit") {
        this.exitProg();
      }
    });
};

module.exports = Magic;
