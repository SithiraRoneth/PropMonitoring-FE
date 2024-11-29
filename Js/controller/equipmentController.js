// Initialize an empty equipment object and equipmentDB array (you might not need equipmentDB here)
const equipment = {};
const equipmentDB = [];

// Open modal on button click
document.getElementById("btnequipmentAdd").addEventListener("click", function () {
  var myModal = new bootstrap.Modal(document.getElementById("equipmentModal"));
  myModal.show();
});

// Load all equipment on page load
getAllEquipment();

$("#btnSaveEquipment").click(function () {
  let eqId = $("#txteqid").val();
  let eqName = $("#txteqname").val();
  let eqType = $("input[name='Eq_type']:checked").val();
  let eqStatus = $("input[name='Eq_status']:checked").val();

  const newEquipment = Object.assign({}, equipment);
  newEquipment.equipmentId = eqId;  // Ensure consistency with equipmentId
  newEquipment.equipmentName = eqName;
  newEquipment.equipmentType = eqType;
  newEquipment.status = eqStatus;

  console.log(newEquipment);

  if (!checkExistEquipment(newEquipment.equipmentId)) {
    $.ajax({
      url: "http://localhost:5050/propMonitoring/api/v1/equipments",
      type: "POST",
      data: JSON.stringify(newEquipment),
      headers: { "Content-Type": "application/json" },
      success: (res) => {
        console.log(JSON.stringify(res));
        getAllEquipment();
      },
      error: (res) => {
        console.error(res);
        Swal.fire({
          title: "Oops Failed",
          text: "Invalid Equipment type",
          icon: "error"
        });
      }
    });
  } else {
    alert("Oops! Existing equipment code, try again with new equipment code");
  }
});

function checkExistEquipment(eqId) {
  for (let i = 0; i < equipmentDB.length; i++) {
    if (equipmentDB[i].equipmentId === eqId) {  // Compare equipmentId, not the whole object
      return true;
    }
  }
  return false;
}

function clearAllEquipment() {
  $("#txteqid").val('');
  $("#txteqname").val('');
  $("input[name='Eq_type']:checked").val('');
  $("input[name='Eq_status']:checked").val('');
}

// Fetch and display all equipment
function getAllEquipment() {
  let tBody = $("#tblEquipmentBody");

  // Clear existing table data
  tBody.empty();

  $.ajax({
    url: "http://localhost:5050/propMonitoring/api/v1/equipments",  // Backend URL for equipment
    type: "GET",
    contentType: "application/json",
    success: function (equipmentList) {
      // Populate the equipment table
      equipmentList.forEach(equipment => {
        let tr = $(`<tr>
                      <td>${equipment.equipmentId}</td>
                      <td>${equipment.equipmentName}</td>
                      <td>${equipment.equipmentType}</td>
                      <td>${equipment.status}</td>
                      <td><button class="btn btn-warning updateBtn" data-equipment-id="${equipment.equipmentId}">Update</button></td>
                      <td><button class="btn btn-danger deleteBtn" data-equipment-id="${equipment.equipmentId}">Delete</button></td>
                    </tr>`);
        tBody.append(tr);
      });

      // Event listener for delete buttons
      $(".deleteBtn").click(function () {
        let equipmentId = $(this).data("equipment-id");  // Get the equipment ID from the data attribute
        console.log("Deleting equipment with ID:", equipmentId);  // Log for debugging
      
        // Confirm deletion
        let confirmDelete = window.confirm("Are you sure you want to delete this equipment?");
        
        if (confirmDelete) {
          // Perform the deletion
          $.ajax({
            url: `http://localhost:5050/propMonitoring/api/v1/equipments/${equipmentId}`,
            type: "DELETE",  // Ensure the request type is DELETE
            success: function (response) {
              console.log("Delete success response:", response);  // Log the success response
              alert("Equipment deleted successfully.");
              getAllEquipment();  // Reload the equipment data
            },
            error: function (xhr, status, error) {
              console.error("Failed to delete the equipment:", error);  // Log any error that occurs
              alert("Failed to delete the equipment.");
            }
          });
        } else {
          alert("The equipment was not deleted.");
        }
      });
      

      // Event listener for update buttons
      $(".updateBtn").click(function () {
        let equipmentId = $(this).data("equipment-id");

        // Log the clicked equipmentId and the equipmentList for debugging
        console.log("Clicked equipment ID:", equipmentId);

        // Find the equipment with the specified ID
        let equipment = equipmentList.find(e => e.equipmentId === equipmentId);

        console.log("Found equipment:", equipment);

        if (!equipment) {
          alert("Equipment not found");
          return;  // Exit if equipment is not found
        }

        // Populate the update form with the equipment data
        $("#eqId").val(equipment.equipmentId);
        $("#eqName").val(equipment.equipmentName);
        $("#eqType").val(equipment.equipmentType);
        $("#eqStatus").val(equipment.status);

        // Show the update modal
        $('#equipmentUpdateModal').modal('show');
      });

    },
    error: function (xhr, status, error) {
      console.error("Failed to fetch equipment data:", error);
      alert("Unable to load equipment details.");
    }
  });
}

// Handle update form submission
$("#updateEquipmentForm").submit(function (event) {
  event.preventDefault();

  // Get the updated equipment details from the form
  let updatedEquipment = {
    equipmentId: $("#eqId").val(),
    equipmentName: $("#eqName").val(),
    equipmentType: $("#eqType").val(),
    status: $("#eqStatus").val()
  };

  // Send the updated data to the server
  $.ajax({
    url: `http://localhost:5050/propMonitoring/api/v1/equipments/${updatedEquipment.equipmentId}`,
    type: "PUT",
    contentType: "application/json",
    data: JSON.stringify(updatedEquipment),
    success: function (response) {
      Swal.fire({
        title: "Success",
        text: "Equipment details updated successfully.",
        icon: "success"
      });
      $('#equipmentUpdateModal').modal('hide');
      getAllEquipment();  // Reload the equipment data
    },
    error: function (xhr, status, error) {
      Swal.fire({
        title: "Error",
        text: "Failed to update equipment details.",
        icon: "error"
      });
    }
  });
});
