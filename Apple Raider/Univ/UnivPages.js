function loadUnivPage(page) {
    const fileMap = {
        Bootcamp: "../Univ/Bootcamp.html",
        Wine: "../Univ/Wine.html",
        VMs: "../Univ/VMs.html"
    };
    const divMap = {
        Bootcamp: "bootcamp-content",
        Wine: "wine-content",
        VMs: "vm-content"
    };
    // Aggiungi un parametro casuale per evitare la cache
    const url = fileMap[page] + "?v=" + Date.now();
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            document.getElementById(divMap[page]).innerHTML = match ? match[1] : "Contenuto non trovato.";
        })
        .catch(() => {
            document.getElementById(divMap[page]).innerHTML = "Errore nel caricamento.";
        });
}