$(document).ready(function () {
    $('#loading').addClass('hidden')
    $('#menu-2').addClass('active')
    $('#menu-1').removeClass('active')
    $('#menu-3').removeClass('active')

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
                optioncustomer += ' <option value="' + item.ID + '">' + item.name + '(' + item.address + ')' + '</option>';
            });
            optioncustomer += ' <option value="0">-</option>';
            $("#customer").append(optioncustomer);
        },
        error: function (err) {
        }
    });


});