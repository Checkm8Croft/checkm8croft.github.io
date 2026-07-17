// Script principale per il sito

/**
 * Inizializza le checkbox della checklist dinamicamente
 * @param {Document|HTMLElement} root - contesto in cui cercare le checkbox
 */
function initializeChecklist(root = document) {
    const completedCheckboxes = root.querySelectorAll('input[type="checkbox"].completed-checkbox');
    const uncompletedCheckboxes = root.querySelectorAll('input[type="checkbox"].uncompleted-checkbox');

    completedCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
        checkbox.disabled = true;
        checkbox.closest('.checklist-item')?.classList.add('completed');
    });

    uncompletedCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        checkbox.disabled = true;
        checkbox.closest('.checklist-item')?.classList.remove('completed');
    });
}

/**
 * Inizializza tutto quando il DOM è pronto
 */
document.addEventListener('DOMContentLoaded', function() {
    initializeChecklist();
    initializeWorkInProgress();
});

/**
 * Inizializza il messaggio work in progress quando presente
 * @param {Document|HTMLElement} root - contesto in cui cercare il messaggio
 */
function initializeWorkInProgress(root = document) {
    const workinprogressElement = root.getElementById?.('workinprogress') || root.querySelector('#workinprogress');
    if (workinprogressElement) {
        workinprogressElement.innerText = workinprogresstext;
    }
}

/**
 * Espone le funzioni globalmente per poter essere chiamata dal spa-loader
 * quando viene caricato nuovo contenuto dinamicamente
 */
window.initializeChecklist = initializeChecklist;
window.initializeWorkInProgress = initializeWorkInProgress;

const workinprogresstext = "This is work in progress tool, and is not complete, check the status on the GH repo.";

function workinprogress() {
    initializeWorkInProgress();
}