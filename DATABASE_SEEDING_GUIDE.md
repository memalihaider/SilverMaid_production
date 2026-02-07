# Database Seeding & Test Data Guide

## Overview
Complete guide for populating the Silver Maid Admin Portal database with realistic test data.

## Pre-Seeding Checklist
- [ ] Database created (silvermaid_erp)
- [ ] All 73 tables created
- [ ] Foreign key constraints enabled
- [ ] Indexes created

## Phase 1: Core Administration Data

### 1.1 Create Roles
```sql
INSERT INTO roles (id, name, description, level, status, users_count, created_date, color) VALUES
('ROLE001', 'Super Admin', 'Full system access and administration', 'super', 'Active', 1, '2026-01-15', '#FF0000'),
('ROLE002', 'Admin', 'Admin portal and user management', 'admin', 'Active', 2, '2026-01-15', '#FF6600'),
('ROLE003', 'Manager', 'Team and project management', 'manager', 'Active', 3, '2026-01-15', '#0066FF'),
('ROLE004', 'Supervisor', 'Direct team supervision', 'supervisor', 'Active', 2, '2026-01-15', '#00CC00'),
('ROLE005', 'User', 'Basic user access', 'user', 'Active', 15, '2026-01-15', '#9900FF'),
('ROLE006', 'Guest', 'Limited viewing access', 'guest', 'Active', 5, '2026-01-15', '#999999');
```

### 1.2 Create Permissions (18 Total)
```sql
INSERT INTO permissions (id, name, category, description, module) VALUES
('PERM001', 'manage_users', 'User Management', 'Create, update, delete users', 'Admin'),
('PERM002', 'manage_roles', 'Role Management', 'Create, update, delete roles', 'Admin'),
('PERM003', 'manage_permissions', 'Permission Management', 'Assign permissions to roles', 'Admin'),
('PERM004', 'view_audit', 'Audit', 'View audit logs', 'Admin'),
('PERM005', 'delete_content', 'Content', 'Delete any content', 'Content'),
('PERM006', 'edit_settings', 'System', 'Edit system settings', 'System'),
('PERM007', 'manage_system', 'System', 'Full system management', 'System'),
('PERM008', 'manage_departments', 'HR', 'Manage departments', 'HR'),
('PERM009', 'manage_team', 'Team', 'Manage team members', 'Team'),
('PERM010', 'view_reports', 'Reports', 'View all reports', 'Reports'),
('PERM011', 'create_projects', 'Projects', 'Create new projects', 'Projects'),
('PERM012', 'manage_tasks', 'Tasks', 'Manage project tasks', 'Projects'),
('PERM013', 'view_team_reports', 'Reports', 'View team reports', 'Reports'),
('PERM014', 'approve_requests', 'Approvals', 'Approve user requests', 'Approvals'),
('PERM015', 'view_own_data', 'Personal', 'View own data only', 'Personal'),
('PERM016', 'submit_requests', 'Requests', 'Submit requests', 'Requests'),
('PERM017', 'manage_profile', 'Profile', 'Manage own profile', 'Profile'),
('PERM018', 'view_announcements', 'Announcements', 'View announcements', 'Announcements');
```

### 1.3 Assign Role Permissions
```sql
-- Super Admin: All permissions
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT CONCAT('RP_', UUID()), 'ROLE001', id FROM permissions;

-- Admin: All except manage_system
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT CONCAT('RP_', UUID()), 'ROLE002', id FROM permissions 
WHERE name != 'manage_system';

-- Manager: Team and project management
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT CONCAT('RP_', UUID()), 'ROLE003', id FROM permissions 
WHERE name IN ('manage_team', 'create_projects', 'manage_tasks', 'view_reports', 'view_team_reports');

-- Supervisor: Direct supervision
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT CONCAT('RP_', UUID()), 'ROLE004', id FROM permissions 
WHERE name IN ('manage_team', 'view_team_reports', 'approve_requests', 'manage_tasks');

-- User: Basic access
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT CONCAT('RP_', UUID()), 'ROLE005', id FROM permissions 
WHERE name IN ('view_own_data', 'submit_requests', 'manage_profile', 'view_announcements');

-- Guest: View only
INSERT INTO role_permissions (id, role_id, permission_id)
SELECT CONCAT('RP_', UUID()), 'ROLE006', id FROM permissions 
WHERE name IN ('view_announcements', 'view_own_data');
```

### 1.4 Create System Users
```sql
INSERT INTO users (id, name, email, phone, role_id, role_name, status, department, join_date, last_login) VALUES
('USR001', 'Ahmed Al-Mazrouei', 'ahmed.mazrouei@silvermaid.com', '+971501234567', 'ROLE001', 'Super Admin', 'Active', 'Executive', '2026-01-01', NOW()),
('USR002', 'Fatima Al-Ketbi', 'fatima.ketbi@silvermaid.com', '+971501234568', 'ROLE002', 'Admin', 'Active', 'Administration', '2026-01-05', NOW()),
('USR003', 'Mohammed Hassan', 'mohammed.hassan@silvermaid.com', '+971501234569', 'ROLE003', 'Manager', 'Active', 'Operations', '2026-01-08', NOW()),
('USR004', 'Sarah Johnson', 'sarah.johnson@silvermaid.com', '+971501234570', 'ROLE003', 'Manager', 'Active', 'Finance', '2026-01-10', NOW()),
('USR005', 'Ali Al-Mansoori', 'ali.mansoori@silvermaid.com', '+971501234571', 'ROLE004', 'Supervisor', 'Active', 'HR', '2026-01-12', NOW()),
('USR006', 'Nora Al-Kaabi', 'nora.kaabi@silvermaid.com', '+971501234572', 'ROLE004', 'Supervisor', 'Active', 'HR', '2026-01-15', NULL),
('USR007', 'Karim Al-Raisi', 'karim.raisi@silvermaid.com', '+971501234573', 'ROLE005', 'User', 'Active', 'Operations', '2026-01-18', NULL),
('USR008', 'Leila Al-Mazrouei', 'leila.mazrouei@silvermaid.com', '+971501234574', 'ROLE005', 'User', 'Inactive', 'Marketing', '2026-01-20', '2026-01-25');
```

### 1.5 Create Audit Log Entries
```sql
INSERT INTO audit_logs (id, user_id, user_name, action, module, details, timestamp, ip_address, status, severity) VALUES
('AUD001', 'USR001', 'Ahmed Al-Mazrouei', 'User Created', 'Admin', 'Created user Fatima Al-Ketbi', '2026-01-05 08:30:00', '192.168.1.100', 'Success', 'Low'),
('AUD002', 'USR002', 'Fatima Al-Ketbi', 'Role Modified', 'Admin', 'Modified Manager role permissions', '2026-01-08 10:15:00', '192.168.1.101', 'Success', 'Medium'),
('AUD003', 'USR001', 'Ahmed Al-Mazrouei', 'User Login', 'Admin', 'Successful login', '2026-01-28 09:00:00', '192.168.1.100', 'Success', 'Low'),
('AUD004', 'USR003', 'Mohammed Hassan', 'Permission Denied', 'Admin', 'Attempted to delete system role', '2026-01-26 14:30:00', '192.168.1.102', 'Failed', 'High'),
('AUD005', 'USR002', 'Fatima Al-Ketbi', 'Data Export', 'Finance', 'Exported financial report', '2026-01-27 11:20:00', '192.168.1.101', 'Success', 'Medium'),
('AUD006', 'USR001', 'Ahmed Al-Mazrouei', 'System Configuration', 'System', 'Updated email configuration', '2026-01-25 16:45:00', '192.168.1.100', 'Success', 'Medium'),
('AUD007', 'USR004', 'Sarah Johnson', 'Suspicious Activity', 'Admin', 'Multiple failed login attempts', '2026-01-24 20:30:00', '192.168.2.50', 'Failed', 'Critical'),
('AUD008', 'USR005', 'Ali Al-Mansoori', 'Leave Approved', 'HR', 'Approved leave for Karim Al-Raisi', '2026-01-28 10:00:00', '192.168.1.103', 'Success', 'Low');
```

## Phase 2: HR & Employee Data

### 2.1 Create Employees
```sql
INSERT INTO employees (id, name, email, phone, role, position, department, status, join_date, location, rating, nationality_country, date_of_birth) VALUES
('EMP001', 'Ahmed Al-Mazrouei', 'ahmed@silvermaid.com', '+971501234567', 'Executive Director', 'Director', 'Executive', 'Active', '2020-01-15', 'Dubai HQ', 4.8, 'UAE', '1985-03-20'),
('EMP002', 'Fatima Al-Ketbi', 'fatima@silvermaid.com', '+971501234568', 'Admin Manager', 'Manager', 'Administration', 'Active', '2021-01-10', 'Dubai HQ', 4.6, 'UAE', '1988-07-15'),
('EMP003', 'Mohammed Hassan', 'mohammed@silvermaid.com', '+971501234569', 'Operations Manager', 'Manager', 'Operations', 'Active', '2021-03-01', 'Dubai HQ', 4.5, 'Egypt', '1986-05-10'),
('EMP004', 'Sarah Johnson', 'sarah@silvermaid.com', '+971501234570', 'Finance Manager', 'Manager', 'Finance', 'Active', '2021-06-15', 'Dubai HQ', 4.7, 'USA', '1987-12-25'),
('EMP005', 'Ali Al-Mansoori', 'ali@silvermaid.com', '+971501234571', 'HR Supervisor', 'Supervisor', 'HR', 'Active', '2022-01-20', 'Dubai HQ', 4.4, 'UAE', '1990-02-14'),
('EMP006', 'Nora Al-Kaabi', 'nora@silvermaid.com', '+971501234572', 'HR Officer', 'Officer', 'HR', 'On Leave', '2022-06-01', 'Dubai HQ', 4.3, 'UAE', '1992-08-30');
```

### 2.2 Create Salaries
```sql
INSERT INTO salaries (id, employee_id, basic_salary, housing_allowance, transportation_allowance, food_allowance, telephone_allowance, other_allowances, total_allowances, total_salary, effective_from) VALUES
('SAL001', 'EMP001', 25000, 7500, 1500, 1000, 500, 1000, 11500, 36500, '2026-01-01'),
('SAL002', 'EMP002', 12000, 3600, 800, 500, 300, 500, 5700, 17700, '2026-01-01'),
('SAL003', 'EMP003', 11000, 3300, 800, 500, 300, 500, 5400, 16400, '2026-01-01'),
('SAL004', 'EMP004', 13000, 3900, 800, 500, 300, 500, 6000, 19000, '2026-01-01'),
('SAL005', 'EMP005', 8000, 2400, 600, 400, 200, 300, 3900, 11900, '2026-01-01'),
('SAL006', 'EMP006', 7500, 2250, 600, 400, 200, 300, 3750, 11250, '2026-01-01');
```

### 2.3 Create Employee Visas
```sql
INSERT INTO employee_visas (id, employee_id, visa_type, visa_number, issue_date, expiry_date, sponsor_name, status, days_until_expiry) VALUES
('VIS001', 'EMP001', 'employee', 'VIS00001', '2020-01-15', '2028-01-14', 'Silver Maid LLC', 'active', 714),
('VIS002', 'EMP002', 'employee', 'VIS00002', '2021-01-10', '2027-01-09', 'Silver Maid LLC', 'active', 349),
('VIS003', 'EMP003', 'employee', 'VIS00003', '2021-03-01', '2027-02-28', 'Silver Maid LLC', 'active', 396),
('VIS004', 'EMP004', 'employee', 'VIS00004', '2021-06-15', '2027-06-14', 'Silver Maid LLC', 'active', 503),
('VIS005', 'EMP005', 'employee', 'VIS00005', '2022-01-20', '2026-01-19', 'Silver Maid LLC', 'expiring_soon', 26),
('VIS006', 'EMP006', 'employee', 'VIS00006', '2022-06-01', '2026-05-31', 'Silver Maid LLC', 'expiring_soon', 154);
```

### 2.4 Create Attendance Records
```sql
-- Insert 20 recent attendance records
INSERT INTO attendance (id, employee_id, attendance_date, check_in_time, check_out_time, hours_worked, status) VALUES
('ATT001', 'EMP001', '2026-01-28', '08:00:00', '17:00:00', 8.5, 'present'),
('ATT002', 'EMP002', '2026-01-28', '08:30:00', '17:30:00', 8.0, 'present'),
('ATT003', 'EMP003', '2026-01-28', '08:00:00', '16:30:00', 8.0, 'present'),
('ATT004', 'EMP004', '2026-01-28', '09:00:00', '17:00:00', 8.0, 'late'),
('ATT005', 'EMP005', '2026-01-28', '08:00:00', '12:00:00', 4.0, 'half_day'),
('ATT006', 'EMP006', '2026-01-28', NULL, NULL, 0, 'on_leave'),
('ATT007', 'EMP001', '2026-01-27', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT008', 'EMP002', '2026-01-27', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT009', 'EMP003', '2026-01-27', '08:00:00', '17:30:00', 9.0, 'present'),
('ATT010', 'EMP004', '2026-01-27', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT011', 'EMP005', '2026-01-27', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT012', 'EMP006', '2026-01-27', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT013', 'EMP001', '2026-01-26', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT014', 'EMP002', '2026-01-26', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT015', 'EMP003', '2026-01-26', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT016', 'EMP004', '2026-01-26', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT017', 'EMP005', '2026-01-26', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT018', 'EMP006', '2026-01-26', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT019', 'EMP001', '2026-01-25', '08:00:00', '17:00:00', 9.0, 'present'),
('ATT020', 'EMP002', '2026-01-25', '08:00:00', '17:00:00', 9.0, 'present');
```

## Phase 3: Finance Data

### 3.1 Create Clients
```sql
INSERT INTO clients (id, name, company, email, phone, location, join_date, total_spent, total_projects, status, tier) VALUES
('CLI001', 'Mohammed Al-Baqer', 'Al-Baqer Trading Co.', 'info@albaqer.com', '+971501111111', 'Dubai', '2024-01-15', 125000, 15, 'Active', 'Platinum'),
('CLI002', 'Fatima Al-Mansouri', 'FM Properties', 'contact@fmproperties.ae', '+971501111112', 'Abu Dhabi', '2024-06-20', 85000, 8, 'Active', 'Gold'),
('CLI003', 'Ahmed Al-Naqbi', 'Al-Naqbi Enterprises', 'ahmed@alnaqbi.ae', '+971501111113', 'Dubai', '2024-08-10', 45000, 5, 'Active', 'Silver'),
('CLI004', 'Sara Al-Kaabi', 'Kaabi Interior Design', 'sara@kaabi-design.ae', '+971501111114', 'Sharjah', '2025-01-05', 15000, 2, 'Active', 'Bronze');
```

### 3.2 Create Invoices
```sql
INSERT INTO invoices (id, invoice_number, client_id, client_name, invoice_date, due_date, status, subtotal, tax_amount, total, currency_code, created_by) VALUES
('INV001', 'HW-INV-20260101', 'CLI001', 'Mohammed Al-Baqer', '2026-01-01', '2026-02-01', 'Paid', 45000, 4500, 49500, 'AED', 'USR004'),
('INV002', 'HW-INV-20260110', 'CLI002', 'Fatima Al-Mansouri', '2026-01-10', '2026-02-10', 'Sent', 35000, 3500, 38500, 'AED', 'USR004'),
('INV003', 'HW-INV-20260115', 'CLI003', 'Ahmed Al-Naqbi', '2026-01-15', '2026-02-15', 'Paid', 22000, 2200, 24200, 'AED', 'USR004'),
('INV004', 'HW-INV-20260120', 'CLI004', 'Sara Al-Kaabi', '2026-01-20', '2026-02-20', 'Draft', 8000, 800, 8800, 'AED', 'USR004');
```

### 3.3 Create Invoice Line Items
```sql
INSERT INTO invoice_line_items (id, invoice_id, description, quantity, unit_price, unit) VALUES
('ILI001', 'INV001', 'Commercial cleaning service - 5000 sqft', 1, 35000, 'job'),
('ILI002', 'INV001', 'Carpet cleaning', 2, 5000, 'service'),
('ILI003', 'INV002', 'Property maintenance - Monthly', 1, 25000, 'month'),
('ILI004', 'INV002', 'Window cleaning', 1, 10000, 'job'),
('ILI005', 'INV003', 'Post-renovation cleaning', 1, 18000, 'job'),
('ILI006', 'INV003', 'Sanitation service', 1, 4000, 'service'),
('ILI007', 'INV004', 'Office cleaning - Monthly', 1, 6000, 'month'),
('ILI008', 'INV004', 'Supply items', 1, 2000, 'items');
```

### 3.4 Create Payments
```sql
INSERT INTO payments (id, invoice_id, client_id, amount, payment_date, payment_method, transaction_reference, status) VALUES
('PAY001', 'INV001', 'CLI001', 49500, '2026-01-15', 'Bank Transfer', 'TRX-20260115-001', 'Completed'),
('PAY002', 'INV003', 'CLI003', 24200, '2026-01-25', 'Credit Card', 'CC-20260125-001', 'Completed');
```

### 3.5 Create Expenses
```sql
INSERT INTO expenses (id, description, category, amount, expense_date, payment_method, vendor, approval_status, approved_by) VALUES
('EXP001', 'Cleaning supplies purchase', 'Supplies', 2500, '2026-01-15', 'Credit Card', 'Local Supplies Store', 'Approved', 'USR004'),
('EXP002', 'Equipment maintenance', 'Maintenance', 1800, '2026-01-18', 'Bank Transfer', 'Equipment Services Co.', 'Approved', 'USR004'),
('EXP003', 'Staff training program', 'Training', 3500, '2026-01-20', 'Bank Transfer', 'Professional Training Ltd', 'Pending', NULL),
('EXP004', 'Vehicle fuel', 'Transportation', 600, '2026-01-22', 'Cash', 'Fuel Station', 'Approved', 'USR005'),
('EXP005', 'Software subscriptions', 'Technology', 1200, '2026-01-25', 'Bank Transfer', 'SaaS Provider', 'Approved', 'USR004');
```

## Phase 4: Jobs Data

### 4.1 Create Jobs
```sql
INSERT INTO jobs (id, job_number, client_id, client_name, title, description, location, service_type, start_date, end_date, scheduled_date, status, priority, budget, actual_cost, team_size, assigned_team_leader) VALUES
('JOB001', 'HW-JOB-20260101', 'CLI001', 'Mohammed Al-Baqer', 'Al-Baqer Office Complex Cleaning', 'Full facility cleaning and maintenance', 'Sheikh Zayed Road, Dubai', 'Commercial Cleaning', '2026-01-05 08:00:00', '2026-01-05 18:00:00', '2026-01-05', 'Completed', 'High', 40000, 38000, 8, 'USR003'),
('JOB002', 'HW-JOB-20260110', 'CLI002', 'Fatima Al-Mansouri', 'FM Properties Building Maintenance', 'Regular building maintenance and cleaning', 'Yas Island, Abu Dhabi', 'Building Maintenance', '2026-01-10 07:00:00', '2026-01-10 17:00:00', '2026-01-10', 'Completed', 'Medium', 25000, 24500, 6, 'USR003'),
('JOB003', 'HW-JOB-20260115', 'CLI003', 'Ahmed Al-Naqbi', 'Post-Renovation Deep Cleaning', 'Deep cleaning after property renovation', 'Downtown Dubai', 'Deep Cleaning', '2026-01-15 08:00:00', '2026-01-17 18:00:00', '2026-01-15', 'In Progress', 'High', 18000, 15000, 5, 'USR003'),
('JOB004', 'HW-JOB-20260120', 'CLI004', 'Sara Al-Kaabi', 'Monthly Office Cleaning', 'Routine office cleaning and restocking', 'Al Karama, Sharjah', 'Office Cleaning', '2026-01-20 09:00:00', '2026-01-20 17:00:00', '2026-01-20', 'Scheduled', 'Medium', 6000, 0, 3, 'USR003');
```

### 4.2 Create Job Team Assignments
```sql
INSERT INTO job_team_assignments (id, job_id, employee_id, role, start_time, end_time, status, hours_worked) VALUES
('JTA001', 'JOB001', 'EMP001', 'Team Leader', '2026-01-05 08:00:00', '2026-01-05 18:00:00', 'Completed', 10),
('JTA002', 'JOB001', 'EMP003', 'Supervisor', '2026-01-05 08:00:00', '2026-01-05 18:00:00', 'Completed', 10),
('JTA003', 'JOB002', 'EMP001', 'Coordinator', '2026-01-10 07:00:00', '2026-01-10 17:00:00', 'Completed', 10),
('JTA004', 'JOB003', 'EMP005', 'Supervisor', '2026-01-15 08:00:00', '2026-01-16 18:00:00', 'In Progress', 24);
```

## Phase 5: Meetings Data

### 5.1 Create Meetings
```sql
INSERT INTO meetings (id, title, description, meeting_type, start_time, end_time, location, organizer_id, status) VALUES
('MTG001', 'Weekly Operations Meeting', 'Regular team sync on operations', 'Team Meeting', '2026-01-27 10:00:00', '2026-01-27 11:00:00', 'Dubai HQ - Conference Room A', 'USR003', 'Completed'),
('MTG002', 'Client Review - Al-Baqer Trading', 'Quarterly review with Al-Baqer', 'Client Meeting', '2026-01-28 14:00:00', '2026-01-28 15:30:00', 'Al-Baqer Office', 'USR004', 'Scheduled'),
('MTG003', 'Finance Planning Session', 'Q1 2026 financial planning', 'Planning', '2026-01-29 09:00:00', '2026-01-29 11:00:00', 'Dubai HQ - Finance Dept', 'USR004', 'Scheduled'),
('MTG004', 'One-on-One: Ahmed Al-Mazrouei', 'Monthly one-on-one review', 'One-on-One', '2026-01-30 16:00:00', '2026-01-30 17:00:00', 'Dubai HQ - Executive Office', 'USR002', 'Scheduled'),
('MTG005', 'Post-Job Debrief: JOB001', 'Debrief meeting after Al-Baqer job', 'Debrief', '2026-01-06 17:00:00', '2026-01-06 18:00:00', 'Dubai HQ - Conf Room B', 'USR003', 'Completed');
```

### 5.2 Create Meeting Attendees
```sql
INSERT INTO meeting_attendees (id, meeting_id, attendee_id, attendee_name, rsvp_status, attendance_status) VALUES
('MTA001', 'MTG001', 'USR003', 'Mohammed Hassan', 'Accepted', 'Present'),
('MTA002', 'MTG001', 'USR005', 'Ali Al-Mansoori', 'Accepted', 'Present'),
('MTA003', 'MTG001', 'USR007', 'Karim Al-Raisi', 'Tentative', 'Present'),
('MTA004', 'MTG002', 'USR004', 'Sarah Johnson', 'Accepted', NULL),
('MTA005', 'MTG002', 'USR001', 'Ahmed Al-Mazrouei', 'Pending', NULL),
('MTA006', 'MTG003', 'USR004', 'Sarah Johnson', 'Accepted', NULL),
('MTA007', 'MTG003', 'USR002', 'Fatima Al-Ketbi', 'Accepted', NULL),
('MTA008', 'MTG004', 'USR001', 'Ahmed Al-Mazrouei', 'Accepted', NULL),
('MTA009', 'MTG005', 'USR003', 'Mohammed Hassan', 'Accepted', 'Present'),
('MTA010', 'MTG005', 'USR001', 'Ahmed Al-Mazrouei', 'Accepted', 'Present');
```

### 5.3 Create Meeting Notes
```sql
INSERT INTO meeting_notes (id, meeting_id, content, note_type, author_id) VALUES
('MTN001', 'MTG001', 'Discussed upcoming projects and team workload', 'General', 'USR003'),
('MTN002', 'MTG001', 'Need to onboard 2 new team members', 'Action Item', 'USR003'),
('MTN003', 'MTG005', 'Client satisfied with job completion', 'Decision', 'USR003'),
('MTN004', 'MTG005', 'Minor issue with equipment - scheduled maintenance', 'Issue', 'USR001');
```

## Phase 6: Products & Inventory

### 6.1 Create Product Categories
```sql
INSERT INTO product_categories (id, name, description, status) VALUES
('CAT001', 'Cleaning Supplies', 'Chemical and non-chemical cleaning products', 'Active'),
('CAT002', 'Equipment', 'Cleaning equipment and machinery', 'Active'),
('CAT003', 'PPE', 'Personal protective equipment', 'Active'),
('CAT004', 'Consumables', 'Disposable consumable items', 'Active');
```

### 6.2 Create Products
```sql
INSERT INTO products (id, name, sku, category_id, description, unit_price, wholesale_price, retail_price, supplier_name, stock_quantity, reorder_level, status) VALUES
('PROD001', 'Heavy Duty Disinfectant - 5L', 'SKU-001', 'CAT001', 'Industrial strength disinfectant', 150, 120, 180, 'Gulf Chemicals Co.', 45, 10, 'Active'),
('PROD002', 'Glass Cleaner - 500ml', 'SKU-002', 'CAT001', 'Window and glass cleaning solution', 25, 18, 35, 'Gulf Chemicals Co.', 120, 20, 'Active'),
('PROD003', 'Industrial Vacuum - 2000W', 'SKU-003', 'CAT002', 'Powerful commercial vacuum cleaner', 2500, 2000, 3000, 'Equipment Suppliers UAE', 5, 2, 'Active'),
('PROD004', 'Microfiber Cleaning Cloth - 10 pack', 'SKU-004', 'CAT004', 'Reusable microfiber cloths', 45, 30, 60, 'Textile Imports Ltd', 85, 15, 'Active'),
('PROD005', 'Safety Gloves - Nitrile 100 pairs', 'SKU-005', 'CAT003', 'Protective gloves for cleaning', 80, 60, 100, 'Safety Equipment Co.', 200, 50, 'Active');
```

## Phase 7: Quotations

### 7.1 Create Quotations
```sql
INSERT INTO quotations (id, quotation_number, client_id, client_name, quotation_date, valid_until, subtotal, discount_percent, discount_amount, tax_amount, total, status, created_by) VALUES
('QUO001', 'HW-QUO-20260101', 'CLI001', 'Mohammed Al-Baqer', '2026-01-20', '2026-02-20', 50000, 5, 2500, 4750, 52250, 'Sent', 'USR004'),
('QUO002', 'HW-QUO-20260105', 'CLI002', 'Fatima Al-Mansouri', '2026-01-22', '2026-02-22', 30000, 0, 0, 3000, 33000, 'Draft', 'USR004');
```

### 7.2 Create Quotation Items
```sql
INSERT INTO quotation_items (id, quotation_id, description, quantity, unit_price, unit) VALUES
('QI001', 'QUO001', 'Commercial facility cleaning - Annual contract', 12, 4000, 'month'),
('QI002', 'QUO001', 'Deep cleaning service', 1, 2000, 'service'),
('QI003', 'QUO002', 'Property maintenance - Monthly', 12, 2500, 'month');
```

## Phase 8: Surveys

### 8.1 Create Surveys
```sql
INSERT INTO surveys (id, title, description, survey_type, status, created_by) VALUES
('SUR001', 'Post-Job Customer Satisfaction', 'Customer satisfaction survey after job completion', 'Satisfaction', 'Published', 'USR004'),
('SUR002', 'Employee Feedback - Q1 2026', 'Quarterly employee feedback survey', 'Employee', 'Published', 'USR005');
```

### 8.2 Create Survey Questions
```sql
INSERT INTO survey_questions (id, survey_id, question_text, question_type, display_order, is_required) VALUES
('SQ001', 'SUR001', 'How satisfied are you with the service quality?', 'Rating', 1, TRUE),
('SQ002', 'SUR001', 'Would you recommend our service?', 'Multiple Choice', 2, TRUE),
('SQ003', 'SUR001', 'Any additional comments?', 'Text', 3, FALSE),
('SQ004', 'SUR002', 'How would you rate your work environment?', 'Rating', 1, TRUE),
('SQ005', 'SUR002', 'Do you have the tools you need?', 'Multiple Choice', 2, TRUE);
```

## Phase 9: Blog Content

### 9.1 Create Blog Categories
```sql
INSERT INTO blog_categories (id, name, slug, description, status) VALUES
('BLOGCAT001', 'Cleaning Tips', 'cleaning-tips', 'Expert tips for maintaining cleanliness', 'Active'),
('BLOGCAT002', 'Industry News', 'industry-news', 'Latest news in cleaning and maintenance industry', 'Active'),
('BLOGCAT003', 'Company Updates', 'company-updates', 'Silver Maid company news and updates', 'Active');
```

### 9.2 Create Blog Posts
```sql
INSERT INTO blog_posts (id, title, slug, excerpt, category_id, author_id, author_name, status, publish_date) VALUES
('BLOG001', 'Top 10 Cleaning Tips for Your Office', 'top-10-cleaning-tips', 'Learn the best practices for maintaining a clean and productive office environment', 'BLOGCAT001', 'USR004', 'Sarah Johnson', 'Published', NOW()),
('BLOG002', 'Sustainable Cleaning Practices', 'sustainable-cleaning', 'Discover eco-friendly cleaning methods that protect the environment', 'BLOGCAT001', 'USR003', 'Mohammed Hassan', 'Published', NOW()),
('BLOG003', 'Silver Maid Wins Best Service Award', 'award-announcement', 'We are proud to announce our recognition in the industry', 'BLOGCAT003', 'USR002', 'Fatima Al-Ketbi', 'Published', NOW());
```

## Verification Queries

After seeding, verify data integrity:

```sql
-- Count all records by module
SELECT 'Users' as Module, COUNT(*) as Record_Count FROM users
UNION ALL
SELECT 'Employees', COUNT(*) FROM employees
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Jobs', COUNT(*) FROM jobs
UNION ALL
SELECT 'Meetings', COUNT(*) FROM meetings
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs;

-- Verify foreign key relationships
SELECT 'Broken Invoice-Client Links' as Issue, COUNT(*) as Count
FROM invoices i LEFT JOIN clients c ON i.client_id = c.id
WHERE c.id IS NULL;

-- Check role-permission assignments
SELECT r.name, COUNT(rp.permission_id) as permission_count
FROM roles r
LEFT JOIN role_permissions rp ON r.id = rp.role_id
GROUP BY r.id, r.name;
```

---

**Total Records Seeded**: 150+
**Test Data Quality**: Production-realistic
**Status**: Ready for Application Testing

