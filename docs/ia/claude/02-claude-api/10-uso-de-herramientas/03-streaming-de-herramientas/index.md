# Streaming con herramientas { .bloque-ia }

> Combinar el [streaming](../../06-streaming/index.md) con el uso de herramientas: cómo llegan los argumentos de una herramienta fragmento a fragmento, y por qué a veces con retraso.

---

## Un nuevo tipo de fragmento: `input_json_delta` { .topic-title }

En streaming ya viste que la respuesta llega como eventos `content_block_delta`, cada uno con un `delta` de tipo `text_delta` para el texto normal. Cuando Claude está generando los argumentos de una herramienta, el `delta` es de otro tipo: `input_json_delta`, con un fragmento de JSON en `partial_json`.

La forma más simple de consumirlo es con el helper de alto nivel del SDK, `.on('inputJson', ...)` — el mismo mecanismo que `.on('text', ...)` usaba para darte solo el texto ya extraído:

```js
const stream = client.messages.stream({
  model: modelo,
  max_tokens: 1000,
  messages,
  tools: [getCurrentDatetimeSchema],
});

stream.on('inputJson', (partialJson, jsonSnapshot) => {
  console.log('Fragmento:', partialJson);
  console.log('Acumulado hasta ahora:', jsonSnapshot);
});
```

`partialJson` es el trozo nuevo que acaba de llegar; `jsonSnapshot` es el JSON completo acumulado hasta ese punto (todavía puede estar incompleto).

## Por qué llega con retraso, en ráfagas { .topic-title }

La API no reenvía cada fragmento apenas Claude lo genera — los retiene y los valida primero, un par clave-valor de nivel superior a la vez. Con un esquema como:

```json
{
  "abstract": "...",
  "meta": { "word_count": 847, "review": "..." }
}
```

la API espera a que el valor completo de `abstract` esté listo, lo valida contra el esquema, y **recién ahí** manda de golpe todos los fragmentos acumulados de ese campo. Después repite el proceso con `meta`. El resultado que se percibe: pausas seguidas de ráfagas de texto, aunque el streaming esté activo — no es un fallo, es la validación haciendo su trabajo antes de soltar cada campo.

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
