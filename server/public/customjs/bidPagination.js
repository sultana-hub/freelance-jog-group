document.addEventListener("DOMContentLoaded", function () {
  const table = document.getElementById("bidTable");
  const tbody = table.querySelector("tbody");
  const allRows = Array.from(tbody.getElementsByTagName("tr"));
  const searchInput = document.getElementById("bidSearch");

  const prevBtn = document.getElementById("bidPrevPage");
  const nextBtn = document.getElementById("bidNextPage");
  const pageInfo = document.getElementById("bidPageInfo");

  let currentPage = 1;
  const rowsPerPage = 5;
  let filteredRows = [...allRows];

  function renderTable() {
    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;


    allRows.forEach((row) => (row.style.display = "none"));

 
    filteredRows.forEach((row, index) => {
      row.style.display = index >= start && index < end ? "" : "none";
    });

   
    let totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  
  searchInput.addEventListener("keyup", function () {
    const filter = searchInput.value.trim().toLowerCase();

    if (filter) {
      filteredRows = allRows.filter((row) => {
        const jobTitle = row.cells[1]?.textContent.trim().toLowerCase() || "";
        const freelancer = row.cells[2]?.textContent.trim().toLowerCase() || "";
        return jobTitle.includes(filter) || freelancer.includes(filter);
      });
    } else {
      filteredRows = [...allRows];
    }

    currentPage = 1; 
    renderTable();
  });

  
  prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextBtn.addEventListener("click", function () {
    let totalPages = Math.ceil(filteredRows.length / rowsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
    }
  });

  // ✅ Initial Render
  renderTable();
});
