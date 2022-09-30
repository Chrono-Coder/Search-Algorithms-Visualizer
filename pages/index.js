import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { selectAll, select } from 'd3'

export default function Home() {
	const [start, setStart] = useState(-1)
	const [goal, setGoal] = useState(-1)
	const [mouseDown, setMouseDown] = useState(false)
	const [buildMode, setBuildMode] = useState(false)
	const [path, setPath] = useState([])
	const [exploredPath, setExploredPath] = useState([])
	const [pathMode, setPathMode] = useState(true)
	const [finalCost, setCost] = useState(0)

	const [hueristicMode, setHueristicMode] = useState(0)
	const [isLoaded, setLoaded] = useState(false)
	const [numCols, setNumCols] = useState(0)
	const [numRows, setNumRows] = useState(0)
	const [filter, setFilter] = useState("aStar")
	// const [deleting, setDeleting] = useState(false)

	const delay = async (ms = 1000) =>
		new Promise(resolve => setTimeout(resolve, ms))


	useEffect(() => {
		if (!pathMode) {
			const cells = document.querySelectorAll("[data-cell]")
			cells.forEach(cell => {
				cell.classList.remove('exploredpath')
				cell.classList.remove('subpath')
			})
			exploredPath.forEach(p => {
				document.getElementById(p).classList.add("exploredpath")
			});
		}

		else {
			const cells = document.querySelectorAll("[data-cell]")
			cells.forEach(cell => {
				cell.classList.remove('exploredpath')
				cell.classList.remove('subpath')
			})
			path.forEach(p => {
				document.getElementById(p).classList.add("subpath")
			});

		}
	}, [pathMode])

	function greedySearch(e) {
		// e.preventDefault()
		// path.forEach(cell => {
		// 	let c = document.getElementById(cell)
		// 	c.classList.remove('subpath')
		// 	c.classList.remove('exploredpath')
		// })
		let numCells = numCols * numRows
		let visited = []
		let explored = []
		let paths = [
			{
				path: [start],
				cost: getDistCellID(start, goal),
				index: 0
			}
		]

		if (start != -1 && goal != -1) {
			let found = false
			while (!found && paths.length != 0) {
				let curPath = getMinCost(paths)
				let curNode = (curPath.path[curPath.path.length - 1])
				paths = paths.slice(0, curPath.index).concat(paths.slice(curPath.index + 1))
				// curPath.path.forEach(cell => {
				// 	explored.push(cell)
				// });
				if (curNode != goal && !visited.includes(curNode)) {
					// explored.push(curNode)

					let up = curNode - numCols
					let down = curNode + numCols
					let left = curNode - 1
					let right = curNode + 1
					let upRight = curNode - numCols + 1
					let upLeft = curNode - numCols - 1
					let downRight = curNode + numCols + 1
					let downLeft = curNode + numCols - 1

					const appendPaths = (ID) => {
						if (ID > 0 && ID < numCells && !document.getElementById(ID).classList.contains("blocker") && !visited.includes(ID)) {
							paths.push({ path: curPath.path.concat([ID]), cost: getDistCellID(ID, goal) + 1 })
							// curPath.path.forEach(cell => {
							// 	explored.push(cell)
							// });

						}
					}

					appendPaths(up)
					appendPaths(down)
					appendPaths(left)
					appendPaths(right)
					if (hueristicMode == 0) {
						appendPaths(upRight)
						appendPaths(downRight)
						appendPaths(upLeft)
						appendPaths(downLeft)
					}

					visited.push(curNode)

				}

				else if (visited.includes(curNode) && curNode != goal) {

				}
				else {
					found = true
					setPath(curPath.path)
					setCost(curPath.path.length)
					paths.forEach(({ path }) => {
						path.forEach(cell => {
							explored.push(cell)
						});
					});
					setExploredPath(explored)

				}

			}
		}

	}

	function aStarSearch(e) {
		let numCells = numCols * numRows
		let visited = []
		let explored = []
		let paths = [
			{
				path: [start],
				cost: getDistCellID(start, goal),
				index: 0
			}
		]

		if (start != -1 && goal != -1) {
			let found = false
			while (!found && paths.length != 0) {
				let curPath = getMinCost(paths)
				let curNode = (curPath.path[curPath.path.length - 1])
				paths = paths.slice(0, curPath.index).concat(paths.slice(curPath.index + 1))
				if (curNode != goal && !visited.includes(curNode)) {

					let up = curNode - numCols
					let down = curNode + numCols
					let left = curNode - 1
					let right = curNode + 1
					let upRight = curNode - numCols + 1
					let upLeft = curNode - numCols - 1
					let downRight = curNode + numCols + 1
					let downLeft = curNode + numCols - 1

					const appendPaths = (ID) => {
						if (ID > 0 && ID < numCells && !document.getElementById(ID).classList.contains("blocker") && !visited.includes(ID)) {
							let temp = curPath.path.concat([ID])
							//(h(n) = g(n)
							paths.push({ path: temp, cost: getDistCellID(ID, goal) + temp.length })

						}
					}

					appendPaths(up)
					appendPaths(down)
					appendPaths(left)
					appendPaths(right)
					if (hueristicMode == 0) {
						appendPaths(upRight)
						appendPaths(downRight)
						appendPaths(upLeft)
						appendPaths(downLeft)
					}

					visited.push(curNode)
				}

				else if (visited.includes(curNode) && curNode != goal) {

				}
				else {
					found = true
					setPath(curPath.path)
					setCost(curPath.cost)
					paths.forEach(({ path }) => {
						path.forEach(cell => {
							explored.push(cell)
						});
					});
					setExploredPath(explored)

				}

			}
		}

	}

	function uniformSearch(e) {
		let numCells = numCols * numRows
		let visited = []
		let explored = []
		let paths = [
			{
				path: [start],
				cost: getDistCellID(start, goal),
				index: 0
			}
		]

		if (start != -1 && goal != -1) {
			let found = false
			while (!found && paths.length != 0) {
				let curPath = getMinCost(paths)
				let curNode = (curPath.path[curPath.path.length - 1])
				paths = paths.slice(0, curPath.index).concat(paths.slice(curPath.index + 1))
				if (curNode != goal && !visited.includes(curNode)) {

					let up = curNode - numCols
					let down = curNode + numCols
					let left = curNode - 1
					let right = curNode + 1
					let upRight = curNode - numCols + 1
					let upLeft = curNode - numCols - 1
					let downRight = curNode + numCols + 1
					let downLeft = curNode + numCols - 1

					const appendPaths = (ID) => {
						if (ID > 0 && ID < numCells && !document.getElementById(ID).classList.contains("blocker") && !visited.includes(ID)) {
							let temp = curPath.path.concat([ID])
							//(h(n) = g(n)
							paths.push({ path: temp, cost: temp.length })

						}
					}

					appendPaths(up)
					appendPaths(down)
					appendPaths(left)
					appendPaths(right)
					if (hueristicMode == 0) {
						appendPaths(upRight)
						appendPaths(downRight)
						appendPaths(upLeft)
						appendPaths(downLeft)
					}

					visited.push(curNode)
				}

				else if (visited.includes(curNode) && curNode != goal) {

				}
				else {
					found = true
					setPath(curPath.path)
					setCost(curPath.cost)
					paths.forEach(({ path }) => {
						path.forEach(cell => {
							explored.push(cell)
						});
					});
					setExploredPath(explored)

				}

			}
		}

	}

	useEffect(() => {
		animatePath2()
	}, [finalCost, path, exploredPath])

	async function animatePath() {
		selectAll(".subpath").classed("subpath", false)
		selectAll(".exploredpath").classed("exploredpath", false)
		let cell = 0
		if (pathMode) {
			let visited = []
			for (let i = 0; i < path.length; i++) {
				cell = path[i]
				cell = exploredPath[i]
				if (!visited.includes(cell)) {
					document.getElementById(cell).classList.add("subpath")
					await delay(100)
					visited.push(cell)

				}

			}

		}
		else {
			let visited = []
			for (let i = 0; i < exploredPath.length; i++) {
				cell = exploredPath[i]
				if (!visited.includes(cell)) {
					document.getElementById(cell).classList.add("exploredpath")
					await delay(10)
					visited.push(cell)
				}

			}
		}

	}

	async function animatePath2() {
		// if (path.length != 0 && exploredPath.length != 0) {
		selectAll(".subpath").classed("subpath", false)
		selectAll(".exploredpath").classed("exploredpath", false)
		let cell = 0
		let visited = []
		for (let i = 0; i < exploredPath.length; i++) {
			cell = exploredPath[i]
			if (!visited.includes(cell)) {
				// if (path.includes(cell)) {
				// 	document.getElementById(cell).classList.add("subpath")
				// }
				// else {
				document.getElementById(cell).classList.add("exploredpath")
				// document.getElementById(cell).classList.remove("border-[0.1px]")
				// }
				visited.push(cell)
				await delay(10)
			}

		}
		visited = []
		for (let i = 0; i < path.length; i++) {
			cell = path[i]
			// cell = exploredPath[i]
			if (!visited.includes(cell)) {
				document.getElementById(cell).classList.remove("exploredpath")
				document.getElementById(cell).classList.add("subpath")
				// document.getElementById(cell).classList.remove("border-[0.1px]")

				await delay(10)
				visited.push(cell)

			}

		}
		// }

	}

	function randomizeGrid(e) {
		e.preventDefault()
		const cells = document.querySelectorAll("[data-cell]")
		cells.forEach(cell => {
			let rand = Math.floor(Math.random() * 10)
			cell.classList.remove('blocker')
			if (rand >= 5) {
				cell.classList.add('blocker')

			}
		});
	}

	useEffect(() => {
		if (typeof document != 'undefined' && !isLoaded) {
			setNumRows(Math.floor(window.innerHeight / 40) + 1)
			setNumCols(Math.floor(window.innerWidth / 40))
			setLoaded(true)
		}
		else if (typeof document == 'undefined') {
			setLoaded(false)
		}
	}, [isLoaded])

	function getMinCost(paths) {
		let minPath = paths[0].path
		let minCost = paths[0].cost
		let index = 0
		let count = 0

		paths.forEach(subPath => {

			if (subPath.cost < minCost) {
				minCost = subPath.cost
				minPath = subPath.path
				index = count
			}
			count++
		});

		return {
			path: minPath,
			cost: minCost,
			index: index
		}
	}


	function getDistCellID(cell1, cell2) {
		let pos1 = {
			x: document.getElementById(cell1).getAttribute("x"),
			y: document.getElementById(cell1).getAttribute("y")
		}

		let pos2 = {
			x: document.getElementById(cell2).getAttribute("x"),
			y: document.getElementById(cell2).getAttribute("y")
		}

		if (hueristicMode == 0) {

			return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2))
		}

		else {
			return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y)
		}

	}

	function handleCellClick(e) {
		e.preventDefault()
		const cell = e.target
		if (!cell.classList.contains("start") && !cell.classList.contains("goal") && start == -1) {
			cell.classList.add("start")
			setStart(+cell.getAttribute("id"))
		}

		else if (!cell.classList.contains("goal") && !cell.classList.contains("start") && goal == -1) {
			cell.classList.add("goal")
			setGoal(+cell.getAttribute("id"))

		}

		else if (cell.classList.contains("blocker")) {
			cell.classList.remove("blocker")
			cell.classList.remove("subpath")
		}

		else if (!cell.classList.contains("blocker") && !cell.classList.contains("start") && !cell.classList.contains("goal")) {
			cell.classList.add("blocker")
			cell.classList.remove("subpath")
			cell.classList.remove("exploredpath")

		}

		// cell.classList.remove("subpath")
		// cell.classList.add("blocker")

	}

	function handleCellDrag(e) {
		e.preventDefault()
		const cell = e.target

		if (mouseDown && buildMode) {
			if (!cell.classList.contains("goal") && !cell.classList.contains("start") && !cell.classList.contains("blocker")) {
				cell.classList.remove("subpath")
				cell.classList.remove("exploredpath")
				cell.classList.add("blocker")
				setBuildMode(true)
			}
			else {
				cell.classList.remove("blocker")
				// setBuildMode(false)
			}
			// setMouseDown(false)
		}

		else if (mouseDown && !buildMode) {
			if (!cell.classList.contains("goal") &&
				!cell.classList.contains("start") && !cell.classList.contains("blocker")) {
				cell.classList.remove("subpath")
				cell.classList.remove("exploredpath")
				cell.classList.add("blocker")
				// setBuildMode(true)
			}
			else {
				cell.classList.remove("blocker")
				// setBuildMode(false)
			}
		}


	}

	function generateGrid() {


		let size = numCols * numRows
		let count = 0
		let divs = []

		let yIndex = 0
		while (count != size) {

			count % numCols == 0 ? yIndex++ : yIndex
			let pos = {
				x: count % numCols,
				y: yIndex
			}
			divs.push(<div key={count} id={count} x={pos.x} y={pos.y - 1} className="cell w-[40px] h-[40px] border-[0.1px]  m-0 p-0" data-cell onMouseEnter={handleCellDrag} onMouseDown={handleCellClick} ></div >)
			count += 1

		}
		// setNumCols(numcols)

		return (<>
			{divs.map(d => d)}
		</>)
	}

	function clearGrid(e) {
		e.preventDefault()
		const cells = document.querySelectorAll("[data-cell]")
		cells.forEach(cell => {
			cell.classList.remove('goal')
			cell.classList.remove('start')
			cell.classList.remove('blocker')
			cell.classList.remove('subpath')
			cell.classList.remove('exploredpath')
			// selectAll(".cell").style('background-color', 'white')
		})
		setStart(-1)
		setGoal(-1)
		setPath([])
		setExploredPath([])
		// toggleBuildMode()

	}

	function clearWalls(e) {
		e.preventDefault()
		const cells = document.querySelectorAll("[data-cell]")
		cells.forEach(cell => {
			cell.classList.remove('blocker')
		})
		// setStart(-1)
		// setGoal(-1)
		// setPath([])
		// setExploredPath([])
		// toggleBuildMode()
		filter == "aStar" ? aStarSearch(e) : filter == "greedy" ? greedySearch(e) : uniformSearch(e)
	}

	function clearPath(e) {
		e.preventDefault()
		const cells = document.querySelectorAll("[data-cell]")
		cells.forEach(cell => {
			cell.classList.remove('goal')
			cell.classList.remove('start')
			cell.classList.remove('subpath')
			cell.classList.remove('exploredpath')
		})
		setStart(-1)
		setGoal(-1)
		setPath([])
		setExploredPath([])

	}

	function toggleHueristic(e) {
		e.preventDefault()
		hueristicMode == 0 ? setHueristicMode(1) : setHueristicMode(0)
		// aStarSearch(e)
	}

	return (
		<div className="flex w-screen h-screen overflow-hidden">
			<div>
				<Head>
					<title>A Star Algorithm</title>
					{/* <meta name="description" /> */}
				</Head>
				{/* <input>Build Mode</input> */}
				<nav className="flex justify-items-start items-center bg-black h-24 w-screen overflow-hidden">

					<select name="Filter" id="Filter" defaultValue="aStar" required className="h-[50%] border border-slate-50 rounded bg-black ml-3 pl-2 pr-2 text-white hover:underline" onChange={() => {
						setFilter(document.getElementById('Filter').value)
					}}  >
						{/* <option value="none" disabled hidden>Select an Option</option> */}
						<option value="aStar">A * Search</option>
						<option value="greedy">Greedy Search</option>
						<option value="uniform">Uniform Search</option>
					</select>
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={filter == "aStar" ? aStarSearch : filter == "greedy" ? greedySearch : uniformSearch}>Search</button>
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={clearGrid}>Clear All</button>
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={clearWalls}>Clear Walls</button>
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={clearPath}>Clear Path</button>
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={randomizeGrid}>Randomize Grid</button>
					{/* <button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={togglePathMode}>{pathMode ? "Paths Mode" : "Explored Mode"}</button> */}
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={toggleHueristic}>{hueristicMode == 0 ? "Euclidean" : "Manhattan"}</button>
					<div>
						<h1 className="h-[50%] ml-3 pl-2 pr-2 text-white">Start: {start}</h1>
						<h1 className="h-[50%] ml-3 pl-2 pr-2  text-white">Goal: {goal}</h1>
					</div>
					<h1 className="h-[50%] ml-3 pl-2 text-white">Cost: {finalCost}</h1>

				</nav>
				<div className="board flex w-screen h-screen gap-0 justify-start items-start flex-wrap m-0 p-0 overflow-hidden" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)} id="board">
					{isLoaded ? generateGrid() : null}

				</div>

			</div>


		</div>
	)
}
