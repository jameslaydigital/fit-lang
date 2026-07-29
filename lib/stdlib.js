export function printf(fmt, ...rest) {
    let output = "";
    for (let i = 0; i < fmt.length; i++) {
        if (fmt[i] === "%") {
            i++;
            const specifier = fmt.at(i);
            switch (specifier) {
                case "d":
                    output += Number(rest.shift());
                    break;
                case "s":
                    output += String(rest.shift());
                    break;
                case "o":
                    output += JSON.stringify(rest.shift());
                    break;
                default:
                    output += specifier;
            }
        } else {
            output += fmt[i];
        }
    }
    return output;
}
