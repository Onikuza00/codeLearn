# Streaming con herramientas { .bloque-ia }

> Combinar el [streaming](../../06-streaming/index.md) con el uso de herramientas: cómo llegan los argumentos de una herramienta fragmento a fragmento, y por qué a veces con retraso.

---

## El evento `inputJson` { .topic-title }

`client.messages.stream(...)` devuelve un **emisor de eventos** — un objeto al que le decís "cuando pase X, ejecutá esta función", igual que `addEventListener('click', fn)` en el navegador. Con herramientas activas, el evento que interesa es `'inputJson'`: se dispara cada vez que llega un pedacito nuevo de los argumentos que Claude está armando para la herramienta.

```js
const stream = client.messages.stream({
  model: modelo,
  max_tokens: 1000,
  messages,
  tools: [getCurrentDatetimeSchema],
});

stream.on('inputJson', (partialJson, jsonSnapshot) => {
  console.log('Fragmento:', partialJson);
  console.log('Acumulado:', jsonSnapshot);
});
```

!!! tip "Los dos parámetros del callback"
    El SDK llama a esta función con dos valores fijos, siempre en el mismo orden — los nombres (`partialJson`, `jsonSnapshot`) los elegís vos:

    - **`partialJson`** — el pedacito que acaba de llegar en esta llamada puntual, nada más.
    - **`jsonSnapshot`** — la suma de todos los pedacitos recibidos hasta ahora, ya parseada como objeto (solo cuando ese texto junto ya es JSON válido — si no, se queda vacío).

## Por qué llega con retraso, en ráfagas { .topic-title }

Con una herramienta que recibe `{ format: 'time' }`, una ejecución real deja este rastro:

```
Fragmento: {"forma
Acumulado: {}
Fragmento: t": "ti
Acumulado: {}
Fragmento: me"}
Acumulado: { format: 'time' }
```

`jsonSnapshot` se queda en `{}` durante los dos primeros fragmentos — el texto acumulado (`{"format`, `{"format": "ti`) todavía no es JSON válido. Recién en el tercer fragmento, cuando `{"format":"time"}` cierra y valida, `jsonSnapshot` muestra el objeto completo de una sola vez.

La API no reenvía cada fragmento apenas Claude lo genera: los retiene y los valida primero, campo por campo. Con un esquema de varios campos, repite este proceso por cada uno — de ahí la sensación de pausas seguidas de ráfagas, aunque el streaming esté activo. No es un fallo, es la validación haciendo su trabajo antes de soltar cada campo.

## Streaming más granular (beta) { .topic-title }

Si ese retraso por validación afecta a la experiencia de usuario — por ejemplo, querés mostrar el progreso en tiempo real mientras Claude arma los argumentos — existe una forma de recibir los fragmentos apenas se generan, sin esperar a que cada campo esté completo y validado.

!!! warning "Área en evolución — comprobar la documentación oficial antes de usarla"
    Esto es una funcionalidad relativamente nueva y cambia de forma entre versiones del SDK. Al momento de escribir esto, el SDK expone un campo `eager_input_streaming` dentro de la propia definición de la herramienta (no un parámetro suelto de la llamada), como evolución del mecanismo anterior basado en una cabecera beta. No copies un nombre de parámetro de memoria — antes de activarlo, comprobá la [documentación oficial de tool use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview) para la forma vigente.

**La contrapartida: JSON inválido.** Sin la validación de por medio, podés recibir JSON roto a mitad de generar — hay que parsear cada `jsonSnapshot` dentro de un `try`/`catch`:

```js
try {
  const parsedArgs = JSON.parse(jsonSnapshot);
  // usar parsedArgs
} catch {
  // todavía no es JSON válido — esperar al próximo fragmento
}
```

## Cuándo conviene { .topic-title }

- Necesitás mostrarle al usuario el progreso en tiempo real mientras Claude arma los argumentos.
- Querés empezar a procesar resultados parciales antes de tener el objeto completo.
- Los cortes por validación afectan de forma notable a la experiencia de usuario.
- Estás dispuesto a manejar JSON inválido de forma robusta en tu código.

Para la mayoría de los casos, el comportamiento por defecto (con validación) es suficiente — esta opción es para cuando la latencia percibida importa más que la garantía de recibir siempre JSON válido en cada fragmento.

---

## 📖 Recursos oficiales

| Recurso | Link |
|---------|------|
| 🎓 **Anthropic Academy — Building with the Claude API** | https://anthropic.skilljar.com/claude-with-the-anthropic-api |
| 📘 **Documentación oficial — Tool use** | https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview |
| 📘 **Documentación oficial — Streaming Messages** | https://platform.claude.com/docs/en/build-with-claude/streaming |
