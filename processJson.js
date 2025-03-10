function processJson() {
    let input = document.getElementById('input-json').value;
    let output = '';

    try {
        let parsedInput = JSON.parse(input);
        if (parsedInput && Array.isArray(parsedInput.chapters)) {
            output += "label start:\n";

            parsedInput.chapters.forEach(chapter => {
                if (chapter.id && chapter.title && chapter.description) {
                    output += `    label chapter${chapter.id}:\n`;

                    if (chapter.image) {
                        output += `        scene ${chapter.image.replace(/\.[^/.]+$/, "")}\n`;
                    }

                    output += `        "${chapter.title}"\n`;
                    output += `        "${chapter.description}"\n`;

                    if (chapter.enemies && chapter.enemies.length > 0) {
                        chapter.enemies.forEach(enemy => {
                            output += `        "Przeciwnik: ${enemy.name} (HP: ${enemy['hit-points']}, Zręczność: ${enemy.dexterity})"\n`;
                        });
                    }

                    if (chapter.events && chapter.events.length > 0) {
                        chapter.events.forEach(event => {
                            output += `        "* Zdarzenie: ${event.type} ${event.parameter} ${event.value}"\n`;
                        });
                    }

                    if (chapter.connectors && chapter.connectors.length > 0) {
                        output += `        menu:\n`;
                        chapter.connectors.forEach(connector => {
                            output += `            "${connector.button}:
"`;
                            output += `                jump chapter${connector.destination}\n`;
                        });
                    }

                    output += `        return\n\n`;
                }
            });

            output += "return\n";
        } else {
            output = "Invalid JSON structure: Expected 'chapters' as an array.";
        }
    } catch (error) {
        output = "Invalid JSON input: " + error.message;
    }

    document.getElementById('output-renpy').value = output;
    saveToHistory(input, output);
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('input-json').value = e.target.result;
        };
        reader.readAsText(file);
    }
}

function downloadOutput() {
    const output = document.getElementById('output-renpy').value;
    if (!output) {
        alert("Brak wyników do pobrania");
        return;
    }
    const blob = new Blob([output], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'renpyscript.rpy';
    link.click();
}

function clearJsonInput() {
    document.getElementById('input-json').value = '';
}

function resetFileInput() {
    document.getElementById('file-input').value = '';
}

function clearOutput() {
    document.getElementById('output-renpy').value = '';
}

const HISTORY_KEY = "conversionHistory";

function saveToHistory(input, output) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const timestamp = new Date().toLocaleString();
    history.unshift({ input, output, timestamp });
    if (history.length > 10) history.pop();
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    loadHistory();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    const historyContainer = document.getElementById("conversion-history");
    historyContainer.innerHTML = "";
    history.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        const content = document.createElement("div");
        content.innerHTML = `<strong>${item.timestamp}</strong><br><small>${item.input.length} ilość znaków</small>`;
        const buttons = document.createElement("div");
        buttons.classList.add("btn-group");
        const loadButton = document.createElement("button");
        loadButton.classList.add("btn", "btn-primary", "btn-sm");
        loadButton.textContent = "Wczytaj";
        loadButton.onclick = () => {
            document.getElementById("input-json").value = item.input;
            document.getElementById("output-renpy").value = item.output;
        };
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn", "btn-danger", "btn-sm");
        deleteButton.textContent = "Usuń";
        deleteButton.onclick = () => deleteFromHistory(index);
        buttons.append(loadButton, deleteButton);
        listItem.append(content, buttons);
        historyContainer.appendChild(listItem);
    });
}

function deleteFromHistory(index) {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    history.splice(index, 1);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    loadHistory();
}

function clearAllHistory() {
    localStorage.removeItem(HISTORY_KEY);
    loadHistory();
}

document.addEventListener("DOMContentLoaded", loadHistory);
