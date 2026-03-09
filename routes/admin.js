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
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // ========================
  // HELPERS (MATCH PAYROLL)
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

  // ========================
  // MONTHLY PAYROLL
  // ========================
  for (const monthName of months) {
    const month = `${monthName} ${year}`;
    const hasDTR = data.dtrmonths_data.some(row => row.month_year === month);
    if (!hasDTR) {
      data.monthlyPayroll[month] = 0;
      continue;
    }

    // Filter full-time only (match payroll route)
    let employees = await GET_ALL_EMPLOYEE();
    employees = employees.filter(em => em.type === 'full-time');

    let total_payroll = 0;

    const events_month = await GET_EVENTS_MONTH(month);

    // Build event date set (match payroll route)
    const eventDates = new Set();
    events_month.forEach(ev => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        eventDates.add(formatLocalDate(new Date(d)));
      }
    });

    const [mName, yStr] = month.split(" ");
    const yy = parseInt(yStr);
    const mm = new Date(`${mName} 1, ${yy}`).getMonth();
    const daysInMonth = new Date(yy, mm + 1, 0).getDate();

    for (let employee of employees) {
      employee.absent = 0;
      const empId = employee.b_id || employee.employee_id || employee.id;
      if (!empId) continue;

      const dtr = await GET_DTR_BY_EMPLOYEE_AND_MONTH(empId, month);
      let totalUndertime = 0;

      const dtrMap = {};
      dtr.forEach(entry => {
        const day = new Date(entry.date).getDate();
        dtrMap[day] = entry;
      });

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(yy, mm, day);
        const dayOfWeek = date.getDay();
        const entry = dtrMap[day];

        // Skip weekends
        if (dayOfWeek === 0 || dayOfWeek === 6) continue;

        // Skip event days (match payroll route)
        const currentDateStr = formatLocalDate(date);
        if (eventDates.has(currentDateStr)) continue;

        // Absent whole day
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

        // Morning
        const morningComplete = morning_in !== null && morning_out !== null;
        if (!morningComplete) {
          undertime += 4 * 60;
        } else {
          if (morning_in > official.morning_in)
            undertime += morning_in - official.morning_in;
          if (morning_out < official.morning_out)
            undertime += official.morning_out - morning_out;
        }

        // Afternoon
        const afternoonComplete = afternoon_in !== null && afternoon_out !== null;
        if (!afternoonComplete) {
          undertime += 4 * 60;
        } else {
          if (afternoon_in > official.afternoon_in)
            undertime += afternoon_in - official.afternoon_in;
          if (afternoon_out < official.afternoon_out)
            undertime += official.afternoon_out - afternoon_out;
        }

        // Cap to 8h
        if (undertime > 8 * 60) undertime = 8 * 60;

        totalUndertime += undertime;
      }

      // Final computation (match payroll route exactly)
      employee.totalUndertimeMinutes = totalUndertime;
      employee.daily_salary = Number(employee.monthly_salary) / daysInMonth;
      employee.hourly_salary = employee.daily_salary / 8;
      employee.minutes_salary = employee.hourly_salary / 60;

      employee.undertimeAmount = employee.totalUndertimeMinutes * employee.minutes_salary;
      employee.salaryGross = Number(employee.monthly_salary) - employee.undertimeAmount;

      employee.netpay =
        employee.salaryGross -
        (Number(employee.microdev || 0) +
          Number(employee.pagibig || 0) +
          Number(employee.sss || 0));

      total_payroll += employee.netpay;
      console.log(employee);
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
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  /**
   * Check if a DTR pair (in/out) falls within a load window.
   * Uses a 60-min tolerance to handle slight clock-in variations.
   */
  function pairMatchesLoad(pairIn, pairOut, loadStart, loadEnd) {
    if (pairIn === null || pairOut === null) return false;
    return pairIn <= loadEnd + 60 && pairOut >= loadStart - 60;
  }

  /**
   * Clip the actual time_in/time_out to the load window
   * and return worked minutes within that window.
   */
  function getClippedMinutes(pairIn, pairOut, loadStart, loadEnd) {
    const clippedIn  = Math.max(pairIn,  loadStart);
    const clippedOut = Math.min(pairOut, loadEnd);
    return Math.max(0, clippedOut - clippedIn);
  }

  /**
   * Given a load window and a DTR record,
   * find which DTR pair (morning or afternoon) matches the load window.
   * DTR times are in 24hr format (e.g. '08:35:00').
   * Returns actual clipped worked minutes within the load window.
   */
  function getWorkedMinutesForLoad(dtr, loadStart, loadEnd) {
    // ✅ DTR times are 24hr format — use parseTime24
    const morningIn    = parseTime24(dtr.morning_time_in);
    const morningOut   = parseTime24(dtr.morning_time_out);
    const afternoonIn  = parseTime24(dtr.afternoon_time_in);
    const afternoonOut = parseTime24(dtr.afternoon_time_out);

    // Try morning pair first
    if (pairMatchesLoad(morningIn, morningOut, loadStart, loadEnd)) {
      return getClippedMinutes(morningIn, morningOut, loadStart, loadEnd);
    }

    // Try afternoon pair
    if (pairMatchesLoad(afternoonIn, afternoonOut, loadStart, loadEnd)) {
      return getClippedMinutes(afternoonIn, afternoonOut, loadStart, loadEnd);
    }

    // No matching pair → absent for this load → no pay
    return 0;
  }

  /**
   * Calculate undertime in minutes for a single load window vs actual DTR.
   * Undertime = scheduled load duration - actual clipped worked minutes.
   */
  function getUndertimeForLoad(dtr, loadStart, loadEnd) {
    const scheduledMinutes = loadEnd - loadStart;
    const workedMinutes = getWorkedMinutesForLoad(dtr, loadStart, loadEnd);
    return Math.max(0, scheduledMinutes - workedMinutes);
  }

  try {
    const month = req.query.month;

    let data = {
      title: "Payroll Part Time",
      name: req.name,
      employees: await GET_ALL_EMPLOYEE(),
      dtrmonths: all_months,
      dtryears: all_years,
      totalPayroll: 0,
      today: new Date().toDateString(),
    };

    data.employees = data.employees.filter(em => em.type === "part-time");
    data.employees.forEach(em => em.date_added = formatDate(em.date_added));

    if (month) {

      // ========================
      // PARSE MONTH "January 2026"
      // ========================
      const [monthName, yearStr] = month.split(" ");
      const year = parseInt(yearStr);
      const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

      // ========================
      // BUILD ALL DATES IN MONTH
      // ========================
      const allDatesInMonth = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, monthIndex, day);
        const dateStr = formatLocalDate(dateObj);
        allDatesInMonth.push({ dateStr, dateObj });
      }

      // ========================
      // BUILD HOLIDAY / EVENT DATE SET
      // ========================
      const events_month = await GET_EVENTS_MONTH(month);
      const eventDates = new Set();
      events_month.forEach(ev => {
        const start = new Date(ev.start);
        const end   = new Date(ev.end);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          eventDates.add(formatLocalDate(new Date(d)));
        }
      });

      let total_payroll = 0;

      // ========================
      // EMPLOYEE LOOP
      // ========================
      for (const employee of data.employees) {

        const empId = employee.b_id;
        if (!empId) continue;

        const loads = await GET_ALL_FACULTY_LOADS_BY_ID(employee.id);
        const employeedtr = await GET_DTR_BY_EMPLOYEE_AND_MONTH(empId, month);

        // Map DTR records by date string for quick lookup
        const dtrByDate = {};
        for (const dtr of employeedtr) {
          const key = formatLocalDate(new Date(dtr.date));
          dtrByDate[key] = dtr;
        }

        let totalWorkedMinutes   = 0;
        let totalUndertimeMinutes = 0;
        let totalAbsentMinutes   = 0;

        // ========================
        // DAY LOOP
        // ========================
        for (const { dateStr, dateObj } of allDatesInMonth) {

          // Skip holidays/events
          if (eventDates.has(dateStr)) continue;

          const currentDay = days[dateObj.getDay()];

          // Get loads scheduled for this day of the week
          const dayLoads = loads.filter(l =>
            l.days.split(',').map(d => d.trim().toUpperCase()).includes(currentDay)
          );

          if (dayLoads.length === 0) continue; // no schedule this day

          const dtr = dtrByDate[dateStr];

          // ========================
          // LOAD LOOP
          // ========================
          for (const load of dayLoads) {
            const loadStart       = parseTime24(load.start_time);
            const loadEnd         = parseTime24(load.end_time);
            const scheduledMinutes = loadEnd - loadStart;

            if (!dtr || (
              !dtr.morning_time_in  &&
              !dtr.morning_time_out &&
              !dtr.afternoon_time_in &&
              !dtr.afternoon_time_out
            )) {
              // Fully absent for this load
              totalAbsentMinutes    += scheduledMinutes;
              totalUndertimeMinutes += scheduledMinutes;
              continue;
            }

            const workedMinutes   = getWorkedMinutesForLoad(dtr, loadStart, loadEnd);
            const undertimeMinutes = getUndertimeForLoad(dtr, loadStart, loadEnd);

            totalWorkedMinutes    += workedMinutes;
            totalUndertimeMinutes += undertimeMinutes;
          }
        }

        // ========================
        // FINAL COMPUTATION
        // ========================
        const workedHours = Math.floor(totalWorkedMinutes / 60);
        const workedMins  = totalWorkedMinutes % 60;
        employee.totalHoursWorked = `${workedHours}:${workedMins.toString().padStart(2, '0')}`;

        const uHours = Math.floor(totalUndertimeMinutes / 60);
        const uMins  = totalUndertimeMinutes % 60;
        employee.totalUndertime          = `${uHours}:${uMins.toString().padStart(2, '0')}`;
        employee.totalUndertimeFormatted = employee.totalUndertime; // ✅ for template

        const decimalHours = totalWorkedMinutes / 60;
        const hourlyRate   = parseFloat(employee.hourly_salary) || 0;

        // Undertime amount = undertime hours × hourly rate
        const undertimeDecimalHours  = totalUndertimeMinutes / 60;
        employee.undertimeAmount     = (undertimeDecimalHours * hourlyRate).toFixed(2); // ✅ for template

        employee.totalPay    = (decimalHours * hourlyRate).toFixed(2);
        employee.salaryGross = employee.totalPay; // ✅ for template (gross = total pay before deductions)

        const deductions =
          Number(employee.sss      || 0) +
          Number(employee.pagibig  || 0) +
          Number(employee.microdev || 0);

        employee.netpay = (decimalHours * hourlyRate - deductions).toFixed(2);

        total_payroll += parseFloat(employee.netpay);
      }

      data.monthDuration = `${monthName} 1-${daysInMonth} ${yearStr}`;
      data.daysInMonth   = daysInMonth;
      data.totalPayroll  = total_payroll;
      console.log("TOtal Payroll: ", total_payroll);

      // await UPDATE_PAYROLL_LATEST(total_payroll, month);
    }

    res.render("admin/payroll_parttime", data);

  } catch (error) {
    console.error("Payroll Part-Time Error:", error);
    res.status(500).send("Server Error");
  }
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