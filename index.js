const inquirer = require("inquirer");
const pool = require("./db");

//Start up the Application
function startApp() {
    inquirer
    .createPromptModule([
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
    pool.query("SELECT 8 FROM department", (err, res) => {
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
