import express from 'express';
import bcrypt from 'bcrypt'
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { generateAuthToken, hashPassword } from './helpers.js';
import { 
  UPDATE_AUTH_TOKEN, 
  GET_BY_EMAIL, 
  GET_EMPLOYEE_BY_ID,
  ADD_NEW_EMPLOYEE,
  INSERT_FILE_UPLOAD,
  INSERT_DTR,
  GET_DTR_FILTER_MONTH,
  INSERT_EVENT,
  GET_EVENTS_MONTH,
  UPDATE_EMPLOYEE_BY_ID,
  UPDATE_RECORD_BY_ID,
  GET_DTR_FILTER_MONTH_PAYROLL,
  GET_ALL_EMPLOYEE,
  INSERT_TRAVEL_ORDER,
  INSERT_SUBJECT,
  DELETE_SUBJECT_BY_ID,
  INSERT_FACULTY_LOAD,
  DELETE_FACULTY_LOAD_BY_ID,
  GET_ALL_FACULTY_LOADS,
  GET_ALL_FACULTY_LOADS_BY_ID
} from '../db/services.js';
import fs from "fs";
import readline from "readline";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads')); // make sure uploads folder exists
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // keeps .txt
    const timestamp = new Date().toISOString().replace(/[-:.]/g, ""); // e.g., 20250815T135245
    const now = new Date();
    const readableTimestamp = now.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/[,]/g, '').replace(/\s+/g, '_').replace(/:/g, '-');

    // Example: Mon_Oct_13_2025_23-48-59
    const filename = `AGL_${readableTimestamp}${ext}`;

    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.txt') cb(null, true);
  else cb(new Error('Only .txt files are allowed'), false);
};

const upload = multer({ storage, fileFilter });

router.post('/', async (req, res) => {
  const { param } = req.body;

  try {
    
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  try {
    const acc = await GET_BY_EMAIL(email);
    console.log(acc);
    if (!acc || !(await bcrypt.compare(password, acc.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = await generateAuthToken();
    console.log(token);
    console.log(acc.id);

    await UPDATE_AUTH_TOKEN(token, acc.id);

    res.cookie('auth_token', token, {
      httpOnly: true,      // Prevents JS access to cookie (good for security)
      secure: process.env.NODE_ENV === 'production',  // Only send cookie over HTTPS in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      sameSite: 'lax'      // Adjust based on your cross-site cookie policy
    });
    
    res.status(200).json({ success: true, token, message: 'Login successful.', role: acc.role },);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

router.post('/add-employee', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);

    const user = await GET_EMPLOYEE_BY_ID(formFields.B_ID);
    if (!user){
        await ADD_NEW_EMPLOYEE(formFields.B_ID, formFields.B_Name, formFields['employment-type'], formFields.designation, formFields.Monthly_salary_input || 0, formFields.Hourly_salary_input || 0, formFields.sss_monthly || 0, formFields.microdev_monthly || 0, formFields.First_name, formFields.Middle_name, formFields.Last_name);
        res.status(200).json({
            success: true,
            message: 'Employee added successfully',
            formData: formFields,
        });
    } else {
      res.status(200).json({ message: 'Employee already exists.' });
    }
    

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/edit-employee', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);

    const user = await GET_EMPLOYEE_BY_ID(formFields.B_ID);
    if (user){
        await UPDATE_EMPLOYEE_BY_ID(formFields.B_Name, formFields['employment-type2'], formFields.designation, formFields.Monthly_edit_salary_input || 0, formFields.Hourly_edit_salary_input || 0, formFields.sss_monthly || 0, formFields.microdev_monthly || 0, formFields.First_name, formFields.Middle_name, formFields.Last_name, formFields.B_ID);
        res.status(200).json({
            success: true,
            message: 'Employee edited successfully',
            // formData: formFields,
        });
    } else {
      res.status(200).json({ message: 'Employee does not exists.' });
    }
  
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/edit-record', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);

    const user = await GET_EMPLOYEE_BY_ID(formFields.employee_id);
    console.log(user);
    if (user){
      function stringToTime(timeStr) {
        if (!timeStr) return null;
        const [hours, minutes, seconds] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes, seconds || 0, 0);
        return date;
      }

      await UPDATE_RECORD_BY_ID(
        stringToTime(formFields.morning_timein),
        stringToTime(formFields.morning_timeout),
        stringToTime(formFields.afternoon_timein),
        stringToTime(formFields.afternoon_timeout),
        formFields.record_id,
        formFields.employee_id
      );      
      
      res.status(200).json({
          success: true,
          message: 'Record edited successfully',
          // formData: formFields,
      });
    } else {
      res.status(200).json({ message: 'Employee does not exists.' });
    }
  
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

// router.post('/upload-file', upload.single('drop-file'), async (req, res) => {
//   try {
//     const outputPath = "./routes/clean/" + req.file.filename;

//     const widths = [3, 5, 5, 10, 5, 5, 20];
//     function padColumns(columns) {
//       return columns.map((col, i) => String(col).trim().padEnd(widths[i] || col.length)).join("");
//     }

//     async function alignFile() {
//       const rl = readline.createInterface({
//         input: fs.createReadStream(req.file.path), // use correct file path
//         crlfDelay: Infinity,
//       });
    
//       const output = fs.createWriteStream(outputPath);
    
//       for await (const line of rl) {
//         if (line.trim() === "") continue;
//         const columns = line.split(/\s+/);
//         output.write(padColumns(columns) + "\n");
//       }
    
//       output.end();
//       console.log("Aligned file saved to", outputPath);
//     }

//     await alignFile(); // wait for processing to finish

//     //read file
//     async function extractAttendanceData() {
//         const fileStream = fs.createReadStream(outputPath);
//         const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });
    
//         const results = [];
//         let isHeader = true;
    
//         for await (const line of rl) {
//             if (isHeader) {
//                 isHeader = false;
//                 continue;
//             }
    
//             const parts = line.trim().split(/\s+/);
//             if (parts.length < 7) continue;
    
//             // const EnNo = parts[2];
//             // const nameParts = parts.slice(3, parts.length - 4);
//             // const Name = nameParts.join(' ');
//             // const GMNo = parts[parts.length - 4];
//             // const Mode = parts[parts.length - 3];
//             // const Date = parts[parts.length - 2];
//             // const Time = parts[parts.length - 1];
//             const EnNo = parts[2];
//             const Name = parts[3];       
//             const GMNo = parts[4];
//             const Mode = parts[5];
//             const Date = parts[6];
//             const Time = parts[7];

//             results.push({
//                 EnNo,
//                 Name,
//                 GMNo,
//                 Mode,
//                 DateTime: `${Date} ${Time}`
//             });
//         }
    
//         // Group by employee → date → AM/PM in/out
//         const groupedByEmployee = {};
    
//         results.forEach(entry => {
//             const empNo = entry.EnNo;
//             const date = entry.DateTime.split(" ")[0];
//             const time = entry.DateTime.split(" ")[1];
    
//             if (!groupedByEmployee[empNo]) {
//                 groupedByEmployee[empNo] = {
//                     employeeNo: empNo,
//                     name: entry.Name,
//                     days: {}
//                 };
//             }
    
//             if (!groupedByEmployee[empNo].days[date]) {
//                 groupedByEmployee[empNo].days[date] = {
//                     date,
//                     am_in: null,
//                     am_out: null,
//                     pm_in: null,
//                     pm_out: null
//                 };
//             }
    
//             if (entry.Mode === '0') { // Time IN
//                 if (!groupedByEmployee[empNo].days[date].am_in) {
//                     groupedByEmployee[empNo].days[date].am_in = time;
//                 } else {
//                     groupedByEmployee[empNo].days[date].pm_in = time;
//                 }
//             } else if (entry.Mode === '1') { // Time OUT
//                 if (!groupedByEmployee[empNo].days[date].am_out) {
//                     groupedByEmployee[empNo].days[date].am_out = time;
//                 } else {
//                     groupedByEmployee[empNo].days[date].pm_out = time;
//                 }
//             }
//         });
    
//         return Object.values(groupedByEmployee).map(emp => ({
//             employeeNo: emp.employeeNo,
//             name: emp.name,
//             days: Object.values(emp.days)
//         }));
//     }

//     // Usage
//     const groupedData = await extractAttendanceData();
//     for (const emp of groupedData) {
//       const employeeId = emp.employeeNo;
//       for (const day of emp.days) {
//         console.log(groupedData);
//         await INSERT_DTR(
//           employeeId,
//           day.am_in || null,
//           day.am_out || null,
//           day.pm_in || null,
//           day.pm_out || null,
//           day.date
//         );
//       }
//     }

//     console.log('Form fields:', req.body);
//     console.log('Uploaded file:', req.file);

//     await INSERT_FILE_UPLOAD(req.file.filename, req.file.path);

//     res.json({
//       success: true,
//       message: 'File uploaded successfully!',
//       filename: req.file.originalname
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     res.status(500).json({ success: false, message: 'Error saving file' });
//   }
// });

router.post('/upload-file', upload.single('drop-file'), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Parse the uploaded file
    async function extractAttendanceData() {
      const fileStream = fs.createReadStream(filePath);
      const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

      const results = [];
      let isHeader = true;

      for await (const line of rl) {
        if (!line.trim()) continue; // skip empty lines
        if (isHeader) { isHeader = false; continue; }

        // Split by tab first, fallback to spaces
        let parts = line.split('\t');
        if (parts.length < 7) parts = line.trim().split(/\s+/);

        if (parts.length < 7) continue; // still invalid

        const EnNo = parseInt(parts[2], 10); // numeric employee id
        if (isNaN(EnNo)) continue; // skip if not a number

        const GMNo = parts[4];
        const Mode = parts[5];
        const DateTime = parts[6]; // "YYYY/MM/DD HH:MM:SS"

        results.push({ EnNo, GMNo, Mode, DateTime });
      }

      // Group by employee → date → AM/PM
      const groupedByEmployee = {};
      results.forEach(entry => {
        const empNo = entry.EnNo;
        const [date, time] = entry.DateTime.split(" ");

        if (!groupedByEmployee[empNo]) groupedByEmployee[empNo] = { employeeNo: empNo, days: {} };
        if (!groupedByEmployee[empNo].days[date]) groupedByEmployee[empNo].days[date] = { date, am_in: null, am_out: null, pm_in: null, pm_out: null };

        if (entry.Mode === '0') {
          if (!groupedByEmployee[empNo].days[date].am_in) groupedByEmployee[empNo].days[date].am_in = time;
          else groupedByEmployee[empNo].days[date].pm_in = time;
        } else if (entry.Mode === '1') {
          if (!groupedByEmployee[empNo].days[date].am_out) groupedByEmployee[empNo].days[date].am_out = time;
          else groupedByEmployee[empNo].days[date].pm_out = time;
        }
      });

      return Object.values(groupedByEmployee).map(emp => ({
        employeeNo: emp.employeeNo,
        days: Object.values(emp.days)
      }));
    }

    const groupedData = await extractAttendanceData();
    console.log(groupedData);

    // Insert into DTR table
    for (const emp of groupedData) {
      const employeeId = emp.employeeNo;
      for (const day of emp.days) {
        await INSERT_DTR(
          employeeId,
          day.am_in || null,
          day.am_out || null,
          day.pm_in || null,
          day.pm_out || null,
          day.date
        );
      }
    }

    // Save file upload record
    await INSERT_FILE_UPLOAD(req.file.filename, req.file.path);

    res.json({
      success: true,
      message: 'File uploaded and attendance saved successfully!',
      filename: req.file.originalname
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Error saving file' });
  }
});

router.post('/select-month', async (req, res) => {
  try {
    const formFields = req.body;
    const eventthismonth = await GET_EVENTS_MONTH(formFields.month);
    const facultyload = await GET_ALL_FACULTY_LOADS_BY_ID(formFields.id);
    const get_employee_info = await GET_EMPLOYEE_BY_ID(formFields.id);

    // console.log(formFields.month);
    // console.log(formFields.id);
    // console.log(eventthismonth);
    console.log("Faculty Load : ");
    console.log(facultyload);
    // console.log(get_employee_info);

    const dtr = await GET_DTR_FILTER_MONTH(formFields.month, formFields.id);
    // console.log(dtr);

    res.status(200).json({
      success: true,
      dtr: dtr,
      events: eventthismonth,
      load: facultyload,
      employee: get_employee_info,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/select-month-payroll', async (req, res) => {
  try {
    const formFields = req.body;

    console.log(formFields.month);
    console.log(formFields.id);

    const dtr = await GET_DTR_FILTER_MONTH_PAYROLL(formFields.month);
    console.log(dtr);

    res.status(200).json({
      success: true,
      dtr: dtr,
      employees: await GET_ALL_EMPLOYEE()
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/select-month-record', async (req, res) => {
  try {
    const formFields = req.body;

    console.log(formFields.month);
    console.log(formFields.id);

    const get_employee_info = await GET_EMPLOYEE_BY_ID(formFields.id);
    const dtr = await GET_DTR_FILTER_MONTH(formFields.month, formFields.id);

    res.status(200).json({
      success: true,
      dtr: dtr,
      employee: get_employee_info
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/add-event', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);
    
    const [month, day, year] = formFields.start.split("/");
    const formattedDateStart = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const [month2, day2, year2] = formFields.end.split("/");
    const formattedDateEnd = `${year2}-${month2.padStart(2, "0")}-${day2.padStart(2, "0")}`;

    console.log('start : ', formattedDateStart);
    console.log('end : ', formattedDateEnd);
    await INSERT_EVENT(formattedDateStart, formattedDateEnd, formFields.message || null);
    res.status(200).json({
      success: true,
      message: "Event added to calendar.",
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/add-subject', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);
    
    await INSERT_SUBJECT(formFields.sub_id, formFields.sub_desc);
    res.status(200).json({
      success: true,
      message: "Subject added successfully.",
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/add-travel-order', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);
    
    const [monthName, year] = formFields.selected_month.split(" ");
    const monthNumber = new Date(`${monthName} 1, ${year}`).getMonth() + 1;
    const formattedDate = `${year}-${String(monthNumber).padStart(2, "0")}-${String(formFields.dtrid).padStart(2, "0")}`;

    await INSERT_TRAVEL_ORDER(formFields.E_ID, "8:00", "12:00", "12:01", "5:00", formFields.message, formattedDate);
    console.log("travel order on : ", formattedDate);
    res.status(200).json({
      success: true,
      message: "Travel order added successfully.",
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/delete-subject', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);
    
    await DELETE_SUBJECT_BY_ID(formFields.id);
    res.status(200).json({
      success: true,
      message: "Subject deleted successfully.",
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/add-faculty-load', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);
    
    const schedule = [
      formFields.SUN,
      formFields.MON,
      formFields.TUE,
      formFields.WED,
      formFields.THU,
      formFields.FRI,
      formFields.SAT
    ].filter(day => day && day.trim() !== "").join(", ");

    console.log(schedule);
    await INSERT_FACULTY_LOAD(formFields.employee_id, formFields.sub_id, formFields.starttime, formFields.endtime, schedule);
    res.status(200).json({
      success: true,
      message: "Faculty load added successfully.",
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

router.post('/delete-faculty-load', async (req, res) => {
  try {
    const formFields = req.body;
    console.log(formFields);
    
    await DELETE_FACULTY_LOAD_BY_ID(formFields.id);
    res.status(200).json({
      success: true,
      message: "Faculty load deleted successfully.",
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

export default router;
