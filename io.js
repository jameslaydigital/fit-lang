let impl = {
    print: (...args) => console.log(...args),
    error: (...args) => console.error(...args),
    render: (html) => console.log(html),
    exit: () => {},
};

export function setOutput(output) {
    impl = output;
}

export function print(...args) { impl.print(...args); }
export function error(...args) { impl.error(...args); }
export function render(...args) { impl.render(...args); }
export function exit(code) { impl.exit(code); }
