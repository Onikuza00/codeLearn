# XML { .section-python .bloque-python }

> XML es un formato de etiquetas anidadas, muy común en configuraciones y en sistemas antiguos. Aquí lo lees y lo escribes con `xml.etree.ElementTree`, y ves por qué nunca debes parsear XML de origen dudoso con la librería estándar sin precauciones.

---

## Leer XML {: .topic-title }

**XML** describe los datos con **etiquetas** anidadas, como HTML, y puede llevar **atributos** (`id="1"`). El módulo estándar `xml.etree.ElementTree` lo convierte en un árbol de **elementos** que recorres con `find` y `findall`.

**1. El script**

```python
# read_xml.py
import xml.etree.ElementTree as ET

xml_text = """<offers>
  <offer id="1" remote="false">
    <title>Frontend Developer</title>
    <city>Madrid</city>
    <salary>32000</salary>
  </offer>
  <offer id="2" remote="true">
    <title>Backend Developer</title>
    <city>Barcelona</city>
  </offer>
</offers>"""

root = ET.fromstring(xml_text)
print(root.tag, len(root))
for offer in root.findall("offer"):
    title = offer.find("title").text
    salary = offer.find("salary")
    print(offer.attrib["id"], offer.get("remote"), title, salary.text if salary is not None else "sin salario")

print(root.find("offer/city").text)
print(root.find("offer/zip"))
try:
    print(root.find("offer/zip").text)
except AttributeError as error:
    print(f"AttributeError: {error}")
print([city.text for city in root.iter("city")])
```

**2. Cómo se ejecuta**

```bash
python read_xml.py
```

**3. Qué pasa por dentro.** `fromstring` analiza el texto y devuelve el elemento raíz. `root.findall("offer")` devuelve los hijos con esa etiqueta; `offer.find("title")` el primer hijo `title`. `.text` es el texto de dentro y `.attrib` / `.get()` leen los atributos. Todo llega como texto (`'32000'`). Para leer de un archivo se usa `ET.parse("archivo.xml").getroot()`, como muestran los apuntes de la escuela.

**4. La salida**

```text
offers 2
1 false Frontend Developer 32000
2 true Backend Developer sin salario
Madrid
None
AttributeError: 'NoneType' object has no attribute 'text'
['Madrid', 'Barcelona']
```

!!! warning "`find` devuelve `None` si no encuentra el elemento"
    La segunda oferta no tiene `salary`: `find("salary")` da `None`, y `None.text` lanza `AttributeError`. Es el error más común con ElementTree, y los apuntes no lo advierten. Comprueba `is not None` antes de usar `.text`.

---

## Escribir XML {: .topic-title }

```python
# write_xml.py
import xml.etree.ElementTree as ET

root = ET.Element("offers")
offer = ET.SubElement(root, "offer", id="1")
ET.SubElement(offer, "title").text = "QA & Testing <senior>"
tree = ET.ElementTree(root)
ET.indent(tree)
ET.dump(root)
tree.write("data/offers.xml", encoding="utf-8", xml_declaration=True)
print(open("data/offers.xml", encoding="utf-8").read().splitlines()[0])
```

```text
<offers>
  <offer id="1">
    <title>QA &amp; Testing &lt;senior&gt;</title>
  </offer>
</offers>
<?xml version='1.0' encoding='utf-8'?>
```

- `Element` crea la raíz y `SubElement` añade hijos; los atributos van como argumentos con nombre.
- `ET.indent` da formato legible y `ET.dump` lo imprime.
- Los caracteres especiales (`&`, `<`) se **escapan solos** (`&amp;`, `&lt;`).
- `tree.write(...)` guarda el archivo; con `encoding="utf-8"` y `xml_declaration=True` incluye la cabecera.

---

## El aviso de seguridad {: .topic-title }

Los apuntes de la escuela no lo mencionan, y es lo más importante de este capítulo: **XML puede llevar instrucciones que consumen recursos o acceden a otros datos**. La documentación oficial advierte de que los módulos XML de la biblioteca estándar **no son seguros frente a datos maliciosos** (ataques como la «explosión de entidades»). Un documento pequeño puede expandirse a un tamaño enorme al analizarlo.

La alternativa recomendada es el paquete **`defusedxml`** (se instala con `pip`), que rechaza esas construcciones:

```python
# entities.py
import xml.etree.ElementTree as ET
import defusedxml.ElementTree as safe_ET
from defusedxml import EntitiesForbidden

bomb = """<?xml version="1.0"?>
<!DOCTYPE lolz [
  <!ENTITY lol "lol">
  <!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">
  <!ENTITY lol3 "&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;&lol2;">
]>
<data>&lol3;</data>"""

print(len(ET.fromstring(bomb).text), "caracteres expandidos desde un documento de", len(bomb), "caracteres")
try:
    safe_ET.fromstring(bomb)
except EntitiesForbidden as error:
    print("defusedxml:", type(error).__name__)
print(safe_ET.fromstring("<a>ok</a>").text)
```

```text
300 caracteres expandidos desde un documento de 233 caracteres
defusedxml: EntitiesForbidden
ok
```

Este ejemplo es **minúsculo** a propósito (3 niveles de entidades). Con más niveles el crecimiento es exponencial. La versión estándar lo expande sin queja; `defusedxml` lo rechaza con `EntitiesForbidden`.

!!! warning "XML que no has escrito tú: `defusedxml`"
    Para archivos que controlas (tu propia configuración), `xml.etree` basta. Para XML de **fuentes externas** (subidas de usuarios, respuestas de servicios ajenos), usa `defusedxml.ElementTree` como sustituto directo.

---

## Python en IA {: .topic-title }

XML aparece en dos sitios:

- **Datos y feeds** antiguos (sitemaps, catálogos, RSS) que tienes que convertir a texto o JSON antes de dárselos a un modelo.
- **Etiquetas en los prompts:** a veces se estructura el prompt con etiquetas tipo XML (`<documento>...</documento>`) para separar instrucciones de datos. Eso es solo texto con forma de etiquetas; no necesita un parser.

!!! tip "Convierte a diccionarios cuanto antes"
    Lee el XML una vez, extrae lo que necesitas a una lista de diccionarios y trabaja con eso. El resto de tu código ([comprensiones](../../../02-estructuras-de-datos/04-comprensiones/01-comprensiones-de-lista/index.md), [JSON](../02-json/index.md)) se escribe mejor sobre diccionarios.

---

## Comparación con JavaScript {: .topic-title }

| En JS | En Python |
|---|---|
| `new DOMParser().parseFromString(xml, "text/xml")` | `ET.fromstring(xml)` |
| `doc.querySelector("title")` | `root.find("title")` |
| `doc.querySelectorAll("offer")` | `root.findall("offer")` |
| `el.textContent` | `el.text` |
| `el.getAttribute("id")` | `el.get("id")` |
| El navegador evita muchos ataques de entidades | `xml.etree` no es seguro con datos hostiles: `defusedxml` |

!!! tip "Consejos"
    - **`find()` puede dar `None`:** compruébalo.
    - **Todo es texto:** convierte con `int()` / `float()`.
    - **JSON mejor que XML** si puedes elegir el formato.

---

## Recursos {: .topic-title }

| Recurso | Enlace |
|---|---|
| **Apuntes de la escuela** | |
| Fitxers JSON i XML — «El format XML (import xml.etree.ElementTree)» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_602/#2-el-format-xml-import-xmletreeelementtree> |
| Fitxers JSON i XML — «Lectura de fitxers XML» | <https://apunts.institutmontilivi.cat/ASIX-OPTNB/pyASIX/py_602/#lectura-de-fitxers-xml> |
| **Documentación oficial** | |
| Módulo `xml.etree.ElementTree` | <https://docs.python.org/3/library/xml.etree.elementtree.html> |
| Vulnerabilidades de XML | <https://docs.python.org/3/library/xml.html#xml-vulnerabilities> |
| defusedxml en PyPI | <https://pypi.org/project/defusedxml/> |
