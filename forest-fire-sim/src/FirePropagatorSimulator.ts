// functions to update list

import { GridType } from "./gridGenerator";

export type Position = {
    x: number, y: number
}

// let FireList: Position[] = [{x: 10, y: 10}]


function propagateFires(grid: GridType, fireList: Position[]): boolean {
    // ease of use
    const gridWidth = grid[0].length
    const gridHeight = grid.length

    // new fire list
    const newFireList: Position[] = []
    // console.log("fire", JSON.parse(JSON.stringify(grid)) , JSON.parse(JSON.stringify(fireList)))

    // propagate fire
    for (const fire of fireList) {
        // this cell is on fire
        // check for cells around to propagate to them
        
        let positions = []
        // 000
        // 0x0
        // 000

        // right
        positions.push({x: fire.x+1, y: fire.y})
        // left
        positions.push({x: fire.x-1, y: fire.y})
        // bottom
        positions.push({x: fire.x, y: fire.y+1})
        // top
        positions.push({x: fire.x, y: fire.y-1})
        // bottom right 
        positions.push({x: fire.x+1, y: fire.y+1})
        // bottom left
        positions.push({x: fire.x-1, y: fire.y+1})
        // top right
        positions.push({x: fire.x+1, y: fire.y-1})
        // top left
        positions.push({x: fire.x-1, y: fire.y-1})
        
        // console.log(positions)
        // verify all positions and keep valid ones
        positions = positions.filter(position => position.x > gridWidth-1 || position.x < 0 || position.y > gridHeight-1 || position.y < 0 || grid[position.y][position.x].state !== 0  ? false : true)
        // console.log(positions)


        // make changes //

        // grid changes
        // make changes -> trees on fire 
        for (const pos of positions) {
            grid[pos.y][pos.x].state = 1
        } 
        // kill first tree
        grid[fire.y][fire.x].state = 3

        // new firelist changes
        newFireList.push(...positions)
        
    }
    fireList.splice(0, fireList.length)
    fireList.push(...newFireList)
    
    // check if no more fires to propagate -> end
    if (newFireList.length === 0) return false
    else return true
    // console.log("fire end", JSON.parse(JSON.stringify(grid)) , JSON.parse(JSON.stringify(fireList)))
}

function getFires(grid: GridType): Position[] {
    const fireList: Position[] = []

    for (let y=0; y < grid.length; y++) {
        for(let x=0; x < grid[y].length; x++) {
            grid[y][x].state === 1 ? fireList.push({x, y}) : undefined
        }
    }
    // console.log("list", JSON.parse(JSON.stringify(fireList)))
    return fireList
}

export { getFires, propagateFires }