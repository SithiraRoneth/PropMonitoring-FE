const field = {}
const fieldDB = []
// Save a Field
$("#btnFieldSave").click(function () {
    let fieldCode = $('#txtfieldcode').val();
    let fieldName = $('#txtfieldname').val();
    let fieldLocation = $('#txtfieldlocation').val();
    let extendSizeOfTheField = $('#txtsize').val();
    let fieldImage1 = $('#txtimage1')[0].files[0];
    let fieldImage2 = $('#txtimage2')[0].files[0];

    let formData = new FormData();
    formData.append("fieldCode", fieldCode);
    formData.append("fieldName", fieldName);
    formData.append("location", fieldLocation);
    formData.append("size", extendSizeOfTheField);
    formData.append("fieldImage1", fieldImage1);
    formData.append("fieldImage2", fieldImage2);

    if (!checkExistField(fieldCode)) {
        const isSaved = confirm("Do you want to save this field?");
        if (isSaved) {
            $.ajax({
                url: "http://localhost:5050/propMonitoring/api/v1/fields",
                type: "POST",
                data: formData,
                processData: false,
                contentType: false,
                success: function (res) {
                    console.log("Saved successfully:", res);
                    getAllFields();
                },
                error: function (res) {
                    console.error("Save failed:", res);
                    error("Save failed")
                }
            });
        }
    } else {
        alert("Oops! Field code already exists.");
    }

    clearAllField();
    $('#txtfieldcode').focus();
    getAllFields();
});

// Update a Field
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
        formData.append("location", fieldLocation);
        formData.append("size", extendSizeOfTheField);

        if (fieldImage1) formData.append("fieldImage1", fieldImage1);
        if (fieldImage2) formData.append("fieldImage2", fieldImage2);

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

                    if (selectedField.fieldImage1) {
                        $('#fieldImagePreview1').attr('src', `data:image/jpeg;base64,${selectedField.fieldImage1}`).show();
                    } else {
                        $('#fieldImagePreview1').hide();
                    }

                    if (selectedField.fieldImage2) {
                        $('#fieldImagePreview2').attr('src', `data:image/jpeg;base64,${selectedField.fieldImage2}`).show();
                    } else {
                        $('#fieldImagePreview2').hide();
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
