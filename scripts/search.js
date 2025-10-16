export const compileRegex = (input, flags = 'i') => {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch {
        return null; 
    }
};

export const highlight = (text, regex) => {
    if (!regex || !text) return text;
    return String(text).replace(regex, match => `<mark>${match}</mark>`);
};