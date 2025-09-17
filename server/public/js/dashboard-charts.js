

console.log("dashboard charts")

document.addEventListener("DOMContentLoaded", function () {
    // const {users}= window.dashboardData
    // console.log(users)
  // User Chart
  const userPolarChart = document.getElementById("userPolarChart");
  if(userPolarChart){
    new Chart(userPolarChart, {
      type: "polarArea",
      data: {
        labels: ["admin", "freelancer", "client"],
        datasets: [
          {
            data: [1245, 522, 1850],
            backgroundColor: [
              "rgba(26,111,196,0.8)",
              "rgba(44,140,224,0.8)",
              "rgba(77,166,255,0.8)",
              "rgba(255,107,107,0.8)",
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  // Job Status Chart
  const jobStatusCtx = document.getElementById("jobStatusChart");
  if (jobStatusCtx) {
    new Chart(jobStatusCtx, {
      type: "doughnut",
      data: {
        labels: ["Open", "In Progress", "Completed", "Cancelled"],
        datasets: [
          {
            data: [1245, 522, 1850, 255],
            backgroundColor: [
              "rgba(26,111,196,0.8)",
              "rgba(44,140,224,0.8)",
              "rgba(77,166,255,0.8)",
              "rgba(255,107,107,0.8)",
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
  }

  // Category Chart
  const categoryCtx = document.getElementById("categoryChart");
  if (categoryCtx) {
    new Chart(categoryCtx, {
      type: "bar",
      data: {
        labels: [
          "Web Development",
          "Graphic Design",
          "Content Writing",
          "Marketing",
          "Mobile Apps",
          "Web Development",
          "Graphic Design",
          "Content Writing",
          "Marketing",
          "Mobile Apps",
          "Web Development",
          "Graphic Design",
          "Content Writing",
          "Marketing",
          "Mobile Apps",
          "Web Development",
          "Graphic Design",
          "Content Writing",
          "Marketing",
          "Mobile Apps",
        ],
        datasets: [
          {
            label: "Number of Jobs",
            data: [850, 620, 480, 710, 590, 850, 620, 480, 710, 590, 850, 620, 480, 710, 590, 850, 620, 480, 710, 590],
            backgroundColor: "rgba(26,111,196,0.7)",
            borderColor: "rgba(26,111,196,1)",
            borderWidth: 1,
            barPercentage: 0.8, // ✅ correct (Chart.js v3+)
            categoryPercentage: 0.9,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true } },
      },
    });
  }
});

