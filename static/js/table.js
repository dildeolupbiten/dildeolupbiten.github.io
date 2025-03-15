class Table {
    constructor(labels, parent, ignore) {
        this.labels = labels;
        this.parent = parent;
        this.table = this.init_table(ignore);
    };
    init_table(ignore) {
        var table = document.createElement("table");
        table.className = "table table-sm container";
        this.init_th(table, ignore);
        if (!ignore) {
            this.init_inputs(table);
            table.style.marginTop = "50px";
        }
        this.parent.appendChild(table);
        return table;
    }
    init_th(table, ignore) {
        var tr = document.createElement("tr");
        for (var label of this.labels) {
            var th = document.createElement("th");
            th.innerHTML = label;
            th.className = "bg-dark text-light";
            if (!ignore) {
                th.className += " text-center";
            }
            tr.appendChild(th);
        }
        table.appendChild(tr);
    }
    init_inputs(table) {
        var tr = document.createElement("tr");
        for (var label of this.labels) {
            var td = document.createElement("td");
            td.className = "col";
            td.style.width = `${1/this.labels.length}%`;
            var input = null;
            if (label == "df") {
                var select = document.createElement("select");
                select.className = "form-select";
                ["Backward", "Central", "Forward"].forEach((label) => {
                    var option = document.createElement("option");
                    option.value = label;
                    option.innerHTML = label;
                    select.appendChild(option);
                });
                select.children[1].className += " selected";
                select.id = label;
                td.appendChild(select);
            } else {
                input = document.createElement("input");
                if (label != "f(x)") {
                    input.type = "number";
                }
                input.id = label;
                input.className = "form-control";
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    init_row(cols) {
        var tr = document.createElement("tr");
        for (var col of cols) {
            var td = document.createElement("td");
            var span = document.createElement("span");
            span.innerHTML = col;
            td.className = "col";
            td.appendChild(span);
            tr.appendChild(td);
        }
        this.table.appendChild(tr);
    }
    clear_rows() {
        while (this.table.children.length > 1) {
            this.table.removeChild(this.table.children[this.table.children.length - 1]);
        }
    }
}