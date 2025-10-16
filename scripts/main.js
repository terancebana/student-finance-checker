import * as storage from './storage.js';
import * as state from './state.js';
import * as ui from './ui.js';

// --- Event Handlers ---
const handleNavClick = (e) => {
    if (e.target.classList.contains('nav-link')) {
        e.preventDefault();
        ui.showSection(e.target.dataset.section);
    }
};

const handleFormSubmit = (e) => {
    e.preventDefault();
    if (ui.validateForm()) {
        const data = ui.getFormData();
        const message = data.id ? state.updateTransaction(data.id, data) : state.addTransaction(data);
        ui.showStatusMessage(message);
        ui.closeModal(); // This is now correctly called
        renderApp();
    }
};

const handleTableClick = (e) => {
    const id = e.target.closest('tr')?.dataset.id;
    if (!id) return;

    if (e.target.matches('.edit-btn')) {
        const transaction = state.getTransactionById(id);
        ui.openModal(transaction);
    } else if (e.target.matches('.delete-btn')) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            const message = state.deleteTransaction(id);
            ui.showStatusMessage(message);
            renderApp();
        }
    }
};

const handleSort = (e) => {
    const sortBy = e.target.dataset.sort;
    if (sortBy) {
        state.sortTransactions(sortBy);
        renderApp();
    }
};

const handleSaveSettings = () => {
    const budgetCap = document.getElementById('budget-cap-input').value;
    state.updateSettings({ budgetCap: budgetCap ? parseFloat(budgetCap) : null });
    ui.showStatusMessage('Settings saved.');
    renderApp();
};

const handleExport = () => {
    const data = storage.load();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: 'finance-data.json' });
    a.click();
    URL.revokeObjectURL(url);
};

const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            if (!importedData.transactions || !importedData.settings) throw new Error('Invalid file structure.');
            state.setState(importedData);
            renderApp();
            ui.showStatusMessage('Data imported successfully.');
        } catch (error) {
            alert('Error: Could not import data. Please check file format.');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
};

// --- App Render ---
const renderApp = () => {
    const transactions = state.getFilteredAndSortedTransactions();
    const settings = state.getSettings();
    console.log('[app] renderApp -> transactions count', transactions.length);
    ui.renderTable(transactions);
    ui.updateDashboard(state.getState().transactions, settings);
};

// --- Initialization ---
const init = async () => {
    let initialData = storage.load();
    if (initialData.transactions.length === 0) {
        try {
            const response = await fetch('seed.json');
            const seedData = await response.json();
            initialData.transactions = seedData;
        } catch (error) {
            console.error('Could not load seed data.', error);
        }
    }
    state.setState(initialData);
    renderApp();

    // Attach all event listeners
    document.querySelector('.nav-links').addEventListener('click', handleNavClick);
    document.getElementById('transaction-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('transactions-tbody').addEventListener('click', handleTableClick);
    document.querySelector('thead').addEventListener('click', handleSort);
    document.getElementById('add-transaction-btn').addEventListener('click', () => ui.openModal());
    document.querySelector('.modal-close-btn').addEventListener('click', ui.closeModal);
    document.getElementById('search-input').addEventListener('input', renderApp);
    document.getElementById('case-sensitive-toggle').addEventListener('change', renderApp);
    document.getElementById('save-settings-btn').addEventListener('click', handleSaveSettings);
    document.getElementById('export-json-btn').addEventListener('click', handleExport);
    document.getElementById('import-json-input').addEventListener('change', handleImport);
};

document.addEventListener('DOMContentLoaded', init);