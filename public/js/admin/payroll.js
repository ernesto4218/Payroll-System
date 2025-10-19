if (document.getElementById("search-table") && typeof simpleDatatables.DataTable !== 'undefined') {

    const table = new simpleDatatables.DataTable("#search-table", {
        perPage: 15,
        perPageSelect: false,
        template: (options, dom) => "<div class='" + options.classes.top + "'>" +
            "<div class='flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse w-full sm:w-auto'>" +
            (options.paging && options.perPageSelect ?
                "<div class='" + options.classes.dropdown + "'>" +
                    "<label>" +
                        "<select class='" + options.classes.selector + "'></select> " + options.labels.perPage +
                    "</label>" +
                "</div>" : ""
            ) + "<button id='exportDropdownButton' type='button' class='flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 0 sm:w-auto'>" +
            "Export as" +
            "<svg class='-me-0.5 ms-1.5 h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>" +
                "<path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7' />" +
            "</svg>" +
        "</button>" +
        "<div id='exportDropdown' class='z-10 hidden w-52 divide-y divide-gray-100 rounded-lg bg-white shadow-sm  data-popper-placement='bottom'>" +
            "<ul class='p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400' aria-labelledby='exportDropdownButton'>" +
                "<li>" +
                    "<button id='export-csv' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 '>" +
                        "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 ' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
                            "<path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm1.018 8.828a2.34 2.34 0 0 0-2.373 2.13v.008a2.32 2.32 0 0 0 2.06 2.497l.535.059a.993.993 0 0 0 .136.006.272.272 0 0 1 .263.367l-.008.02a.377.377 0 0 1-.018.044.49.49 0 0 1-.078.02 1.689 1.689 0 0 1-.297.021h-1.13a1 1 0 1 0 0 2h1.13c.417 0 .892-.05 1.324-.279.47-.248.78-.648.953-1.134a2.272 2.272 0 0 0-2.115-3.06l-.478-.052a.32.32 0 0 1-.285-.341.34.34 0 0 1 .344-.306l.94.02a1 1 0 1 0 .043-2l-.943-.02h-.003Zm7.933 1.482a1 1 0 1 0-1.902-.62l-.57 1.747-.522-1.726a1 1 0 0 0-1.914.578l1.443 4.773a1 1 0 0 0 1.908.021l1.557-4.773Zm-13.762.88a.647.647 0 0 1 .458-.19h1.018a1 1 0 1 0 0-2H6.647A2.647 2.647 0 0 0 4 13.647v1.706A2.647 2.647 0 0 0 6.647 18h1.018a1 1 0 1 0 0-2H6.647A.647.647 0 0 1 6 15.353v-1.706c0-.172.068-.336.19-.457Z' clip-rule='evenodd'/>" +
                        "</svg>" +
                        "<span>Export CSV</span>" +
                    "</button>" +
                "</li>" +
                "<li>" +
                    "<button id='export-json' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 '>" +
                        "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 ' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
                            "<path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm-.293 9.293a1 1 0 0 1 0 1.414L9.414 14l1.293 1.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0Zm2.586 1.414a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L14.586 14l-1.293-1.293Z' clip-rule='evenodd'/>" +
                        "</svg>" +
                        "<span>Export JSON</span>" +
                    "</button>" +
                "</li>" +
                "<li>" +
                    "<button id='export-txt' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 '>" +
                        "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 ' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
                            "<path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7ZM8 16a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1-5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z' clip-rule='evenodd'/>" +
                        "</svg>" +
                        "<span>Export TXT</span>" +
                    "</button>" +
                "</li>" +
            "</ul>" +
        "</div>" + "</div>" +
            (options.searchable ?
                "<div class='" + options.classes.search + "'>" +
                    "<input class='" + options.classes.input + "' placeholder='" + options.labels.placeholder + "' type='search' title='" + options.labels.searchTitle + "'" + (dom.id ? " aria-controls='" + dom.id + "'" : "") + ">" +
                "</div>" : ""
            ) +
        "</div>" +
        "<div class='" + options.classes.container + "'" + (options.scrollY.length ? " style='height: " + options.scrollY + "; overflow-Y: auto;'" : "") + "></div>" +
        "<div class='" + options.classes.bottom + "'>" +
            (options.paging ?
                "<div class='" + options.classes.info + "'></div>" : ""
            ) +
            "<nav class='" + options.classes.pagination + "'></nav>" +
        "</div>"
    })
    
    const $exportButton = document.getElementById("exportDropdownButton");
    const $exportDropdownEl = document.getElementById("exportDropdown");
    const visibleColumnIndexes = table.columns.settings
        .map((col, index) => col.hidden ? null : index)
        .filter(index => index !== null);
    const columnIndexesExcludingLast = visibleColumnIndexes.slice(0, -1);

    const dropdown = new Dropdown($exportDropdownEl, $exportButton);
    console.log(dropdown)

    document.getElementById("export-csv").addEventListener("click", () => {
        simpleDatatables.exportCSV(table, {
            filename: "payroll_data",
            download: true,
            lineDelimiter: "\n",
            columnDelimiter: ";",
            columns: columnIndexesExcludingLast
        });
    });

    document.getElementById("export-txt").addEventListener("click", () => {
        simpleDatatables.exportTXT(table, {
            filename: "payroll_data",
            download: true,
            columns: columnIndexesExcludingLast
        });
    });

    document.getElementById("export-json").addEventListener("click", () => {
        simpleDatatables.exportJSON(table, {
            filename: "payroll_data",
            download: true,
            space: 3,
            columns: columnIndexesExcludingLast
        });
    });

    const releasefulltimeparent = document.getElementById('releasefulltimeparent');
    const search = document.querySelector('.datatable-search');
    const monthdata = JSON.parse(document.getElementById('search-table').getAttribute('data-months'));
    console.log(monthdata);
    search.classList.add('flex','flex-row','gap-2','items-center');

    search.innerHTML += `
        <form class="w-50">
        <select id="selectmonth" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full p-2.5">
            <option selected disabled>Choose</option>
        </select>
        </form>
        <a href="/admin/payroll-part-time">
            <button type="button" class="flex flex-row gap-2 items-center text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-2.5 py-2.5">
            <svg class="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/></svg>
            Part Time</button>
        </a>
        <a id="releasepayrollbtn" href="#">
            <button type="button" class="flex flex-row gap-2 items-center text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2.5 py-2.5">
            <svg class="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M192 64C156.7 64 128 92.7 128 128L128 368L310.1 368L279.1 337C269.7 327.6 269.7 312.4 279.1 303.1C288.5 293.8 303.7 293.7 313 303.1L385 375.1C394.4 384.5 394.4 399.7 385 409L313 481C303.6 490.4 288.4 490.4 279.1 481C269.8 471.6 269.7 456.4 279.1 447.1L310.1 416.1L128 416.1L128 512.1C128 547.4 156.7 576.1 192 576.1L448 576.1C483.3 576.1 512 547.4 512 512.1L512 234.6C512 217.6 505.3 201.3 493.3 189.3L386.7 82.7C374.7 70.7 358.5 64 341.5 64L192 64zM453.5 240L360 240C346.7 240 336 229.3 336 216L336 122.5L453.5 240z"/></svg>
            Release</button>
        </a>
    `

    let selected_month;

    const select = document.getElementById('selectmonth');
    monthdata.forEach(item => {
        const option = document.createElement('option');
        option.value = item.month_year;
        option.textContent = item.month_year;
        select.appendChild(option);
    });

    select.addEventListener('change', function () {
        selected_month = this.value;
        if (selected_month) {
            window.location.href = `?month=${encodeURIComponent(selected_month)}`;
        }
    });

    const releasepayrollbtn = document.getElementById('releasepayrollbtn');
    releasepayrollbtn.onclick = function () {
        const params = new URLSearchParams(window.location.search);
        const month = params.get("month");

        if (month) {
            releasefulltimeparent.classList.remove('hidden');
            releasefulltimeparent.classList.add('flex');
            
            const release_form_table = document.getElementById('release_form_table');
            const tbody = release_form_table.querySelector("tbody");
            tbody.innerHTML = ""; // clear old rows

            const visibleRows = document
            .getElementById("search-table")
            .querySelectorAll("tr");

            visibleRows.forEach((row, i) => {
                if (i >= 1) { // skip header row
                    const cells = row.querySelectorAll("td");
                    const values = Array.from(cells).map(cell => cell.innerText.trim());
                    console.log(values);

                    // Expected values array structure:
                    // [no, name, designation, monthlySalary, undertimeH, undertimeM, undertimeAmount, gross, sss, pagibig, microdev, net]

                    const tr = document.createElement("tr");
                    tr.className = "odd:bg-white even:bg-gray-50";

                    // No.
                    tr.innerHTML += `<td class="px-3 py-1 border border-gray-200">${values[0]}</td>`;

                    // Emp No.
                    tr.innerHTML += `<td class="px-3 py-1 border border-gray-200">${values[1]}</td>`;

                    // Name
                    tr.innerHTML += `<td class="px-3 py-1 border border-gray-200">${values[2]}</td>`;

                    // COS
                    tr.innerHTML += `<td class="px-3 py-1 border border-gray-200">${values[3]}</td>`;

                    // Designation
                    tr.innerHTML += `<td class="px-3 py-1 border border-gray-200">${values[4]}</td>`;

                    // Monthly Salary
                    tr.innerHTML += `<td class="px-3 py-1 border border-gray-200">${values[5]}</td>`;

                    // Undertime (H, M, Amount)
                    const hmparts = values[6].split("\n").map(s => s.trim());
                    tr.innerHTML += `
                    <td class="px-3 py-1 border border-gray-200">
                    <div class="text-gray-600 flex flex-row justify-between w-full">
                        <p class="w-1/2 text-center">${hmparts[0]}</p>
                        <p class="w-1/2 text-center">${hmparts[1]}</p>
                    </div>
                    </td>
                    `;


                    // Gross this period
                    tr.innerHTML += `<td class="px-3 py-1 border border-gray-200">${values[7]}</td>`;

                    // Deductions (SSS, Pag-IBIG, Microdev)
                    const deductparts = values[8].split("\n").map(s => s.trim());
                    tr.innerHTML += `
                    <td class="px-3 py-1 border border-gray-200">
                        <div class="text-gray-600 flex flex-row justify-between w-full">
                        <p class="w-1/3 text-center">${deductparts[0]}</p>
                        <p class="w-1/3 text-center">${deductparts[1]}</p>
                        <p class="w-1/3 text-center">${deductparts[2]}</p>
                        </div>
                    </td>
                    `;

                    // Net this period
                    tr.innerHTML += `<td class="px-3 py-1 border border-gray-200 font-medium">${values[9]}</td>`;

                    tbody.appendChild(tr);
                }
            });


        } else {
            showToast("error", "Please select a month.");
        }
    };

    const closerealeaseparentbtn = document.getElementById('closerealeaseparentbtn');
    closerealeaseparentbtn.onclick = function() {
        releasefulltimeparent.classList.remove('flex');
        releasefulltimeparent.classList.add('hidden');
    };

const { jsPDF } = window.jspdf;
function sanitizeColors(node) {
    node.querySelectorAll("*").forEach(el => {
        const style = window.getComputedStyle(el);

        if (style.color.includes("oklch")) {
            el.style.color = "#374151"; // fallback text color
        }
        if (style.backgroundColor.includes("oklch")) {
            el.style.backgroundColor = "#ffffff"; // fallback bg
        }
        if (style.borderColor.includes("oklch")) {
            el.style.borderColor = "#e5e7eb"; // fallback border
        }
    });
}

printreleasefullbtn.onclick = function () {
    const element = document.getElementById("payrollfullprint");

    sanitizeColors(element);

    const scale = 4; // increase for sharper text

    domtoimage.toPng(element, {
        width: element.offsetWidth * scale,
        height: element.offsetHeight * scale,
        style: {
            transform: "scale(" + scale + ")",
            transformOrigin: "top left",
            width: element.offsetWidth + "px",
            height: element.offsetHeight + "px"
        }
    })
    .then(dataUrl => {
        // Custom size: long bond (8.5 x 13 in) landscape
        const pdf = new jsPDF("landscape", "pt", [936, 612]);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const img = new Image();
        img.src = dataUrl;
        img.onload = function() {
            const ratio = Math.min(pageWidth / img.width, pageHeight / img.height);
            const imgWidth = img.width * ratio;
            const imgHeight = img.height * ratio;

            pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save("payroll.pdf");
        };
    })
    .catch(error => {
        console.error("Export failed:", error);
    });
};
}
