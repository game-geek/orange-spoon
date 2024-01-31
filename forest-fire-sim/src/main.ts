// import './main.css'
// import './style.css'
// bug, if import it here the html shows before the css
import {Position, getFires, propagateFires} from "./FirePropagatorSimulator"
import generateGrid, { GridType, resetGrid } from "./gridGenerator"
import {reRenderGrid, renderCanvasGrid, renderGrid} from "./renderGrid"

// DOM REFERENCES
// UI 
const createButton = document.querySelector("#create") as HTMLButtonElement
const popups = document.querySelector(".popups") as HTMLDivElement
// create new forest popup
const createPopup = popups.querySelector(".create") as HTMLDivElement
const createForm = createPopup.querySelector("form") as HTMLFormElement

// create new forest popup
const endPopup = popups.querySelector(".end") as HTMLDivElement

// controlls
const simulationControlls = document.querySelector(".right-sidebar ") as HTMLDivElement
const toggleSimulationButton = simulationControlls.querySelector(".simulate") as HTMLButtonElement
const resetSimulationButton = simulationControlls.querySelector(".reset") as HTMLButtonElement
const speedSlider = simulationControlls.querySelector(".speed") as HTMLButtonElement
const stepSimulationButton = simulationControlls.querySelector(".step") as HTMLButtonElement

// VARS
// list of all simulations
const forests: {
    grid: GridType
    fires: Position[]
}[] = []
// current simulation index -> forest
let currentForest: null | number = null
let simulating: boolean = false
let simulationLoop: null | NodeJS.Timeout = null
let speed: number = 500

// LISTENERS

createButton.addEventListener("click", openCreatePopup)
createPopup.querySelector("form button.cancel")?.addEventListener("click", closeCreatePopup)
createPopup.addEventListener("click", (e) => {
    // check if clicked outside of the popup
    // @ts-ignore
    const classNameOfElement = e.target.className
    if (classNameOfElement === "create") {
        // clicked outside form -> close form
        closeCreatePopup()
    } else if (classNameOfElement === "end") {
        // clicked outside form -> close form
        closeEndPopup()
    }
})

// close end popup
endPopup.querySelector("form button.cancel")?.addEventListener("click", closeEndPopup)



// listening for create form submission
createForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // parse form data
    const formData = new FormData(createForm)
    const height = Number(formData.get("height"))
    const width = Number(formData.get("width"))
    const density = Number(formData.get("density"))
    
    if (height === 0 || width === 0 || density > 100) return alert("width and height must be bigger than 0, density can at most be 100")

    // generate grid with parsed values
    const grid = generateGrid({size: {height, width}, forestDensity: 0, fireDensity: density})
    renderCanvasGrid(grid)
    const fires = getFires(grid)
    

    // for (let i=0; i < 3; i++ ){
    //     propagateFires(grid, fires)
    //     renderGrid(grid)
    //     // console.log(grid, fires)
    // }
    currentForest = forests.length
    forests.push({
        fires,
        grid
    })
    closeCreatePopup()
})


function simulateLoop() {
    simulateOnce()

    // reccursevely
    simulationLoop = setTimeout(simulateLoop, speed);
}




// controll buttons

speedSlider.addEventListener("click", () => {
    speed = 1000-Number(speedSlider.value)
    if (simulating) {
        if (simulationLoop) clearTimeout(simulationLoop)
        simulateLoop()
    }
})

toggleSimulationButton.addEventListener('click', () => {
    if (currentForest === null) {
        simulating = false
        return console.log(" error while simulating, no forests exist, create one")
    }

    if (simulating) {
        startSimulation()
    } else {
        pauseSimulation()
    }
})


resetSimulationButton.addEventListener("click", resetSimulation)
stepSimulationButton.addEventListener("click", simulateOnce)


// create new forest button
function openCreatePopup() {
    createPopup.classList.remove("hidden")
}
function closeCreatePopup() {
    createPopup.classList.add("hidden")
}

// close end popup
function openEndPopup() {
    endPopup.classList.remove("hidden")
}
function closeEndPopup() {
    endPopup.classList.add("hidden")
}


// Prog





function resetSimulation() {
    // get forest index -> currentForest
    if (currentForest === null) return console.log("no forests exist, create one")
    resetGrid(forests[currentForest].grid)      
    forests[currentForest].fires = getFires(forests[currentForest].grid)
    renderCanvasGrid(forests[currentForest].grid)
}

function startSimulation() {
    // kill the setTimeout function (loop)
    if (simulationLoop) {
        clearTimeout(simulationLoop)
    }
    simulating = false
    toggleSimulationButton.textContent = "Start Simulation"

}   

function pauseSimulation() {
    if (simulationLoop) {
        clearTimeout(simulationLoop)
    } 
    // start loop
    simulateLoop()
    simulating = true
    toggleSimulationButton.textContent = "Pause Simulation"
}

function simulateOnce() {
    if (currentForest === null) {
        simulating = false
        return console.log(" error while simulating, no forests exist, create one")
    }
    const noMoreFires = propagateFires(forests[currentForest].grid, forests[currentForest].fires)
    renderCanvasGrid(forests[currentForest].grid)
    console.log()
    // verify if reached end
    if (noMoreFires) openEndPopup()
    // bug -> newFireList is not empty ....

}