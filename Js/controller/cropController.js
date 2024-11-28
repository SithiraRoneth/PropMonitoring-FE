const crop = {}; 
const cropDB = []; 
let selectedCropIndex = null; 

getAllCrops()

$("#btnCropSave").click(function () {
    let cropCode = $('#txtcropcode').val();
    let cropName = $('#txtcropname').val();
    let scientificName = $('#txtscientific').val();
    let cropImageFile = $('#txtimage')[0].files[0];
    let category = $('#txtcategory').val();
    let season = $('#txtseason').val();

    
    let formData = new FormData();
    formData.append("crop_code", cropCode);
    formData.append("cropName", cropName);
    formData.append("scientificName", scientificName);
    formData.append("cropImage", cropImageFile);
    formData.append("category", category);
    formData.append("season", season);

    
    $.ajax({
        url: "http://localhost:5050/propMonitoring/api/v1/crops",
        type: "POST",
        data: formData,
        processData: false, 
        contentType: false,
        success: (res) => {
            console.log("Saved successfully:", res);
            
            getAllCrops()
        },
        
        error: (res) => {
            console.error("Save failed:", res);
            Swal.fire({
                title: "Oops Failed",
                text: "Unable to save the crop",
                icon: "error",
            });
        },
    });

    clearAllCrop();
    $('#txtcropcode').focus();
    getAllCrops()
});


$("#btnCropUpdate").click(function () {
    if (selectedCropIndex !== null) {
        let cropCode = $('#txtcropcode').val();
        let cropName = $('#txtcropname').val();
        let scientificName = $('#txtscientific').val();
        let cropImageFile = $('#txtimage')[0].files[0]; 
        let category = $('#txtcategory').val();
        let season = $('#txtseason').val();

        
        let formData = new FormData();
        formData.append("cropCode", cropCode);
        formData.append("cropName", cropName);
        formData.append("scientificName", scientificName);
        formData.append("category", category);
        formData.append("season", season);

        
        if (cropImageFile) {
            formData.append("cropImage", cropImageFile);
        } else {
            
            formData.append("cropImage", "");
        }
        const isConfirmed = confirm("Are you sure you want to update this crop? ");
        if(isConfirmed){
        $.ajax({
            url: "http://localhost:5050/propMonitoring/api/v1/crops/" + cropCode,
            type: "PUT",
            data: formData,
            processData: false,
            contentType: false,
            success: function (res) {
                console.log("Updated successfully:", res);
                getAllCrops()
                
            },
            error: function (xhr, status, error) {
                console.error("Update failed:", error);
               
            }
        });
        }else{
            alert("Crop Update was cancelled."); 
        }

        clearAllCrop(); 
        selectedCropIndex = null; 
        getAllCrops()
    }
});



$("#btnCropDelete").click(function(){
    let selectedID = $('#txtcropcode').val();
    if (selectedID) {
        
        const isConfirmed = confirm("Are you sure you want to delete this crop? You won't be able to recover it.");

        if (isConfirmed) {
            
            $.ajax({
                url: "http://localhost:5050/propMonitoring/api/v1/crops/" + selectedID, 
                type: "DELETE",
                success: function (response) {
                    alert("Crop deleted successfully!"); 
                    getAllCrops(); 
                    clearAllCrop(); 
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 404) {
                        alert("Crop not found!"); 
                    } else if (xhr.status === 500) {
                        alert("An error occurred while deleting the crop."); 
                    } else {
                        alert("Failed to delete crop!"); 
                    }
                }
            });
        } else {
            alert("Crop deletion was cancelled."); 
        }
    } else {
        alert("Please select a crop to delete!"); 
    }
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
 
function getAllCrops() {
    let cropContainer = $("#cropCardsContainer");
    cropContainer.empty();

    $.ajax({
        url: "http://localhost:5050/propMonitoring/api/v1/crops", 
        type: "GET", 
        contentType: "application/json",
        success: function (crops) {
            cropDB.length = 0; 
            crops.forEach((crop) => {
                cropDB.push(crop); 

                let card = $(`
                    <div class="col-md-4 crop-card" data-index="${crop.cropCode}">
                        <div class="card mb-4" style="width: 100%;">
                            <img 
                                src="data:image/jpeg;base64,${crop.cropImage}" 
                                class="card-img-top" 
                                alt="${crop.cropName}" 
                                loading="lazy" 
                                onerror="this.onerror=null;this.src='/path/to/placeholder.jpg';"
                                style="max-height: 200px; object-fit: cover;"
                            >
                            <div class="card-body">
                                <h5 class="card-title">${crop.cropName}</h5>
                                <p class="card-text">
                                    Crop Code: ${crop.cropCode}<br>
                                    Scientific Name: ${crop.scientificName}<br>
                                    Category: ${crop.category}<br>
                                    Season: ${crop.season}<br>
                                </p>
                            </div>
                        </div>
                    </div>
                `);

                cropContainer.append(card);
            });

            // Add click event to each crop card
            $(".crop-card").click(function() {
                let selectedCropCode = $(this).data("index"); 
                const selectedCrop = cropDB.find(crop => crop.cropCode === selectedCropCode); 

                
                if (selectedCrop) {
                    $('#txtcropcode').val(selectedCrop.cropCode);
                    $('#txtcropname').val(selectedCrop.cropName);
                    $('#txtscientific').val(selectedCrop.scientificName);
                    $('#txtcategory').val(selectedCrop.category);
                    $('#txtseason').val(selectedCrop.season);

                    
                    if (selectedCrop.cropImage) {
                        $('#imagePreview').attr('src', `data:image/jpeg;base64,${selectedCrop.cropImage}`).show();
                    } else {
                        $('#imagePreview').hide();
                    }

                    
                    selectedCropIndex = cropDB.indexOf(selectedCrop);
                }
            });
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch crops: ", error);
        }
    });
}
