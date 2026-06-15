var cptn = [];

class CPTN {
    constructor(cpt, parents, name) {
        this.cpt = cpt;
        this.parents = parents;
        this.name = name;
        cptn.push(this);
    }
}

function posteriorProbability(p_prior, evidence) {
    function marginalize(cpt, parents, key) {
        if (parents.length === 0) {
            return cpt[key];
        }
        const [parent, ...rest] = parents;
        if (Object.keys(evidence).includes(parent.name)) {
            return marginalize(cpt, rest, [key, evidence[parent.name]]);
        } else {
            const left = marginalize(cpt, rest, [key, true]);
            const right = marginalize(cpt, rest, [key, false]);
            return Object.fromEntries(Object.keys(left).map(i => [i, left[i] + right[i]]));

        }
    }
    function jointProbability(hypothesis) {
        var p_joint = p_prior[hypothesis];
        cptn.forEach(node => {
            const cpt_entry = marginalize(node.cpt, node.parents, hypothesis);
            if (Object.keys(evidence).includes(node.name)) {
                p_joint *= cpt_entry[evidence[node.name]];
            } else {
                p_joint *= 1;
            }
        })
        return p_joint;
    }
    
    var [p_true, p_false] = [true, false].map(e => jointProbability(e));
    return p_true / (p_true + p_false);
}

function *combinations(array, repeat) {
    if (!repeat) {
        yield [];
        return;
    }
    for (var i = 0; i < array.length; i++) {
        for (var comb of combinations(array.slice(i + 1), repeat - 1)) {
            yield [array[i], ...comb];
        }
    }
}

function *product(array, repeat) {
    if (!repeat) {
        yield [];
        return;
    }
    for (var i = 0; i < array.length; i++) {
        for (var prod of product(array, repeat - 1)) {
            yield [array[i], ...prod];
        }
    }
}
