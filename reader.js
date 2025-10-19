import fs from 'fs';
import readline from 'readline';

const filePath = './routes/clean/AGL_20250815T141624813Z.TXT';

async function extractAttendanceData() {
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    const results = [];
    let isHeader = true;

    for await (const line of rl) {
        if (isHeader) {
            isHeader = false;
            continue;
        }

        const parts = line.trim().split(/\s+/);
        if (parts.length < 7) continue;

        const EnNo = parts[2];
        const nameParts = parts.slice(3, parts.length - 4);
        const Name = nameParts.join(' ');
        const GMNo = parts[parts.length - 4];
        const Mode = parts[parts.length - 3];
        const Date = parts[parts.length - 2];
        const Time = parts[parts.length - 1];

        results.push({
            EnNo,
            Name,
            GMNo,
            Mode,
            DateTime: `${Date} ${Time}`
        });
    }

    // Group by employee → date → AM/PM in/out
    const groupedByEmployee = {};

    results.forEach(entry => {
        const empNo = entry.EnNo;
        const date = entry.DateTime.split(" ")[0];
        const time = entry.DateTime.split(" ")[1];

        if (!groupedByEmployee[empNo]) {
            groupedByEmployee[empNo] = {
                employeeNo: empNo,
                name: entry.Name,
                days: {}
            };
        }

        if (!groupedByEmployee[empNo].days[date]) {
            groupedByEmployee[empNo].days[date] = {
                date,
                am_in: null,
                am_out: null,
                pm_in: null,
                pm_out: null
            };
        }

        if (entry.Mode === '0') { // Time IN
            if (!groupedByEmployee[empNo].days[date].am_in) {
                groupedByEmployee[empNo].days[date].am_in = time;
            } else {
                groupedByEmployee[empNo].days[date].pm_in = time;
            }
        } else if (entry.Mode === '1') { // Time OUT
            if (!groupedByEmployee[empNo].days[date].am_out) {
                groupedByEmployee[empNo].days[date].am_out = time;
            } else {
                groupedByEmployee[empNo].days[date].pm_out = time;
            }
        }
    });

    return Object.values(groupedByEmployee).map(emp => ({
        employeeNo: emp.employeeNo,
        name: emp.name,
        days: Object.values(emp.days)
    }));
}

// Usage
extractAttendanceData()
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(err => console.error(err));

