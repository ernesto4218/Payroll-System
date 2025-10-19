if (document.getElementById("search-table") && typeof simpleDatatables.DataTable !== 'undefined') {
    const table = new simpleDatatables.DataTable("#search-table", {
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
            filename: "employees_data",
            download: true,
            lineDelimiter: "\n",
            columnDelimiter: ";",
            columns: columnIndexesExcludingLast
        });
    });

    document.getElementById("export-txt").addEventListener("click", () => {
        simpleDatatables.exportTXT(table, {
            filename: "employees_data",
            download: true,
            columns: columnIndexesExcludingLast
        });
    });

    document.getElementById("export-json").addEventListener("click", () => {
        simpleDatatables.exportJSON(table, {
            filename: "employees_data",
            download: true,
            space: 3,
            columns: columnIndexesExcludingLast
        });
    });

    const search = document.querySelector('.datatable-search');
    search.classList.add('flex','flex-row','gap-2','items-center');

    search.innerHTML += `<button id="addemployeebtn" type="button" class="flex flex-row items-center gap-2 text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5">
        <svg class="w-4 h-4" fill='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
    Add</button>`

    const addemployeeformparent = document.getElementById('addemployeeformparent');
    const addemployeebtn = document.getElementById('addemployeebtn');
    const Monthly_salary = document.getElementById('Monthly_salary');
    const Hourly_salary = document.getElementById('Hourly_salary');
    const addemployeeform = document.getElementById('addemployeeform');
    const Monthly_salary_input = document.getElementById('Monthly_salary_input');
    const Hourly_salary_input = document.getElementById('Hourly_salary_input');
    const closeaddemployeeform = document.getElementById('closeaddemployeeform');
    const viewdtrformparent = document.getElementById('viewdtrformparent');
    const closedtrform = document.getElementById('closedtrform');
    const monthselector = document.getElementById('monthselector');
    const tbody = document.getElementById("dtrtable"); // Select the table body
    const dtrduplicate = document.getElementById('dtrduplicate');
    const editemployeeformparent = document.getElementById('editemployeeformparent');
    const closeeditemployeeform = document.getElementById('closeeditemployeeform');
    const Monthly_edit_salary = document.getElementById('Monthly_edit_salary');
    const Hourly_edit_salary = document.getElementById('Hourly_edit_salary');
    const editemployeeform = document.getElementById('editemployeeform');
    const Hourly_edit_salary_input = document.getElementById('Hourly_edit_salary_input');
    const Monthly_edit_salary_input = document.getElementById('Monthly_edit_salary_input');
    const monthselectorrecords = document.getElementById('monthselectorrecords');
    const recordsparent = document.getElementById('recordsparent');
    const closerecordsform = document.getElementById('closerecordsform');
    const recordbody = document.querySelector('#search-table-records tbody');
    const editrecordformparent = document.getElementById('editrecordformparent');
    const closeeditrecordform = document.getElementById('closeeditrecordform');
    const editrecordform = document.getElementById('editrecordform');
    const addtravelorderform = document.getElementById('addtravelorderform');
    const addtravelorderformparent = document.getElementById('addtravelorderformparent');
    const closeaddtravelorderform = document.getElementById('closeaddtravelorderform');

    let selected_employee_id = 0;

    var totalUndertimeMinutes = 0;

    recordbody.addEventListener('click', function(e) {
        const target = e.target;
        console.log(target);
        // Travel Order button
        if (target.classList.contains('travelorderbtn')) {
            const row = target.closest('tr');
            console.log('Travel order clicked for row:', row);

            // Show travel order form
            addtravelorderformparent.classList.remove('hidden');
            addtravelorderformparent.classList.add('flex');
        }

        // Edit button
        if (target.classList.contains('editrecordbtn')) {
            const entryData = JSON.parse(target.dataset.dtr);
            const employeeData = JSON.parse(target.dataset.employee);

            console.log('Edit clicked for:', entryData, employeeData);

            // Show edit form
            editFormParent.classList.remove('hidden');
            editFormParent.classList.add('flex');

            // Populate the form fields using entryData
        }
    });

    addemployeebtn.onclick = function() {
        addemployeeformparent.classList.remove('hidden');
        addemployeeformparent.classList.add('flex');
    };

    closeaddemployeeform.onclick = function() {
        addemployeeform.reset();
        addemployeeformparent.classList.remove('flex');
        addemployeeformparent.classList.add('hidden');
    };

    closedtrform.onclick = function() {
        viewdtrformparent.classList.add('hidden');
        viewdtrformparent.classList.remove('flex');
    };

    closeeditemployeeform.onclick = function() {
        editemployeeform.reset();
        editemployeeformparent.classList.remove('flex');
        editemployeeformparent.classList.add('hidden');
    };

    closerecordsform.onclick = function() {
        // recordsparent.classList.remove('flex');
        // recordsparent.classList.add('hidden');

        // monthselectorrecords.value = '';

        location.reload();
    };

    closeeditrecordform.onclick = function() {
        editrecordformparent.classList.remove('flex');
        editrecordformparent.classList.add('hidden');
    };

    closeaddtravelorderform.onclick = function() {
        addtravelorderformparent.classList.remove('flex');
        addtravelorderformparent.classList.add('hidden');
    };

    document.querySelectorAll('input[name="employment-type"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedValue = document.querySelector('input[name="employment-type"]:checked').value;
            console.log("Selected:", selectedValue);

            if (selectedValue === 'full-time'){
                Monthly_salary.classList.remove('hidden');
                Hourly_salary.classList.add('hidden');

                Hourly_salary_input.value = '';
            } else if (selectedValue === 'part-time') {
                Monthly_salary.classList.add('hidden');
                Hourly_salary.classList.remove('hidden');
                
                Monthly_salary_input.value = '';
            }
        });
    });

    document.querySelectorAll('input[name="employment-type2"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const selectedValue = document.querySelector('input[name="employment-type2"]:checked').value;
            console.log("Selected:", selectedValue);

            if (selectedValue === 'full-time'){
                Monthly_edit_salary.classList.remove('hidden');
                Hourly_edit_salary.classList.add('hidden');

                Hourly_edit_salary_input.value = '';
            } else if (selectedValue === 'part-time') {
                Monthly_edit_salary.classList.add('hidden');
                Hourly_edit_salary.classList.remove('hidden');
                
                Monthly_edit_salary_input.value = '';
            }
        });
    });

    addemployeeform.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent page reload

        const formData = new FormData(addemployeeform);
        const jsonData = Object.fromEntries(formData.entries());

        fetch('/api/add-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('success', data.message);
                addemployeeform.reset();
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showToast('error', data.message);
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showToast('error', err);
        });
    });

    editemployeeform.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent page reload

        const formData = new FormData(editemployeeform);
        const jsonData = Object.fromEntries(formData.entries());

        fetch('/api/edit-employee', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('success', data.message);
                editemployeeform.reset();
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showToast('error', data.message);
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showToast('error', err);
        });
    });

    editrecordform.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent page reload

        const formData = new FormData(editrecordform);
        const jsonData = Object.fromEntries(formData.entries());

        console.log(jsonData);
        fetch('/api/edit-record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('success', data.message);
                editrecordform.reset();
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showToast('error', data.message);
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showToast('error', err);
        });
    });

    addtravelorderform.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent page reload

        const formData = new FormData(addtravelorderform);
        const jsonData = Object.fromEntries(formData.entries());

        fetch('/api/add-travel-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonData),
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('success', data.message);
                addtravelorderform.reset();
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                showToast('error', data.message);
            }
        })
        .catch(err => {
            console.error('Error:', err);
            showToast('error', err);
        });
    });

    document.querySelectorAll('.dtrbtn').forEach(btn => {
        btn.onclick = function(){
            const id = btn.getAttribute('data-employee');
            const data = JSON.parse(btn.getAttribute('data-employeedata'));
            
            const dtrnametxt = document.getElementById('dtrnametxt');
            dtrnametxt.textContent = 
                (data.last_name + ", " + data.first_name + ", " + data.middle_name).toUpperCase();
            console.log(data);

            viewdtrformparent.classList.add('flex');
            viewdtrformparent.classList.remove('hidden');

            selected_employee_id = id;
            monthselector.value = "";
            tbody.innerHTML = "";
            totalUndertimeMinutes = 0;
            dtrduplicate.innerHTML = '';
        }
    });

    document.querySelectorAll('.recordsbtn').forEach(btn => {
        btn.onclick = function(){
            const id = btn.getAttribute('data-employee');
            selected_employee_id = id;

            recordsparent.classList.remove('hidden');
            recordsparent.classList.add('flex');

            recordbody.innerHTML = "";
            tablerecords = '';

            document.getElementById('table-record-container').classList.add('hidden');
            
            console.log(recordbody);
        }
    });

    document.querySelectorAll('.editbtn').forEach(btn => {
        btn.onclick = function(){
            const data = JSON.parse(btn.getAttribute('data-employee'));
            console.log(data);

            editemployeeformparent.classList.remove('hidden');
            editemployeeformparent.classList.add('flex');

            editemployeeform.querySelector('#B_ID').value = data.b_id;
            editemployeeform.querySelector('#B_Name').value = data.b_name;
            editemployeeform.querySelector('#First_name').value = data.first_name;
            editemployeeform.querySelector('#Middle_name').value = data.middle_name;
            editemployeeform.querySelector('#Last_name').value = data.last_name;

            if (data.type === 'full-time'){
                editemployeeform.querySelector('#full-time').checked = true;
                editemployeeform.querySelector('#full-time').dispatchEvent(new Event('change', { bubbles: true }));
                editemployeeform.querySelector('#Monthly_edit_salary_input').value = Number(data.monthly_salary);
            } else {
                editemployeeform.querySelector('#part-time').checked = true;
                editemployeeform.querySelector('#part-time').dispatchEvent(new Event('change', { bubbles: true }));
                editemployeeform.querySelector('#Hourly_edit_salary_input').value = Number(data.hourly_salary);
            }

            editemployeeform.querySelector('#Designation').value = data.designation;
            editemployeeform.querySelector('#sss_monthly').value = data.sss;
        }
    });

    monthselector.addEventListener('change', () => {
        const selectedMonth = monthselector.value;
        console.log('Selected month:', selectedMonth);

        if (selectedMonth !== ''){
            fetch('/api/select-month', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ month: selectedMonth, id: selected_employee_id }),
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                if (data.success) {
                    tbody.innerHTML = ""; // Clear existing rows
                    dtrduplicate.innerHTML = '';
                    totalUndertimeMinutes = 0;

                    // Extract year and month index from selectedMonth, e.g., "August 2025"
                    const [monthName, yearStr] = selectedMonth.split(" ");
                    const monthIndex = new Date(`${monthName} 1, ${yearStr}`).getMonth(); // 0-based
                    const year = parseInt(yearStr);
                    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
                    const selectedperiodtxt = document.getElementById('selectedperiodtxt');
                    selectedperiodtxt.textContent = `${monthName} 1 - ${daysInMonth}, ${year}`;

                    // Map DTR data by day
                    const dtrMap = {};
                    data.dtr.forEach(entry => {
                        const day = new Date(entry.date).getDate();
                        dtrMap[day] = entry;
                    });

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

                        const tr = document.createElement("tr");

                        if (dayOfWeek === 6 && data.employee.type !== "part-time") { // Saturday
                            tr.innerHTML = `
                                <td class="border-b-2 border-black text-center px-1 py-1 text-red-600">${day}</td>
                                <td class="border-b-2 border-black text-center px-1 py-1 text-red-600" colspan="4">SATURDAY</td>
                                <td class="border-b-2 border-black text-center px-1 py-1 text-red-600" colspan="2">00:00</td>
                            `;
                        } else if (dayOfWeek === 0 && data.employee.type !== "part-time") { // Sunday
                            tr.innerHTML = `
                                <td class="border-b-2 border-black text-center px-1 py-1 text-red-600">${day}</td>
                                <td class="border-b-2 border-black text-center px-1 py-1 text-red-600" colspan="4">SUNDAY</td>
                                <td class="border-b-2 border-black text-center px-1 py-1 text-red-600" colspan="2">00:00</td>
                            `;
                        } else if (eventDates.has(currentDateStr)) { // Weekday with event
                            // console.log("Event: ", currentDateStr);
                            // console.log("Events: ", eventDates);

                            // Get all events for this date
                            const eventsForDay = data.events.filter(ev => {
                                const start = new Date(ev.start);
                                const end = new Date(ev.end);
                                const current = new Date(currentDateStr);
                                return current >= start && current <= end;
                            });

                            // Combine descriptions, max 10 chars
                            let desc = eventsForDay.map(ev => ev.description || "").join(", ");
                            if (desc.length > 20) desc = desc.slice(0, 20) + "...";

                            tr.innerHTML = `
                                <td class="border-b-2 border-black text-center px-1 py-1">${day}</td>
                                <td class="border-b-2 border-black text-center px-1 py-1 text-red-600" colspan="4">${desc.toUpperCase()}</td>
                                <td class="border-b-2 border-black text-center px-1 py-1 text-red-600" colspan="2">00:00</td>
                            `;
                        } else { // Weekdays
                            if (entry?.message){
                                tr.innerHTML = `
                                    <td class="border-b-2 border-black text-center px-1 py-1 text-red-600">${day}</td>
                                    <td class="border-b-2 border-black text-center px-1 py-1 text-red-600" colspan="4">${entry.message.toUpperCase()}</td>
                                    <td class="border-b-2 border-black text-center px-1 py-1 text-red-600" colspan="2">00:00</td>
                                `;
                            } else {

                                const morning = [
                                    to12HourNoSuffix(entry?.morning_time_in),
                                    to12HourNoSuffix(entry?.morning_time_out)
                                    ];

                                const afternoon = [
                                    to12HourNoSuffix(entry?.afternoon_time_in),
                                    to12HourNoSuffix(entry?.afternoon_time_out)
                                ];

                                // console.log("morning: ", morning);
                                // console.log("afternoon: ", afternoon);


                                tr.innerHTML = `
                                    <td class="border-b-2 border-black text-center px-1 py-1">${day}</td>
                                    <td class="border-b-2 border-black text-center px-1 py-1">${to12HourNoSuffix(entry?.morning_time_in)}</td>
                                    <td class="border-b-2 border-black text-center px-1 py-1">${to12HourNoSuffix(entry?.morning_time_out)}</td>
                                    <td class="border-b-2 border-black text-center px-1 py-1">${to12HourNoSuffix(entry?.afternoon_time_in)}</td>
                                    <td class="border-b-2 border-black text-center px-1 py-1">${to12HourNoSuffix(entry?.afternoon_time_out)}</td>
                                    <td class="border-b-2 border-black text-center px-1 py-1" colspan="2">
                                        ${calculateUndertimeFromArrays(morning, afternoon, data.employee.type, data.load, currentDateStr)}
                                    </td>
                                `;

                            }
                        }

                        tbody.appendChild(tr);

                        // console.log(totalUndertimeMinutes);
                    }

                    function calculateUndertimeFromArrays(morning, afternoon, type, load, currentDateStr) {
                        function toMinutes12(timeStr) {
                            if (!timeStr) return null;
                            const [time, period] = timeStr.split(' ');
                            let [hours, minutes] = time.split(':').map(Number);

                            if (period === 'AM' && hours === 12) hours = 0;
                            if (period === 'PM' && hours !== 12) hours += 12;

                            return hours * 60 + minutes;
                        }

                        function toMinutes24(timeStr) {
                            if (!timeStr) return null;
                            const [h, m, s] = timeStr.split(':').map(Number);
                            return h * 60 + m;
                        }

                        // --- get day of week ---
                        const date = new Date(currentDateStr);
                        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
                        const currentDay = days[date.getDay()];

                        // --- convert logs to minutes ---
                        const morning_in = toMinutes12(morning[0]);
                        const morning_out = toMinutes12(morning[1]);
                        const afternoon_in = toMinutes12(afternoon[0]);
                        const afternoon_out = toMinutes12(afternoon[1]);

                        let undertime = 0;

                        // ========================
                        // PART-TIME TEACHER LOGIC
                        // ========================
                        if (type === 'part-time' && Array.isArray(load) && load.length > 0) {
                            console.log("part time");
                            // Filter only today's load(s)
                            const todayLoads = load.filter(l => l.days === currentDay);

                            if (todayLoads.length === 0) {
                                // No official schedule today → no undertime
                                return "00:00";
                            }

                            // Combine all logs into one array (in minutes)
                            const allLogs = [morning_in, morning_out, afternoon_in, afternoon_out].filter(Boolean);

                            todayLoads.forEach(l => {
                                const loadStart = toMinutes24(l.start_time);
                                const loadEnd = toMinutes24(l.end_time);
                                let loadUndertime = 0;

                                // Find logs within ±60 minutes of this load’s window
                                const logsWithinLoad = allLogs.filter(t => t >= loadStart - 60 && t <= loadEnd + 60);

                                if (logsWithinLoad.length === 0) {
                                    // No logs during this load → full load duration is undertime
                                    loadUndertime = loadEnd - loadStart;
                                } else {
                                    const minLog = Math.min(...logsWithinLoad);
                                    const maxLog = Math.max(...logsWithinLoad);

                                    // Late in
                                    if (minLog > loadStart) loadUndertime += (minLog - loadStart);
                                    // Early out
                                    if (maxLog < loadEnd) loadUndertime += (loadEnd - maxLog);
                                }

                                undertime += loadUndertime;

                                console.log("Part time load undertime : ", loadUndertime);
                            });

                        // ========================
                        // FULL-TIME TEACHER LOGIC
                        // ========================
                        } else {
                            const official = {
                                morning_in: toMinutes12('8:00 AM'),
                                morning_out: toMinutes12('12:00 PM'),
                                afternoon_in: toMinutes12('1:00 PM'),
                                afternoon_out: toMinutes12('5:00 PM')
                            };

                            // Morning
                            if (morning_in !== null && morning_in > official.morning_in)
                                undertime += morning_in - official.morning_in;

                            if (morning_out !== null) {
                                if (morning_out < official.morning_out)
                                    undertime += official.morning_out - morning_out;
                            } else undertime += 4 * 60;

                            // Afternoon
                            if (afternoon_in !== null && afternoon_in > official.afternoon_in)
                                undertime += afternoon_in - official.afternoon_in;

                            if (afternoon_out !== null) {
                                if (afternoon_out < official.afternoon_out)
                                    undertime += official.afternoon_out - afternoon_out;
                            } else undertime += 4 * 60;

                            if (undertime > 8 * 60) undertime = 8 * 60;
                        }

                        // --- format result ---
                        const hours = Math.floor(undertime / 60);
                        const minutes = undertime % 60;

                        totalUndertimeMinutes += undertime;
                        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
                    }




                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td class="border-black text-center px-1 py-1"></td>
                        <td class="border-black text-left px-1 py-1 text-red-600" colspan="2">UNDERTIME</td>
                        <td class="border-black text-center px-1 py-1"></td>
                        <td class="border-black text-center px-1 py-1"></td>
                        <td class="border-black text-center px-1 py-1" colspan="2">
                            ${minutesToHoursMinutes(totalUndertimeMinutes)}
                        </td>
                    `;

                    tbody.appendChild(tr);
                    rednderdtrduplicate();

                } else {
                    showToast('error', data.message);
                }
            })
            .catch(err => {
                console.error('Error:', err);
                showToast('error', err);
            });
        }

        function formatLocalDate(date) {
            const y = date.getFullYear();
            const m = (date.getMonth() + 1).toString().padStart(2, '0');
            const d = date.getDate().toString().padStart(2, '0');
            return `${y}-${m}-${d}`;
        }

        function minutesToHoursMinutes(totalMinutes) {
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        }

    });

    monthselectorrecords.addEventListener('change', () => {
        const selectedMonth = monthselectorrecords.value;
        console.log('Selected month:', selectedMonth);

        if (selectedMonth !== ''){
            fetch('/api/select-month-record', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ month: selectedMonth, id: selected_employee_id }),
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                
                if (data.success && data.dtr.length > 0) {
                    document.getElementById('table-record-container').classList.remove('hidden');

                    // Map DTR data by day
                    const dtrMap = {};
                    data.dtr.forEach(entry => {
                        const day = new Date(entry.date).getDate();
                        dtrMap[day] = entry;
                    });

                    // Extract year and month index from selectedMonth, e.g., "August 2025"
                    const [monthName, yearStr] = selectedMonth.split(" ");
                    const monthIndex = new Date(`${monthName} 1, ${yearStr}`).getMonth(); // 0-based
                    const year = parseInt(yearStr);
                    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

                    // Loop through all days
                    for (let day = 1; day <= daysInMonth; day++) {
                        const entry = dtrMap[day];
                        const dayOfWeek = new Date(year, monthIndex, day).getDay();
                        const newRow = recordbody.insertRow();
                        if (dayOfWeek === 6 && data.employee.type !== "part-time") { // Saturday
                            // Day number
                            newRow.insertCell(0).textContent = day;

                            // Merge cells 1 → 5 into one cell with colspan=5
                            const saturdayCell = newRow.insertCell(1);
                            saturdayCell.colSpan = 5;
                            saturdayCell.textContent = "SATURDAY";

                            for (let i = 0; i < newRow.cells.length; i++) {
                                newRow.cells[i].classList.add('text-center', 'text-red-600');
                            }
                        } else if (dayOfWeek === 0 && data.employee.type !== "part-time") { // Sunday
                            // Day number
                            newRow.insertCell(0).textContent = day;

                            // Merge cells 1 → 5 into one cell with colspan=5
                            const saturdayCell = newRow.insertCell(1);
                            saturdayCell.colSpan = 5;
                            saturdayCell.textContent = "SUNDAY";

                            for (let i = 0; i < newRow.cells.length; i++) {
                                newRow.cells[i].classList.add('text-center', 'text-red-600');
                            }
                        } else {

                            if (entry?.message){
                                newRow.insertCell(0).textContent = day;

                                // Merge cells 1 → 5 into one cell with colspan=5
                                const travelordercell = newRow.insertCell(1);
                                travelordercell.colSpan = 5;
                                travelordercell.textContent = entry.message.toUpperCase();

                                for (let i = 0; i < newRow.cells.length; i++) {
                                    newRow.cells[i].classList.add('text-center', 'text-red-600');
                                }
                            } else {
                                newRow.insertCell(0).textContent = day;
                                newRow.insertCell(1).textContent = to12HourNoSuffix(entry?.morning_time_in);
                                newRow.insertCell(2).textContent = to12HourNoSuffix(entry?.morning_time_out);
                                newRow.insertCell(3).textContent = to12HourNoSuffix(entry?.afternoon_time_in);
                                newRow.insertCell(4).textContent = to12HourNoSuffix(entry?.afternoon_time_out);

                                for (let i = 0; i < newRow.cells.length; i++) {
                                    newRow.cells[i].classList.add('text-center');
                                }

                                if (!entry){
                                    console.log('absent');
                                    newRow.insertCell(5).innerHTML = `<span data-dtrid='${day}' data-employee='${selected_employee_id}' class="travelorderbtn cursor-pointer bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">T.O</span>`;
                                } else {
                                    newRow.insertCell(5).innerHTML = `<span data-dtr='${JSON.stringify(entry)}' data-employee='<%= JSON.stringify(employee) %>' class="editrecordbtn cursor-pointer bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">Edit</span>`;
                                }

                            }
                            
                        }
                    }

                    const tablerecords = new simpleDatatables.DataTable("#search-table-records", {
                        template: (options, dom) => "<div class='" + options.classes.top + "'>" +
                            "<div class='flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-3 rtl:space-x-reverse w-full sm:w-auto'>" +
                            (options.paging && options.perPageSelect ?
                                "<div class='" + options.classes.dropdown + "'>" +
                                    "<label>" +
                                        "<select class='" + options.classes.selector + "'></select> " + options.labels.perPage +
                                    "</label>" +
                                "</div>" : ""
                            ) + "<button id='exportDropdownButtonRecord' type='button' class='flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 0 sm:w-auto'>" +
                            "Export as" +
                            "<svg class='-me-0.5 ms-1.5 h-4 w-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>" +
                                "<path stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m19 9-7 7-7-7' />" +
                            "</svg>" +
                        "</button>" +
                        "<div id='exportDropdownRecord' class='z-10 hidden w-52 divide-y divide-gray-100 rounded-lg bg-white shadow-sm  data-popper-placement='bottom'>" +
                            "<ul class='p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400' aria-labelledby='exportDropdownButton'>" +
                                "<li>" +
                                    "<button id='export-csv-records' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 '>" +
                                        "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 ' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
                                            "<path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2 2 2 0 0 0 2 2h12a2 2 0 0 0 2-2 2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2V4a2 2 0 0 0-2-2h-7Zm1.018 8.828a2.34 2.34 0 0 0-2.373 2.13v.008a2.32 2.32 0 0 0 2.06 2.497l.535.059a.993.993 0 0 0 .136.006.272.272 0 0 1 .263.367l-.008.02a.377.377 0 0 1-.018.044.49.49 0 0 1-.078.02 1.689 1.689 0 0 1-.297.021h-1.13a1 1 0 1 0 0 2h1.13c.417 0 .892-.05 1.324-.279.47-.248.78-.648.953-1.134a2.272 2.272 0 0 0-2.115-3.06l-.478-.052a.32.32 0 0 1-.285-.341.34.34 0 0 1 .344-.306l.94.02a1 1 0 1 0 .043-2l-.943-.02h-.003Zm7.933 1.482a1 1 0 1 0-1.902-.62l-.57 1.747-.522-1.726a1 1 0 0 0-1.914.578l1.443 4.773a1 1 0 0 0 1.908.021l1.557-4.773Zm-13.762.88a.647.647 0 0 1 .458-.19h1.018a1 1 0 1 0 0-2H6.647A2.647 2.647 0 0 0 4 13.647v1.706A2.647 2.647 0 0 0 6.647 18h1.018a1 1 0 1 0 0-2H6.647A.647.647 0 0 1 6 15.353v-1.706c0-.172.068-.336.19-.457Z' clip-rule='evenodd'/>" +
                                        "</svg>" +
                                        "<span>Export CSV</span>" +
                                    "</button>" +
                                "</li>" +
                                "<li>" +
                                    "<button id='export-json-records' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 '>" +
                                        "<svg class='me-1.5 h-4 w-4 text-gray-400 group-hover:text-gray-900 ' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='currentColor' viewBox='0 0 24 24'>" +
                                            "<path fill-rule='evenodd' d='M9 2.221V7H4.221a2 2 0 0 1 .365-.5L8.5 2.586A2 2 0 0 1 9 2.22ZM11 2v5a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7Zm-.293 9.293a1 1 0 0 1 0 1.414L9.414 14l1.293 1.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414l2-2a1 1 0 0 1 1.414 0Zm2.586 1.414a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414L14.586 14l-1.293-1.293Z' clip-rule='evenodd'/>" +
                                        "</svg>" +
                                        "<span>Export JSON</span>" +
                                    "</button>" +
                                "</li>" +
                                "<li>" +
                                    "<button id='export-txt-records' class='group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 '>" +
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

                    const $exportButton = document.getElementById("exportDropdownButtonRecord");
                    const $exportDropdownEl = document.getElementById("exportDropdownRecord");
                    
                    const dropdown = new Dropdown($exportDropdownEl, $exportButton);
                    console.log(dropdown)

                    document.getElementById("export-csv-records").addEventListener("click", () => {
                        simpleDatatables.exportCSV(tablerecords, {
                            filename: "record_data",
                            download: true,
                            lineDelimiter: "\n",
                            columnDelimiter: ";",
                            columns: columnIndexesExcludingLast
                        });
                    });

                    document.getElementById("export-txt-records").addEventListener("click", () => {
                        simpleDatatables.exportTXT(tablerecords, {
                            filename: "record_data",
                            download: true,
                            columns: columnIndexesExcludingLast
                        });
                    });

                    document.getElementById("export-json-records").addEventListener("click", () => {
                        simpleDatatables.exportJSON(tablerecords, {
                            filename: "record_data",
                            download: true,
                            space: 3,
                            columns: columnIndexesExcludingLast
                        });
                    });
                } else {
                    showToast('error', "Missing Data.");
                }
            })
            .catch(err => {
                console.error('Error:', err);
                showToast('error', err);
            });
        }
    });

    function rednderdtrduplicate() {
        dtrduplicate.innerHTML = '';

        const gendtr = document.getElementById('gendtr');
        dtrduplicate.innerHTML = gendtr.innerHTML; // copy content
    }

    function to12HourNoSuffix(time24) {
        if (!time24) return ""; // handle null/empty
        let [hour, minute] = time24.split(":").map(Number);
        const suffix = hour >= 12 ? "PM" : "AM"; // determine AM or PM
        hour = hour % 12 || 12;                  // convert 0 → 12, 13 → 1, etc.
        return `${hour}:${minute.toString().padStart(2, "0")} ${suffix}`;
    }
    
    const searchtablerecords = document.getElementById('search-table-records');
    searchtablerecords.addEventListener("click", function (e) {
        if (e.target.classList.contains("editrecordbtn")) {
            editrecordformparent.classList.remove('hidden');
            editrecordformparent.classList.add('flex');

            // Use e.target instead of btn
            const dtr = JSON.parse(e.target.getAttribute('data-dtr'));
            console.log(dtr);

            document.querySelector('input[type="time"][name="morning_timein"]').value = dtr.morning_time_in || "";
            document.querySelector('input[type="time"][name="morning_timeout"]').value = dtr.morning_time_out || "";
            document.querySelector('input[type="time"][name="afternoon_timein"]').value = dtr.afternoon_time_in || "";
            document.querySelector('input[type="time"][name="afternoon_timeout"]').value = dtr.afternoon_time_out || "";

            editrecordform.querySelector('[name="employee_id"]').value = dtr.employee_id;
            editrecordform.querySelector('[name="record_id"]').value = dtr.id;
        }

        if (e.target.classList.contains("travelorderbtn")) {
            addtravelorderformparent.classList.remove('hidden');
            addtravelorderformparent.classList.add('flex');

            const employee = e.target.getAttribute('data-employee');
            const dtrid = e.target.getAttribute('data-dtrid');
            addtravelorderformparent.querySelector('#E_ID').value = employee;
            addtravelorderformparent.querySelector('#dtrid').value = dtrid;
            addtravelorderformparent.querySelector('#selected_month').value = monthselectorrecords.value;

            console.log(employee);
        }
    });

}
