// Sistema di caricamento dinamico per SPA (Single Page Application)

// Contenitore dove inserire il contenuto dinamico
const CONTENT_CONTAINER_ID = 'dynamic-content';

/**
 * Carica un file HTML e lo inserisce nel contenitore dinamico
 * @param {string} filePath - Percorso del file HTML da caricare
 */
async function loadPage(filePath) {
    try {
        const response = await fetch(filePath);
        
        if (!response.ok) {
            throw new Error(`Errore nel caricamento: ${response.status}`);
        }
        
        const html = await response.text();
        const container = document.getElementById(CONTENT_CONTAINER_ID);
        
        if (!container) {
            console.error(`Contenitore con id "${CONTENT_CONTAINER_ID}" non trovato`);
            return;
        }
        
        // Estrai solo il contenuto del body (rimuovi DOCTYPE, html, head, body tags)
        const content = extractBodyContent(html);
        container.innerHTML = content;
        
        // Inizializza le checkbox dopo il rendering del contenuto
        setTimeout(() => {
            if (window.initializeChecklist) {
                window.initializeChecklist(container);
            }
        }, 10);
        
        // Scroll verso l'inizio del contenuto
        window.scrollTo(0, 0);
        
    } catch (error) {
        console.error('Errore nel caricamento della pagina:', error);
        const container = document.getElementById(CONTENT_CONTAINER_ID);
        if (container) {
            container.innerHTML = '<h2>Errore nel caricamento della pagina</h2>';
        }
    }
}

/**
 * Estrae solo il contenuto del body da un HTML completo
 * @param {string} html - HTML completo
 * @returns {string} - Contenuto del body
 */
function extractBodyContent(html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    
    if (bodyMatch && bodyMatch[1]) {
        return bodyMatch[1];
    }
    
    // Se non c'è un tag body, ritorna l'HTML così com'è
    // (utile se il file contiene già solo il contenuto)
    return html;
}

/**
 * Aggiorna l'URL con il fragment della pagina corrente
 * @param {string} filePath - Percorso del file
 */
function updateUrlFragment(filePath) {
    window.location.hash = filePath;
}

/**
 * Legge il fragment dall'URL e ritorna il percorso del file
 * @returns {string|null} - Percorso del file o null se non specificato
 */
function getPageFromUrl() {
    const hash = window.location.hash;
    
    // Rimuovi il # dall'inizio
    if (hash.startsWith('#')) {
        return hash.substring(1);
    }
    
    return null;
}

/**
 * Intercetta i clic sui link e carica le pagine dinamicamente
 */
document.addEventListener('DOMContentLoaded', function() {
    // Carica la pagina dal fragment se presente
    const pageFromUrl = getPageFromUrl();
    if (pageFromUrl) {
        loadPage(pageFromUrl);
    }
    
    // Aggiungi event listener a tutti i link
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Controlla se il link è interno (HTML) e non è un link esterno
        if (href && 
            href.endsWith('.html') && 
            !href.startsWith('http') && 
            !href.startsWith('//')) {
            
            e.preventDefault();
            
            // Aggiorna il fragment URL
            updateUrlFragment(href);
            
            // Carica la pagina
            loadPage(href);
        }
    });
    
    // Gestisci i cambiamenti del fragment (back/forward button)
    window.addEventListener('hashchange', function() {
        const pageFromUrl = getPageFromUrl();
        if (pageFromUrl) {
            loadPage(pageFromUrl);
        }
    });
});
