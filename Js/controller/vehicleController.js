getAllVehicles()

function getAllVehicles() {
  $.ajax({
    url: "http://localhost:5050/propMonitoring/api/v1/vehicles", 
    type: "GET",
    contentType: "application/json",
    success: function (vehicleList) {
      console.log("Fetched Vehicle List:", vehicleList);  // Log for debugging
      if (!Array.isArray(vehicleList)) {
        console.error("Expected an array but received:", vehicleList);
        alert("Unexpected data format from server.");
        return;
      }

      vehicleList.forEach(vehicle => {
        let tr = $(`<tr>
                      <td>${vehicle.licensePlateNo}</td>
                      <td>${vehicle.vehicleCategory}</td>
                      <td>${vehicle.fuelType}</td>
                      <td>${vehicle.status}</td>
                      <td>${vehicle.remarks}</td>
                      <td>${vehicle.staffMemberDetails}</td>
                      <td><button class="btn btn-warning updateBtn" data-licene-id="${vehicle.licensePlateNo}">Update</button></td>
                      <td><button class="btn btn-danger deleteBtn" data-licene-id="${vehicle.licensePlateNo}">Delete</button></td>
                    </tr>`);
        tBody.append(tr);
      });
    },
    error: function (xhr, status, error) {
      console.error("Failed to fetch vehicle data:", error);
      alert("Unable to load vehicle details.");
    }
  });
}
