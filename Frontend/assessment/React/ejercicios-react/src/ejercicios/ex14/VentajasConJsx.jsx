import { createElement} from 'react'

function VentajasConJsx(){
    return (
        createElement("section", {className: "flex flex-col justify-center items-center gap-4 p-4 mt-6 rounded-lg border-1 border-green-700 bg-green-500/10 max-w-fit px-4 mx-auto"},
            createElement("h2", {className: "font-semibold text-2xl text-green-800"}, "Por qué elegirnos?"),
            createElement("ul", {className: "flex flex-col gap-1"},
                createElement("li",null,"✓ Rápido"),
                createElement("li",null,"✓ Seguro"),
                createElement("li",null,"✓ Accesible"),
            ),
        )
    )
}

export default VentajasConJsx