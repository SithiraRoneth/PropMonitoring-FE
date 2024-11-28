
  document.getElementById("btnequipmentAdd").addEventListener("click", function () {
    // Get the modal element
    var myModal = new bootstrap.Modal(document.getElementById("equipmentModal"));
    myModal.show();
  });

  const equipment = {}
  const equipmentDB = []

  $("#btnSaveEquipment").click(function(){
    let eqId = $("#txteqid").val()
    let eqName = $("#txteqname").val()
    let eqType = $("input[name='Eq_type']:checked").val()
    let eqStatus = $("input[name='Eq_status']:checked").val()

    const newEquipment = Object.assign({},equipment);
    newEquipment.eqId = eqId
    newEquipment.eqName = eqName
    newEquipment.eqType = eqType
    newEquipment.eqStatus = eqStatus

    console.log(newEquipment)

    if(!checkExistEquipment(newEquipment.eqId)){
      $.ajax({
        // url: "http://localhost:5050/propMonitoring/api/v1/equipments",
        type: "POST",
        data: JSON.stringify(newEquipment),
        headers: {"Content-Type": "application/json"},
        success: (res) => {
            console.log(JSON.stringify(res))
            console.log("equipment saved successfully")
            
            // Swal.fire({
            //     title: "Saved Successfully",
            //     text: "",
            //     icon: "success"
            // })
            getAllEquipments()
            // get All crops

        },
        error: (res) => {
            console.error(res)
            Swal.fire({
                title: "Oops Failed",
                text: "Invalid Equipment type",
                icon: "error"
            })
        }
      })
    }else{
      alert("Oops! existing equipment code, try again with new equipment code")
    }
  });

  function checkExistEquipment(eqId){
   
  }
  function clearAllEquipment(){
    $("#txteqid").val('')
    $("#txteqname").val('')
    $("input[name='Eq_type']:checked").val('')
    $("input[name='Eq_status']:checked").val('')
  }

  function getAllEquipments(){
    let tBody = $("#tblEquipment");
    tBody.empty()

    $.ajax({
      // url: "http://localhost:5050/propMonitoring/api/v1/equipments", // The URL to the backend endpoint
      type: "GET", // HTTP method
      contentType: "application/json", // Expected response content type
      success: function (equipments) {
          // Iterate over the list of customers and append each to the table
          for (let i = 0; i < equipments.length; i++) {
              let tr = $(`<tr>
                              <td>${equipments[i].eqId}</td>
                              <td>${equipments[i].eqName}</td>
                              <td>${equipments[i].eqType}</td>
                              <td>${equipments[i].eqStatus}</td>
                              <td><button class="btn btn-warning updateBtn" data-staff-id="${equipments[i].eqId}">Update</button></td>  
                              <td><button class="btn btn-danger deleteBtn" data-staff-id="${equipments[i].eqId}">Delete</button></td>  
                          </tr>`);
              tBody.append(tr);
          }
          $(".deleteBtn").click(function() {
            let eqId = $(this).data("eq-id");
        
            // Show a simple confirmation dialog
            let confirmDelete = window.confirm("Are you sure you want to delete this equipment ?");
        
            if (confirmDelete) {
                // Proceed to delete the staff
                $.ajax({
                    url: `http://localhost:5050/propMonitoring/api/v1/equipments/${eqId}`,
                    type: "DELETE",
                    success: function(response) {
                        alert("The equipment has been deleted.");
                        getAllStaff();  
                    },
                    error: function(xhr, status, error) {
                        if (xhr.status === 404) {
                            alert("Failed to delete the equipment. equipment not found.");
                        } else if (xhr.status === 500) {
                            alert("Failed to delete the equipment due to a server error.");
                        } else {
                            alert("An unknown error occurred.");
                        }
                    }
                  });
                }else{
                  alert("Equipment was not deleted.")
                }
              });

              $(".updateBtn").click(function() {
                let eqId = $(this).data("eq-id");
                let equipment = equipments.find(e => e.eqId === eqId);

                // Populate the modal fields with the equipment data
                $("#eqId").val(equipment.eqId);
                $("#eqName").val(equipment.eqName);
                $("#eqType").val(equipment.eqType);
                $("#eqStatus").val(equipment.eqStatus);
      
                // Show the modal
                $('#updateEqModal').modal('show');
              });
              
      },
      error: function (xhr, status, error) {
          console.error("Failed to fetch equipment: ", error);
      }
    });
  }

  $("#updateEquipmentForm").submit(function(event){
      event.preventDefault();

      let updateEquipment = {
        eqId: $("#eqId").val(),
        eqName: $("#eqName").val(),
        eqType: $("#eqType").val(),
        eqStatus: $("#eqStatus").val()
      };
      $.ajax({
        url: `http://localhost:5050/propMonitoring/api/v1/equipments/${updateEquipment.eqId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updateEquipment),
        success: function(response) {
            alert("Equipment updated")
            $('#updateEqModal').modal('hide');
            getAllEquipments(); 
        },
        error: function(xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update equipment details.",
                icon: "error"
            });
        }
    });
  });