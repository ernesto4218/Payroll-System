import { start } from 'repl';
import db from './db.js';       // Now process.env.DBNAME will be defined
import * as queries from './queries.js';


// Insert new row
export async function insertItem(...values) {
  const [result] = await db.execute(INSERT, values);
  return result.insertId;
}

// Get single row by ID
export async function getItemById(id) {
  const [rows] = await db.execute(GET_BY_ID, [id]);
  return rows[0];
}

// Update row by ID (last value should be the ID)
export async function updateItemById(...values) {
  const [result] = await db.execute(UPDATE_BY_ID, values);
  return result.affectedRows > 0;
}

// Delete row by ID
export async function deleteItemById(id) {
  const [result] = await db.execute(DELETE_BY_ID, [id]);
  return result.affectedRows > 0;
}

// Get all rows
export async function getAllItems() {
  const [rows] = await db.execute(GET_ALL);
  return rows;
}

// Upsert (insert or update if exists)
export async function upsertItem(...values) {
  const [result] = await db.execute(UPSERT, values);
  return result.insertId || result.affectedRows > 0;
}


// authentication
export async function VERIFY_AUTH(token) {
  const [results] = await db.execute(queries.VERIFY_AUTH, [token]);
  return results[0];
}

export async function VERIFY_AUTH_RESIDENT(token) {
  const [results] = await db.execute(queries.VERIFY_AUTH_RESIDENT, [token]);
  return results[0];
}


// Admin
export async function GET_BY_EMAIL(email) {
  const [rows] = await db.execute(queries.GET_BY_EMAIL, [email]);
  return rows[0];
}

export async function UPDATE_AUTH_TOKEN(token, id) {
  const [result] = await db.execute(queries.UPDATE_AUTH_TOKEN, [token, id]);
  return result.affectedRows > 0;
}

export async function GET_ALL_EMPLOYEE() {
  const [rows] = await db.execute(queries.GET_ALL_EMPLOYEE);
  return rows;
}

export async function GET_ALL_UPLOADED_FILES() {
  const [rows] = await db.execute(queries.GET_ALL_UPLOADED_FILES);
  return rows;
}

export async function COUNT_TOTAL_EMPLOYEES() {
  const [rows] = await db.execute(queries.COUNT_TOTAL_EMPLOYEES);
  return rows[0].total_employees;
}

export async function COUNT_TOTAL_FULLTIME() {
  const [rows] = await db.execute(queries.COUNT_TOTAL_FULLTIME);
  return rows[0].total_fulltime;
}

export async function COUNT_TOTAL_PARTTIME() {
  const [rows] = await db.execute(queries.COUNT_TOTAL_PARTTIME);
  return rows[0].total_parttime;
}

// api
export async function GET_EMPLOYEE_BY_ID(id) {
  const [rows] = await db.execute(queries.GET_EMPLOYEE_BY_ID, [id]);
  return rows[0];
}

export async function GET_EMPLOYEE_BY_B_ID(id) {
  const [rows] = await db.execute(queries.GET_EMPLOYEE_BY_B_ID, [id]);
  return rows[0];
}

export async function ADD_NEW_EMPLOYEE(b_id, b_name, type, designation, monthly_salary, hourly_salary, sss_monthly, microdev_monthly, first_name, middle_name, last_name) {
  const [result] = await db.execute(queries.ADD_NEW_EMPLOYEE,[b_id, b_name, type, designation, monthly_salary, hourly_salary, sss_monthly, microdev_monthly, first_name, middle_name, last_name]);
  return result.insertId;
}

export async function UPDATE_EMPLOYEE_BY_ID(b_name, type, designation, monthly_salary, hourly_salary, sss_monthly, microdev_monthly, first_name, middle_name, last_name, b_id) {
  const [result] = await db.execute(queries.UPDATE_EMPLOYEE_BY_ID,[b_name, type, designation, monthly_salary, hourly_salary, sss_monthly, microdev_monthly, first_name, middle_name, last_name, b_id]);
  return result.affectedRows > 0;
}

export async function UPDATE_RECORD_BY_ID(morning_timein, morning_timeout, afternoon_timein, afternoon_timeout, record_id, employee_id) {
  const [result] = await db.execute(queries.UPDATE_RECORD_BY_ID,[morning_timein, morning_timeout, afternoon_timein, afternoon_timeout, record_id, employee_id]);
  return result.affectedRows > 0;
}

export async function INSERT_FILE_UPLOAD(name, path) {
  const [result] = await db.execute(queries.INSERT_FILE_UPLOAD, [name, path]);
  return result.insertId;
}

export async function INSERT_DTR(employee_id, morning_time_in, morning_time_out, afternoon_time_in, afternoon_time_out, date) {
  const [result] = await db.execute(queries.INSERT_DTR, [employee_id, morning_time_in, morning_time_out, afternoon_time_in, afternoon_time_out, date]);
  return result.insertId;
}

export async function GET_DTR_MONTHS() {
  const [rows] = await db.execute(queries.GET_DTR_MONTHS);
  return rows;
}

export async function GET_DTR_FILTER_MONTH(month, employee_id) {
  const [rows] = await db.execute(queries.GET_DTR_FILTER_MONTH, [employee_id, month]);
  return rows;
}

export async function GET_DTR_FILTER_MONTH_PAYROLL(month) {
  const [rows] = await db.execute(queries.GET_DTR_FILTER_MONTH_PAYROLL, [month]);
  return rows;
}

export async function INSERT_EVENT(start, end, description) {
  const [result] = await db.execute(queries.INSERT_EVENT, [start, end, description]);
  return result.insertId;
}

export async function GET_EVENTS() {
  const [rows] = await db.execute(queries.GET_EVENTS);
  return rows;
}

export async function GET_EVENTS_MONTH(month) {
  const [rows] = await db.execute(queries.GET_EVENTS_MONTH, [month]);
  return rows;
}

export async function INSERT_TRAVEL_ORDER(employee_id, morning_time_in, morning_time_out, afternoon_time_in, afternoon_time_out, message, date) {
  const [result] = await db.execute(queries.INSERT_TRAVEL_ORDER, [employee_id, morning_time_in, morning_time_out, afternoon_time_in, afternoon_time_out, message, date]);
  return result.insertId;
}

export async function INSERT_SUBJECT(id, description) {
  const [result] = await db.execute(queries.INSERT_SUBJECT, [id, description]);
  return result.insertId;
}

export async function GET_ALL_SUBJECT() {
  const [result] = await db.execute(queries.GET_ALL_SUBJECT);
  return result;
}

export async function DELETE_SUBJECT_BY_ID(id) {
  const [result] = await db.execute(queries.DELETE_SUBJECT_BY_ID, [id]);
  return result.affectedRows > 0;
}

export async function INSERT_FACULTY_LOAD(employee_id, sub_id, starttime, endtime, schedule) {
  const [result] = await db.execute(queries.INSERT_FACULTY_LOAD, [employee_id, sub_id, starttime, endtime, schedule]);
  return result.insertId;
}

export async function GET_ALL_FACULTY_LOADS() {
  const [result] = await db.execute(queries.GET_ALL_FACULTY_LOADS);
  return result;
}

export async function GET_ALL_FACULTY_LOADS_BY_ID(employee_id) {
  const [result] = await db.execute(queries.GET_ALL_FACULTY_LOADS_BY_ID_QUERY, [employee_id]);
  return result;
}

export async function DELETE_FACULTY_LOAD_BY_ID(id) {
  const [result] = await db.execute(queries.DELETE_FACULTY_LOAD_BY_ID
, [id]);
  return result.affectedRows > 0;
}
