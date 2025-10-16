const patterns = {
    description: /^\S(?:.*\S)?$/,
    amount: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
    date: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
};

export const validators = {
    description: (value) => value && patterns.description.test(value),
    amount: (value) => !isNaN(value) && patterns.amount.test(String(value)),
    date: (value) => patterns.date.test(value),
};