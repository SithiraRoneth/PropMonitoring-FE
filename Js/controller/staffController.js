const staff = {};
const staffDB = [];

const vehicle = {};
const vehicleDB = [];

getAllStaff()
// staff save
$("#btnnext").click(function(){
    let email = $('#txtemail').val();
    let firstName = $('#txtfirstname').val();
    let lastName = $('#txtlastname').val();
    let designation = $('#txtdesignation').val();
    let gender = $("input[name='GENDER']:checked").val();
    let addressline = $('#txtaddress').val();
    let contact = $('#txtcontact').val();
    let join = $("#txtdate").val()
    // let role = $('#staff-role').val();
    

    const newStaff = Object.assign({},staff);
    newStaff.email = email;
    newStaff.firstName = firstName;
    newStaff.lastName = lastName;   
    newStaff.designation = designation;
    newStaff.gender = gender;
    newStaff.address = addressline;
    newStaff.contactNo = contact;
    newStaff.joinedDate = join;
    // newStaff.role = role;
    

    console.log(newStaff);
    if(!checkExistStaff(newStaff.email)){
        $.ajax({
            url: "http://localhost:5050/propMonitoring/api/v1/staffs",
           type: "POST",
           data: JSON.stringify(newStaff),
           headers: {"Content-Type": "application/json"},
           success: (res) => {
               console.log(JSON.stringify(res))
               console.log("staff saved successfully")
               //getAllStaff()
               clearAllStaff()
               $('#modalStaffId').text(newStaff.email);
               $('#addVehicleModal').modal('show');
               
           },
           error: (res) => {
               console.error(res)
               Swal.fire({
                   title: "Oops Failed",
                   text: "Invalid Staff type",
                   icon: "error"
               })
           }
       })
    }else{
        alert("Oops! already exisist staff id")
    }
    
});

$("#btnsavevehicle").click(function () {
    let email = $('#modalStaffId').text(); // Staff email
    let licensePlateNo = $("#txtplate").val();
    let vehicleCategory = $("#txtVcategory").val();
    let fuelType = $("#txtfuel").val();
    let remarks = $("#txtremark").val();

    // Validate inputs
    if (!email || !licensePlateNo || !vehicleCategory || !fuelType) {
        alert("Please fill all required fields.");
        return;
    }

    // Create the vehicle object
    const newVehicle = {
        licensePlateNo,
        vehicleCategory,
        fuelType,
        remarks,
        staffMemberDetails: {
            email: email 
        }
    };

    console.log("Payload being sent to server:", newVehicle);

    // Send AJAX request
    $.ajax({
        url: "http://localhost:5050/propMonitoring/api/v1/vehicles",
        type: "POST",
        data: JSON.stringify(newVehicle),
        headers: { "Content-Type": "application/json" },
        success: function (res) {
            alert("Vehicle saved successfully.");
            console.log("Vehicle Data:", vehicleDB);
            $('#addVehicleModal').modal('hide');
            getAllStaff()
        },
        error: function (xhr) {
            console.error("Error while saving vehicle:", xhr.responseText);
            alert(`Failed to save vehicle. Error: ${xhr.responseText}`);
        }
    });
});



// Check if staff exists
function checkExistStaff(email) {
    return staffDB.some(staff => staff.email === email);
}

// Check if vehicle exists
function checkExistVehicle(licensePlateNo) {
    return vehicleDB.some(vehicle => vehicle.licensePlateNo === licensePlateNo);
}



$("#btnSkip").click(function(){
    alert("Staff saved")
    getAllStaff()
    $('#addVehicleModal').modal('hide');
});

// function checkExistStaff(email){
//     for(let i = 0; i < staffDB.length; i++){
//         if(staff == staffDB[i].email){
//             return true;
//         }
//     }
//     return false;
// }

// function checkExistVehicle(licensePlateNo){
//     for(let i = 0; i < vehicleDB.length; i++){
//         if(vehicle == vehicleDB[i].licensePlateNo){
//             return true;
//         }
//     }
//     return false;
// }
function clearAllStaff(){
    $("#txtplate").val('');
    $("#txtVcategory").val('')
    $("#txtfuel").val('')
    $("#txtremark").val('')
    $('#txtstaffid').val('')
    $('#txtfirstname').val('')
    $('#txtlastname').val('')
    $('#txtdesignation').val('')
    $("input[name='gender']:checked").val('')
    $('#txtaddress').val('')
    $('#txtcontact').val('')
    $('#txtemail').val('')
}

function getAllStaff() {
    let tBody = $("#tblStaff tbody");  // Selecting tbody element

    // Clear existing table data
    tBody.empty();

    $.ajax({
        url: "http://localhost:5050/propMonitoring/api/v1/staffs", 
        type: "GET",
        contentType: "application/json",
        success: function(staffs) {
            for (let i = 0; i < staffs.length; i++) {
                let tr = $(`<tr>
                                <td>${staffs[i].email}</td>
                                <td>${staffs[i].firstName}</td>
                                <td>${staffs[i].lastName}</td>
                                <td>${staffs[i].designation}</td>
                                <td>${staffs[i].gender}</td>
                                <td>${staffs[i].address}</td>
                                <td>${staffs[i].contactNo}</td>
                                
                                <td><button class="btn btn-warning updateBtn" data-staff-id="${staffs[i].email}">Update</button></td>  
                                <td><button class="btn btn-danger deleteBtn" data-staff-id="${staffs[i].email}">Delete</button></td>  
                            </tr>`);
                tBody.append(tr);  // Append the new row to the table
            }

            $(".deleteBtn").click(function() {
                let email = $(this).data("staff-id");
            
                // Show a simple confirmation dialog
                let confirmDelete = window.confirm("Are you sure you want to delete this staff member?");
            
                if (confirmDelete) {
                    // Proceed to delete the staff
                    $.ajax({
                        url: `http://localhost:5050/propMonitoring/api/v1/staffs/${email}`,
                        type: "DELETE",
                        success: function(response) {
                            alert("The staff member has been deleted.");
                            getAllStaff();  
                        },
                        error: function(xhr, status, error) {
                            if (xhr.status === 404) {
                                alert("Failed to delete the staff member. Staff not found.");
                            } else if (xhr.status === 500) {
                                alert("Failed to delete the staff member due to a server error.");
                            } else {
                                alert("An unknown error occurred.");
                            }
                        }
                    });
                } else {
                    alert("The staff member was not deleted.");
                }
            });
            

            // Add event listener for the update button
            $(".updateBtn").click(function () {
                let email = $(this).data("staff-id");
                let staff = staffs.find(s => s.email === email);
        
                if (staff) {
                    // Populate update modal fields
                    $("#email").val(staff.email);
                    $("#firstName").val(staff.firstName);
                    $("#lastName").val(staff.lastName);
                    $("#designation").val(staff.designation);
                    $("#gender").val(staff.gender);
                    $("#joindate").val(staff.joinedDate);
                    $("#address").val(staff.address);
                    $("#contactNo").val(staff.contactNo);
        
                    // Show the modal
                    $('#updateModal').modal('show');
                }
            });
        },
        error: function(xhr, status, error) {
            console.error("Failed to fetch staff data:", error);
            alert("Unable to load staff details.");
        }
    });
}

$("#updateStaffForm").submit(function(event) {
    event.preventDefault();

    // Get the updated staff details from the form inputs
    let updatedStaff = {
        email: $("#email").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        designation: $("#designation").val(),
        gender: $("#gender").val().toUpperCase(),  // Convert gender to uppercase
        joinedDate: $("#joindate").val(),
        address: $("#address").val(),
        contactNo: $("#contactNo").val()
    };

    // Send the updated data to the server
    $.ajax({
        url: `http://localhost:5050/propMonitoring/api/v1/staffs/${updatedStaff.email}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updatedStaff),
        success: function(response) {
            alert("Staff updated successfully");
            $('#updateModal').modal('hide');
            getAllStaff();  // Reload staff data
        },
        error: function(xhr, status, error) {
            alert("Failed to update staff: " + xhr.responseText);
        }
    });
});



