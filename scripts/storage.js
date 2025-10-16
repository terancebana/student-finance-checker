const STORAGE_KEY = 'studentFinanceTrackerData';
const DEFAULT_STATE = { transactions: [], settings: { budgetCap: null } };

export const load = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : DEFAULT_STATE;
    } catch {
        return DEFAULT_STATE;
    }
};

export const save = (data) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save data to localStorage', e);
    }
};