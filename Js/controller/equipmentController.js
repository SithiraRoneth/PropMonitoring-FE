
  document.getElementById("btnequipmentAdd").addEventListener("click", function () {
    // Get the modal element
    var myModal = new bootstrap.Modal(document.getElementById("equipmentModal"));
    myModal.show();
  });

  const equipment = {}
  const equipmentDB = []

  getAllEquipments()

  $("#tblEquipment").on('click', 'tr',function(){
    let eqId = $(this).find('td:eq(0)').text();
    let eqName = $(this).find('td:eq(1)').text();
    let eqType = $(this).find('td:eq(2)').text();
    let eqStatus = $(this).find('td:eq(3)').text();
    
    $("#txteqid").val(eqId)
    $("#txteqname").val(eqName)
    $("input[name='Eq_type']:checked").val(eqType)
    $("input[name='Eq_status']:checked").val(eqStatus)
  })

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
      url: "http://localhost:5050/equipments", // The URL to the backend endpoint
      type: "GET", // HTTP method
      contentType: "application/json", // Expected response content type
      success: function (equipment) {
          // Iterate over the list of customers and append each to the table
          for (let i = 0; i < equipment.length; i++) {
              let tr = $(`<tr>
                              <td>${equipment[i].eqId}</td>
                              <td>${equipment[i].eqName}</td>
                              <td>${equipment[i].eqType}</td>
                              <td>${equipment[i].eqStatus}</td>
                          </tr>`);
              tBody.append(tr);
          }
      },
      error: function (xhr, status, error) {
          console.error("Failed to fetch equipment: ", error);
      }
    });
  }