class Dropdown {
    constructor(entries) {
        this.dropdown = this.init();
        this.addEntries(entries, this.dropdown);
    }
    init() {
        var dropdown = document.createElement("div");
        dropdown.style.display = "flex";
        dropdown.style.flexDirection = "column";
        document.getElementById("offcanvas-body").appendChild(dropdown);
        return dropdown;
    }
    addEntries(entries, parent) {
        var target = null;
        entries.forEach((entry) => {
            var div = document.createElement("div");
            div.className = "div";
            div.style.height = "50px";
            var left = document.createElement("div");
            left.className = "left";
            var right = document.createElement("div");
            right.className = "right";
            var btn = null;
            if (!entry.children) {
                btn = document.createElement("a");
                btn.href = entry.href;
            } else {
                btn = document.createElement("btn");
            }
            if (parent == this.dropdown) {
                left.className = "w-25";
                right.className = "w-75";
            } else {
                left.className = "w-75";
            }
            left.style.display = "inline-block";
            btn.innerHTML = entry.innerHTML;
            btn.className = "menu-link navbar-toggler nav-link nav-item";
            left.appendChild(btn);
            div.appendChild(left);
            if (entry.children) {
                btn.right = right;
                div.style.position = "relative";
                right.style.position = "absolute";
                right.style.display = "none";
                right.style.zIndex = "2";
                btn.onclick = function(e) {
                    if (!target) {
                        target = e.target;
                    }
                    if (target != e.target) {
                        target.right.style.display = "none";
                        target = e.target;
                    }
                    if (target.right.style.display == "inline-block") {
                        target.right.style.display = "none";
                    } else {
                        target.right.style.display = "inline-block";
                    }
                };
                this.addEntries(entry.children, right);
                div.appendChild(right);
            }
            parent.appendChild(div);
            return div;
        });
    }
}