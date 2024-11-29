const vehicle = {}

function getAllVehicles() {
    let tBody = $("#tblVehicleBody");
  
    // Clear existing table data
    tBody.empty();
  
    $.ajax({
      url: "http://localhost:5050/propMonitoring/api/v1/vehicles",  // Backend URL for equipment
      type: "GET",
      contentType: "application/json",
      success: function (vehicleList) {
        // Populate the equipment table
        vehicleList.forEach(vehicle => {
          let tr = $(`<tr>
                        <td>${vehicle.licensePlateNo}</td>
                        <td>${vehicle.vehicleCategory}</td>
                        <td>${vehicle.fuelType}</td>
                        <td>${vehicle.status}</td>
                        <td>${vehicle.remarks}</td>
                        
                        <td><button class="btn btn-warning updateBtn" data-licene-id="${vehicle.licensePlateNo}">Update</button></td>
                        <td><button class="btn btn-danger deleteBtn" data-licene-id="${vehicle.licensePlateNo}">Delete</button></td>
                      </tr>`);
          tBody.append(tr);
        });
  
        // Event listener for delete buttons
        $(".deleteBtn").click(function () {
          let licensePlateNo = $(this).data("licene-id");  // Get the equipment ID from the data attribute
          console.log("Deleting vehicle with License:", licensePlateNo);  // Log for debugging
        
          // Confirm deletion
          let confirmDelete = window.confirm("Are you sure you want to delete this vehicle?");
          
          if (confirmDelete) {
            // Perform the deletion
            $.ajax({
              url: `http://localhost:5050/propMonitoring/api/v1/vehicles/${licensePlateNo}`,
              type: "DELETE",  // Ensure the request type is DELETE
              success: function (response) {
                console.log("Delete success response:", response);  // Log the success response
                alert("Vehicle deleted successfully.");
                getAllVehicles();  // Reload the equipment data
              },
              error: function (xhr, status, error) {
                console.error("Failed to delete the vehicle:", error);  // Log any error that occurs
                alert("Failed to delete the vehicle.");
              }
            });
          } else {
            alert("The vehicle was not deleted.");
          }
        });
        
  
        // Event listener for update buttons
        $(".updateBtn").click(function () {
          let licensePlateNo = $(this).data("licene-id");
  
          // Log the clicked equipmentId and the equipmentList for debugging
          console.log("Clicked vehicle license:", licensePlateNo);
  
          // Find the equipment with the specified ID
          let vehicle = vehicleList.find(e => e.licensePlateNo === licensePlateNo);
  
          console.log("Found equipment:", vehicle);
  
          if (!vehicle) {
            alert("Vehicle not found");
            return;  // Exit if equipment is not found
          }
  
          // Populate the update form with the equipment data
          $("#liceneNo").val(vehicle.licensePlateNo);
          $("#vCategory").val(vehicle.vehicleCategory);
          $("#fuelType").val(vehicle.fuelType);
          $("#vStatus").val(vehicle.status);
          $("#vRemarks").val(vehicle.remarks);
  
          // Show the update modal
          $('#vehicleUpdateModal').modal('show');
        });
  
      },
      error: function (xhr, status, error) {
        console.error("Failed to fetch vehicle data:", error);
        alert("Unable to load vehicle details.");
      }
    });
  }
  
  // Handle update form submission
  $("#updateVehicleForm").submit(function (event) {
    event.preventDefault();
  
    // Get the updated equipment details from the form
    let updateVehicle = {
      licensePlateNo: $("#liceneNo").val(),
      vehicleCategory: $("#vCategory").val(),
      fuelType: $("#fuelType").val(),
      status: $("#vStatus").val(),
      remarks: $("#vRemarks").val()
    };
  
    // Send the updated data to the server
    $.ajax({
      url: `http://localhost:5050/propMonitoring/api/v1/vehicles/${updateVehicle.licensePlateNo}`,
      type: "PUT",
      contentType: "application/json",
      data: JSON.stringify(updateVehicle),
      success: function (response) {
        alert("updated vehicle")
        $('#vehicleUpdateModal').modal('hide');
        getAllVehicles();  // Reload the vehicle data
      },
      error: function (xhr, status, error) {
        Swal.fire({
          title: "Error",
          text: "Failed to update vehicle details.",
          icon: "error"
        });
      }
    });
  });
  