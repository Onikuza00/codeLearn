// Helper para las demos interactivas de arrays: dibuja el array como cajas
// y mantiene un log de las últimas acciones. Vanilla JS, sin dependencias.
window.ArrayDemo = (function () {
    function renderViz(vizEl, arr, ghostValue) {
        vizEl.innerHTML = "";
        vizEl.classList.toggle("array-demo__viz--empty", arr.length === 0 && !ghostValue);

        arr.forEach(function (value) {
            var item = document.createElement("span");
            item.className = "array-demo__item";
            item.textContent = JSON.stringify(value);
            vizEl.appendChild(item);
        });

        if (ghostValue !== undefined) {
            var arrow = document.createElement("span");
            arrow.className = "array-demo__arrow";
            arrow.textContent = "→";
            vizEl.appendChild(arrow);

            var ghost = document.createElement("span");
            ghost.className = "array-demo__item array-demo__item--ghost";
            ghost.textContent = JSON.stringify(ghostValue);
            vizEl.appendChild(ghost);
        }
    }

    function log(logEl, text) {
        var line = document.createElement("div");
        line.textContent = text;
        logEl.prepend(line);
        while (logEl.children.length > 4) {
            logEl.removeChild(logEl.lastChild);
        }
    }

    function clearLog(logEl) {
        logEl.innerHTML = "";
    }

    return { renderViz: renderViz, log: log, clearLog: clearLog };
})();
