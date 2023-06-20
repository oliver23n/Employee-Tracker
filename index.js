
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database 

const { prompt } = require('inquirer');
const { default: Choice } = require('inquirer/lib/objects/choice');

const mysql = require('mysql2');
//connect to database
const db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '1234',
    database: 'employees_db'
}, console.log('connected to emplyees_db database'));

// db.query('SELECT * FROM employee' ,(err,res) => {
//     console.table(res);
// });

//give prompt selection
//get the result from prompt, based on that, do what to do with the data.




function mainMenu() {
    const selection = 
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'answer',
            choices:['View all Departments',
        'View all Roles',
        'View all Employees',
        'Add a department',
        'Add a role',
        'Add an employee']
        }
    
        prompt(selection)
        .then((response) =>{
        switch(response.answer){
            case 'View all Departments':
                viewDept();
                break;
            case 'View all Roles':
                //view all roles function
                break;
            case 'Add a department':
                //add a department function
                break;
            case 'Add a role':
                //add a role function
                break;
            case 'Add an employee':
                //add an employee function
                break;
                }
         });
}

//show all departments
function viewDept (){
    db.query('SELECT * FROM department', (err,result) =>{
                    console.table(result);
                    mainMenu();
                    });
}



mainMenu();