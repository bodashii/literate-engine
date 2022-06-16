INSERT INTO departments (name)
VALUES
('Sales'), ('Service'), ('Parts'), ('Admin');

INSERT INTO roles (title, salary, department_id)
VALUES
('cashier', 35000.00, 4),
('car sales', 70000.00, 1),
('car sales manager', 160000.00, 1),
('finance', 80000.00, 1),
('finance manager', 130000.00, 1),
('express service advisor', 40000.00, 2),
('service advisor', 65000.00, 2),
('service manager', 110000.00, 2),
('lube technician', 35000.00, 2),
('mainline technician', 60000.00, 2),
('master technician', 90000.00, 2),
('parts counter', 38000.00, 3),
('parts manager', 70000.00, 3),
('accountant', 60000.00, 4),
('hr representative', 65000.00, 4),
('maintenance', 40000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Mickey', 'Duck', 14, Null),
('Donald', 'Mouse', 13, Null),
('Elmer', 'Goof', 8, Null),
('Goofy', 'Fudge', 3, Null),
('Kevin', 'MasterChief', 12, 2),
('Loofy', 'Pirate', 2, 3),
('Orlando', 'Zorro', 2, 3),
('Minnie', 'Rojas', 1, 1),
('Reacher', 'Jack', 6, 4),
('Bundy', 'Ted', 7, 4),
('Gavin', 'Dancer', 9, 4),
('Brandon', 'Flower', 10, 4),
('Always', 'Genius', 11, 4),
('Jose', 'Taters', 11, 4),
('Pate', 'Gonzalez', 10, 4),
('Justin', 'Carter', 9, 4);