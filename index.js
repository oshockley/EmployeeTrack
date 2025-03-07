const inquirer = require("inquirer");
const pool = require("./db");

//Start up the Application
function startApp() {
    inquirer
    .prompt([
        {
            type: "list",
            name: "action",
            message: "What do you want to select?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department of choice",
                "Add a role of choice",
                "Add an emplyee of choice",
                "Update role of employee",
                "Exit",

            ],
        },
    ])
    .then((answer) => {
        switch (answer.action) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Exit":
                pool.end();
                console.log("Goodbye!");
                break;
        }
    });
}

//Fucntion for access all departments
function viewDepartments() {
    pool.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

//Function to access all roles
function addRole() {
    pool.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;

        const departmentChoices = res.rows.map((dept) => ({
            name: dept.name,
            value: dept.id,
        }));

        inquirer
            .prompt([
                { type: "input", name: "title", message: "Enter the role title:" },
                { type: "input", name: "salary", message: "Enter the salary:" },
                {
                    type: "list",
                    name: "department_id",
                    message: "Select the department:",
                    choices: departmentChoices,
                },
            ])
            .then((answer) => {
                pool.query(
                    "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
                    [answer.title, answer.salary, answer.department_id],
                    (err) => {
                        if (err) throw err;
                        console.log("Role added successfully!");
                        startApp();
                    }
                );
            });
    });
}

// Function to update employees' roles
function viewDepartments() {
    pool.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

//Function to examine all roles
function viewRoles() {
    const query = `
    SELECT role.id, role.title, department.name AS department, role.salary
    FROM role
    JOIN department ON role.department_id = department.id;
    `;
    pool.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

// Function to examine all employees
function viewEmployees() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary,
    COALESCE(m.first_name || ' ' || m.last_name, 'None') AS manager
    FROM employee e
    JOIN role ON e.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    pool.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        startApp();
    });
}

// Fucntion to add selected department
function addDepartment() {
    inquirer
    .prompt([
        {
            type: "input",
            name: "deptName",
            message: "Enter the department name:",
        },
    ])
    .then((answer) => {
        pool.query("INSERT INTO department (name) VALUES ($1)", [answer.deptName], (err) => {
            if(err) throw err;
            console.log("Department has been added!");
            startApp();
        });
    });
}

// Function to add role
function addRole() {
    pool.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;

        const departmentChoices = res.rows.map((dept) => ({
            name: dept.name,
            value: dept.id,
        }));

        inquirer
            .prompt([
                { type: "input", name: "title", message: "Enter title of role:"},
                { type: "input", name: "salary", message: "Enter salary:"},
                {
                    type: "list",
                    name: "department_id",
                    message: "Select the deparmtent:",
                    choices: departmentChoices,
                
            },
        ])
        .then((answer) => {
            pool.query(
                "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
                [answer.title, answer.salary, answer.department_id],
                (err) => {
                    if (err) throw err;
                    console.log("Role has been added!");
                    startApp();
                }
            );
        });
    });
}

// Function to add employee
function addEmployee() {
    pool.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;

        const roleChoices = res.rows.map((role) => ({
            name: role.title,
            value: role.id,
        }));

        pool.query("SELECT * FROM employee", (err, employees) => {
            if (err) throw err;

            const managerChoices = employees.rows.map((emp) => ({
                name: `${emp.first_name} ${emp.last_name}`,
                value: emp.id,
            }));
            managerChoices.unshift({ name: "None", value: null }); // Allow no manager

            inquirer
                .prompt([
                    { type: "input", name: "first_name", message: "Enter employee's first name:" },
                    { type: "input", name: "last_name", message: "Enter employee's last name:" },
                    { type: "list", name: "role_id", message: "Select role:", choices: roleChoices },
                    { type: "list", name: "manager_id", message: "Select manager (or None):", choices: managerChoices },
                ])
                .then((answer) => {
                    // Convert empty manager input to NULL
                    const manager_id = answer.manager_id ? answer.manager_id : null;

                    pool.query(
                        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
                        [answer.first_name, answer.last_name, answer.role_id, manager_id],
                        (err) => {
                            if (err) throw err;
                            console.log("Employee has been added!");
                            startApp();
                        }
                    );
                });
        });
    });
}

// Update Employee Role
function updateEmployeeRole() {
    inquirer
        .prompt([
            { type: "input", name: "employee_id", message: "To update, enter employee ID:" },
            { type: "input", name: "new_role_id", message: "Enter new role ID:" },
        ])
        .then((answer) => {
            pool.query(
                "UPDATE employee SET role_id = $1 WHERE id = $2",
                [answer.new_role_id, answer.employee_id],
                (err) => {
                    if (err) throw err;
                    console.log("Employee Role Update Successful!");
                    startApp();
                }
            );
        });
}

// Start EmployeeTrack
startApp();
