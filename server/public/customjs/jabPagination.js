  document.addEventListener("DOMContentLoaded", () => {
    const rows = Array.from(document.querySelectorAll("#jobsTable tbody tr"));
    const searchInput = document.getElementById("jobSearch");
    const pageInfo = document.getElementById("jobPageInfo");
    const prevBtn = document.getElementById("jobPrevPage");
    const nextBtn = document.getElementById("jobNextPage");

    let currentPage = 1;
    const rowsPerPage = 5;
    let filteredRows = [...rows];

    function renderTable() {
      rows.forEach(r => r.style.display = "none");

      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const paginated = filteredRows.slice(start, end);

      paginated.forEach(r => r.style.display = "");

      const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
      pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage >= totalPages;
    }

    function applyFilters() {
      const query = searchInput.value.toLowerCase();
      filteredRows = rows.filter(row => {
        const client = row.querySelector(".job-client")?.textContent.toLowerCase() || "";
        const title = row.querySelector(".job-title")?.textContent.toLowerCase() || "";
        return client.includes(query) || title.includes(query);
      });
      currentPage = 1;
      renderTable();
    }

    searchInput.addEventListener("keyup", applyFilters);

    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) { currentPage--; renderTable(); }
    });

    nextBtn.addEventListener("click", () => {
      const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
      if (currentPage < totalPages) { currentPage++; renderTable(); }
    });

    applyFilters();
  });