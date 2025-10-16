import * as storage from './storage.js';
import * as search from './search.js';

let appState = {
    transactions: [],
    settings: { budgetCap: null },
    sort: { by: 'date', order: 'desc' }
};

export const getState = () => appState;
export const getSettings = () => appState.settings;

export const setState = (newState) => {
    appState = { ...appState, ...newState };
    storage.save(appState);
        console.log('[state] setState ->', appState);
};

export const addTransaction = (data) => {
    // Avoid letting an (empty) `id` from the form overwrite the generated id
    const { id: _ignoredId, ...rest } = data;
    const newTransaction = {
        id: `txn_${Date.now()}`,
        ...rest,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    appState.transactions.push(newTransaction);
    storage.save(appState);
        console.log('[state] addTransaction ->', newTransaction);
    return `Transaction "${data.description}" added.`;
};

export const updateTransaction = (id, data) => {
    const index = appState.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        // Prevent the passed `data.id` from changing the existing id
        const { id: _maybeId, ...rest } = data;
        appState.transactions[index] = { ...appState.transactions[index], ...rest, updatedAt: new Date().toISOString() };
        storage.save(appState);
            console.log('[state] updateTransaction ->', appState.transactions[index]);
    }
    return `Transaction "${data.description}" updated.`;
};

export const deleteTransaction = (id) => {
    appState.transactions = appState.transactions.filter(t => t.id !== id);
    storage.save(appState);
        console.log('[state] deleteTransaction -> remaining', appState.transactions.length);
    return 'Transaction deleted.';
};

export const getTransactionById = (id) => appState.transactions.find(t => t.id === id);

export const updateSettings = (newSettings) => {
    appState.settings = { ...appState.settings, ...newSettings };
    storage.save(appState);
};

export const sortTransactions = (sortBy) => {
    appState.sort.order = (appState.sort.by === sortBy && appState.sort.order === 'asc') ? 'desc' : 'asc';
    appState.sort.by = sortBy;
};

export const getFilteredAndSortedTransactions = () => {
    const { transactions, sort } = appState;
    const searchInput = document.getElementById('search-input').value;
    const isCaseSensitive = document.getElementById('case-sensitive-toggle').checked;
    const regex = search.compileRegex(searchInput, isCaseSensitive ? '' : 'i');

    const filtered = regex ? transactions.filter(t => Object.values(t).some(val => regex.test(String(val)))) : transactions;

    return [...filtered].sort((a, b) => {
        const valA = a[sort.by];
        const valB = b[sort.by];
        const comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
        return sort.order === 'asc' ? comparison : -comparison;
    });
};