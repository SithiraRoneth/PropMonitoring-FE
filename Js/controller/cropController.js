const crop = {}; 
const cropDB = []; 
let selectedCropIndex = null; 

$("#btnCropSave").click(function(){
    let cropcode = $('#txtcropcode').val();
    let cropname = $('#txtcropname').val();
    let scientificname = $('#txtscientific').val();
    let cropimageFile = $('#txtimage')[0].files[0];
    let category = $('#txtcategory').val();
    let cropseason = $('#txtseason').val();
    // let fieldcode = $('#txtFiled').val();

    const newCrop = Object.assign({}, crop);
    newCrop.cropCode = cropcode;
    newCrop.cropName = cropname;
    newCrop.scientificName = scientificname;
    newCrop.category = category;
    newCrop.season = cropseason;
    // newCrop.fieldCode = fieldcode;

    if (!checkExistCrop(newCrop.cropCode)) {
        if (cropimageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                newCrop.cropImage = e.target.result;
                
                cropDB.push(newCrop);
                renderCropCards();
            };
            reader.readAsDataURL(cropimageFile);
            clearAllCrop()
        }
        $.ajax({
            url: "http://localhost:5050/crops",
            type: "POST",
            data: customerJson,
            headers: {"Content-Type": "application/json"},
            success: (res) => {
                console.log(JSON.stringify(res))
                Swal.fire({
                    title: "Saved Successfully",
                    text: "",
                    icon: "success"
                })
                // get All crops
            },
            error: (res) => {
                console.error(res)
                Swal.fire({
                    title: "Oops Failed",
                    text: "Invalid Crop type",
                    icon: "error"
                })
            }
        })
    } else {
        console.log("Crop with this code already exists");
        Swal.fire({
            title: "Same Customer Id",
            showClass: {
                popup: `
  animate__animated
  animate__fadeInUp
  animate__faster
`
            },
            hideClass: {
                popup: `
  animate__animated
  animate__fadeOutDown
  animate__faster
`
            }
        });
    }

    clearAllCrop();
    $('#txtcropcode').focus();
});

// $("#btnCropUpdate").click(function() {

//     if (selectedCropIndex !== null) {
//         let cropcode = $('#txtcropcode').val();
//         let cropname = $('#txtcropname').val();
//         let scientificname = $('#txtscientific').val();
//         let cropimageFile = $('#txtimage')[0].files[0];
//         let category = $('#txtcategory').val();
//         let cropseason = $('#txtseason').val();
//         let fieldcode = $('#txtFiled').val();

//         const updatedCrop = cropDB[selectedCropIndex];
//         updatedCrop.cropCode = cropcode;
//         updatedCrop.cropName = cropname;
//         updatedCrop.scientificName = scientificname;
//         updatedCrop.cropImage = cropimageFile;
//         updatedCrop.category = category;
//         updatedCrop.season = cropseason;
//         updatedCrop.fieldCode = fieldcode;

//         if (cropimageFile) {
//             const reader = new FileReader();
//             reader.onload = function(e) {
//                 updatedCrop.cropImage = e.target.result;
//                 renderCropCards();
//             };
//             reader.readAsDataURL(cropimageFile);
//         } else {
//             renderCropCards();
//         }

//         clearAllCrop();
//         selectedCropIndex = null;
//     }
// });
$("#btnCropUpdate").click(function () {
    if (selectedCropIndex !== null) {
        let cropcode = $('#txtcropcode').val();
        let cropname = $('#txtcropname').val();
        let scientificname = $('#txtscientific').val();
        let cropimageFile = $('#txtimage')[0].files[0];
        let category = $('#txtcategory').val();
        let cropseason = $('#txtseason').val();
        // let fieldcode = $('#txtFiled').val();

        const updatedCrop = cropDB[selectedCropIndex];

        updatedCrop.cropCode = cropcode;
        updatedCrop.cropName = cropname;
        updatedCrop.scientificName = scientificname;
        updatedCrop.category = category;
        updatedCrop.season = cropseason;
        // updatedCrop.fieldCode = fieldcode;

        if (cropimageFile) {
           
            const reader = new FileReader();
            reader.onload = function (e) {
                updatedCrop.cropImage = e.target.result; 
                renderCropCards();
            };
            reader.readAsDataURL(cropimageFile);
        } else {
            
            renderCropCards();
        }

        clearAllCrop();
        selectedCropIndex = null;
    }
});

$("#btnCropDelete").click(function(){
    let selectedID = $("txtcropcode").val()
    if (selectedID) {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't delete this crop",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                // Make an AJAX request to delete the customer
                $.ajax({
                    url: "http://localhost:5050/crop?id=" + selectedID,
                    type: "DELETE",
                    success: function (response) {
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: "Customer Deleted",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        clearAllCrop()
                    },
                    error: function (xhr, status, error) {
                        console.error("Failed to delete crop:", error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Failed to delete crop!'
                        });
                    }
                });
            } else {
                Swal.fire({
                    icon: 'info',
                    title: 'Cancelled',
                    text: 'Crop deletion was cancelled.'
                });
            }
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: 'No Crop Selected!',
            text: 'Please select a crop to delete.'
        });
    }
    clearAllCrop()
});

function checkExistCrop(code) {
    for (let i = 0; i < cropDB.length; i++) {
        if (code === cropDB[i].cropCode) {
            return true;
        }
    }
    return false;
}

function clearAllCrop() {
    $('#txtcropcode').val('');
    $('#txtcropname').val('');
    $('#txtscientific').val('');
    $('#txtimage').val('');
    $('#txtcategory').val('');
    $('#txtseason').val('');
    $('#txtFiled').val('');
    $('#imagePreview').hide();
}


function renderCropCards() {
    $('#cropCardsContainer').empty();
    cropDB.forEach((crop, index) => {
        const newCard = `
          <div class="col-md-4 crop-card" data-index="${index}">
            <div class="card mb-4" style="width: 100%;">
              <img src="${crop.cropImage || 'assets/default.jpg'}" class="card-img-top" alt="${crop.cropName}">
              <div class="card-body">
                <h5 class="card-title">${crop.cropName}</h5>
                <p class="card-text">
                  Scientific Name: ${crop.scientificName}<br>
                  Category: ${crop.category}<br>
                  Season: ${crop.season}<br>
                  Field Code: ${crop.fieldCode}
                </p>
              </div>
            </div>
          </div>`;
        $('#cropCardsContainer').append(newCard);
    });

    $(".crop-card").click(function() {
        selectedCropIndex = $(this).data("index");
        const selectedCrop = cropDB[selectedCropIndex];
    
        
        $('#txtcropcode').val(selectedCrop.cropCode);
        $('#txtcropname').val(selectedCrop.cropName);
        $('#txtscientific').val(selectedCrop.scientificName);
        $('#txtcategory').val(selectedCrop.category);
        $('#txtseason').val(selectedCrop.season);
        $('#txtFiled').val(selectedCrop.fieldCode);
    
        
        if (selectedCrop.cropImage) {
            $('#imagePreview').attr('src', selectedCrop.cropImage).show();
        } else {
            $('#imagePreview').hide();
        }
    
        console.log("Selected crop for update:", selectedCrop);
    });
    
    $("#txtimage").change(function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
               
                $('#imagePreview').attr('src', e.target.result).show();
            };
            reader.readAsDataURL(file);
        }
    });
    
}
