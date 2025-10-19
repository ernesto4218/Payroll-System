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
} from '../db/services.js';
import bcrypt from 'bcrypt';
import Decimal from "decimal.js";
import dayjs from "dayjs";


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
    eventsthismonth: await GET_EVENTS_MONTH(months[now.getMonth()] + " " + year),
    eventsthismonthnum: 0,
    monthlyPayroll: {},
    today: (new Date()).toDateString(),
  }

  data.eventsthismonthnum = data.eventsthismonth.length;

  data.eventsthismonth.forEach(event => {
    event.start = formatDate(event.start);
    event.end = formatDate(event.end);
  });

  data.allevents.forEach(event => {
    event.start = formatDate(event.start);
    event.end = formatDate(event.end);
  });

  console.log(data);

  // filter employees
  data.employees_data = data.employees_data.filter(em => em.type === 'full-time');
  data.employees_data.forEach(em => {
    em.date_added = formatDate(em.date_added);
  });

  for (const monthName of months) {
    const monthLabel = `${monthName} ${year}`;
    let totalPayroll = 0;

    // get events for this month
    const events = await GET_EVENTS_MONTH(monthLabel);

    for (const employee of data.employees_data) {
      // do the same payroll calculation you already have
      const employeedtr = await GET_DTR_FILTER_MONTH(monthLabel, employee.id);

      // ⚡ Instead of repeating everything here, you can refactor your payroll calculation
      // into a helper function:
      const { netpay } = await calculateEmployeePayroll(
        employee,
        employeedtr,
        events,
        monthLabel
      );

      totalPayroll += netpay;
    }

    data.monthlyPayroll[monthName] = totalPayroll;
  }

  async function calculateEmployeePayroll(employee, employeedtr, events, month) {
    let totalUndertimeMinutes = 0;
    let hasDTR = employeedtr.length > 0;

    function formatLocalDate(date) {
      const y = date.getFullYear();
      const m = (date.getMonth() + 1).toString().padStart(2, '0');
      const d = date.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${d}`;
    }

    function to12HourNoSuffix(time24) {
      if (!time24) return "";
      let [hour, minute] = time24.split(":").map(Number);
      const suffix = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute.toString().padStart(2, "0")} ${suffix}`;
    }

    function minutesToHoursMinutes(totalMinutes) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Extract year/month
    const [monthName, yearStr] = month.split(" ");
    const monthIndex = new Date(`${monthName} 1, ${yearStr}`).getMonth();
    const year = parseInt(yearStr);
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Map DTR
    const dtrMap = {};
    employeedtr.forEach(entry => {
      const day = new Date(entry.date).getDate();
      dtrMap[day] = entry;
    });

    // Map events
    const eventDates = new Set();
    events.forEach(ev => {
      const start = new Date(ev.start);
      const end = new Date(ev.end);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        eventDates.add(formatLocalDate(d));
      }
    });

    // Loop days
    for (let day = 1; day <= daysInMonth; day++) {
      const entry = dtrMap[day];
      const currentDateStr = formatLocalDate(new Date(year, monthIndex, day));
      const dayOfWeek = new Date(year, monthIndex, day).getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) continue; // weekend
      if (eventDates.has(currentDateStr)) continue; // holiday/event

      if (!entry) {
        totalUndertimeMinutes += 8 * 60; 
      } else if (entry?.message) {
        continue; // skip if has message
      } else {
        const morning = [
          to12HourNoSuffix(entry?.morning_time_in),
          to12HourNoSuffix(entry?.morning_time_out)
        ];
        const afternoon = [
          to12HourNoSuffix(entry?.afternoon_time_in),
          to12HourNoSuffix(entry?.afternoon_time_out)
        ];
        totalUndertimeMinutes += calcUndertimeFromArrays(morning, afternoon);
      }
    }

    // Salary calculation
    const monthsalary = new Decimal(employee.monthly_salary);
    const hourstotalmonth = new Decimal(daysInMonth).times(8);
    const hourlyrate = monthsalary.div(hourstotalmonth);
    const undertimeAmount = hourlyrate.times(totalUndertimeMinutes).div(60);

    let salarygross = hasDTR ? monthsalary.minus(undertimeAmount) : new Decimal(0);

    const deductions = new Decimal(employee.sss || 0)
      .plus(employee.microdev || 0)
      .plus(employee.pagibig || 0);

    let netpay = Math.max(0, salarygross - deductions);
    netpay = parseFloat(netpay.toFixed(2));

    return {
      undertime: minutesToHoursMinutes(totalUndertimeMinutes),
      undertimeAmount: undertimeAmount.toFixed(2),
      salarygross: salarygross.toFixed(2),
      netpay
    };

    // helper inside
    function calcUndertimeFromArrays(morning, afternoon) {
      function toMinutes(timeStr) {
        if (!timeStr) return null;
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'AM' && hours === 12) hours = 0;
        if (period === 'PM' && hours !== 12) hours += 12;
        return hours * 60 + minutes;
      }

      const official = {
        morning_in: toMinutes('8:00 AM'),
        morning_out: toMinutes('12:00 PM'),
        afternoon_in: toMinutes('1:00 PM'),
        afternoon_out: toMinutes('5:00 PM')
      };

      const morning_in = toMinutes(morning[0]);
      const morning_out = toMinutes(morning[1]);
      const afternoon_in = toMinutes(afternoon[0]);
      const afternoon_out = toMinutes(afternoon[1]);

      let undertime = 0;

      if (morning_in !== null && morning_in > official.morning_in) {
        undertime += morning_in - official.morning_in;
      }
      if (morning_out !== null) {
        if (morning_out < official.morning_out) undertime += official.morning_out - morning_out;
      } else {
        undertime += 4 * 60;
      }

      if (afternoon_in !== null && afternoon_in > official.afternoon_in) {
        undertime += afternoon_in - official.afternoon_in;
      }
      if (afternoon_out !== null) {
        if (afternoon_out < official.afternoon_out) undertime += official.afternoon_out - afternoon_out;
      } else {
        undertime += 4 * 60;
      }

      if (undertime > 8 * 60) undertime = 8 * 60;
      return undertime;
    }
  }


  console.log(data);
  
  res.render('admin/dashboard', data);
});

router.get('/payroll', async (req, res) => {
  const month = req.query.month; 
  let data = {
    title: "Payroll",
    name: req.name,
    employees: await GET_ALL_EMPLOYEE(),
    dtrmonths: await GET_DTR_MONTHS(),
    totalPayroll: 0,
    today: (new Date()).toDateString(),
  };
  
  // Format employee date_added
  data.employees = data.employees.filter(em => em.type === 'full-time');
  data.employees.forEach(em => {
    em.date_added = formatDate(em.date_added);  
  });


  if (month){
    data.events = await GET_EVENTS_MONTH(month);
    for (const employee of data.employees) {
      if (employee.type.toLowerCase() === 'full-time'){

        function formatLocalDate(date) {
            const y = date.getFullYear();
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const d = date.getDate().toString().padStart(2, '0');
            return `${y}-${m}-${d}`;
        }


        function to12HourNoSuffix(time24) {
            if (!time24) return ""; // handle null/empty
            let [hour, minute] = time24.split(":").map(Number);
            const suffix = hour >= 12 ? "PM" : "AM"; // determine AM or PM
            hour = hour % 12 || 12;                  // convert 0 → 12, 13 → 1, etc.
            return `${hour}:${minute.toString().padStart(2, "0")} ${suffix}`;
        }
        
        function minutesToHoursMinutes(totalMinutes) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

        const employeedtr = await GET_DTR_FILTER_MONTH(month, employee.id);
        let totalUndertimeMinutes = 0;
        let hasDTR = employeedtr.length > 0;
        
        // Extract year and month index from selectedMonth, e.g., "August 2025"
        const [monthName, yearStr] = month.split(" ");
        const monthIndex = new Date(`${monthName} 1, ${yearStr}`).getMonth(); // 0-based
        const year = parseInt(yearStr);
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        // Map DTR data by day
        const dtrMap = {};
        employeedtr.forEach(entry => {
            const day = new Date(entry.date).getDate();
            dtrMap[day] = entry;
        });

        // get events
        const eventDates = new Set();
        data.events.forEach(ev => {
            const start = new Date(ev.start);
            const end = new Date(ev.end);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dateStr = formatLocalDate(d); // use local date
                eventDates.add(dateStr);
            }
        });
        
        // Loop through all days
        for (let day = 1; day <= daysInMonth; day++) {
            const entry = dtrMap[day];
            const currentDateStr = formatLocalDate(new Date(year, monthIndex, day));
            const dayOfWeek = new Date(year, monthIndex, day).getDay();

            if (dayOfWeek === 6) { // Saturday
                
            } else if (dayOfWeek === 0) { // Sunday
                
            } else if (eventDates.has(currentDateStr)) { // Weekday with event
                
            } else { // Weekdays
                if (!entry){
                  totalUndertimeMinutes += 8 * 60; 
                  // console.log(employee, " IS ABSENT", entry);
                } else if (entry?.message){
                    
                } else {

                    if (employee.id === 4){
                      console.log(employee, " IS PRESENT", entry);
                    }
                    const morning = [
                        to12HourNoSuffix(entry?.morning_time_in),
                        to12HourNoSuffix(entry?.morning_time_out)
                        ];

                    const afternoon = [
                        to12HourNoSuffix(entry?.afternoon_time_in),
                        to12HourNoSuffix(entry?.afternoon_time_out)
                    ];

                    calculateUndertimeFromArrays(morning, afternoon)
                }
            }
        }

        // employeedtr
        // console.log(employeedtr);
        console.log(employee.first_name, totalUndertimeMinutes);
        
        function calculateUndertimeFromArrays(morning, afternoon) {
            function toMinutes(timeStr) {
                if (!timeStr) return null; // null if no time
                const [time, period] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);

                if (period === 'AM' && hours === 12) hours = 0;
                if (period === 'PM' && hours !== 12) hours += 12;

                return hours * 60 + minutes;
            }

            // Official hours in minutes
            const official = {
                morning_in: toMinutes('8:00 AM'),
                morning_out: toMinutes('12:00 PM'),
                afternoon_in: toMinutes('1:00 PM'),
                afternoon_out: toMinutes('5:00 PM')
            };

            const morning_in = toMinutes(morning[0]);
            const morning_out = toMinutes(morning[1]);
            const afternoon_in = toMinutes(afternoon[0]);
            const afternoon_out = toMinutes(afternoon[1]);

            let undertime = 0;

            // Morning
            if (morning_in !== null && morning_in > official.morning_in) {
                undertime += morning_in - official.morning_in;
            }
            if (morning_out !== null) {
                if (morning_out < official.morning_out) undertime += official.morning_out - morning_out;
            } else {
                // Missing morning out → full 4 hours
                undertime += 4 * 60;
            }

            // Afternoon
            if (afternoon_in !== null && afternoon_in > official.afternoon_in) {
                undertime += afternoon_in - official.afternoon_in;
            }
            if (afternoon_out !== null) {
                if (afternoon_out < official.afternoon_out) undertime += official.afternoon_out - afternoon_out;
            } else {
                // Missing afternoon out → full 4 hours
                undertime += 4 * 60;
            }

            // Cap maximum undertime to 8 hours
            if (undertime > 8 * 60) undertime = 8 * 60;

            // Convert minutes to HH:MM
            const hours = Math.floor(undertime / 60);
            const minutes = undertime % 60;

            totalUndertimeMinutes += undertime;
            return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
        }

        // append total undertime to employee
        employee.undertime = minutesToHoursMinutes(totalUndertimeMinutes);

        // calculate undertime amount
        const monthsalary = new Decimal(employee.monthly_salary);
        const hourstotalmonth = new Decimal(daysInMonth).times(8);
        const hourlyrate = monthsalary.div(hourstotalmonth);
        const undertimeAmount = hourlyrate.times(totalUndertimeMinutes).div(60);
        let salarygross;

        if (!hasDTR) {
            // ✅ No DTR at all → full 0 salary
            salarygross = new Decimal(0);
        } else {
            salarygross = monthsalary.minus(undertimeAmount);
        }


        // format for display (2 decimal places, no rounding errors)
        employee.undertimeAmount = undertimeAmount.toFixed(2);
        employee.salarygross = salarygross.toFixed(2);
        const deductions = new Decimal(employee.sss || 0)
          .plus(employee.microdev || 0)
          .plus(employee.pagibig || 0);

        employee.netpay = Math.max(0, salarygross - deductions);
        employee.netpay = parseFloat(employee.netpay.toFixed(2));
        data.totalPayroll += employee.netpay;
      }
    };
  }

  console.log(data.totalPayroll.toLocaleString());
  res.render('admin/payroll', data);

});

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
    dtrmonths: await GET_DTR_MONTHS(),
    today: (new Date()).toDateString(),
  }
  

  data.employees.forEach(em => {
    em.date_added = formatDate(em.date_added);  
  });

  console.log(data);
  
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

  console.log(data);
  
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
