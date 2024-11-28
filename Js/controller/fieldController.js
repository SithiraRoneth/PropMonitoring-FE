const field = {}
const fieldDB = []

$("#btnFieldSave").click(function(){
    let fieldCode = $('#txtfieldcode').val();
    let fieldName = $('#txtfieldname').val();
    let location = $('#txtfieldlocation').val();
    let size = $('#txtsize').val();
    let fieldImage1 = $('#txtimage1')[0].files[0];
    let fieldImage2 = $('#txtimage2')[0].files[0];
    

    
    let formData = new FormData();
    formData.append("fieldCode", fieldCode);
    formData.append("fieldName", fieldName);
    formData.append("location", location);
    formData.append("size", size);
    formData.append("fieldImage1", fieldImage1);
    formData.append("fieldImage2", fieldImage2);
});