import { validators } from './validators.js';
import * as search from './search.js';

const elements = {
    sections: document.querySelectorAll('.content-section'),
    navLinks: document.querySelectorAll('.nav-link'),
    modal: document.getElementById('transaction-modal'),
    form: document.getElementById('transaction-form'),
    tbody: document.getElementById('transactions-tbody'),
};

export const showSection = (sectionId) => {
    elements.sections.forEach(s => s.hidden = s.id !== sectionId);
    elements.navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === sectionId));
};

export const renderTable = (transactions) => {
    const searchInput = document.getElementById('search-input').value;
    const isCaseSensitive = document.getElementById('case-sensitive-toggle').checked;
    const regex = search.compileRegex(searchInput, isCaseSensitive ? '' : 'i');

    if (!Array.isArray(transactions) || transactions.length === 0) {
        elements.tbody.innerHTML = '<tr><td colspan="5">No transactions found.</td></tr>';
        return;
    }

    elements.tbody.innerHTML = transactions.map(t => {
        const desc = t.description ? search.highlight(t.description, regex) : '';
        const cat = t.category ? search.highlight(t.category, regex) : '';
        const date = t.date || '';
        const amt = typeof t.amount === 'number' && !isNaN(t.amount) ? `$${t.amount.toFixed(2)}` : '';
        return `
            <tr data-id="${t.id}">
                <td data-label="Description">${desc}</td>
                <td data-label="Category">${cat}</td>
                <td data-label="Date">${date}</td>
                <td data-label="Amount">${amt}</td>
                <td data-label="Actions">
                    <button class="edit-btn" aria-label="Edit ${desc}">Edit</button>
                    <button class="delete-btn" aria-label="Delete ${desc}">Delete</button>
                </td>
            </tr>
        `;
    }).join('');

    if (transactions.length === 0) {
        elements.tbody.innerHTML = diagnosticRow + '<tr><td colspan="5">No transactions found.</td></tr>';
        return;
    }
    elements.tbody.innerHTML = diagnosticRow + transactions.map(t => `
        <tr data-id="${t.id}">
            <td data-label="Description">${search.highlight(t.description, regex)}</td>
            <td data-label="Category">${search.highlight(t.category, regex)}</td>
            <td data-label="Date">${t.date}</td>
            <td data-label="Amount">$${t.amount.toFixed(2)}</td>
            <td data-label="Actions">
                <button class="edit-btn" aria-label="Edit ${t.description}">Edit</button>
                <button class="delete-btn" aria-label="Delete ${t.description}">Delete</button>
            </td>
        </tr>`).join('');
};

export const updateDashboard = (transactions, settings) => {
    const totalSpent = transactions.reduce((sum, t) => sum + t.amount, 0);
    const categoryCounts = transactions.reduce((acc, t) => ({...acc, [t.category]: (acc[t.category] || 0) + 1}), {});
    const topCategory = Object.keys(categoryCounts).length ? Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0] : 'N/A';
    
    document.getElementById('stats-total-records').textContent = transactions.length;
    document.getElementById('stats-total-spent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('stats-top-category').textContent = topCategory;
    
    const { budgetCap } = settings;
    const budgetStatusEl = document.getElementById('stats-budget-status');
    const budgetLiveRegion = document.getElementById('budget-live-region');
    document.getElementById('budget-cap-input').value = budgetCap || '';

    if (budgetCap > 0) {
        const remaining = budgetCap - totalSpent;
        const overage = totalSpent - budgetCap;
        const isOver = totalSpent > budgetCap;
        
        budgetStatusEl.textContent = isOver ? `$${overage.toFixed(2)} over` : `$${remaining.toFixed(2)} left`;
        budgetStatusEl.style.color = isOver ? 'var(--error-color)' : 'var(--success-color)';
        budgetLiveRegion.textContent = budgetStatusEl.textContent;
        budgetLiveRegion.setAttribute('aria-live', isOver ? 'assertive' : 'polite');
    } else {
        budgetStatusEl.textContent = 'No cap set.';
        budgetStatusEl.style.color = 'inherit';
        budgetLiveRegion.textContent = '';
    }
};

export const openModal = (transaction = null) => {
    elements.form.reset();
    clearFormErrors();
    document.getElementById('modal-title').textContent = transaction ? 'Edit Transaction' : 'Add Transaction';
    document.getElementById('transaction-id').value = transaction?.id || '';
    if (transaction) {
        Object.keys(transaction).forEach(key => {
            const input = elements.form.querySelector(`#${key}`);
            if (input) input.value = transaction[key];
        });
    } else {
        document.getElementById('date').valueAsDate = new Date();
    }
    elements.modal.hidden = false;
    document.getElementById('description').focus();
};

export const closeModal = () => { elements.modal.hidden = true; };

export const getFormData = () => ({
    id: document.getElementById('transaction-id').value,
    description: document.getElementById('description').value.trim(),
    amount: parseFloat(document.getElementById('amount').value),
    category: document.getElementById('category').value,
    date: document.getElementById('date').value,
});

const showError = (id, message) => {
    const el = document.getElementById(id);
    el.classList.add('invalid');
    el.nextElementSibling.textContent = message;
};
const clearFormErrors = () => {
    elements.form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    elements.form.querySelectorAll('.error-message').forEach(el => el.textContent = '');
};

export const validateForm = () => {
    clearFormErrors();
    let isValid = true;
    const data = getFormData();

    if (!validators.description(data.description)) { isValid = false; showError('description', 'Cannot be empty or just spaces.'); }
    if (!validators.amount(data.amount)) { isValid = false; showError('amount', 'Please enter a valid amount.'); }
    if (!validators.date(data.date)) { isValid = false; showError('date', 'Please use YYYY-MM-DD format.'); }
    
    return isValid;
};

export const showStatusMessage = (message) => {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    setTimeout(() => { statusEl.textContent = ''; }, 4000);
};