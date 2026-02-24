import express from 'express';
import { formatDate, generateAuthToken, hashPassword } from './helpers.js';
import { 
  GET_ALL_EMPLOYEE,
  GET_ALL_UPLOADED_FILES,
  GET_DTR_FILTER_MONTH_PAYROLL,
  GET_DTR_MONTHS,
  GET_EVENTS,
  GET_EVENTS_MONTH,
  GET_DTR_FILTER_MONTH,
  GET_ALL_SUBJECT,
  GET_ALL_FACULTY_LOADS,
  GET_ALL_FACULTY_LOADS_BY_ID,
  COUNT_TOTAL_EMPLOYEES,
  COUNT_TOTAL_FULLTIME,
  COUNT_TOTAL_PARTTIME,
  GET_DTR_BY_EMPLOYEE_AND_MONTH,
  GET_ALL_EVENT_THIS_MONTH,
  UPDATE_PAYROLL_LATEST
} from '../db/services.js';
import bcrypt from 'bcrypt';
import Decimal from "decimal.js";
import dayjs from "dayjs";

const all_years = [
  { value: 2022 },
  { value: 2023 },
  { value: 2024 },
  { value: 2025 },
  { value: 2026 },
];

const all_months = [
  { value: 'January' },
  { value: 'February' },
  { value: 'March' },
  { value: 'April' },
  { value: 'May' },
  { value: 'June' },
  { value: 'July' },
  { value: 'August' },
  { value: 'September' },
  { value: 'October' },
  { value: 'November' },
  { value: 'December' },
];


const router = express.Router();

// console.log(await hashPassword('password'));
router.get('/dashboard', async (req, res) => {
  const year = new Date().getFullYear();
  const now = new Date();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  let data = {
    title: "Dashboard",
    name: req.name,
    employees: await COUNT_TOTAL_EMPLOYEES(),
    fulltime: await COUNT_TOTAL_FULLTIME(),
    parttime: await COUNT_TOTAL_PARTTIME(),
    employees_data: await GET_ALL_EMPLOYEE(),
    dtrmonths_data: await GET_DTR_MONTHS(),
    allevents: await GET_EVENTS(),
    eventsthismonth: await GET_EVENTS_MONTH(`${months[now.getMonth()]} ${year}`),
    eventsthismonthnum: 0,
    monthlyPayroll: {},
    today: (new Date()).toDateString(),
  };

  data.eventsthismonthnum = data.eventsthismonth.length;

  data.allevents.forEach(event => {
    event.start = formatDate(event.start);
    event.end = formatDate(event.end);
  });

  // Filter only full-time employees
  data.employees_data = data.employees_data.filter(em => em.type === 'full-time');
  data.employees_data.forEach(em => {
    em.date_added = formatDate(em.date_added);
  });

  // monthly payroll
  for (const monthName of months) {
    const month = `${monthName} ${year}`;
    const hasDTR = data.dtrmonths_data.some(row => row.month_year === month);
    if (!hasDTR) {
      // No DTR for this month → Zero payroll
      data.monthlyPayroll[month] = 0;
      continue; 
    }


    const employees = await GET_ALL_EMPLOYEE();

    let total_payroll = 0;
    let daysInMonth = 0;
    let monthNameOnly;
    let yearStr;

    const events_month = await GET_EVENTS_MONTH(month);

    for (let employee of employees) {
      employee.absent = 0;
      const empId = employee.b_id || employee.employee_id || employee.id;
      if (!empId) continue;

      const dtr = await GET_DTR_BY_EMPLOYEE_AND_MONTH(empId, month);
      let totalUndertime = 0;

      const eventRanges = events_month.map(ev => ({
        start: new Date(ev.start),
        end: new Date(ev.end)
      }));

      const [mName, yStr] = month.split(" ");
      monthNameOnly = mName;
      yearStr = yStr;

      const yy = parseInt(yearStr);
      const mm = new Date(`${monthNameOnly} 1, ${yy}`).getMonth();
      daysInMonth = new Date(yy, mm + 1, 0).getDate();

      const dtrMap = {};
      dtr.forEach(entry => {
        const day = new Date(entry.date).getDate();
        dtrMap[day] = entry;
      });

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(yy, mm, day);
        const dayOfWeek = date.getDay();
        const entry = dtrMap[day];

        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        const isEventDay = eventRanges.some(ev => date >= ev.start && date <= ev.end);
        if (isEventDay) continue;

        const toMinutes = (timeStr) => {
          if (!timeStr) return null;
          const [time, period] = timeStr.split(' ');
          let [hours, minutes] = time.split(':').map(Number);
          if (period === 'AM' && hours === 12) hours = 0;
          if (period === 'PM' && hours !== 12) hours += 12;
          return hours * 60 + minutes;
        };

        const official = {
          morning_in: toMinutes('8:00 AM'),
          morning_out: toMinutes('12:00 PM'),
          afternoon_in: toMinutes('1:00 PM'),
          afternoon_out: toMinutes('5:00 PM')
        };

        let undertime = 0;

        if (!entry || entry.message === 'ABSENT') {
          undertime = 8 * 60;
          totalUndertime += undertime;
          employee.absent++;
          continue;
        }

        const hasMorning = entry.morning_time_in || entry.morning_time_out;
        const hasAfternoon = entry.afternoon_time_in || entry.afternoon_time_out;

        if ((hasMorning && !hasAfternoon) || (!hasMorning && hasAfternoon)) {
          undertime = 4 * 60;
          totalUndertime += undertime;
          continue;
        }

        const morning_in = toMinutes(entry.morning_time_in);
        const morning_out = toMinutes(entry.morning_time_out);
        const afternoon_in = toMinutes(entry.afternoon_time_in);
        const afternoon_out = toMinutes(entry.afternoon_time_out);

        if (morning_in && morning_in > official.morning_in)
          undertime += morning_in - official.morning_in;

        if (morning_out && morning_out < official.morning_out)
          undertime += official.morning_out - morning_out;
        else if (!morning_out)
          undertime += 4 * 60;

        if (afternoon_in && afternoon_in > official.afternoon_in)
          undertime += afternoon_in - official.afternoon_in;

        if (afternoon_out && afternoon_out < official.afternoon_out)
          undertime += official.afternoon_out - afternoon_out;
        else if (!afternoon_out)
          undertime += 4 * 60;

        totalUndertime += undertime;
      }

      employee.totalUndertimeMinutes = totalUndertime - (8 * 60);
      employee.daily_salary = employee.monthly_salary / daysInMonth;
      employee.hourly_salary = employee.daily_salary / 8;
      employee.minutes_salary = employee.hourly_salary / 60;

      employee.undertimeAmount = employee.totalUndertimeMinutes * employee.minutes_salary;
      employee.salaryGross = employee.monthly_salary - employee.undertimeAmount;

      employee.netpay =
        employee.salaryGross -
        (Number(employee.microdev) + Number(employee.pagibig) + Number(employee.sss));

      total_payroll += employee.netpay;
    }

    console.log(month, " ", total_payroll);
    data.monthlyPayroll[month] = total_payroll;
  }
  res.render('admin/dashboard', data);
});


router.get('/payroll', async (req, res) => {
  try {
    const month = req.query.month;

    // ========================
    // HELPERS (MATCH FRONTEND)
    // ========================
    const formatLocalDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const toMinutes = (timeStr) => {
      if (!timeStr) return null;
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'AM' && hours === 12) hours = 0;
      if (period === 'PM' && hours !== 12) hours += 12;
      return hours * 60 + minutes;
    };

    let data = {
      title: "Payroll",
      name: req.name,
      employees: await GET_ALL_EMPLOYEE(),
      dtrmonths: all_months,
      dtryears: all_years,
      totalPayroll: 0,
      today: new Date().toDateString(),
    };

    // only full-time
    data.employees = data.employees.filter(em => em.type === 'full-time');

    data.employees.forEach(em => {
      em.date_added = formatDate(em.date_added);
    });

    if (month) {
      let total_payroll = 0;

      const events_month = await GET_EVENTS_MONTH(month);

      // ========================
      // BUILD EVENT DATE SET (FIXED)
      // ========================
      const eventDates = new Set();

      events_month.forEach(ev => {
        const start = new Date(ev.start);
        const end = new Date(ev.end);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          eventDates.add(formatLocalDate(new Date(d)));
        }
      });

      const [monthName, yearStr] = month.split(" ");
      const year = parseInt(yearStr);
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      // ========================
      // EMPLOYEE LOOP
      // ========================
      for (let employee of data.employees) {
        employee.absent = 0;

        const empId = employee.b_id || employee.employee_id || employee.id;
        if (!empId) continue;

        const dtr = await GET_DTR_BY_EMPLOYEE_AND_MONTH(empId, month);

        let totalUndertime = 0;

        // safe DTR map
        const dtrMap = {};
        dtr.forEach(entry => {
          const day = new Date(entry.date).getDate();
          dtrMap[day] = entry;
        });

        // ========================
        // DAY LOOP
        // ========================
        for (let day = 1; day <= daysInMonth; day++) {
          const date = new Date(year, monthIndex, day);
          const dayOfWeek = date.getDay();
          const entry = dtrMap[day];

          // skip weekends
          if (dayOfWeek === 0 || dayOfWeek === 6) continue;

          // skip events (FIXED)
          const currentDateStr = formatLocalDate(date);
          if (eventDates.has(currentDateStr)) continue;

          // absent whole day
          if (!entry || entry.message === 'ABSENT') {
            totalUndertime += 8 * 60;
            employee.absent++;
            continue;
          }

          const official = {
            morning_in: toMinutes('8:00 AM'),
            morning_out: toMinutes('12:00 PM'),
            afternoon_in: toMinutes('1:00 PM'),
            afternoon_out: toMinutes('5:00 PM')
          };

          const morning_in = toMinutes(entry.morning_time_in);
          const morning_out = toMinutes(entry.morning_time_out);
          const afternoon_in = toMinutes(entry.afternoon_time_in);
          const afternoon_out = toMinutes(entry.afternoon_time_out);

          let undertime = 0;

          // ===== MORNING =====
          const morningComplete = morning_in !== null && morning_out !== null;

          if (!morningComplete) {
            undertime += 4 * 60;
          } else {
            if (morning_in > official.morning_in)
              undertime += morning_in - official.morning_in;

            if (morning_out < official.morning_out)
              undertime += official.morning_out - morning_out;
          }

          // ===== AFTERNOON =====
          const afternoonComplete = afternoon_in !== null && afternoon_out !== null;

          if (!afternoonComplete) {
            undertime += 4 * 60;
          } else {
            if (afternoon_in > official.afternoon_in)
              undertime += afternoon_in - official.afternoon_in;

            if (afternoon_out < official.afternoon_out)
              undertime += official.afternoon_out - afternoon_out;
          }

          // cap to 8h
          if (undertime > 8 * 60) undertime = 8 * 60;

          totalUndertime += undertime;
        }

        // ========================
        // FINAL COMPUTATION (FIXED)
        // ========================
        employee.totalUndertimeMinutes = totalUndertime;
        employee.totalUndertimeFormatted = minutesToHHMM(totalUndertime);

        employee.daily_salary = Number(employee.monthly_salary) / daysInMonth;
        employee.hourly_salary = employee.daily_salary / 8;
        employee.minutes_salary = employee.hourly_salary / 60;

        employee.undertimeAmount =
          employee.totalUndertimeMinutes * employee.minutes_salary;

        employee.salaryGross =
          Number(employee.monthly_salary) - employee.undertimeAmount;

        employee.netpay =
          employee.salaryGross -
          (Number(employee.microdev || 0) +
           Number(employee.pagibig || 0) +
           Number(employee.sss || 0));

        total_payroll += employee.netpay;
      }

      data.monthDuration = `${monthName} 1-${daysInMonth} ${yearStr}`;
      data.daysInMonth = daysInMonth;
      data.totalPayroll = total_payroll;

      await UPDATE_PAYROLL_LATEST(total_payroll, month);
    }

    res.render('admin/payroll', data);

  } catch (error) {
    console.error("Payroll Error:", error);
    res.status(500).send("Server Error");
  }
});


function minutesToHHMM(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}


router.get('/payroll-part-time', async (req, res) => {
  const parseTime12 = (timeStr) => {
    if (!timeStr) return null;
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'AM' && hours === 12) hours = 0;
    if (period === 'PM' && hours !== 12) hours += 12;
    return hours * 60 + minutes;
  };

  const parseTime24 = (timeStr) => {
    if (!timeStr) return null;
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  // Calculate undertime based on DTR and loads
  function calculateUndertime(dtr, type, loads, currentDateStr) {
    const date = new Date(currentDateStr);
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const currentDay = days[date.getDay()];

    const morning = [dtr.morning_time_in, dtr.morning_time_out];
    const afternoon = [dtr.afternoon_time_in, dtr.afternoon_time_out];
    const morning_in = parseTime12(morning[0]);
    const morning_out = parseTime12(morning[1]);
    const afternoon_in = parseTime12(afternoon[0]);
    const afternoon_out = parseTime12(afternoon[1]);

    let undertime = 0;

    // ========================
    // PART-TIME TEACHER LOGIC
    // ========================
    if (type === 'part-time' && Array.isArray(loads) && loads.length > 0) {
      const todayLoads = loads.filter(l => 
        l.days.split(',').map(d => d.trim().toUpperCase()).includes(currentDay)
      );

      if (todayLoads.length === 0) return 0; // no schedule today → no undertime

      const allLogs = [morning_in, morning_out, afternoon_in, afternoon_out].filter(Boolean);

      todayLoads.forEach(l => {
        const loadStart = parseTime24(l.start_time);
        const loadEnd = parseTime24(l.end_time);
        let loadUndertime = 0;

        const logsWithinLoad = allLogs.filter(t => t >= loadStart - 60 && t <= loadEnd + 60);

        if (logsWithinLoad.length === 0) {
          loadUndertime = loadEnd - loadStart;
        } else {
          const minLog = Math.min(...logsWithinLoad);
          const maxLog = Math.max(...logsWithinLoad);

          if (minLog > loadStart) loadUndertime += (minLog - loadStart);
          if (maxLog < loadEnd) loadUndertime += (loadEnd - maxLog);
        }

        undertime += loadUndertime;
      });
    }

    return undertime;
  }

  // --- main payroll logic ---
  const month = req.query.month;
  const data = {
    title: "Payroll Part Time",
    name: req.name,
    employees: await GET_ALL_EMPLOYEE(),
    dtrmonths: await GET_DTR_MONTHS(),
    today: new Date().toDateString(),
  };

  data.employees = data.employees.filter(em => em.type === "part-time");
  data.employees.forEach(em => em.date_added = formatDate(em.date_added));

  if (month) {
    for (const employee of data.employees) {
      const loads = await GET_ALL_FACULTY_LOADS_BY_ID(employee.id);
      const employeedtr = await GET_DTR_FILTER_MONTH(month, employee.id);

      let totalWorkedMinutes = 0;
      let totalUndertimeMinutes = 0;

      for (const dtr of employeedtr) {
        const dtrDate = dtr.date;

        // get all loads for this DTR day
        const dayLoads = loads.filter(l =>
          l.days.split(',').map(d => d.trim().toUpperCase()).includes(
            new Date(dtrDate).toLocaleString('en-US', { weekday: 'short' }).toUpperCase()
          )
        );

        // --- Calculate undertime for this date ---
        const undertimeMinutes = calculateUndertime(dtr, employee.type, dayLoads, dtrDate);
        totalUndertimeMinutes += undertimeMinutes;

        // --- Calculate actual worked hours (same logic as before) ---
        let dayWorkedMinutes = 0;
        for (const load of dayLoads) {
          const start = parseTime24(load.start_time);
          const end = parseTime24(load.end_time);
          const loadDuration = end - start;
          dayWorkedMinutes += loadDuration - undertimeMinutes;
        }

        totalWorkedMinutes += Math.max(0, dayWorkedMinutes);
      }

      const hours = Math.floor(totalWorkedMinutes / 60);
      const minutes = totalWorkedMinutes % 60;

      employee.totalHoursWorked = `${hours}:${minutes.toString().padStart(2, "0")}`;
      const decimalHours = totalWorkedMinutes / 60;
      const hourlyRate = parseFloat(employee.hourly_salary) || 0;
      employee.totalPay = (decimalHours * hourlyRate).toFixed(2);

      const deductions = Number(employee.sss) + Number(employee.pagibig) + Number(employee.microdev);
      employee.netpay = (decimalHours * hourlyRate - deductions).toFixed(2);

      // Optional: store undertime separately for display
      const uHours = Math.floor(totalUndertimeMinutes / 60);
      const uMinutes = totalUndertimeMinutes % 60;
      employee.totalUndertime = `${uHours}:${uMinutes.toString().padStart(2, '0')}`;
    }
  }

  console.log(data.employees);
  res.render("admin/payroll", data);
});


router.get('/employees', async (req, res) => {

  const data = {
    title: "Employees",
    name: req.name,
    employees: await GET_ALL_EMPLOYEE(),
    dtrmonths: all_months,
    dtryear: all_years,
    today: (new Date()).toDateString(),
  }
  
  data.employees.forEach(em => {
    em.date_added = formatDate(em.date_added);  
  });

  res.render('admin/employees', data);
});


router.get('/facultyload', async (req, res) => {

  const data = {
    title: "Faculty Loads",
    name: req.name,
    employees: await GET_ALL_EMPLOYEE(),
    subjects: await GET_ALL_SUBJECT(),
    loads: await GET_ALL_FACULTY_LOADS(),
    today: (new Date()).toDateString(),
  }
  
  data.employees.forEach(em => {
    em.date_added = formatDate(em.date_added);  
  });
  

  data.loads.forEach(load => {
    const to12Hour = (time) => {
      const [hour, minute] = time.split(":");
      let h = parseInt(hour, 10);
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12; // convert 0 -> 12, 13 -> 1, etc.
      return `${h}:${minute} ${ampm}`;
    };

    load.start_time = to12Hour(load.start_time);
    load.end_time = to12Hour(load.end_time);
  });


  console.log(data);
  
  res.render('admin/facultyload', data);
});


router.get('/uploads', async (req, res) => {

  const data = {
    title: "Biometric Uploads",
    name: req.name,
    uploaded_files: await GET_ALL_UPLOADED_FILES(),
    today: (new Date()).toDateString(),
  }

  data.uploaded_files.forEach(file => {
    file.date_added = formatDate(file.date_added);
  });

  // console.log(data);
  
  res.render('admin/uploads', data);
});

router.get('/calendar', async (req, res) => {

  const data = {
    title: "Calendar",
    name: req.name,
    events: await GET_EVENTS(),
    today: (new Date()).toDateString(),
  }

  console.log(data);
  
  res.render('admin/calendar', data);
});
// router.post('/', async (req, res) => {
//   const { param } = req.body;

//   try {
    
//   } catch (error) {
//     console.error('AI error:', error);
//     res.status(500).json({ error: 'Failed to generate response' });
//   }
// });

export default router;