const staff = {};
const staffDB = [];

const vehicle = {};
var vehicleDB = [];

getAllStaff()
// staff save
$("#btnnext").click(function(){
    let staffId = $('#txtstaffid').val();
    let firstName = $('#txtfirstname').val();
    let lastName = $('#txtlastname').val();
    let designation = $('#txtdesignation').val();
    let gender = $("input[name='gender']:checked").val();
    let addressline1 = $('#txtaddress1').val();
    let contact = $('#txtcontact').val();
    let email = $('#txtemail').val();

    const newStaff = Object.assign({},staff);
    newStaff.staffId = staffId;
    newStaff.firstName = firstName;
    newStaff.lastName = lastName;   
    newStaff.designation = designation;
    newStaff.gender = gender;
    newStaff.addressline1 = addressline1;
    newStaff.contact = contact;
    newStaff.email = email;

    console.log(newStaff);
    if(!checkExistStaff(newStaff.staff)){
        $.ajax({
            url: "http://localhost:5050/propMonitoring/api/v1/staffs",
           type: "POST",
           data: JSON.stringify(newStaff),
           headers: {"Content-Type": "application/json"},
           success: (res) => {
               console.log(JSON.stringify(res))
               console.log("staff saved successfully")
               getAllStaff()
               clearAllStaff()
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
// vehicle save
$("#btnsavevehicle").click(function(){
    let licene = $("#txtplate").val();
    let Vcategory = $("#txtVcategory").val()
    let fuel = $("#txtfuel").val()
    let status = $("#txtstatus").val()
    let remarks = $("#txtremark").val()
    let staffId = $('#modalStaffId').text();

    const newVehicle = Object.assign({},vehicle);
    newVehicle.licene = licene;
    newVehicle.Vcategory = Vcategory;
    newVehicle.fuel = fuel;
    newVehicle.status = status;
    newVehicle.remarks = remarks;
    newVehicle.Vstaff = staffId;

    console.log(newVehicle);
    if(!checkExistVehicle(newVehicle.licene)){
        $.ajax({
            // url: "http://localhost:5050/api/v1/vehicles",
            type: "POST",
            data: JSON.stringify(newVehicle),
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                console.log(JSON.stringify(res))
                console.log("vehicle saved successfully")
                
                // Swal.fire({
                //     title: "Saved Successfully",
                //     text: "",
                //     icon: "success"
                // })
                $('#addVehicleModal').modal('hide');
                // get All crops

            },
            error: (res) => {
                console.error(res)
                Swal.fire({
                    title: "Oops Failed",
                    text: "Invalid Vehicle type",
                    icon: "error"
                })
            }
        })
    }else{
        console.log("vehicle with id already added")
    
    }
});

$("#btnSkip").click(function(){
    // Swal.fire({
    //     title: "Staff Saved Successfully",
    //     text: "",
    //     icon: "success"
    // });
    alert("saved")
    $('#addVehicleModal').modal('hide');
});

function checkExistStaff(staffId){
    for(let i = 0; i < staffDB.length; i++){
        if(staff == staffDB[i].staffId){
            return true;
        }
    }
    return false;
}

function checkExistVehicle(licene){
    for(let i = 0; i < vehicleDB.length; i++){
        if(vehicle == vehicleDB[i].licene){
            return true;
        }
    }
    return false;
}
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
    $('#txtaddress1').val('')
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
                                <td>${staffs[i].staffId}</td>
                                <td>${staffs[i].firstName}</td>
                                <td>${staffs[i].lastName}</td>
                                <td>${staffs[i].designation}</td>
                                <td>${staffs[i].gender}</td>
                                <td>${staffs[i].address}</td>
                                <td>${staffs[i].contactNo}</td>
                                <td>${staffs[i].email}</td>
                                <td><button class="btn btn-warning updateBtn" data-staff-id="${staffs[i].staffId}">Update</button></td>  
                                <td><button class="btn btn-danger deleteBtn" data-staff-id="${staffs[i].staffId}">Delete</button></td>  
                            </tr>`);
                tBody.append(tr);  // Append the new row to the table
            }

            $(".deleteBtn").click(function() {
                let staffId = $(this).data("staff-id");
            
                // Show a simple confirmation dialog
                let confirmDelete = window.confirm("Are you sure you want to delete this staff member?");
            
                if (confirmDelete) {
                    // Proceed to delete the staff
                    $.ajax({
                        url: `http://localhost:5050/propMonitoring/api/v1/staffs/${staffId}`,
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
            $(".updateBtn").click(function() {
                let staffId = $(this).data("staff-id");
                let staff = staffs.find(s => s.staffId === staffId);

                // Populate the modal fields with the staff data
                $("#staffId").val(staff.staffId);
                $("#firstName").val(staff.firstName);
                $("#lastName").val(staff.lastName);
                $("#designation").val(staff.designation);
                $("#gender").val(staff.gender);
                $("#address").val(staff.address);
                $("#contactNo").val(staff.contactNo);
                $("#email").val(staff.email);

                // Show the modal
                $('#updateModal').modal('show');
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
        staffId: $("#staffId").val(),
        firstName: $("#firstName").val(),
        lastName: $("#lastName").val(),
        designation: $("#designation").val(),
        gender: $("#gender").val(),
        address: $("#address").val(),
        contactNo: $("#contactNo").val(),
        email: $("#email").val()
    };

    // Send the updated data to the server
    $.ajax({
        url: `http://localhost:5050/propMonitoring/api/v1/staffs/${updatedStaff.staffId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(updatedStaff),
        success: function(response) {
            Swal.fire({
                title: "Success",
                text: "Staff details updated successfully.",
                icon: "success"
            });
            $('#updateModal').modal('hide');
            getAllStaff();  // Reload the staff data
        },
        error: function(xhr, status, error) {
            Swal.fire({
                title: "Error",
                text: "Failed to update staff details.",
                icon: "error"
            });
        }
    });
});



