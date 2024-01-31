// create a grid randomly generated with 1's and 0's defined by a size and density

// types
type GenerateGridType = {
    size: {
        width: number;
        height: number;
    },
    forestDensity: number;
    fireDensity: number;
}

export type GridType = CellType[][]
type CellType = {
    state: CellState, // 0: burned;  1: forest ; 2: ground; 3: fire
    initial: boolean
}
type CellState = 0 | 1 | 2 | 3


// helper functions
function generateRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function fillRandomly(grid: GridType, density: number, totalAvailable: number, cellToOverride: CellState, overrideCode: CellState) {
    const width = grid.length
    const height = grid[0].length

    // to calculate the density for the forest
    let forestCount = Math.floor((totalAvailable / 100) * density);
    let actual = 0;
    
    while (actual != forestCount){
        let x = generateRandomNumber(0, width-1);
        let y = generateRandomNumber(0, height-1);
        if (grid[y][x].state == cellToOverride){
            grid[y][x].state = overrideCode;
            grid[y][x].initial = true;
            actual ++;
        }
    }
}



// main function 
export default function generateGrid({ size, forestDensity, fireDensity }: GenerateGridType): GridType {
    const grid: GridType = []
    let tempGrid: CellType[] = []
    
    // create grid
    for (let y=0; y < size.height; y++) {
        tempGrid = []
        for (let x=0; x < size.width; x++) {
            tempGrid.push({
                state: 0,
                initial: false
            })
        }
        grid.push([...tempGrid])
    }

    
    // to calculate the density for the forest
    fillRandomly(grid, fireDensity, size.width*size.height, 0, 1)


    

    
    return grid
}

export function resetGrid(grid: GridType) {
    // ease of use
    const gridWidth = grid[0].length
    const gridHeight = grid.length
    
    for (let y=0; y < gridHeight; y++) {
        for (let x=0; x < gridWidth; x++) {
            if (grid[y][x].initial) {
                grid[y][x].state = 1
            } else {
                grid[y][x].state = 0
            }
        }
    }
}