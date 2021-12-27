
var GetTypeEventPath;
var jsonEvent = [];
var file_list = [];
load_event();
createCalendar();
var Is_loadPending = true;

var current_fs, next_fs, previous_fs; //fieldsets
var opacity;
var current ;
var steps ;

//setProgressBar(current);
$(document).ready(function () {
    $('#menu-1').addClass('active')
    $('#menu-2').removeClass('active')
    $('#menu-3').removeClass('active')
    $('#menu-4').removeClass('active')
   

    $(document).on("click", ".next", function () {
        current_fs = $(this).parent();
        next_fs = $(this).parent().next();

        //Add Class Active
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({ opacity: 0 }, {
            step: function (now) {
                // for making fielset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                next_fs.css({ 'opacity': opacity });
            },
            duration: 500
        });
        setProgressBar(++current);
    });

    $(document).on("click", ".previous", function () {

            current_fs = $(this).parent();
            previous_fs = $(this).parent().prev();

            //Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

            //show the previous fieldset
            previous_fs.show();

            //hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now) {
                    // for making fielset appear animation
                    opacity = 1 - now;

                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    previous_fs.css({ 'opacity': opacity });
                },
                duration: 500
            });
            setProgressBar(--current);
        });

    

        $(".submit").click(function () {
            return false;
        })




    ///=============================
    $("#menu-2").removeClass("active");
    $("#staff").select2({
        width: '100%'
    });
    $('#Date_Start').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm', minDate: "01/01/2010 00:00"
    });
    $('#Date_End').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm', minDate: "01/01/2010 00:00"
    });
    $('#Date_Start_update').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm', minDate: "01/01/2010 00:00"
    });
    $('#Date_End_update').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY HH:mm', minDate: "01/01/2010 00:00"
    });
    //$('#Date_Start').bootstrapMaterialDatePicker({
    //    weekStart: 0, time: false
    //});
    //$('#Date_End').bootstrapMaterialDatePicker({
    //    weekStart: 0, time: false
    //});
    //$('#Time_Start').bootstrapMaterialDatePicker({
    //    format: 'HH:mm', time: true, date: false
    //});
    //$('#Time_End').bootstrapMaterialDatePicker({
    //    format: 'HH:mm', time: true, date: false
   // });
    //////////////////////////////


    //////////////////////////////


    // get type
    let optiontype = "";
    $('#type').empty();
    $.ajax({
        url: GetTypeEventPath,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            optiontype += ' <option value="empty">Select Type Event</option>'; 
            $.each(data, function (i, item) {
               // optiontype.log(item);
                optiontype += ' <option value="' + item.ID+'">' + item.type_event+'</option>';   
           });
            $("#type").append(optiontype);
        },
        error: function (err) {
        }
    });
    //get customer
    let optioncustomer = "";
    $('#customer').empty();
    $.ajax({
        url: GetCustomerPath,
        type: 'POST',
        //async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            optioncustomer += ' <option value="empty">Select Customer</option>';
            $.each(data, function (i, item) {
                // optiontype.log(item);
                optioncustomer += ' <option value="' + item.ID + '">' + item.name +'('+item.address+ ')'+'</option>';
            });
            optioncustomer += ' <option value="0">-</option>';
            $("#customer").append(optioncustomer);
        },
        error: function (err) {
        }
    });
 
    $('#staff').find('option').remove();
    $.post(GetStaffPath, function (response) {
        function iterate(item) {
           // console.log(item.name);
           // console.log(item);
            $("#staff").append(new Option(item , item));
        }
        response.forEach(iterate);
    });

    $("#type").change(function () {

        if ($('#type option').filter(':selected').val() != "empty" && $('#customer option').filter(':selected').val() != "empty") {
            checkstep();
        }
    });

    $("#customer").change(function () {
       // console.log($('#customer option').filter(':selected').val())
        if ($('#type option').filter(':selected').val() != "empty" && $('#customer option').filter(':selected').val() != "empty") {
            checkstep();
        }
    });
    //$("#event_id").change(function () {
  //  $("#event_id option").on("click", "option", function () {
    $("#event_id").change(function () {
        console.log("event_id")
        if ($('#type option').filter(':selected').val() != "empty" && $('#customer option').filter(':selected').val() != "empty" && $('#event_id option').filter(':selected').val() != "" && Is_loadPending==false) {
            checkstep();
        }
    });

    $("input[name='Radio']").change(function () {
        console.log($("input[name='Radio']:checked").val());
        if ($("input[name='Radio']:checked").val() == "new") {
            $("#event_id").val('')
            $("#submit_event").attr("data-mode", "new");
            $("#submit_event").attr("data-nextstep", 1);
            $('#mode_nextstep').prop("disabled", true);
            $("div.timeline-2#list_step .time-item").removeClass('index');
            $("div.timeline-2#list_step .time-item:nth-child(1)").addClass('index');
            $('#event_id').empty();
            $("#option").addClass("hidden");

        } else if ($("input[name='Radio']:checked").val() == "nextstep") {
            $("#submit_event").attr("data-mode", "nextstep");
        }
    });

    $(document).on("click", "#submit_event", function () {
        if ($('#type option').filter(':selected').val() == "empty" || $('#customer option').filter(':selected').val() == "empty") {
            swal({
                title: "ERROR",
                text: "Please input type,customer",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK"
            })
            return true;
        }

        $('#loading').removeClass('hidden')
        console.log("click submit");
        var items = {};
        
            //items.event_start = $('#Date_Start').val(),
            //items.event_end =$('#Date_End').val(),
            items.type_id = $('#type option').filter(':selected').val(),
              // items.type_detail = $('#other').val(),
            items.customer_id = $('#customer option').filter(':selected').val(),
            items.code_event = $('#event_id option').filter(':selected').val(),
            items.remark = $('#remark').val(),
            items.staff = $('#staff').val().toString(),
            console.log(items);
        //console.log($('#Date_Start').val(),"$('#Date_Start').val()")
        
        $.ajax({
            url: InsertEventPath,
            type: 'POST',
            data: JSON.stringify({
                items: items,
                mode: $("#submit_event").attr("data-mode"),
                step: $("#submit_event").attr("data-nextstep"),
                event_start: $('#Date_Start').val(),
                event_end : $('#Date_End').val(),
            }), //async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $('#loading').addClass('hidden')
                swal("success", "Insert Data Success", "success");
                $('#model_add').modal('hide');
                load_event();
            },
            error: function (err) {
                $('#loading').addClass('hidden')
            }
        });
        
    });
    $(document).on("click", "#detail_update", function () {
 

        $('#loading').removeClass('hidden')
        console.log("click submit");
        var items = {};
        //items.event_start = $('#Date_Start_update').val(),
        //items.event_end = $('#Date_End_update').val(),
        items.code_event = $('#detail_update').attr('data-code'),  
        items.remark = $('#remark_update').val(),
        items.step = $("#detail_update").attr("data-step")
      
        //console.log(items);

        $.ajax({
            url: UpdateEventPath,
            type: 'POST',
            data: JSON.stringify({
                items: items,
                event_start : $('#Date_Start_update').val(),
                event_end : $('#Date_End_update').val(),

            }), //async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                var files;
                //console.log("B", files);
                files = file_list;
                console.log(file_list,"file");
                console.log(file_list.length, "file length");
                if (file_list.length>0) {
                    for (var index in files) {
                        files[index].file = files[index].detail.file;
                        delete files[index].detail;
                    }


                    files.forEach(element => {
                        var Data = new FormData();
                        Data.append("file", element.file);
                        //Data.append("description", element.description);
                        Data.append("code", $("#detail_update").attr("data-code"));
                        Data.append("step", $("#detail_update").attr("data-step"));

                        let ck =true
                        $.ajax({
                            type: "POST",
                            url: InsertFilePath,
                            data: Data,
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: function () {

                                
                            },
                            error: function (xhr, status, error) {
                                ck=false
                                var errorMessage = xhr.status + ': ' + xhr.statusText
                                alert('Error - ' + errorMessage);
                            }
                        });
                        if (ck) {

                            $('#loading').addClass('hidden')
                            swal("success", "Update Data Success", "success");
                            location.reload();
                        }
                        $('#loading').addClass('hidden')

                    });

                } else {

                    $('#loading').addClass('hidden')
                    swal("success", "Update Data Success", "success");

                    load_event();
                    $('#model_update').modal('hide');

                }
        
         
            },
            error: function (err) {
                $('#loading').addClass('hidden')
            }
        });

    });

    $(document).on("click", "#status_update", function () {
 

        $('#loading').removeClass('hidden')
        console.log("click submit");
        var items = {};
        items.code_event = $('#status_update').attr('data-code'),  
        items.step = $("#status_update").attr("data-step"),
      
        //console.log(items);

        $.ajax({
            url: UpdateStatusEventPath,
            type: 'POST',
            data: JSON.stringify({
                items: items,
            }), //async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {           
                    $('#loading').addClass('hidden')
                    swal("success", "Update Data Success", "success");
                    load_event();
                    $('#model_update').modal('hide');
            },
            error: function (err) {
                $('#loading').addClass('hidden')
            }
        });

    });


    $(document).on("click", "#history", function () {
        //$('body').addClass("no-scroll");

       // $('body').css("overflow-y","hidden");
        //$("html,body").css("overflow", "visible")

        $('#model_update').modal('hide');
        $('#detail_his').empty();
        $('#loading').removeClass('hidden')
        //console.log("click submit");

            $.ajax({
                url: GetHistoryPath,
                type: 'POST',
                data: JSON.stringify({
                    code: $('#history').attr('data-code'),
                }), //async: false,
                contentType: 'application/json; charset=utf-8',
                success: function (data) {

                    //console.log(data.liststep)
                    //console.log(data.history)
                    var Ishavestep = false;
                    if (data.liststep.length == 0){
                        Ishavestep = false;
                    } else {
                        Ishavestep = true;
                    }
                  
                    if (data.history.length > 0) {
                        let txthtml = "";

                        if (data.history[0].name != null) {
                            txthtml += "<h4 id='heading'>" + data.history[0].name + "</h4>"
                        }
                        if (data.history[0].address != null) {
                            txthtml += "<p>" + data.history[0].address + "</p>"
                        }
                     
                        txthtml += "<form id='msform'>"
                        txthtml += "<ul id='progressbar'>"
                        if (Ishavestep) {
                            $.each(data.liststep, function (i, item) {
                                //header
                                let status = ""
                                if (item.status == 1 || item.status == 2) {
                                    status = "confirm";
                                } else {
                                    status = "pending";
                                }
                                let txtclass = "";
                                if (i == 0) {
                                    txtclass = "class='active'"
                                }                            
                                  txthtml += "<li " + txtclass + " id=" + status + "><strong>" + item + "</strong></li>"                           
                            });

                        } else {
                            $.each(data.history, function (i, item) {

                                //header
                                let status = ""
                                if (item.status == 1||item.status == 2) {
                                    status = "confirm";
                                } else {
                                    status = "pending";
                                }
                                let txtclass = "";
                                if (i == 0) {
                                    txtclass = "class='active'"
                                }                            
                                    txthtml += "<li " + txtclass + " id=" + status + "><strong>" + item.type_event + "</strong></li>"                               
                            });
                        }
                      
                        txthtml += "</ul>"
                        if (Ishavestep) {

                            txthtml += "<div class='progress'><div class='progress-bar progress-bar-striped progress-bar-animated' role = 'progressbar' aria-valuemin='0' aria-valuemax='100'></div> </div><br>"
                        }
                            
                        $.each(data.history, function (i, item) {
                            //loop body
                            txthtml += "<fieldset name='step'>"
                            txthtml += "<div class='form-card'>"
                            txthtml += "    <div class='row'>"
                            if (Ishavestep) {
                                txthtml += "       <div class='col-7'><h2 class='fs-title'>" + item.step_name + "</h2></div>"
                                txthtml += "       <div class='col-5'><h2 class='steps'>Step " + (i + 1) + "/" + data.liststep.length + "</h2>"
                            } else {
                                txthtml += "       <div class='col-7'><h2 class='fs-title'></h2></div>"
                                txthtml += "       <div class='col-5'><h2 class='steps'>Step 1/1 </h2>"
                            }
                        
                            txthtml += "    </div>"
                            txthtml += "</div>"
                               
                 
                            txthtml += "<div class='row'> <div class='col-md-6'> <div class='form-group'>"
                            txthtml += "<label for= 'Date_End' class= 'control-label txtcolor' > DateTime Start</label> "
                            //txthtml += "<input class='form-control' type='text' disabled value='" + moment(item.event_start).format('DD/MM/YYYY HH:mm') + "'> </div> </div>" 
                            txthtml += "<input class='form-control' type='text' disabled value='" + moment(item.event_start).zone(+0).format('DD/MM/YYYY HH:mm') + "'> </div> </div>"
                                                
                            txthtml += "<div class='col-md-6'> <div class='form-group'>"
                            txthtml += "<label for='Date_End' class='control-label txtcolor'>DateTime End</label>"
                            //txthtml += "<input class='form-control' type='text' disabled value='" + moment(item.event_end).format('DD/MM/YYYY HH:mm') + "'> </div> </div>"          
                            txthtml += "<input class='form-control' type='text' disabled value='" + moment(item.event_end).zone(+0).format('DD/MM/YYYY HH:mm') + "'> </div> </div>"
                            txthtml += "</div>"

                            txthtml += "<div class='row'>"
                              txthtml += " <div class='col-md-12'>"
                                txthtml += " <div class='form-group no-margin'>"
                            txthtml += " <label for='field-7' class='control-label txtcolor'>Remark</label>"
                               txthtml += "  <textarea class='form-control' placeholder='"+item.remark+"' style='margin-top: 0px; margin-bottom: 0px; height: 65px;' disabled ></textarea>"
                                txthtml += " </div>"
                            txthtml += " </div>"
                            txthtml += "</div>"
                                 
                            txthtml += "<div class='row'>"           
                               txthtml += "<div class='col-md-12'>" 
                                txthtml += "<div >" 
                                txthtml += "<label for='inputSkills' class='control-label txtcolor'>Attach File</label>" 
                                      txthtml += "<div class='form-group row '>" 


                            //file
                            txthtml += " <div class='col-sm-12'> <div class='bg-white'><ul class='mailbox-attachments d-flex flex-wrap align-items-stretch clearfix' style='margin-bottom:0px !important;'>"           
                            $.each(item.listfile, function (i, itemfile) {
                            let filename = itemfile.name;
                            let tmp = filename.split('.');
                            let FileType = tmp[1];
                            let format = itemfile.name_format + '^' + itemfile.name;
                            txthtml += "<li data-placement='top' data-html='true'><span class='mailbox-attachment-icon'>"
                            if (FileType == "docx" || FileType == "doc") {
                                txthtml += "<i class='far fa-file-word'></i>"
                            }
                            else if (FileType == "pptx" || FileType == "ppt") {
                                txthtml += "<i class='far fa-file-powerpoint'></i>"
                            }
                            else if (FileType == "xls" || FileType == "xlxs") {
                                txthtml += "<i class='far fa-file-excel'></i>"
                            }
                            else if (FileType == "pdf") {
                                txthtml += " <i class='far fa-file-pdf'></i>"
                            }
                            else if (FileType == "png" || FileType == "jpeg" || FileType == "jpg" || FileType == "JPG" || FileType == "gif") {
                                txthtml += "<i class='far fa-file-image'></i>"
                            }
                            else {
                                txthtml += "<i class='far fa-file'></i>"
                            }
                            txthtml += "</span> "
                            txthtml += "<div class='mailbox-attachment-info'><span class='mailbox-attachment-size clearfix'> "
                            txthtml += "<span style='font-size:12px'>" + itemfile.name + "</span>"
                            txthtml += "<button name='itemFile' value = " + format + " data-filename=" + itemfile.name + " class='btn btn-default btn-sm float-right'> <i class='fas fa-cloud-download-alt'></i></button >";
                            txthtml += " </span></div></li>"
                        });

                        txthtml += " </ul></div></div>"

                                          txthtml += "</div>" 
                                txthtml += "</div>" 
                               txthtml += "</div>" 
                            txthtml += "</div>" 
                            txthtml += "</div>" 
                           
                            if ((i == 0 && (data.history.length == 1 || data.liststep.length == 0)) || !Ishavestep ) {
                                // only one step,no have step
                                //console.log("if1")
                            }
                            else if ((data.history.length < data.liststep.length) && Ishavestep && data.liststep.length!=0) {
                                //no  finish
                               // console.log("if2")
                                if (i == 0) {
                                    if ((i + 1) == data.history.length) {
                                       // console.log("if2-1-1")
                                    } else {
                                        //console.log("if2-1-2")
                                        txthtml += "<input type='button' name='next' class='next action-button' value='Next'/>"
                                    }
                                   
                               }
                               else if ((i + 1) == data.history.length) {
                                    //console.log("if2-2")                              
                                    txthtml += "<input type='button' name='previous' class='previous action-button-previous' value='Previous'/>" 
                               } 
                                else {
                                    //console.log("if2-3")
                                    txthtml += "<input type='button' name='next' class='next action-button' value='Next'/>"
                                    txthtml += "<input type='button' name='previous' class='previous action-button-previous' value='Previous'/>" 
                                }
                                                
                            }
                            else if (i == 0 && Ishavestep) {
                                //step first
                                txthtml += "<input type='button' name='next' class='next action-button' value='Next'/>"
                                //console.log("if3")
                            } 
                            else if (i == (data.history.length-1)) {
                                //step final
                                txthtml += "<input type='button' name='previous' class='previous action-button-previous' value='Previous'/>" 
                               // console.log("if4")
                            }  else {
                               // console.log("if6")
                                //step normal
                                txthtml += "<input type='button' name='next' class='next action-button' value='Next'/>"
                                txthtml += "<input type='button' name='previous' class='previous action-button-previous' value='Previous'/>" 
                            }


                            txthtml += "</fieldset>"
                        });  
                           
                        txthtml += "</form>"

                        $('#detail_his').append(txthtml);

                         current = 1;
                        //steps = $("fieldset[name='step']").length;
                        steps = data.liststep.length;
                       // console.log(steps,"steps");
                         setProgressBar(current);
                        $('#model_history').modal('show');

                    }
                    $('#loading').addClass('hidden')
                },
                error: function (err) {
                    $('#loading').addClass('hidden')
                }
            });

    });

    $(document).on("click", "button[name='itemFile']", function () {

        console.log($(this).attr('data-filename'))
        let name =$(this).attr('data-filename')
 
        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.open("GET", DownloadFilePath.concat("?id=" + $(this).val() ));
        request.onload = function () {
      
                var url = window.URL.createObjectURL(this.response);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.href = url;
                a.download = name;
                a.click();
            
        }
        request.send();

    });

});
function setProgressBar(curStep) {
   // console.log(steps, "steps", curStep,"curStep");
    var percent = parseFloat(100 / steps) * curStep;
    percent = percent.toFixed();
    //console.log(percent,"percent");
    $(".progress-bar").css("width", percent + "%")

}
function clearform() {
    $('#type').val('empty').change();
    $('#customer').val('empty').change();
    $('#remark').val('');
    $('#staff').val('').trigger('change');
    $("input[name='Radio']").prop('checked', false);
    $("#event_id").val('');
    $("#option").addClass("hidden");
    $("div.row#panal_step").html("");
   // $('#mode_new').prop("disabled", false);
 //   $('#mode_nextstep').prop("disabled", false);
    $("div.timeline-2#list_step .time-item").removeClass('index');
    $('#event_id').empty();
}
function clearvalue() {
   // $("input[name='Radio']").prop('checked', false);
    $("div.row#panal_step").html("");
    $("#submit_event").attr("data-mode", "");
    $("#submit_event").attr("data-nextstep", "");

}
function checkstep() {
    let htmlstep = "";
    $('#loading').removeClass('hidden')
    clearvalue()
    $.ajax({
        url: CkEventAndStepPath,
        type: 'POST',
        data: JSON.stringify({
            type: $('#type option').filter(':selected').val(),
            customer: $('#customer option').filter(':selected').val(),
            code_event: $('#event_id option').filter(':selected').val()
        }),
        //async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log(data.hisEvent,"his");
           // console.log(data.hisEvent.length);
            console.log(data.liststep,"liststep");
            console.log(data.hisEvent,"hisEvent");
            var mode = "";
            var nextstep = 0;
            //const countFinish = data.hisEvent.filter(item => item.status == 1).length
            if (data.liststep.length != 0) {
                // มี step
                nextstep = data.hisEvent.length + 1;
                mode = "new";
                if (data.hisEvent.length != 0) {
                 
                    mode = "nextstep";
                    // case มีหลาย event code ที่ยังไม่เสร็จ
                    if (data.PendingEvent != null && data.PendingEvent.length > 0) {
        
                        let optionpending = "";
                        $.each(data.PendingEvent,function (i, item) {                         
                            optionpending += ' <option value="' + item+ '">' + item +'</option>';
                        });                  
                        $("#event_id").empty().append(optionpending);
                    }
                }
            } else {
                //ไม่มี step
                mode = "new";
                nextstep = 1;
            }
        
            if (data.liststep.length != 0) {
                htmlstep += "<div class='col-lg-12 col-sm-12'><label class='control-label pb-3'>Workflow</label><div class='card' style ='margin-left:35px'><div class='tab-pane'><div class='timeline-2' id='list_step'>";

                $.each(data.liststep, function (i, item) {
                    htmlstep += "<div class='time-item'> <div class='item-info'> <div class='text-muted'>Step " + (i + 1) + "</div><p><strong>" + item + "</strong></p></div></div>";
                });
                htmlstep += " </div></div ></div ></div >";
                $("div.row#panal_step").html(htmlstep);
                $("div.timeline-2#list_step .time-item:nth-child(" + nextstep + ")").addClass('index');
                if (mode == "new") {
                  
                    $("input[name='Radio']#mode_new").prop('checked', true);
                    $("#option").addClass("hidden");

                } else {
                    
                    $("input[name='Radio']#mode_nextstep").prop('checked', true);
                    Is_loadPending = true;
                    $("#event_id").val(data.hisEvent[0].code_event).change();
                    Is_loadPending = false;
                    $("#option").removeClass("hidden");
                }
            } else {

                $("#option").addClass("hidden");
            }
           
            $("#submit_event").attr("data-mode",mode);
            $("#submit_event").attr("data-nextstep", nextstep);
            $('#loading').addClass('hidden')
        },
        error: function (err) {
            $('#loading').addClass('hidden')
       
        }
    });
       
}
async function load_event() {

    jsonEvent = [];
    const a = await $.ajax({
        url: GetEventPath,
        // async: false,
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            //  console.log(data);
            if (data.code == "nodata") {

                //swal({
                //    title: "ERROR",
                //    text: "DATA NOT FOUND",
                //    type: "warning",
                //    confirmButtonColor: "#DD6B55",
                //    confirmButtonText: "OK"
                //})
            } else {
                //$('#loading').removeClass('hidden');
                $.each(data, function (i, item) {

                    //console.log(moment(item.event_start).zone(+0).format('YYYY-MM-DD HH:mm:ss'))
                    //console.log(moment(item.event_start).zone(+0))
                    //let tmp2 = item.plandt.substring(0, 4) + '/' + item.plandt.substring(6, 4) + '/' + item.plandt.substring(8, 6)
                    
                    jsonEvent.push({
                        title: (item.name === null ? '' : item.name) + " (" + item.type_event + ")" + (item.sum_step == "" ? '' :" :"+ item.sum_step),
                        code: item.code_event,
                        type: item.type_event,
                        type_id: item.type_id,                                           
                        remark: item.remark,

                        step: item.step,
                        step_name: item.step_name,
                        sum_step: item.sum_step,

                        status: item.status,
                        staff: item.staff,
                        ins_time: item.ins_time,
                        ins_user: item.ins_user,

                  
                        customer: item.name,
                        address: item.address,
                        contact_name: item.contact_name,
                        contact_tel: item.contact_tel,
                        contact_fax: item.contact_fax,
                        contact_email: item.contact_email,

                       //start: moment(item.event_start).format('YYYY-MM-DD HH:mm:ss'),
                       start: moment(item.event_start).zone(+0).format('YYYY-MM-DD HH:mm:ss'),
                        //end: moment(item.event_end).format('YYYY-MM-DD HH:mm:ss'),
                        end: moment(item.event_end).zone(+0).format('YYYY-MM-DD HH:mm:ss'),
                        color: item.color,

                    });
                })
            }
        },
        error: function (err) {

            swal({
                title: "ERROR",
                text: "Can't not connect database(E16)",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK"
            })
        }
    });


    $('#loading').addClass('hidden');
    //remove old data
    $('#calendar').fullCalendar('removeEvents');
    //Getting new event json data
    $("#calendar").fullCalendar('addEventSource', jsonEvent);
    //Updating new events
    $('#calendar').fullCalendar('rerenderEvents');
    //getting latest Events
    $('#calendar').fullCalendar('refetchEvents');
    //getting latest Resources
    $('#calendar').fullCalendar('refetchResources');

}
function createCalendar() {

  
    console.log(jsonEvent)
    $('#calendar').fullCalendar({
        //load_event()
        // weekends: false // will hide Saturdays and Sundays
        schedulerLicenseKey: 'GPL-My-Project-Is-Open-Source',
        eventLimit: 5,
        selectable: true,
        displayEventTime: false,
        eventLimit: true,
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,basicWeek,basicDay'
        },


        events: jsonEvent,
        //eventColor: '#59ceb5',
        eventRender: function (eventObj, $el) {
            //  console.log(eventObj.status);
            if (eventObj.status == 1 || eventObj.status == 2) {
                $el.find('.fc-title').prepend("<i class='fas fa-check' style='margin-right:7px;color:whilte'></i>   ")

            }
            $el.popover({
                title: (eventObj.customer === null ? '' : eventObj.customer) + " " + (eventObj.step_name ===null ? eventObj.type : eventObj.step_name),
                html: true,
                content: "location :" +( eventObj.address === null ? '-' : eventObj.address) + "<br>" +
                    "Contact :" + (eventObj.contact_name === null ? '-' : eventObj.contact_name) + "<br>"+
                    "Tel :" + (eventObj.contact_tel === null ? '-' : eventObj.contact_tel) +"<br>"+
                    "Fax :" + (eventObj.contact_fax === null ? '-' : eventObj.contact_fax) +"<br>"+
                    "E-mail :" + (eventObj.contact_email === null ? '-' : eventObj.contact_email) +"<br>"+
                    "remark :" + (eventObj.remark === null ? '-' : eventObj.remark)+"",
                trigger: 'hover',
                placement: 'top',
                container: 'body'
            });
        },
        //dayClick: function(date, jsEvent, view) {
        //    console.log(date.format())
        //     //alert('Clicked on: ' + date.format());
        //     //alert('Current view: ' + view.name);
        //     //// change the day's background color just for fun
        //     //$(this).css('background-color', 'red');

        //   },
        select: function (startDate, endDate, date) {
           // console.log(date)

            var dateEnd = new Date(endDate);
            dateEnd.setDate(dateEnd.getDate() - 1);
            var dateStart = new Date(startDate);

            //var newEndDate = dateEnd.getFullYear() + '-' + String(dateEnd.getMonth() + 1).padStart(2, '0') + '-' + String(dateEnd.getDate()).padStart(2, '0');
            var newEndDate = String(dateEnd.getDate()).padStart(2, '0') + '/' + String(dateEnd.getMonth() + 1).padStart(2, '0') + '/' + dateEnd.getFullYear();
            var newStartDate = String(dateStart.getDate()).padStart(2, '0')+ '/' + String(dateStart.getMonth() + 1).padStart(2, '0') + '/' +  dateStart.getFullYear();

            $('#Date_Start').val(newStartDate + " 08:00")
            $('#Date_End').val(newEndDate + " 17:00")

            clearform();
            $('#model_add').modal('show');
        },
        eventClick: function (calEvent) {
            // $('#modeledit').modal('show');
            //console.log(moment(calEvent.start));
            //console.log(moment(calEvent.end));
      
            //console.log(moment(calEvent.start).format('DD/MM/YYYY HH:mm'));
            //console.log(moment(calEvent.end).format('DD/MM/YYYY HH:mm'));

            //console.log(moment(calEvent.start).zone(+0).format('DD/MM/YYYY HH:mm'),"0");
            //console.log(moment(calEvent.start).zone(-7).format('DD/MM/YYYY HH:mm'),"-7");
            //console.log(moment(calEvent.end).format('DD/MM/YYYY HH:mm'));

            $('#Date_Start_update').val(moment(calEvent.start).zone(-0).format('DD/MM/YYYY HH:mm '))
            $('#Date_End_update').val(moment(calEvent.end).zone(-0).format('DD/MM/YYYY HH:mm '))

            $("#history").attr("data-code", calEvent.code)

            $("#detail_update").attr("data-code", calEvent.code)
            $("#detail_update").attr("data-step", calEvent.step)

            $("#status_update").attr("data-code", calEvent.code)
            $("#status_update").attr("data-step", calEvent.step)

            $('#remark_update').val(calEvent.remark)
            $('#listFile').empty();
            $.ajax({
                url: GetFilePath,
                type: 'POST',
                data: JSON.stringify({
                    code_event: calEvent.code,
                    step: calEvent.step,
                }), //async: false,
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    console.log(data)
                    console.log(data.length)
                    if (data.length > 0) {
                        let txthtml = " <div class='col-sm-12'> <div class='card-footer bg-white'><ul class='mailbox-attachments d-flex flex-wrap align-items-stretch clearfix'>"

                                
                        $.each(data, function (i, item) {

                            let filename = item.name;
                            let tmp = filename.split('.');
                            let FileType = tmp[1];
                            let format = item.name_format +'^'+item.name;
                            txthtml += "<li data-placement='top' data-html='true'><span class='mailbox-attachment-icon'>"
                            if (FileType == "docx" || FileType == "doc") {
                                txthtml += "<i class='far fa-file-word'></i>"
                            }
                            else if (FileType == "pptx" || FileType == "ppt") {
                                txthtml += "<i class='far fa-file-powerpoint'></i>"
                            }
                            else if (FileType == "xls" || FileType == "xlxs") {
                                txthtml += "<i class='far fa-file-excel'></i>"
                            }
                            else if (FileType == "pdf") {
                                txthtml += " <i class='far fa-file-pdf'></i>"
                            }
                            else if (FileType == "png" || FileType == "jpeg" || FileType == "jpg" || FileType == "JPG" || FileType == "gif") {
                                txthtml += "<i class='far fa-file-image'></i>"
                            }
                            else {
                                txthtml += "<i class='far fa-file'></i>"
                            }
                                txthtml += "</span> "
                            txthtml += "<div class='mailbox-attachment-info'><span class='mailbox-attachment-size clearfix mt-1'> "
                            txthtml +="<span style='font-size:12px'>"+item.name+"</span>"
                            txthtml += "<button name='itemFile' value = " + format + " data-filename="+ item.name+" class='btn btn-default btn-sm float-right'> <i class='fas fa-cloud-download-alt'></i></button >";    
                            txthtml +=" </span></div></li>"
                        });

                        txthtml += " </ul></div></div>"
                        $('#listFile').append(txthtml);              
                                   
                                
                    }
               
                },
                error: function (err) {
  
                }
            });
            if (calEvent.status == 1 || calEvent.status == 2) {
                $('#IsFinish.finish').removeClass('hidden');
            } else {
                $('#IsFinish.finish').addClass('hidden');

            }
            $('#model_update').modal('show');
            //console.log(moment(info.start).format('YYYY-MM-DD HH:mm'));
        },
    });



}