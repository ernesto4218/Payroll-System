// Get a single row by ID
export const GET_BY_ID = 'SELECT * FROM table_name WHERE id = ?';

// Insert a new row
export const INSERT = 'INSERT INTO table_name (column1, column2) VALUES (?, ?)';

// Update a row by ID
export const UPDATE_BY_ID = 'UPDATE table_name SET column1 = ?, column2 = ?, date_updated = NOW() WHERE id = ?';

// Delete a row by ID
export const DELETE_BY_ID = 'DELETE FROM table_name WHERE id = ?';

// Get all rows
export const GET_ALL = 'SELECT * FROM table_name';


// admin
export const VERIFY_AUTH = "SELECT * FROM users WHERE auth_token = ?";
export const VERIFY_AUTH_RESIDENT = "SELECT * FROM residents WHERE auth_token = ?";
export const GET_BY_EMAIL = 'SELECT * FROM users WHERE email = ?';
export const GET_EMPLOYEE_BY_ID = 'SELECT * FROM employees WHERE id = ?';
export const GET_ALL_EMPLOYEE = 'SELECT * FROM employees ORDER BY id DESC';
export const UPDATE_AUTH_TOKEN = 'UPDATE users SET auth_token = ? WHERE id = ?';
export const GET_ALL_UPLOADED_FILES = 'SELECT * FROM file_upload ORDER BY id DESC';
export const GET_ALL_SUBJECT = 'SELECT * FROM subjects ORDER BY id DESC';
export const DELETE_SUBJECT_BY_ID = 'DELETE FROM subjects WHERE id = ?';
export const DELETE_FACULTY_LOAD_BY_ID = 'DELETE FROM faculty_loads WHERE id = ?';
export const COUNT_TOTAL_EMPLOYEES = 'SELECT COUNT(*) AS total_employees FROM employees';
export const COUNT_TOTAL_FULLTIME = 'SELECT COUNT(*) AS total_fulltime FROM employees WHERE type = "full-time"';
export const COUNT_TOTAL_PARTTIME = 'SELECT COUNT(*) AS total_parttime FROM employees WHERE type = "part-time"';

// api 
export const ADD_NEW_EMPLOYEE = 'INSERT INTO employees (b_id, b_name, type, designation, monthly_salary, hourly_salary, sss, microdev, first_name, middle_name, last_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
export const UPDATE_EMPLOYEE_BY_ID = 'UPDATE employees SET b_name = ?, type = ?, designation = ?, monthly_salary = ?, hourly_salary = ?, sss = ?, microdev = ?, first_name = ?, middle_name = ?, last_name = ? WHERE b_id = ?';
export const UPDATE_RECORD_BY_ID = 'UPDATE dtr SET morning_time_in = ?, morning_time_out = ?, afternoon_time_in = ?, afternoon_time_out = ? WHERE id = ? AND employee_id = ?';
export const INSERT_FILE_UPLOAD = 'INSERT INTO file_upload (file_name, path) VALUES (?, ?)';
export const INSERT_DTR = `
  INSERT INTO dtr (
    employee_id,
    morning_time_in,
    morning_time_out,
    afternoon_time_in,
    afternoon_time_out,
    date
  ) VALUES (?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    morning_time_in = VALUES(morning_time_in),
    morning_time_out = VALUES(morning_time_out),
    afternoon_time_in = VALUES(afternoon_time_in),
    afternoon_time_out = VALUES(afternoon_time_out)
`;

export const GET_DTR_MONTHS = `
  SELECT DISTINCT DATE_FORMAT(date, '%M %Y') AS month_year
  FROM dtr
  ORDER BY date
`;

export const GET_DTR_FILTER_MONTH = `SELECT *
    FROM dtr
    WHERE employee_id = ?
      AND DATE_FORMAT(date, '%M %Y') = ?;
  `;

export const GET_DTR_FILTER_MONTH_PAYROLL = `SELECT *
    FROM dtr
    WHERE DATE_FORMAT(date, '%M %Y') = ?;
`;

export const INSERT_EVENT = 'INSERT INTO events (start, end, description) VALUES (?, ?, ?)';
export const GET_EVENTS = 'SELECT * FROM events ORDER BY id DESC';
export const GET_EVENTS_MONTH = `
  SELECT *
  FROM events
  WHERE DATE_FORMAT(start, '%M %Y') = ?;
`;
export const INSERT_TRAVEL_ORDER = 'INSERT INTO dtr (employee_id, morning_time_in, morning_time_out, afternoon_time_in, afternoon_time_out, message, date) VALUES (?, ?, ?, ?, ?, ?, ?)';
export const INSERT_SUBJECT = 'INSERT INTO subjects (code, description) VALUES (?, ?)';
export const INSERT_FACULTY_LOAD = 'INSERT INTO faculty_loads (teacher_id, subject_id, start_time, end_time, days) VALUES (?, ?, ?, ?, ?)';


export const GET_ALL_FACULTY_LOADS = `SELECT 
    fl.id,
    e.first_name,
    e.last_name,
    s.code AS subject_code,
    s.description AS subject_description,
    fl.start_time,
    fl.end_time,
    fl.days,
    fl.date_added
FROM faculty_loads fl
JOIN employees e ON fl.teacher_id = e.id
JOIN subjects s ON fl.subject_id = s.id
ORDER BY fl.id DESC;
`;

export const GET_ALL_FACULTY_LOADS_BY_ID_QUERY = `
  SELECT 
      fl.id,
      e.first_name,
      e.last_name,
      s.code AS subject_code,
      s.description AS subject_description,
      fl.start_time,
      fl.end_time,
      fl.days,
      fl.date_added
  FROM faculty_loads fl
  JOIN employees e ON fl.teacher_id = e.id
  JOIN subjects s ON fl.subject_id = s.id
  WHERE fl.teacher_id = ?
  ORDER BY fl.id DESC;
`;