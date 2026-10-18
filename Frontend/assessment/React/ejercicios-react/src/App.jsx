import imagen from "./assets/react.svg";
import Hero from './ejercicios/ex13/Hero.jsx'
import VentajasConJsx from './ejercicios/ex14/VentajasConJsx.jsx'
import VentajasSinJsx from './ejercicios/ex14/VentajasSinJsx.jsx'

function App() {
  //He decidido dejar la imagen en assets pq es el patrón mas professional
  console.log("<-- Se ha pintado el componente -->")
  return (
  <>
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-center text-7xl font-bold text-blue-800 p-3">
        Hola React
      </h1>
      <img className="w-[200px]" src={imagen} alt="Logo de React"  />
    </div>
    <Hero />
    <VentajasConJsx />
    <VentajasSinJsx />
</>)
}

export default App
