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

	const delay = async (ms = 1000) =>
		new Promise(resolve => setTimeout(resolve, ms))
	const numCells = 1500
	const numCols = 60

	useEffect(() => {
		if (!pathMode) {
			const cells = document.querySelectorAll("[data-cell]")
			cells.forEach(cell => {
				cell.classList.remove('exploredpath')
				cell.classList.remove('subpath')
			})
			path.forEach(p => {
				document.getElementById(p).classList.add("subpath")
			});

		}

		else {
			const cells = document.querySelectorAll("[data-cell]")
			cells.forEach(cell => {
				cell.classList.remove('exploredpath')
				cell.classList.remove('subpath')
			})
			exploredPath.forEach(p => {
				document.getElementById(p).classList.add("exploredpath")
			});

		}
	}, [pathMode])

	function aStarSearch(e) {
		e.preventDefault()
		path.forEach(cell => {
			let c = document.getElementById(cell)
			c.classList.remove('subpath')
			c.classList.remove('exploredpath')
		})
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
					explored.push(curNode)

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
							paths.push({ path: curPath.path.concat([ID]), cost: getDistCellID(ID, goal) })
						}
					}

					appendPaths(up)
					appendPaths(down)
					appendPaths(left)
					appendPaths(right)
					if (hueristicMode == 0) {
						appendPaths(upRight)
						appendPaths(upLeft)
						appendPaths(downRight)
						appendPaths(downLeft)
					}



					visited.push(curNode)
				}
				else if (visited.includes(curNode)) {

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
	async function animatePath() {
		let cell = 0
		if (pathMode) {
			for (let i = 0; i < path.length; i++) {
				cell = path[i]
				document.getElementById(cell).classList.add("subpath")
				await delay(100)

			}

		}
		else {
			for (let i = 0; i < exploredPath.length; i++) {
				cell = exploredPath[i]
				document.getElementById(cell).classList.add("exploredpath")
				await delay(1)

			}
		}

		// let count = 0
		// selectAll("svg").remove()
		// selectAll(".subpath").append("svg").attr("id", `cell-${count++}`)


	}

	useEffect(() => {
		if (path.length != 0)
			animatePath()
	}, [path])

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

	// function getDist(x1, x2, y1, y2) {
	// 	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
	// }

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
		// if (!buildMode) {
		if (!cell.classList.contains("start") && start == -1) {
			cell.classList.add("start")
			setStart(+cell.getAttribute("id"))
		}
		else if (!cell.classList.contains("goal") && goal == -1) {
			cell.classList.add("goal")
			setGoal(+cell.getAttribute("id"))
			let checkbox = document.getElementById("buildmode")
			checkbox.click()
		}
		else if (cell.classList.contains("blocker")) {
			cell.classList.remove("blocker")
			cell.classList.remove("subpath")
		}
		else if (!cell.classList.contains("blocker")) {
			cell.classList.add("blocker")
			cell.classList.remove("subpath")
		}

		// cell.classList.remove("subpath")
		// cell.classList.add("blocker")

	}

	function handleCellDrag(e) {
		e.preventDefault()
		const cell = e.target
		if (mouseDown) {

			if (!cell.classList.contains("goal") && !cell.classList.contains("start")) {
				cell.classList.remove("subpath")
				cell.classList.add("blocker")
			}
			else if (cell.classList.contains("blocker")) {
				cell.classList.remove("blocker")
			}
		}


	}

	function generateGrid(size) {
		let count = 0
		let divs = []

		let yIndex = 0
		while (count != size) {

			count % 60 == 0 ? yIndex++ : yIndex
			let pos = {
				x: count % 60,
				y: yIndex
			}
			divs.push(<div key={count} id={count} x={pos.x} y={pos.y - 1} className="cell flex justify-center items-center relative w-[30px] h-[30px] border-[0.1px] border-black" data-cell onMouseEnter={handleCellDrag} onMouseDown={handleCellClick} ></div >)
			count += 1

		}
		return (<>
			{divs.map(d => d)}
		</>)
	}

	function toggleBuildMode() {
		buildMode ? setBuildMode(false) : setBuildMode(true)
	}

	function togglePathMode(e) {
		e.preventDefault()
		pathMode ? setPathMode(false) : setPathMode(true)
		// animatePath()
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
		let checkbox = document.getElementById("buildmode")
		checkbox.click()
		toggleBuildMode()

	}
	function toggleHueristic(e) {
		e.preventDefault()
		hueristicMode == 0 ? setHueristicMode(1) : setHueristicMode(0)
		// aStarSearch(e)
	}
	return (
		<div className="flex-col flex">
			<div>
				<Head>
					<title>A Star Algorithm</title>
					{/* <meta name="description" /> */}
				</Head>
				{/* <input>Build Mode</input> */}
				<nav className="flex p-5 justify-items-start items-center bg-black h-24 w-screen">
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={aStarSearch}>Begin</button>
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={clearGrid}>Clear</button>
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={togglePathMode}>{pathMode ? "Paths Mode" : "Explored Mode"}</button>
					<button className="h-[50%] border border-slate-50 rounded ml-3 pl-2 pr-2 text-white hover:underline" onClick={toggleHueristic}>{hueristicMode == 0 ? "Euclidean" : "Manhattan"}</button>
					{/* <label type="checkbox" className="h-[50%] text-white m-3 " htmlFor="buildmode">Build Mode</label> */}
					{/* <input id="buildmode" type="checkbox" className="h-[50%]" onClick={() => toggleBuildMode()}></input> */}
					<div>
						<h1 className="h-[50%] ml-3 pl-2 pr-2 text-white">Start: {start}</h1>
						<h1 className="h-[50%] ml-3 pl-2 pr-2  text-white">Goal: {goal}</h1>
					</div>
					<h1 className="h-[50%] ml-3 pl-2 text-white">Cost: {finalCost}</h1>
					{/* <ul className="h-[50%] w-80 ml-3 pl-2 pr-2 flex gap-2 text-white">
						{path.map(cell => {
							return <li key={cell}>{cell},</li>
						})}
					</ul> */}
				</nav>
				<div className="board grid w-screen h-screen justify-center content-center items-center grid-cols-tic-tac m-0 p-0" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)} id="board">
					{generateGrid(numCells)}

				</div>

			</div>


		</div>
	)
}
