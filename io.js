let impl = {
    print: (...args) => console.log(...args),
    error: (...args) => console.error(...args),
    exit: () => {},
};

export function setOutput(output) {
    impl = output;
}

export function print(...args) { impl.print(...args); }
export function error(...args) { impl.error(...args); }
export function exit(code) { impl.exit(code); }
