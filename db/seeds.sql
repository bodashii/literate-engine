INSERT INTO departments (name)
VALUES
('Sales'), ('Service'), ('Parts'), ('Admin');

INSERT INTO roles (title, salary, department_id)
VALUES
('cashier', 35000.00, 4),
('car sales', 70000.00, 1),
('car sales manager', 110000.00, 1),
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