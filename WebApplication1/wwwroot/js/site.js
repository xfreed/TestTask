function createDecisionDataTable() {
    $("#dtReadDecision").one("preInit.dt",
        () => {
            const button =
                $(
                    `<button id="createDecisionButton" class="btn btn-sm btn-primary btn-management" data-toggle="modal" data-target="#CreateDecisionModal">New CV</button>`);
            $("#dtReadDecision_filter label").append(button);
        });
    $("#dtReadDecision").DataTable({
        responsive: true,
        "autoWidth": false,
        "createdRow"(row) {
            $(row).addClass("decision-menu");
        }

    });
    $("#dtReadDecision").on("page.dt",
        () => {
            $("html, body").animate({
                    scrollTop: 100
                },
                200);
        });
}

$(() => {
    const createDecisionForm = ["#Decision-Name", "#datepicker", "#Decision-Description", "#autocomplete_input"];
    const editDecisionForm = ["#Edit-Decision-Name", "#Edit-Decision-Description"];
    createDecisionDataTable();
    $("#datepicker").datepicker({
        dateFormat: "dd-mm-yy"
    }).datepicker("setDate", "0");
    $(".show_hide").on("click",
        function() {
            $(this).parent("td").children(".hidden").removeClass("hidden");
            $(this).hide();
        });
    $(".hide_show").on("click",
        function() {
            $(this).parent("p").addClass("hidden");
            $(this).parent("p").parent("td").children(".show_hide").show();
        });

    function ClearCreateFormData() {
        createDecisionForm.forEach(element => {
            $(element).val("");
        });
    }

    function CheckCreateFormData() {
        let bool = true;
        createDecisionForm.forEach(element => {
            if ($(element).val().toString().length === 0) {
                console.log($(element).val().toString().replace(" ", "").length);
                $(element).parent("div").children(".field-validation-valid").text("Required.");
                bool = false;
            } else
                $(element).parent("div").children(".field-validation-valid").text("");
        });
        if (!bool)
            return false;
        return true;
    }

    $("#CreateDecisionForm-submit").click((e) => {
        e.preventDefault();
        e.stopPropagation();

        $("#CreateDecisionForm-submit").prop("disabled", true);
        const formData = new FormData();
        const decisionName = $("#Decision-Name").val().toString();
        const decisionDate = $("#datepicker").datepicker().val().toString();
        const decisionMarried = $("#Decision-Married").val().toString();
        const decisionSalary = $("#Decision-Salary").val().toString();
        const decisionPhone = $("#Decision-Phone").val().toString();
        formData.append("Cv.Name", decisionName);
        formData.append("Cv.Birthday", decisionDate);
        formData.append("Cv.Married", decisionMarried);
        formData.append("Cv.Phone", decisionPhone);
        formData.append("Cv.Salary", decisionSalary);
        $.ajax({
            url: "/Home/SaveCv",
            type: "POST",
            processData: false,
            contentType: false,
            async: true,
            data: formData,
            success(response) {
                if (response.success) {
                    $("#CreateDecisionModal").modal("hide");
                    $("#ModalSuccess .modal-body:first p:first strong:first").html(response.text);
                    $("#ModalSuccess").modal("show");
                    const table = $("#dtReadDecision").DataTable();
                    $("#dtReadDecision").DataTable().row.add([
                            table.data().rows().count() + 1,
                            response.cv.name,
                            response.cv.birthday,
                            response.cv.married,
                            response.cv.salary,
                            response.cv.phone
                        ])
                        .draw();
                } else {
                    $("#CreateDecisionModal").modal("hide");
                    $("#ModalError.modal-body:first p:first strong:first").html("Can't add cv!");
                }
                ClearCreateFormData();
                $("#CreateDecisionFormFile").val("");
                $("#CreateDecisionForm-submit").prop("disabled", false);
            },
            error() {
                $("#CreateDecisionForm-submit").prop("disabled", false);
                $("#CreateDecisionModal").modal("hide");
                $("#ModalError.modal-body:first p:first strong:first").html("Can't add cv!");
            }
        });
    });

    function ClearEditFormData() {
        editDecisionForm.forEach(element => {
            $(element).val("");
        });
    }

    function checkEditFormData() {
        let bool = true;
        editDecisionForm.forEach(element => {
            if ($(element).val().toString().length === 0) {
                console.log($(element).val().toString().length);
                $(element).parent("div").children(".field-validation-valid").text("Required.");
                bool = false;
            } else
                $(element).parent("div").children(".field-validation-valid").text("");
        });
        if (!bool)
            return false;
        return true;
    }

    $("#EditDecisionForm-submit").click((e) => {
        e.preventDefault();
        e.stopPropagation();
        $("#CreateDecisionForm-submit").prop("disabled", true);
        const formData = new FormData();
        const decisionId = $("#Edit-Decision-ID").val().toString();
        const decisionName = $("#Edit-Decision-Name").val().toString();
        const decisionDate = $("#edit-datepicker").datepicker().val().toString();
        const decisionMarried = $("#edit-Decision-Married").val().toString();
        const decisionSalary = $("#edit-Decision-Salary").val().toString();
        const decisionPhone = $("#edit-Decision-Phone").val().toString();
        formData.append("Cv.Name", decisionName);
        formData.append("Cv.Birthday", decisionDate);
        formData.append("Cv.Married", decisionMarried);
        formData.append("Cv.Phone", decisionPhone);
        formData.append("Cv.Salary", decisionSalary);
        formData.append("Cv.ID", decisionId);
        $.ajax({
            url: "/Home/ChangeCv",
            type: "POST",
            processData: false,
            contentType: false,
            data: formData,
            success(response) {
                $("#EditDecisionForm-submit").prop('disabled', false);
                if (response.success) {
                    ClearEditFormData();
                    $("#EditDecisionModal").modal("hide");
                    $("#ModalSuccess .modal-body:first p:first strong:first").html(response.text);
                    $("#ModalSuccess").modal("show");
                } else {
                    $("#EditDecisionModal").modal("hide");
                    $("#ModalError.modal-body:first p:first strong:first").html("Can't edit cv!");
                }
            },
            error() {
                $("#EditDecisionForm-submit").prop('disabled', false);
                $("#EditDecisionModal").modal("hide");
                $("#ModalError.modal-body:first p:first strong:first").html("Can't edit cv!");
            }
        });
    });
    $("#DeleteDecisionForm-submit").click((e) => {
        $("#DeleteDecisionForm-submit").prop('disabled', true);
        let decisionID = $("#Delete-Decision-ID").val();
        $.ajax({
            url: "/Home/DeleteCv",
            type: "POST",
            data: { 'id': decisionID },
            success(response) {
                $("#DeleteDecisionForm-submit").prop('disabled', false);
                if (response.success) {
                    $("#DeleteDecisionModal").modal("hide");
                    $("#ModalSuccess .modal-body:first p:first strong:first").html(response.text);
                    $("#ModalSuccess").modal("show");
                    let table = $("#dtReadDecision").DataTable();
                    table.rows($(`tbody tr td:contains(${decisionID})`).parent()).remove().draw();
                } else {
                    $("#EditDecisionModal").modal("hide");
                    $("#ModalError.modal-body:first p:first strong:first").html("Can't delete cv!");
                }
            },
            error() {
                $("#DeleteDecisionForm-submit").prop('disabled', false);
                $("#DeleteDecisionModal").modal("hide");
                $("#ModalError.modal-body:first p:first strong:first").html("Can't edit cv!");
            }
        });
    });
    $.contextMenu({
        selector: ".decision-menu",
        callback: function(key) {
            const content = $(this).children().first().text();
            switch (key) {
            case "edit":
                $.get(`/Home/GetCv?id=${content}`,
                    function(json) {
                        if (!json.success) {
                            $("#ModalError.modal-body:first p:first strong:first").html("ID no in database!");
                            return;
                        }
                        $("#Edit-Decision-ID").val(json.cv.id);
                        $("#Edit-Decision-Name").val(json.cv.name);
                        $("#edit-Decision-Married").prop('checked', json.cv.married);
                        $("#edit-Decision-Salary").val(json.cv.salary);
                        $("#edit-Decision-Phone").val(json.cv.phone);
                        $('#edit-datepicker').datepicker({ dateFormat: 'dd/mm/yy' });
                        $('#edit-datepicker').datepicker('setDate', new Date(json.cv.birthday));
                    });
                $("#EditDecisionModal").modal("show");
                break;
            case "delete":
                $.get(`/Home/GetCv?id=${content}`,
                    function(json) {
                        if (!json.success) {
                            $("#ModalError.modal-body:first p:first strong:first").html("ID no in database!");
                            return;
                        }
                        $("#Delete-Decision-ID").val(json.cv.id);
                    });
                $("#DeleteDecisionModal").modal("show");
                break;
            }
        },
        items: {
            "edit": { name: "Edit", icon: "far fa-edit" },
            "delete": { name: "Delete", icon: "far fa-trash-alt" }
        }
    });
});