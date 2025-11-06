export function tokenize(expr){
    const tokens = [];
    let i = 0;

    const isDigit = c => c >= '0' && c <= '9';
    const isSpace = s => s === ' ' || s === "\t" || s === "\n";

    while (i < expr.length){
        const c = expr[i];
        
        if(isSpace(c)){ i++; continue; }

        if (isDigit(c) || c === '.'){
            let start = i;
            let countDot = c === '.' ? 1 : 0;
            i++;

            while(i < expr.length){
                const d = expr[i];
                if (isDigit(d)){ i++; continue;}
                if (d === '.'){
                    countDot++;
                    if (countDot > 1) throw new Error("Nombre invalide (plusieurs points)");
                    i++;
                    continue;
                }
                break;
            }

            const numStr = expr.slice(start, i);
            if(numStr === '.') throw new Error("Nombre invalide (il n'y a qu'un point)");
            tokens.push({type: "NUMBER", value: parseFloat(numStr)});
            continue;
        }

        if (c === '(') { tokens.push({ type: "LPAREN"}); i++; continue; }
        if (c === ')') { tokens.push({ type: "RPAREN"}); i++; continue; }

        if ("+-*/^%".includes(c)) {
            tokens.push({ type: "OP", op: c});
            i++;
            continue;
        }

        throw new Error(`Caractère invalide: '${c}'`);
    }

    const result = [];
    for (let j = 0; j < tokens.length; j++){
        const t = tokens[j];
        if (t.type === "OP" && t.op === '-'){
            const prev = result[result.length - 1];
            const isUnary = !prev || prev.type === "OP" || prev.type === "LPAREN";

            if(isUnary) {
                result.push({ type: "OP", op: "NEG"});
                continue;
            }
        }
        result.push(t);
    }

    return result;

}

// ORDRE DE PRIORITE DES OPERATION
const PRECEDENCE = {
    NEG: 5,
    "^": 4,
    "*": 3, "/": 3,
    "+": 2, "-": 2,
}

const RIGHT_ASSOC = new Set(['^', "NEG"]);

export function toRPN(tokens){
    const output = [];
    const ops = [];

    const popOps = (currentOp) => {
        while(ops.length){
            const top = ops[ops.length - 1];

            if (top.type !== "OP") break;

            const pTop = PRECEDENCE[top.op] ?? 0;
            const pCur = PRECEDENCE[currentOp] ?? 0;

            const right = RIGHT_ASSOC.has(currentOp);

            if ( (!right && pTop >= pCur) || (right && pTop > pCur)){
                output.push(ops.pop());
            }else break;
        }
    }

    for (const t of tokens){
        if (t.type === "NUMBER"){
            output.push(t);
        }else if (t.type === "OP"){
            popOps(t.op);
            ops.push(t);
        }else if (t.type === "LPAREN"){
            ops.push(t);
        }else if (t.type === "RPAREN"){
            let found = false;
            while(ops.length){
                const top = ops.pop();
                if (top.type === "LPAREN") { found = true; break;}
                output.push(top);
            }
            if(!found) throw new Error("Paranthèses non équilibrées");
        }
    }

    while (ops.length) {
        const top = ops.pop();
        if (top.type === "LPAREN" || top.type === "RPAREN"){
            throw new Error("Parenthèses non équilibrées");
        }
        output.push(top);
    }

    return output;
}

export function evalRPN(rpn){
    const stack = [];

    for (const t of rpn){
        if (t.type === "NUMBER") {
            stack.push(t.value);
            continue;
        }
        if (t.type === "OP") {
            if (t.op === "NEG"){
                if (stack.length < 1) throw new Error("Expression invalide (NEG)");
                const a = stack.pop();
                stack.push(-a);
                continue;
            }

            if (stack.length < 2) throw new Error("Expression invalide (binaire)");
            const b = stack.pop();
            const a = stack.pop();
            let r;

            switch(t.op){
                case "+": r = a + b; break;
                case "-": r = a - b; break;
                case "*": r = a * b; break;
                case "/":
                    if (b===0) throw new Error("Division par zéro");
                    r = a / b;
                    break;
                case "^": r = Math.pow(a, b); break;
                case "%": r = a % b; break;
                default: throw new Error(`Opérateur inconnu: ${t.op}`);
            }
            stack.push(r);
            continue;
        }
        throw new Error("Token inattendu");
    }

    if (stack.length !== 1) throw new Error("Expression invalide (plusieurs résultat)");
    return stack[0];
}

export function evaluateExpression(expr){
    const tokens = tokenize(expr);
    const rpn = toRPN(tokens);
    return evalRPN(rpn);
}