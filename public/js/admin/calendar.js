const addeventformparent = document.getElementById('addeventformparent');
const addeventform = document.getElementById('addeventform');

const closeaddeventform = document.getElementById('closeaddeventform');
closeaddeventform.onclick = function() {
    addeventformparent.classList.add('hidden');
    addeventformparent.classList.remove('flex');
};

var calendarEl = document.getElementById('calendar');
const eventscalender = JSON.parse(calendarEl.getAttribute('data-event'));
let eventarr = [];

// Map server events to FullCalendar events
if (eventscalender.length > 0){
    eventarr = eventscalender.map(e => ({
        id: e.id,
        title: e.description || 'No Title',
        start: e.start,
        end: e.end, // FullCalendar treats end as exclusive
        allDay: true, // optional, depends on your data
        color: '#cffae5',
        textColor: '#006145'
    }));
}

var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: eventarr,
    dateClick: function(info) {
        // alert('You clicked on: ' + info.dateStr);
        const date = new Date(info.dateStr);

        // Format to MM/DD/YYYY
        const formattedDate =
            String(date.getMonth() + 1).padStart(2, '0') + "/" +
            String(date.getDate()).padStart(2, '0') + "/" +
            date.getFullYear();
        
        addeventformparent.classList.add('flex');
        addeventformparent.classList.remove('hidden');

        document.getElementById('datepicker-range-start').value = formattedDate;
        document.getElementById('datepicker-range-end').value = formattedDate;

        // Example: add an event when clicked
        calendar.addEvent({
            title: 'New Event',
            start: document.getElementById('datepicker-range-start').value,
            end: document.getElementById('datepicker-range-end').value,
            allDay: true
        });
    }
});
calendar.render();

addeventform.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent page reload

    const formData = new FormData(addeventform);
    const jsonData = Object.fromEntries(formData.entries());

    fetch('/api/add-event', {
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

            setTimeout(() => {
                location.reload();
            }, 1500);
        } else {
            showToast('error', data.message);
        }
    })
    .catch(err => {
        console.error('Error:', err);
        showToast('error', err);
    });
});