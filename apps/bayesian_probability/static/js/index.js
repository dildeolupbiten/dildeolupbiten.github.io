function getOptions(n) {
    var p_list = [...Array(n).keys()].map(i => `E${i + 1}`);
    var options = [];
    for (var i = 1; i < n + 1; i++) {
        var combs = combinations(p_list, i);
        while (true) {
            var comb = combs.next();
            if (!comb.value) {
                break;
            }
            options.push(comb.value.join(","));
        }
    }
    return options;
}

function changeNode(e) {
    var val = e.target.value;
    var td_input = e.target.parentElement.parentElement.children[2];
    var pw = val.split(",").length + 1;
    var power = 2;
    if (val != "None") {
        power = Math.pow(2, pw);
    }
    
    var children = [...td_input.children];

    for (var child of children) {
        td_input.removeChild(child);
    }
    
    var conditions = [true, false];
    var cmbs = product(conditions, pw);
    
    var h = {true: "H", false: "¬H"};
    var s = {true: "+", false: "-"};
    var splitted = val.split(",");

    for (var i = 0; i < power; i++) {
        var value = power == 2 ? [conditions[i]] : cmbs.next().value;

        var div = document.createElement("div");
        div.className = "d-flex justify-content-center text-center";
        var label = document.createElement("label");
        label.innerHTML = value;
        label.className = "w-100";
        label.style.display = "none";
        var txt = document.createElement("label");
        
        var str = [h[value[0]]];
        for (var x = 1; x < value.length; x++) {
            str.push(`${splitted[x - 1]}${s[value[x]]}`);
        }
        
        txt.innerHTML = `P(E${td_input.n + 1}+|${str})`;
        txt.className = "w-100";
        var input = document.createElement("input");
        input.type = "number";
        input.className = "form-control";
        input.value = 0;
        input.step = 0.01;
        div.appendChild(label);
        div.appendChild(txt);
        div.appendChild(input);
        td_input.appendChild(div);
        label.overflow = "auto";
    }
}

function addNode() {
    var n = xy_table.table.children.length - 1;
    var tr = document.createElement("tr");
    tr.className = "border";
    var td_name = document.createElement("td");
    td_name.className = "col p-2";
    
    var name = document.createElement("label");
    name.className = "form-control";
    name.innerHTML = `E${n + 1}`;
    td_name.appendChild(name);
    
    var td_select = document.createElement("td");
    td_select.className = "col border p-2 w-25";
    var select = document.createElement("select");
    select.className = "form-select";
    td_select.appendChild(select);

    var option_none = document.createElement("option");
    option_none.value = "None";
    option_none.innerHTML = "None";
    select.appendChild(option_none);
    
    var options = getOptions(n);

    for (var opt of options) {
        var option = document.createElement("option");
        option.value = opt;
        option.innerHTML = opt;
        select.appendChild(option);
    }
    
    var td_input = document.createElement("td");
    td_input.className = "col border p-2";
    td_input.n = n;
    
    var h = {true: "H", false: "¬H"};
    
    for (var i of [true, false]) {
        var div = document.createElement("div");
        div.className = "d-flex justify-content-center text-center";
        var label = document.createElement("label");
        label.innerHTML = i;
        label.className = "w-100";
        label.style.display = "None";
        var txt = document.createElement("label");
        txt.innerHTML = `P(E${n + 1}+|${h[i]})`;
        txt.className = "w-100";
        var input = document.createElement("input");
        input.type = "number";
        input.className = "form-control";
        input.step = 0.01;
        input.value = 0;
        
        div.appendChild(label);
        div.appendChild(txt);
        div.appendChild(input);
        td_input.appendChild(div);
    }

    select.addEventListener("change", changeNode);
    
    tr.appendChild(td_name);
    tr.appendChild(td_select);
    tr.appendChild(td_input);
    xy_table.table.appendChild(tr);
}

function removeNode() {
    var last_index = [...xy_table.table.children].length - 1;
    if (last_index) {
        xy_table.table.removeChild(xy_table.table.children[last_index]);
    }   
}

function calculate() {
    var val_p_prior = parseFloat(document.getElementById("Prior Probability P(H)").value);
    var p_prior = {true: val_p_prior, false: 1 - val_p_prior};
    var children = [...xy_table.table.children].slice(1);
    
    var cpt_dict = {};
    
    for (var child of children) {
        var name = child.children[0].children[0].innerHTML;
        var values = {};
        for (var div of child.children[2].children) {
            var key = div.children[0].innerHTML;
            var value = div.children[2].value;
            values[key] = {true: value, false: 1 - value};
        }
        var dependency = child.children[1].children[0].value;
        dependency = dependency === "None" ? [] : dependency.split(",");
        var dependency_list = [];
        if (dependency) {
            for (var key of dependency) {
                dependency_list.push(cpt_dict[key]);
            }
        }
        
        const cpt = new CPTN(values, dependency_list, name);
        cpt_dict[name] = cpt;
    }
    
    var children = [...result_table.table.children].slice(1);
    for (var child of children) {
        result_table.table.removeChild(child);
    }
    
    for (var prod of product([true, false], cptn.length)) {
        const dict = Object.fromEntries([...Array(cptn.length).keys()].map(i => [cptn[i].name, prod[i]]));
        const prob = posteriorProbability(p_prior, dict) * 100;
        var label = [...Array(prod.length).keys()].map(i => `${cptn[i].name}${prod[i] ? '+' : '-'}`).join(",");
        result_table.init_row([`P(H${label ? '|' : ''}${label})`, Math.round(prob * 100) / 100]);
    }
    cptn = [];
}

document.getElementById("btn_add").onclick = addNode;
document.getElementById("btn_remove").onclick = removeNode;
document.getElementById("btn_calculate").onclick = calculate;
