var table1;


$(document).ready(function () {
    $('#loading').addClass('hidden')
    $('#menu-7').addClass('active')
    $('#menu-1').removeClass('active')
    $('#menu-2').removeClass('active')
    $('#menu-3').removeClass('active')

    async function loadtable() {

        table1 = await $('#user_tb').DataTable({
            // "paging": true,
            // "lengthChange": true,
            //"searching": true
            // ordering: false,
            // "info": true,
            // "autoWidth": true,
            // "pageLength": 10,        
            //ajax: {
            //    url: GetDataTypePath,
            //    type: "POST",
            //    //data: { dept: us_dept, searchdept: se_dept}
            //    data: function (d) {
            //        d.dept = '';             
            //    }
            //},
            treeGrid: {
                left: 10,
                expandIcon: '<span><i class="fas fa-angle-right text-primary"></i></span>',
                collapseIcon: '<span><i class="fas fa-angle-down text-primary"></i></span>'
            },
            order: [[1, "asc"]],
            columns:
                [
                    //{ data: 'type_code' },
                    //{ data: 'type_code' },
                    //{ data: 'type_code' },
                    //{ data: 'type_code' },
                    //{
                    //    target: 0,
                    //    className: 'treegrid-control',
                    //    orderable: false,
                    //    data: function (item) {
                    //        if (item.children != null && item.children.length > 0) return '<span><i class="fas fa-angle-right text-primary"></i></span>';
                    //        return '';
                    //    }
                    //}, {
                    //    target: 1,
                    //    data: function (item) {
                    //        if (item.Name == "" || item.Name == null) return '';
                    //        return item.User;
                    //    }
                    //},
                    {
                        target: 0,
                        className: 'treegrid-control',
                        orderable: true,
                        data: function (item) {
                            if (item.children != null && item.children.length > 0) return '<span><i class="fas fa-angle-right text-primary"></i></span>';
                            return '';
                        }
                    },
                    {
                        target: 1,
                        orderable: true,
                        className: 'center',
                        data: function (item) {
                            if (item.color == "" || item.color == null) return '';
                            return item.type_event;
                        }
                    },
                    {
                        target: 2,
                        orderable: true,
                        className: 'center',
                        data: function (item) {
                            if (item.color == "" || item.color == null) return '';

                            let select_dept = ` <div class="asColorPicker-trigger" style='width:80%'><span style="background: ${item.color};"></span></div>`;
                            return select_dept;
                        }
                    },
                    {
                        target: 3,
                        orderable: false,
                        className: 'center',
                        data: function (item) {
                            if (item.step_name == "" || item.step_name == null) {
                                if (item.children != null && item.children.length > 0) {
                                    return '';
                                } else {
                                    return '-';
                                }
                            }
                            return item.step_name;
                        }
                    },


                    {
                        target: 4,
                        orderable: false,
                        className: 'center',
                        data: function (item) {
                            if (item.step_name == "" || item.step_name == null) {
                                let txthtml = "";
                                txthtml += " <div style='text-align: center;'>"
                                txthtml += `<input type="submit" style='margin-left: 10px' class="btn btn-sm btn-warning" type_id="${item.id}" value="Edit" onclick="edit(this)">`;
                                // txthtml += `<input type="submit" style='margin-left: 10px' class="btn btn-sm btn-danger" type_id="${item.id}" value="Delete" onclick="deletetype(this)">`;
                                txthtml += "</div>"
                                return txthtml;

                            } else {
                                return '';
                            }


                        }
                    },

                ],
        });
        let a = await $.ajax({
            //url: "Mypaln_SearachMaster/Home"
            url: GetDataTypePath,
            type: 'POST',
            data: JSON.stringify({ Period: $("#search_master_period").val() }),
            contentType: 'application/json; charset=utf-8',
            success: function (data) {
                 //console.log(data,"data");
                table1.clear();
                table1.rows.add(data);
                table1.draw();
                $('#loading').addClass('hidden');
            },
            error: function (err) {
                swal({
                    title: "ERROR",
                    text: "Can't not connect database(E44)",
                    type: "warning",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "OK"
                })
            }
        });
        $(".colorpicker").asColorPicker();

    }
    loadtable()
    $("#model_save").click(function () {
        if ($("#model_name").val() == "") {
            swal({
                title: "ERROR",
                text: "Please fill up this form",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK"
            });
        } else {
            let valuestep = "";
            $('#model_table_step tr').each(function () {

                if ($(this).find("input[name='step']").val() != "") {
                    if (valuestep != "") {
                        valuestep += ','
                    }
                    valuestep += $(this).find("input[name='step']").val();
                }
            });
            console.log(valuestep)
            let items = {}
            items.id = $("#model_save").attr('type_id');
            items.type_event = $('#model_name').val();
            items.color = $('#model_color').val();
            $.ajax({
                url: SaveChangePath,
                type: 'POST',
                data: JSON.stringify({
                    type: items,
                    step: valuestep,
                    mode: $("#model_save").attr('mode'),
                }),
                //async: false,
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    if (data.status == "success") {
                        
                        table1.clear();
                        table1.rows.add(data.data);
                        table1.draw();
                        swal("Success", "Insert Complete", "success");
                        $('#model').modal('hide')
                    }
                },
                error: function (err) {
                    swal({
                        title: "ERROR",
                        text: "Can't not connect database(E102)",
                        type: "warning",
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "OK"
                    });
                }
            });
        }

    });
    $("#model_add_step").click(function () {


        console.log($('#model_table_step tr:last').find("td:eq(0)").text())
        let txthtml = "";
        txthtml += "<tr>"
        txthtml += `<td>${parseInt($('#model_table_step tr:last').find('td:eq(0)').text() == "" ? 0 : $('#model_table_step tr:last').find('td:eq(0)').text()) + 1}`
        txthtml += "      </td>"
        txthtml += " <td class='tabledit-edit-mode'>"
        txthtml += `    <input class="tabledit-input form-control input-sm" name='step' type="text" value="" >`
        txthtml += "</td>"
        txthtml += "<td>"
        txthtml += `<button type="button" onclick="deletestep(this)" class="tabledit-delete-button btn btn-sm btn-light" style="float: none; margin: 5px;"><span class="ti-trash text-danger"></span></button>`;
        txthtml += "</td>"
        txthtml += "</tr>"
        $('#model_table_step').append(txthtml)

    });
    $("#add_type").click(function () {
        $('#model_name').val('')
        $('#model_color').val('')
        $('#model_table_step').empty()
        $("#model_save").attr('mode', 'new');
        $('#model_delete').addClass('hidden')
        $('#model').modal('show')
    });
    /* ---------------------------------------------------------------------------------------------- */
    /*                                          delete type                                           */
    /* ---------------------------------------------------------------------------------------------- */
    $("#model_delete").click(function () {

        swal({
            title: "Delete ",
            text: "Do you want to delete this item?",
            type: "warning",
            showCancelButton: true,
            confirmButtonClass: "btn-danger",
            confirmButtonText: "Yes, Confirm it!",
            closeOnConfirm: false
        },
            function () {

                $.ajax({
                    url: DeleteTypeEventPath,
                    type: 'POST',
                    data: JSON.stringify({
                        type_id: $("#model_save").attr('type_id'),
                    }),
                    //async: false,
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        if (data.status == "success") {
                            table1.clear();
                            table1.rows.add(data.data);
                            table1.draw();
                            swal("Confirm!", "Delete Success", "success");
                            $('#model').modal('hide')
                         
                        }

                    },
                    error: function (err) {

                        swal({
                            title: "ERROR",
                            text: "Can't not connect database(E106)",
                            type: "warning",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "OK"
                        });
                    }
                });
            });
    });


});

/* ---------------------------------------------------------------------------------------------- */
/*                                          delete step                                           */
/* ---------------------------------------------------------------------------------------------- */
function deletestep(e) {
    $(e).closest("tr").remove();
}
/* ---------------------------------------------------------------------------------------------- */
/*                                          edit type                                             */
/* ---------------------------------------------------------------------------------------------- */
function edit(e) {
    $('#model_name').val('')
    $('#model_color').val('')
    $('#model_table_step').empty()
    $.ajax({
        url: GetDataTypeByIDPath,
        type: 'POST',
        data: JSON.stringify({
            typeID: e.getAttribute("type_id"),
        }),
        //async: false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data.Type.length > 0) {

                $('#model_name').val(data.Type[0].type_event)
                $('#model_color').val(data.Type[0].color)

            }
            if (data.Step.length > 0) {
                let txthtml = "";
                $.each(data.Step, function (i, item) {

                    txthtml += "<tr>"
                    txthtml += `<td>${i + 1}`
                    txthtml += "      </td>"
                    txthtml += " <td class='tabledit-edit-mode'>"
                    txthtml += `    <input class="tabledit-input form-control input-sm" name='step' type="text" value="${item.step_name}" >`
                    txthtml += "</td>"
                    txthtml += "<td>"
                    // txthtml +=      `<input type="submit" class="btn btn-sm btn-danger" type_id="${item.id}" value="Delete" onclick="deletestep(this)">`;
                    txthtml += `<button type="button" onclick="deletestep(this)" class="tabledit-delete-button btn btn-sm btn-light" style="float: none; margin: 5px;"><span class="ti-trash text-danger"></span></button>`;
                    txthtml += "</td>"
                    txthtml += "</tr>"

                });
                $('#model_table_step').append(txthtml)

            }

        },
        error: function (err) {

            swal({
                title: "ERROR",
                text: "Can't not connect database(E103)",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "OK"
            });
        }
    });

    $("#model_save").attr('mode', 'edit');
    $('#model_delete').removeClass('hidden')
    $("#model_save").attr('type_id', e.getAttribute("type_id"));
    $('#model').modal('show')
}