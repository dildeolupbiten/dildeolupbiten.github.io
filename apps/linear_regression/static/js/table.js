class Table {
    constructor(id, headers) {
        this.id = id;
        this.headers = headers;
        this.table = this.init_table();
        this.th = this.init_th();
    };
    init_table() {
        var table = document.createElement("table");
        table.id = "table_" + this.id;
        table.className = "table table-sm container";
        document.getElementById(this.id).appendChild(table);
        return table;
    }
    init_th() {
        var tr = document.createElement("tr");
        for (var header of this.headers) {
            var th = document.createElement("th");
            th.innerHTML = header;
            th.className = "text-center bg-dark text-light";
            tr.appendChild(th);
        }
        document.getElementById("table_" + this.id).appendChild(tr);
        return tr;
    }
    init_tr(args) {
        var tr = document.createElement("tr");
        var inputs = [];
        for (var arg of args) {
            var td = document.createElement("td");
            td.className = "text-center";
            if (arg.includes("check")) {
                var check = document.createElement("input");
                check.type = "checkbox";
                check.id = arg;
                check.className = "form-check-input border";
                check.style.borderColor = "#ced4da !important";
                if (!arg.includes("_y_")) {
                    inputs.push(check);
                    td.appendChild(check);
                } else {
                    var div = document.createElement("div");
                    div.className = "form-check form-check-inline mx-4 d-flex justify-content-left";
                    var label = document.createElement("label");
                    var splitted = arg.split("_");
                    label.innerHTML = splitted[splitted.length - 1];
                    label.className = "form-check-label mx-4";
                    label.for = arg;
                    div.appendChild(check);
                    div.appendChild(label);
                    td.appendChild(div);
                }
            } else if (arg == ["input"]) {
                var input = document.createElement("input");
                input.type = "number";
                input.id = "input";
                input.className = "form-control";
                td.appendChild(input);
            } else {
                td.innerHTML = arg;
            }
            td.style.verticalAlign = "middle";
            tr.appendChild(td);
        }
        if (inputs.length) { this.configure_checkbuttons(inputs); }
        document.getElementById("table_" + this.id).appendChild(tr);
    }
    configure_checkbuttons(inputs) {
        var c1 = inputs[0];
        var c2 = inputs[1];
        c1.addEventListener(
            "input",
            function (e) {
                c2.checked = false;
            }
        );
        c2.addEventListener(
            "input",
            function (e) {
                c1.checked = false;
            }
        );
    }
};
