// grammar for my bash-style-parser:

`
cmd         → token+        { $0 }

token       → strings       { $0 }
            → word          { $0 }
            → space         { $0 }

strings     → string+       { $0.join("") }

string      → double_str    { $0 }
            → single_str    { $0 }

double_str  → ["] [^"]* ["] { $1.join("") }
single_str  → ['] [^']* ['] { $1.join("") }

word        → [^'" \t\n\r]+ { $0.join("") }
space       → [ \t\n\r]+    { $0.join("") }
`

export function tokenize(input) {
    const state = {
        i: 0,
        input,
        next() {
            return state.input[state.i++];
        },
        curr() {
            return state.input[state.i];
        }
    };
    return parse_cmd(state).filter(tok => tok.trim() !== "");
}

function parse_cmd(state) {
    const tokens = [];
    let token = "";
    while ((token = parse_token(state))) {
        tokens.push(token);
    }
    return tokens;
}

function parse_token(state) {
    let token = 
        parse_space(state) ||
        parse_word(state)  ||
        parse_strings(state);
    return token;
}

function parse_word(state) {
    let c = "";
    let token = "";
    while (c = state.curr()) {
        if ([" ", "\t", "\n", "\r", "'", '"'].includes(c)) {
            break;
        }
        token += state.next();
    }
    return token;
}

function parse_space(state) {
    // any series of characters that is not \t\n\r or " "
    let c = "";
    let token = "";
    while (c = state.curr()) {
        if ([" ", "\n", "\t", "\r"].includes(c)) {
            token += state.next();
        } else {
            break;
        }
    }
    return token;
}

function parse_strings(state) {
    let token;
    const tokens = [];
    while (token = parse_string(state)) {
        tokens.push(token);
    }
    return tokens.join("");
}

// handles both single and double quote strings:
function parse_string(state) {
    let c = '';
    let token = '';
    let quote = state.curr();
    const start = state.i;

    // eat first quote
    if (!["'", '"'].includes(quote)) {
        return "";
    }
    state.next();

    let is_closed = false;
    while (c = state.curr()) {
        if (c === quote) {
            state.next();
            is_closed = true;
            break;
        }
        token += state.next();
    }

    if (is_closed === false) {
        throw new Error(`expected closing (${quote}) when parsing string: →${state.input.slice(start, state.i)}←`);
    }

    return token;
}
