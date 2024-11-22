document.getElementById('btnstaffsave').addEventListener('click', function () {
    const modal = new bootstrap.Modal(document.getElementById('staffModal'));
    modal.show();
});

const staff = {};
// const staffDB = [];

const vehicle = {};
// const vehicleDB = [];
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
    $('#staffModal').modal('hide');
    $('#modalStaffId').text(staffId);
    $('#addVehicleModal').modal('show');
    if(!checkExistStaff(newStaff.staffId)){
        $.ajax({
            url: "http://localhost:5050/staff",
            type: "POST",
            data: JSON.stringify(newStaff),
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                console.log(JSON.stringify(res))
                console.log("staff saved successfully")
                clearAllStaff()
                $('#addVehicleModal').modal('show');
                // Swal.fire({
                //     title: "Saved Successfully",
                //     text: "",
                //     icon: "success"
                // })

                // get All crops
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
        console.log("staff with id alraedy added")
    }
    
});
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
            url: "http://localhost:5050/vehicles",
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