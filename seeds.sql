\c company_db;

INSERT INTO department (name) VALUES
('Engineering'),
('Finance'),
('Human Resources'),
('Marketing');

INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 85000, 1),
('Senior Software Engineer', 120000, 1),
('Accountant', 75000, 2),
('HR Manager', 90000, 3),
('Marketing Specialist', 65000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Lebron', 'James', 1, NULL),
('Stephen', 'Curry', 2, 1),
('Kevin', 'Durant', 3, NULL),
('Paul', 'George', 4, NULL),
('Derrick', 'Rose', 5, 2);