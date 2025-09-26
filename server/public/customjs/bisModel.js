  document.addEventListener("DOMContentLoaded", function (e) {
    e.preventDefault();
    const editButtons = document.querySelectorAll(".editBidBtn");
    const modal = new bootstrap.Modal(document.getElementById("editBidModal"));
    const bidIdInput = document.getElementById("bidId");
    const statusSelect = document.getElementById("status");
    const form = document.getElementById("editBidForm");

    editButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        const bidId = this.getAttribute("data-id");
        const currentStatus = this.getAttribute("data-status");

        bidIdInput.value = bidId;
        statusSelect.value = currentStatus;

        // Set form action dynamically
        form.action = `/admin/update-bid-status/${bidId}`;

        modal.show();
      });
    });
  });