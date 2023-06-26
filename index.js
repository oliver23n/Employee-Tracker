const { prompt, default: inquirer } = require('inquirer');

const mysql = require('mysql2');
//connect to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'employees_db'
}, console.log('connected to emplyees_db database'));



function mainMenu() {
    const selection =
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'answer',
        choices: ['View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee',
            'Quit']
    }

    prompt(selection)
        .then((response) => {
            switch (response.answer) {
                case 'View all Departments':
                    viewDept();
                    break;
                case 'View all Roles':
                    //view all roles function
                    viewRoles();
                    break;
                case 'View all Employees':
                    //view all employees function
                    viewEmployees();
                    break;
                case 'Add a department':
                    //add a department function
                    addDepartment();
                    break;
                case 'Add a role':
                    //add a role function
                    addRole();
                    break;
                case 'Add an employee':
                    //add an employee function
                    addEmployee();
                    break;
                case 'Update an employee':
                    //add an employee function
                    updateEmployee();
                    break;
                case 'Quit':
                    //exit
                    console.log('Exited prompt.')
                    break;
            }
        });
}

//show all departments
function viewDept() {
    db.query('SELECT * FROM department', (err, result) => {
        console.table(result);
        mainMenu();
    });
}
//show all roles
function viewRoles() {
    db.query('SELECT role.id, role.title, department.department_name, role.salary FROM role JOIN department ON role.department_id = department.id', (err, result) => {
        console.table(result);
        mainMenu();
    });
}

//add a department
function addDepartment() {
    const add_department = {
        type: 'input',
        message: 'What is the name of the Department?',
        name: 'name'
    }
    prompt(add_department)
        .then((response) => {
            db.query(`INSERT INTO department (department_name) VALUES ('${response.name}');`, (err, result) => {
                console.log('Department added!');
                mainMenu();
            })
        })
}

//add a role
function addRole() {
    let departments = [];
    db.query('SELECT department_name FROM department;', (err, result) => {
        result.forEach(element => {
            departments.push(element.department_name);

        });


        const add_role = [{
            type: 'input',
            message: 'What is the title of the role?',
            name: 'title'
        }, {
            type: 'input',
            message: 'How much is the salary>',
            name: 'salary'
        }, {
            type: 'list',
            message: 'Which department does the role belong to?',
            name: 'department',
            choices: departments
        }];
        prompt(add_role)
            .then((response) => {
                const id = departments.indexOf(response.department) + 1;

                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}',${response.salary},${id});`, (err1, result1) => {
                    console.log('Role added!');
                    mainMenu();
                })
            })

    })
}

//view Employees
function viewEmployees() {
    db.query('SELECT e.id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, \' \', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id; ', (err, result) => {
        console.table(result);
        mainMenu();
    })
}

//add an employee
function addEmployee() {
    //get the roles 
    let roles = [];
    let managers = ['None'];
    db.query('SELECT title FROM role;', (err, result) => {
        result.forEach(element => roles.push(element.title));
        //get the employees and id for manager
        db.query('SELECT first_name,last_name FROM employee', (err2, result2) => {

            result2.forEach(person => {
                managers.push(person.first_name + ' ' + person.last_name);
            })
            const add_employee = [{
                type: 'input',
                message: 'What is the first name of the employee?',
                name: 'firstName'
            }, {
                type: 'input',
                message: 'What is the last name of the employee?',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'What is the role of the employee?',
                name: 'role',
                choices: roles
            },
            {
                type: 'list',
                message: 'Who is the manager of the employee?',
                name: 'manager',
                choices: managers
            }];

            prompt(add_employee)
                .then((response) => {

                    const roleId = roles.indexOf(response.role) + 1;

                    const managerId = response.manager === 'None' ? 'null' : managers.indexOf(response.manager);

                    db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${response.firstName}','${response.lastName}',${roleId},${managerId})`, (err3, result3) => {
                        console.log('Employee added!');
                        mainMenu()})
                })

        })

    })
}

//update employee
function updateEmployee() {

    let currentRole;
    const employees = [];
    const roles = [];
    db.query('SELECT concat(employee.first_name,\' \',employee.last_name) as  name, role.title FROM employee JOIN role ON employee.role_id = role.id', (err, result) => {
        result.forEach(element => {
            employees.push(element.name)
            if (roles.indexOf(element.title) === -1) {
                roles.push(element.title);
            }
        })
        const update_employee = {
            type: "list",
            message: "Which employee you want to update?",
            name: "choice",
            choices: employees
        }
        prompt(update_employee)
            .then((response) => {
                result.forEach(object => {
                    if (object.name === response.choice) {
                        currentRole = object.title;
                    }
                })
                const role_prompt = {
                    type: "list",
                    message: "Which role do you want to assign to the employee?",
                    name: 'roleChoice',
                    choices: roles.filter(role => role !== currentRole)
                }
                prompt(role_prompt)

                    .then((response1) => {
                        db.query('SELECT role.id FROM role WHERE role.title = ?', response1.roleChoice, (err2, result2) => {

                            db.query(`UPDATE employee SET role_id=${result2[0].id} WHERE concat(employee.first_name,\' \',employee.last_name) ="${response.choice}";`, (err3, result3) => {
                                console.log('Employee updated!');
                                mainMenu();
                            })

                        })
                    })
            })
    })

}


mainMenu();