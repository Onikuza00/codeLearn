# 01.09 Glosario rápido

| Término | Qué es |
|---------|--------|
| **Twig Component** | Componente UI que se renderiza 1 vez desde PHP. Sin interactividad. |
| **Live Component** | Componente que se re-renderiza por AJAX sin recargar página. Con interactividad. |
| **Prop** | Dato que el componente recibe desde afuera (del padre). |
| **`:` (en props)** | Hace que el valor se interprete como expresión Twig, no como string literal. |
| **Stimulus** | Framework JS minimalista para conectar comportamiento a HTML existente. |
| **Controller (Stimulus)** | Clase JS con métodos (eventos) y targets (referencias a elementos). |
| **Target** | Elemento HTML nombrado dentro de un controller. Se accede como `this.nombreTarget`. |
| **Action** | Enlace evento → controller → método. Sintaxis: `click->ctrl#metodo`. |
| **`->`** | Separa el evento del controller en una action. |
| **`#`** | Separa el controller del método en una action. |
| **`lazy`** | El controller JS no se descarga hasta que aparece en el DOM. |
| **AssetMapper** | Sistema de Symfony para gestionar assets JS/CSS sin Webpack Encore. |
| **Autowiring** | Symfony inyecta servicios automáticamente por el type-hint. |
| **Maker** | Generador de código interactivo (`php bin/console make:*`). |
