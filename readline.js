import fs from "fs";
import readline from "readline";

const filePath = "uploaded_files/AGL_001.TXT"; // your TXT file
const outputPath = "./attendance_aligned.txt";

// define approximate column widths
const widths = [3, 5, 5, 10, 5, 5, 20]; // adjust based on your columns

function padColumns(columns) {
  return columns.map((col, i) => String(col).trim().padEnd(widths[i])).join("");
}

async function alignFile() {
  const rl = readline.createInterface({
    input: fs.createReadStream(filePath),
    crlfDelay: Infinity,
  });

  const output = fs.createWriteStream(outputPath);

  for await (const line of rl) {
    if (line.trim() === "") continue;
    // split by tabs or multiple spaces
    const columns = line.split(/\s+/);
    output.write(padColumns(columns) + "\n");
  }

  output.close();
  console.log("Aligned file saved to", outputPath);
}

alignFile();
