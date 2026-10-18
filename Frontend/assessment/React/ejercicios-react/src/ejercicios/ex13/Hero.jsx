import { createElement } from "react"

function Hero(){
    return (
  createElement("section", { className: "flex flex-col justify-center items-center gap-4 p-4 mt-6" },
  createElement("h2", { className: "text-5xl font-bold" }, "Lanza tu proyecto"),
  createElement("p", { className: "mt-2 text-gray-500 text-xl" }, "Una landing rápida con React."),
  createElement("a", { className: "rounded-2xl bg-blue-700 text-white px-4 py-2 font-semibold", href: "#planes" }, "Empezar"),
    ))
    }

export default Hero