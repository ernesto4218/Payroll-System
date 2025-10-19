function chart1() {
  const totalpayrollyear = document.querySelector('.totalpayrollyear');
  const totalcostfulltime = document.querySelector('.totalcostfulltime');

  const yearlychart = document.getElementById('yearlychart');
  let montlydata = yearlychart.getAttribute('data-month_payroll');

  montlydata = JSON.parse(montlydata);
  console.log(montlydata);

  // Convert object to arrays
  const months = Object.keys(montlydata);     // ["January", "February", ...]
  const values = Object.values(montlydata);   // [0, 0, 0, ..., 29216.53, 0]
  const totalPayroll = values.reduce((acc, val) => acc + val, 0);

  const options = {
    chart: {
      height: "100%",
      maxWidth: "100%",
      type: "area",
      fontFamily: "Inter, sans-serif",
      dropShadow: { enabled: false },
      toolbar: { show: false },
    },
    tooltip: {
      y: {
        formatter: function (value) {
          // ✅ Always show full value in tooltip
          return "₱" + value.toLocaleString();
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
        shade: "#00bc7d",
        gradientToColors: ["#00bc7d"],
      },
    },
    dataLabels: { enabled: false },
    stroke: { width: 6 },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: { left: 2, right: 2, top: 0 },
    },
    series: [
      {
        name: "Payroll",
        data: values,   // Use payroll values
        color: "#00bc7d",
      },
    ],
    xaxis: {
      categories: months,  // Use month names
      labels: {
        show: true,
        style: {
          colors: "#1f2937",   // dark gray
          fontSize: "10px",
          fontFamily: "Inter, sans-serif",
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      labels: {
        formatter: function (value) {
          if (value >= 1000) {
            return "₱" + (value / 1000).toFixed(1).replace(/\.0$/, "") + "K"; 
            // 1000 → 1K, 1500 → 1.5K
          }
          return value; // for values below 1000
        }
      }
    }
  };

  if (document.getElementById("yearlychart") && typeof ApexCharts !== 'undefined') {
    const chart = new ApexCharts(document.getElementById("yearlychart"), options);
    chart.render();

    totalpayrollyear.textContent = "₱" + totalPayroll.toLocaleString();
    totalcostfulltime.textContent = "₱" + totalPayroll.toLocaleString();
  }
}

function chart2() {
  const yearlychart = document.getElementById('yearlychart');
  let montlydata = JSON.parse(yearlychart.getAttribute('data-month_payroll'));

  // Convert to arrays
  const months = Object.keys(montlydata);
  const values = Object.values(montlydata);
  const valuesMap = montlydata;

  // Build comparisons
  let comparisons = [];
  for (let i = 1; i < months.length; i++) {
    comparisons.push({
      from: months[i - 1],
      to: months[i]
    });
  }

  const listEl = document.getElementById("monthComparisonList");
  listEl.innerHTML = "";
  const dropdownLabel = document.getElementById("dropdownLabel");

  // Current month logic
  const now = new Date();
  const currentMonth = months[now.getMonth()] || months[months.length - 1];
  const currentComparison = comparisons.find(comp => comp.to === currentMonth) 
                           || comparisons[comparisons.length - 1];

  // Populate dropdown
  comparisons.forEach(comp => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="#" class="block px-4 py-2 hover:bg-gray-100">
        ${comp.from} → ${comp.to}
      </a>
    `;
    li.querySelector("a").addEventListener("click", e => {
      e.preventDefault();
      dropdownLabel.textContent = `${comp.from} → ${comp.to}`; // ✅ only update text
      renderchart2(comp.from, comp.to, valuesMap);
    });
    listEl.appendChild(li);
  });

  // ✅ Render default (current month comparison)
  if (currentComparison) {
    dropdownLabel.textContent = `${currentComparison.from} → ${currentComparison.to}`;
    renderchart2(currentComparison.from, currentComparison.to, valuesMap);
  }
}

function renderchart2(fromMonth, toMonth, valuesMap) {
  const seriesData = [
    { x: fromMonth, y: valuesMap[fromMonth] || 0 },
    { x: toMonth, y: valuesMap[toMonth] || 0 }
  ];

  const options = {
    series: [{ name: "Payroll", data: seriesData }],
    xaxis: { categories: [fromMonth, toMonth] }
  };

  if (window.chartInstance) {
    // ✅ Update chart
    window.chartInstance.updateOptions(options);

    // ✅ Always update badge when switching months
    document.getElementById("percentBadge").innerHTML =
      renderComparisonBadge(fromMonth, toMonth, valuesMap);

  } else {
    // First time create the chart
    const baseOptions = {
      colors: ["#00bc7d"],
      chart: {
        type: "bar",
        height: 200,
        fontFamily: "Inter, sans-serif",
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "70%",
          borderRadiusApplication: "end",
          borderRadius: 8,
        },
      },
      yaxis: {
        show: true,
        labels: {
          formatter: function (value) {
            if (value >= 1000) {
              return "₱" + (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
            }
            return value;
          }
        }
      },
      tooltip: {
        y: {
          formatter: function (value) {
            // ✅ Always show full value in tooltip
            return "₱" + value.toLocaleString();
          }
        }
      },
      grid: { show: false },
      dataLabels: { enabled: false },
      legend: { show: false },
      fill: { opacity: 1 },
      series: [{ name: "Payroll", data: seriesData }],
      xaxis: { categories: [fromMonth, toMonth] }
    };


    const chartEl = document.getElementById("monthlyComparisonChart");
    if (chartEl && typeof ApexCharts !== "undefined") {
      window.chartInstance = new ApexCharts(chartEl, baseOptions);
      window.chartInstance.render();
    }

    // ✅ Update badge on first render too
    document.getElementById("percentBadge").innerHTML =
      renderComparisonBadge(fromMonth, toMonth, valuesMap);
      
  }
}


function renderComparisonBadge(fromMonth, toMonth, valuesMap) {
  const totalmonthlycomparison = document.querySelector('.totalmonthlycomparison');
  const differnecetext = document.querySelector('.differnecetext');

  const prev = valuesMap[fromMonth] || 0;
  const curr = valuesMap[toMonth] || 0;

  const diff = curr - prev;
  const percentChange = prev !== 0 ? (diff / prev) * 100 : (curr !== 0 ? 100 : 0);

  const isIncrease = diff >= 0;

  const arrowSvg = isIncrease
    ? `<svg class="w-2.5 h-2.5 me-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/></svg>`
    : `<svg class="w-2.5 h-2.5 me-1.5 rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"/></svg>`;

  const badgeClass = isIncrease
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  const total = prev + curr;

  totalmonthlycomparison.textContent = "₱" + total.toLocaleString();
  differnecetext.textContent =  "₱" + diff.toLocaleString();
  return `
    <div class="space-y-1">
      <span class="${badgeClass} text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
        ${arrowSvg} ${percentChange.toFixed(2)}%
      </span>
    </div>
  `;
}






chart1();
chart2();
