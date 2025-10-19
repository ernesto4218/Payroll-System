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

    search.innerHTML += `<button id="addfilebtn" type="button" class="flex flex-row items-center gap-2 text-white bg-emerald-700 hover:bg-emerald-800 focus:ring-4 focus:ring-emerald-300 font-medium rounded-lg text-sm px-5 py-2.5">
        <svg class="w-4 h-4" fill='currentColor' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M176 544C96.5 544 32 479.5 32 400C32 336.6 73 282.8 129.9 263.5C128.6 255.8 128 248 128 240C128 160.5 192.5 96 272 96C327.4 96 375.5 127.3 399.6 173.1C413.8 164.8 430.4 160 448 160C501 160 544 203 544 256C544 271.7 540.2 286.6 533.5 299.7C577.5 320 608 364.4 608 416C608 486.7 550.7 544 480 544L176 544zM337 255C327.6 245.6 312.4 245.6 303.1 255L231.1 327C221.7 336.4 221.7 351.6 231.1 360.9C240.5 370.2 255.7 370.3 265 360.9L296 329.9L296 432C296 445.3 306.7 456 320 456C333.3 456 344 445.3 344 432L344 329.9L375 360.9C384.4 370.3 399.6 370.3 408.9 360.9C418.2 351.5 418.3 336.3 408.9 327L336.9 255z"/></svg>
    Upload</button>`


    const addfilebtn = document.getElementById('addfilebtn');
    const addfileformparent = document.getElementById('addfileformparent');
    const closeaddfileform = document.getElementById('closeaddfileform');
    const fileInput = document.getElementById('dropzone-file');
    const addfileform = document.getElementById('addfileform');
    const fileuploadcontainer = document.getElementById('fileuploadcontainer');
    const fileuploadinfo = document.getElementById('fileuploadinfo');
    
    addfilebtn.onclick = function() {
        addfileformparent.classList.remove('hidden');
        addfileformparent.classList.add('flex');
    };

    closeaddfileform.onclick = function() {
        addfileformparent.classList.remove('flex');
        addfileformparent.classList.add('hidden');
        fileInput.value = "";

        fileuploadcontainer.classList.remove('hidden');
        fileuploadcontainer.classList.add('flex');

        fileuploadinfo.classList.add('hidden');
    };

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type !== "text/plain") {
            showToast("error","Only .txt files are allowed!");
            fileInput.value = ""; // reset input

            fileuploadcontainer.classList.remove('hidden');
            fileuploadcontainer.classList.add('flex');

            fileuploadinfo.classList.add('hidden');
        } else {
            fileuploadcontainer.classList.remove('flex');
            fileuploadcontainer.classList.add('hidden');

            fileuploadinfo.classList.remove('hidden');
            fileuploadinfo.querySelector('span').textContent = file.name;
        }
    });

    addfileform.addEventListener('submit', function (e) {
        e.preventDefault(); // prevent page reload

        const formData = new FormData(addfileform); // keep the file

        fetch('/api/upload-file', {
            method: 'POST',
            body: formData, // send FormData directly
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showToast('success', data.message);
                addfileform.reset();
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

}
