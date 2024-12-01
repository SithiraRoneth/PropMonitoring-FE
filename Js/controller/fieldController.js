const field = {}
const fieldDB = []
getAllFields()
// Save a Field
$("#btnFieldSave").click(function () {
    let field_code = $('#txtfieldcode').val(); // Matches @RequestPart("fieldCode")
    let field_name = $('#txtfieldname').val(); // Matches @RequestPart("fieldName")
    let field_location = $('#txtfieldlocation').val(); // Matches @RequestPart("fieldLocation")
    let extend_size_of_the_field = $('#txtsize').val(); // Matches @RequestPart("extendSizeOfTheField")
    let field_image1 = $('#txtimage1')[0].files[0]; // Matches @RequestPart("fieldImage1")
    let field_image2 = $('#txtimage2')[0].files[0]; // Matches @RequestPart("fieldImage2")

    // Validate required fields
    if (!field_code || !field_name || !field_location || !extend_size_of_the_field) {
        alert("All fields except images are required.");
        return;
    }

    // Prepare FormData
    let formData = new FormData();
    formData.append("fieldCode", field_code);
    formData.append("fieldName", field_name);
    formData.append("fieldLocation", field_location);
    formData.append("extendSizeOfTheField", extend_size_of_the_field);

    if (field_image1) {
        formData.append("fieldImage1", field_image1);
    }
    if (field_image2) {
        formData.append("fieldImage2", field_image2);
    }

    console.log("FormData content:");
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    // AJAX Request
    $.ajax({
        url: "http://localhost:5050/propMonitoring/api/v1/fields",
        type: "POST",
        data: formData,
        processData: false, 
        contentType: false, 
        success: function (response) {
            console.log("Field saved successfully:", response);
            getAllFields();
        },
        error: function (xhr, status, error) {
            console.error("Error saving field:", xhr.responseText);
            alert(`Error: ${xhr.responseText || error}`);
        }
    });
    clearAllField()
    getAllFields
});



$("#btnFieldUpdate").click(function () {
    if (selectedFieldIndex !== null) {
        let fieldCode = $('#txtfieldcode').val();
        let fieldName = $('#txtfieldname').val();
        let fieldLocation = $('#txtfieldlocation').val();
        let extendSizeOfTheField = $('#txtsize').val();
        let fieldImage1 = $('#txtimage1')[0].files[0];
        let fieldImage2 = $('#txtimage2')[0].files[0];

        let formData = new FormData();
        formData.append("fieldCode", fieldCode);
        formData.append("fieldName", fieldName);
        formData.append("fieldLocation", fieldLocation);
        formData.append("extendSizeOfTheField", extendSizeOfTheField);

        // Include previously saved images if new ones are not provided
        if (fieldImage1) {
            formData.append("fieldImage1", fieldImage1);
        } else {
            formData.append("usePreviousImage1", true); // Custom flag for the server
        }

        if (fieldImage2) {
            formData.append("fieldImage2", fieldImage2);
        } else {
            formData.append("usePreviousImage2", true); // Custom flag for the server
        }

        const isConfirmed = confirm("Are you sure you want to update this field?");
        if (isConfirmed) {
            $.ajax({
                url: "http://localhost:5050/propMonitoring/api/v1/fields/" + fieldCode,
                type: "PUT",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log("Updated successfully:", res);
                    getAllFields();
                },
                error: function (xhr, status, error) {
                    console.error("Update failed:", error);
                }
            });
        } else {
            alert("Field update was cancelled.");
        }

        clearAllField();
        selectedFieldIndex = null;
        getAllFields();
    }
});


// Delete a Field
$("#btnFieldDelete").click(function () {
    let selectedID = $('#txtfieldcode').val();
    if (selectedID) {
        const isConfirmed = confirm("Are you sure you want to delete this field? This action cannot be undone.");
        if (isConfirmed) {
            $.ajax({
                url: "http://localhost:5050/propMonitoring/api/v1/fields/" + selectedID,
                type: "DELETE",
                success: function (response) {
                    alert("Field deleted successfully!");
                    getAllFields();
                    clearAllField();
                },
                error: function (xhr, status, error) {
                    if (xhr.status === 404) {
                        alert("Field not found!");
                    } else if (xhr.status === 500) {
                        alert("An error occurred while deleting the field.");
                    } else {
                        alert("Failed to delete field!");
                    }
                }
            });
        } else {
            alert("Field deletion was cancelled.");
        }
    } else {
        alert("Please select a field to delete!");
    }
});

// Check if Field Exists
function checkExistField(code) {
    for (let i = 0; i < fieldDB.length; i++) {
        if (code === fieldDB[i].fieldCode) {
            return true;
        }
    }
    return false;
}

// Clear All Field Input
function clearAllField() {
    $('#txtfieldcode').val('');
    $('#txtfieldname').val('');
    $('#txtfieldlocation').val('');
    $('#txtsize').val('');
    $('#txtimage1').val('');
    $('#txtimage2').val('');
    $('#fieldImagePreview1').hide();
    $('#fieldImagePreview2').hide();
}

// Preview Field Images
$("#txtimage1").change(function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#fieldImagePreview1').attr('src', e.target.result).show();
        };
        reader.readAsDataURL(file);
    }
});

$("#txtimage2").change(function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $('#fieldImagePreview2').attr('src', e.target.result).show();
        };
        reader.readAsDataURL(file);
    }
});

// Fetch and Display All Fields
function getAllFields() {
    let fieldContainer = $("#fieldCardsContainer");
    fieldContainer.empty();

    $.ajax({
        url: "http://localhost:5050/propMonitoring/api/v1/fields",
        type: "GET",
        contentType: "application/json",
        success: function (fields) {
            fieldDB.length = 0;
            fields.forEach((field) => {
                fieldDB.push(field);

                let card = $(`
                    <div class="col-md-4 field-card" data-index="${field.fieldCode}">
                        <div class="card mb-4" style="width: 100%;">
                            <img 
                                src="data:image/jpeg;base64,${field.fieldImage1}" 
                                class="card-img-top" 
                                alt="${field.fieldName}" 
                                loading="lazy" 
                                onerror="this.onerror=null;this.src='/path/to/placeholder.jpg';"
                                style="max-height: 200px; object-fit: cover;"
                            >
                            <img 
                                src="data:image/jpeg;base64,${field.fieldImage2}" 
                                class="card-img-top" 
                                alt="${field.fieldName}" 
                                loading="lazy" 
                                onerror="this.onerror=null;this.src='/path/to/placeholder.jpg';"
                                style="max-height: 200px; object-fit: cover;"
                            >
                            <div class="card-body">
                                <h5 class="card-title">${field.fieldName}</h5>
                                <p class="card-text">
                                    Field Code: ${field.fieldCode}<br>
                                    Location: ${field.fieldLocation}<br>
                                    Size: ${field.extendSizeOfTheField}<br>
                                </p>
                            </div>
                        </div>
                    </div>
                `);

                fieldContainer.append(card);
            });

            $(".field-card").click(function () {
                let selectedFieldCode = $(this).data("index");
                const selectedField = fieldDB.find(field => field.fieldCode === selectedFieldCode);
            
                if (selectedField) {
                    $('#txtfieldcode').val(selectedField.fieldCode);
                    $('#txtfieldname').val(selectedField.fieldName);
                    $('#txtfieldlocation').val(selectedField.fieldLocation);
                    $('#txtsize').val(selectedField.extendSizeOfTheField);
            
                    // Handle fieldImage1
                    if (selectedField.fieldImage1) {
                        $('#fieldImagePreview1').attr('src', `data:image/jpeg;base64,${selectedField.fieldImage1}`).show();
                        $('#txtimage1').val(''); 
                        $('#txtimage1').attr('placeholder', 'Default Image 1'); 
                    } else {
                        $('#fieldImagePreview1').hide();
                        $('#txtimage1').val('');
                        $('#txtimage1').attr('placeholder', 'No Image Provided');
                    }
            
                    // Handle fieldImage2
                    if (selectedField.fieldImage2) {
                        $('#fieldImagePreview2').attr('src', `data:image/jpeg;base64,${selectedField.fieldImage2}`).show();
                        $('#txtimage2').val('');
                        $('#txtimage2').attr('placeholder', 'Default Image 2'); 
                    } else {
                        $('#fieldImagePreview2').hide();
                        $('#txtimage2').val('');
                        $('#txtimage2').attr('placeholder', 'No Image Provided');
                    }
            
                    selectedFieldIndex = fieldDB.indexOf(selectedField);
                }
            });
            
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch fields: ", error);
        }
    });
}
