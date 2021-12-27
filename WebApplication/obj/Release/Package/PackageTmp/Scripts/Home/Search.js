
var table_cr;
$(document).ready(function () {

    $('#menu-2').addClass('active')
    $('#menu-1').removeClass('active')
    $('#menu-3').removeClass('active')
    $('#menu-4').removeClass('active')



    $('#Date_Start').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY', minDate: "01/01/2010", time: false 
    });
    $('#Date_End').bootstrapMaterialDatePicker({
        format: 'DD/MM/YYYY', minDate: "01/01/2010", time: false 
    });
  
    table_cr = $('#datatable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true,
        "pageLength": 10,
        "order": [],
        columnDefs: [

            {
                "targets": 3,
                "render": function (data, type, row) {

                    let txtstep = ""
                    if (row.step_name != null) {
                        txtstep = row.step_name + "(" + row.sum_step + ")";
                    } else {
                        txtstep = "";
                    }
                    return txtstep

                }
            },
            {
                "targets": 4,
                "render": function (data, type, row) {
                    let st = "";
                    //console.log(row.status)
                    if (row.status == 1 || row.status == 2) {
                        st = "<span style='font-size:12px;' class='badge badge-success'>Finished</span>";
                       
                    } 
                    else {
                        st = "<span style='font-size:12px;' class='badge badge-warning'>Waiting</span>";

                    }

                    return st;
                    // return `<span class="badge badge-warning">${data}</span>`;
                }
            },
            {
                "targets": 5,
                "render": function (data, type, row) {
                    //let a = moment(row.event_start).format('YYYY-MM-DD HH:mm:ss')
                    let a = moment(row.event_start).zone(+0).format('YYYY-MM-DD HH:mm:ss')
                    return a
                }
            },
            {
                "targets": 6,
                "render": function (data, type, row) {
                    //let a = moment(row.event_end).format('YYYY-MM-DD HH:mm:ss')
                    let a = moment(row.event_end).zone(+0).format('YYYY-MM-DD HH:mm:ss')
                    return a
                }
            }
            ,
            {
                "targets": 7,
                "render": function (data, type, row) {
                    let action_btn = '';

                    if (row === null) {
                        return null;
                    } else {
                        var btn_badge = `secondary`;
                        var editable = `disabled`;
                    
                        return `<div class="btn-group"><button type="button" id="search_item" data-code="${row.code_event}"class="btn btn-info btn-left btn-sm mb-1 mr-1">` +
                            `<i class="fas fa-external-link-alt"></i></button></div>`;
                    }
                }
            }
        ],

        columns: [
            { data: 'name' },
            { data: 'address' },
            { data: 'type_event' },
            //{ data: 'step_name' },
            //{ data: 'status' },
            //{ data: 'event_start' },
            //{ data: 'event_end' }
       
        ],
    });

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
                optiontype += ' <option value="' + item.ID + '">' + item.type_event + '</option>';
            });
            $("#type").append(optiontype);
        },
        error: function (err) {
        }
    });


    $(document).on("click", "#search_item", function () {
       // $('body').addClass("no-scroll");
        // $('body').css("overflow-y","hidden");
        //$("html,body").css("overflow", "visible")

     
        $('#detail_his').empty();
        $('#loading').removeClass('hidden')
        //console.log("click submit");

        $.ajax({
            url: GetHistoryPath,
            type: 'POST',
            data: JSON.stringify({
                code: $(this).attr('data-code'),
            }), //async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {

                console.log(data.liststep)
                console.log(data.history)
                var Ishavestep = false;
                if (data.liststep.length == 0) {
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
                            if (item.status == 1 || item.status == 2) {
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

                        //console.log(item.event_start)
                        // console.log(moment(item.event_start).format('DD/MM/YYYY HH:mm'))
                        // console.log(moment(item.event_start).format('DD-MM-YYYY HH:mm:ss'))
                        txthtml += "<div class='row'> <div class='col-md-6'> <div class='form-group'>"
                        txthtml += "<label for= 'Date_End' class= 'control-label txtcolor' > DateTime Start</label> "
                        //txthtml += "<input class='form-control' type='text' disabled value='" + moment(item.event_start).format('DD/MM/YYYY HH:mm') + "'> </div> </div>"
                        txthtml += "<input class='form-control' type='text' disabled value='" + moment(item.event_start).zone(+0).format('DD/MM/YYYY HH:mm') + "'> </div> </div>"

                        txthtml += "<div class='col-md-6'> <div class='form-group'>"
                        txthtml += "<label for='Date_End' class='control-label txtcolor'>DateTime End</label>"
                       // txthtml += "<input class='form-control' type='text' disabled value='" + moment(item.event_end).format('DD/MM/YYYY HH:mm') + "'> </div> </div>"
                        txthtml += "<input class='form-control' type='text' disabled value='" + moment(item.event_end).zone(+0).format('DD/MM/YYYY HH:mm') + "'> </div> </div>"
                        txthtml += "</div>"

                        txthtml += "<div class='row'>"
                        txthtml += " <div class='col-md-12'>"
                        txthtml += " <div class='form-group no-margin'>"
                        txthtml += " <label for='field-7' class='control-label txtcolor'>Remark</label>"
                        txthtml += "  <textarea class='form-control' placeholder='" + item.remark + "' style='margin-top: 0px; margin-bottom: 0px; height: 65px;' disabled ></textarea>"
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

                        if ((i == 0 && (data.history.length == 1 || data.liststep.length == 0)) || !Ishavestep) {
                            // only one step,no have step
                            console.log("if1")
                        }
                        else if ((data.history.length < data.liststep.length) && Ishavestep && data.liststep.length != 0) {
                            //no  finish
                            console.log("if2")
                            if (i == 0) {
                                if ((i + 1) == data.history.length) {
                                    console.log("if2-1-1")
                                } else {
                                    console.log("if2-1-2")
                                    txthtml += "<input type='button' name='next' class='next action-button' value='Next'/>"
                                }

                            }
                            else if ((i + 1) == data.history.length) {
                                console.log("if2-2")
                                txthtml += "<input type='button' name='previous' class='previous action-button-previous' value='Previous'/>"
                            }
                            else {
                                console.log("if2-3")
                                txthtml += "<input type='button' name='next' class='next action-button' value='Next'/>"
                                txthtml += "<input type='button' name='previous' class='previous action-button-previous' value='Previous'/>"
                            }

                        }
                        else if (i == 0 && Ishavestep) {
                            //step first
                            txthtml += "<input type='button' name='next' class='next action-button' value='Next'/>"
                            console.log("if3")
                        }
                        else if (i == (data.history.length - 1)) {
                            //step final
                            txthtml += "<input type='button' name='previous' class='previous action-button-previous' value='Previous'/>"
                            console.log("if4")
                        } else {
                            console.log("if6")
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
                    console.log(steps, "steps");
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
    function setProgressBar(curStep) {
        // console.log(steps, "steps", curStep,"curStep");
        var percent = parseFloat(100 / steps) * curStep;
        percent = percent.toFixed();
        //console.log(percent,"percent");
        $(".progress-bar").css("width", percent + "%")

    }
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

    $(document).on("click", "#clear", function () {
        $('#customer').val("")
        $('#remark').val("")
        $('#Date_Start').val("")
        $('#Date_End').val("")

        //$('#Status').val("0")
        //$('#type').val("")

        $('#Status option:first').prop('selected', true);
        $('#type option:first').prop('selected', true);
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

    $(document).on("click", "#submit", function () {
        //if ($('#type option').filter(':selected').val() == "empty" || $('#customer option').filter(':selected').val() == "empty") {
        //    swal({
        //        title: "ERROR",
        //        text: "Please input type,customer",
        //        type: "warning",
        //        confirmButtonColor: "#DD6B55",
        //        confirmButtonText: "OK"
        //    })
        //    return true;
        //}

        $('#loading').removeClass('hidden')
        console.log("click submit");
        var items = {};

            //items.event_start = $('#Date_Start').val(),
            //items.event_end = $('#Date_End').val(),
            items.type_id = $('#type option').filter(':selected').val(),
            items.customer = $('#customer').val(),
            items.status = $('#S_status option').filter(':selected').val(),
            items.remark = $('#remark').val(),
      
            console.log(items);
        console.log($('#Date_Start').val(),"$('#Date_Start').val()")
        console.log($('#Date_End').val(),"$('#Date_End').val()")


        $.ajax({
            url: Submit_SearchPath,
            type: 'POST',
            data: JSON.stringify({
                items: items,
                event_start : $('#Date_Start').val(),
                event_end : $('#Date_End').val(),
            }), //async: false,
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                $('#loading').addClass('hidden')
                table_cr.clear();
                table_cr.rows.add(data);
                table_cr.draw();
       
            },
            error: function (err) {
                $('#loading').addClass('hidden')
            }
        });

    });
});