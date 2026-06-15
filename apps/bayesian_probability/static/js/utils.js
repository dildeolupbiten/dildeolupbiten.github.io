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

/*
const p_prior = {true: 0.25, false: 0.75};

const d1 = new CPTN({
    "true":  {true: 0.9, false: 0.1},
    "false": {true: 0.15, false: 0.85}
}, [], "d1");

const d2 = new CPTN({
    "true": {true: 0.84, false: 0.16}, 
    "false": {true: 0.22, false: 0.78}
}, [], "d2");

const d3 = new CPTN({
    "true,true,true": {true: 0.98, false: 0.02},
    "true,true,false": {true: 0.67, false: 0.33},
    "true,false,true": {true: 0.53, false: 0.47},
    "true,false,false": {true: 0.49, false: 0.51},
    "false,true,true": {true: 0.65, false: 0.35},
    "false,true,false": {true: 0.54, false: 0.46},
    "false,false,true": {true: 0.41, false: 0.59},
    "false,false,false": {true: 0.03, false: 0.97}
}, [d1, d2], "d3");

const result = [true, true, true];
const dict = Object.fromEntries([...Array(cptn.length).keys()].map(i => [cptn[i].name, result[i]]));

const prob = posteriorProbability(p_prior, dict);
console.log(prob);
*/
