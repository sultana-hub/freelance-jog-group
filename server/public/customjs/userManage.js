 document.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll("#roleTabs .nav-link");
    const rows = Array.from(document.querySelectorAll("#usersTable tbody tr"));
    const searchInput = document.getElementById("userSearch");

    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 5;
    let filteredRows = [...rows]; // initial copy

    const pageInfo = document.getElementById("pageInfo");
    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");

    // Function to render rows with pagination
    function renderTable() {
      // hide all
      rows.forEach(r => r.style.display = "none");

      const start = (currentPage - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      const paginated = filteredRows.slice(start, end);

      paginated.forEach(r => r.style.display = "");

      pageInfo.textContent = `Page ${currentPage} of ${Math.ceil(filteredRows.length / rowsPerPage)}`;

      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage >= Math.ceil(filteredRows.length / rowsPerPage);
    }

    // Combine filter by role + search
    function applyFilters() {
      const activeRole = document.querySelector("#roleTabs .nav-link.active").dataset.role;
      const searchValue = searchInput.value.toLowerCase();

      filteredRows = rows.filter(row => {
        const rowRole = row.getAttribute("data-role");
        const name = row.querySelector(".user-name")?.textContent.toLowerCase() || "";
        const email = row.querySelector(".user-email")?.textContent.toLowerCase() || "";

        const matchesRole = (activeRole === "all" || rowRole === activeRole);
        const matchesSearch = (name.includes(searchValue) || email.includes(searchValue));

        return matchesRole && matchesSearch;
      });

      currentPage = 1; // reset to first page
      renderTable();
    }

    // Tab filter
    tabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        applyFilters();
      });
    });

    // Search filter
    searchInput.addEventListener("keyup", applyFilters);

    // Pagination buttons
    prevBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });

    nextBtn.addEventListener("click", () => {
      if (currentPage < Math.ceil(filteredRows.length / rowsPerPage)) {
        currentPage++;
        renderTable();
      }
    });

    // Init
    applyFilters();
  });