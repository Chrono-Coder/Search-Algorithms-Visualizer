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
	const [finalCost, setCost] = useState(0)
	const [hueristicMode, setHueristicMode] = useState(0)
	const [isLoaded, setLoaded] = useState(false)
	const [numCols, setNumCols] = useState(0)
	const [numRows, setNumRows] = useState(0)
	const [filter, setFilter] = useState('aStar')

	const delay = async (ms = 1000) => new Promise((resolve) => setTimeout(resolve, ms))

	useEffect(() => {
		if (typeof document != 'undefined' && !isLoaded) {
			setNumRows(Math.floor((window.innerHeight) / 40) + 1)
			setNumCols(Math.floor((window.innerWidth) / 40))
			setLoaded(true)
		}
		else if (typeof document == 'undefined') {
			setLoaded(false)
		}
	}, [isLoaded])

	function greedySearch(e) {
		if (start == -1) return
		let numCells = numCols * numRows
		let visited = []
		let explored = []
		let paths = [
			{
				path: [start],
				cost: getDistCellID(start, goal),
				index: 0,
			},
		]

		if (start != -1 && goal != -1) {
			let found = false
			while (!found && paths.length != 0) {
				let curPath = getMinCost(paths)
				let curNode = curPath.path[curPath.path.length - 1]
				paths.forEach(({ path }) => {
					path.forEach((cell) => {
						explored.push(cell)
					})
				})
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
						if (ID > 0 && ID < numCells && !document.getElementById(ID).classList.contains('blocker') && !visited.includes(ID)) {
							paths.push({ path: curPath.path.concat([ID]), cost: getDistCellID(ID, goal) })
						}
					}
					appendPaths(up)
					appendPaths(down)
					if (left > 0 && left < numCells && document.getElementById(left).getAttribute('x') != numCols - 1) {
						appendPaths(left)
					}
					if (right > 0 && right < numCells && document.getElementById(right).getAttribute('x') != 0) {
						appendPaths(right)
					}
					if (hueristicMode == 0) {
						if (upRight > 0 && upRight < numCells && document.getElementById(upRight).getAttribute('x') != 0) {
							appendPaths(upRight)
						}
						if (upLeft > 0 && upLeft < numCells && document.getElementById(upLeft).getAttribute('x') != numCols - 1) {
							appendPaths(upLeft)
						}
						if (downRight > 0 && downRight < numCells && document.getElementById(downRight).getAttribute('x') != 0) {
							appendPaths(downRight)
						}
						if (downLeft > 0 && downLeft < numCells && document.getElementById(downLeft).getAttribute('x') != numCols - 1) {
							appendPaths(downLeft)
						}
					}

					visited.push(curNode)
				}
				else if (visited.includes(curNode) && curNode != goal) {
					continue
				}
				else {
					found = true
					setPath(curPath.path)
					setCost(curPath.path.length)

					setExploredPath(explored)
				}
			}
		}
	}

	function aStarSearch(e) {
		if (start == -1) return
		let numCells = numCols * numRows
		let visited = []
		let explored = []
		let paths = [
			{
				path: [start],
				cost: getDistCellID(start, goal),
				index: 0,
			},
		]

		if (start != -1 && goal != -1) {
			let found = false
			while (!found && paths.length != 0) {
				let curPath = getMinCost(paths)
				let curNode = curPath.path[curPath.path.length - 1]
				paths.forEach(({ path }) => {
					path.forEach((cell) => {
						explored.push(cell)
					})
				})
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
						if (ID > 0 && ID < numCells && !document.getElementById(ID).classList.contains('blocker') && !visited.includes(ID)) {
							let temp = curPath.path.concat([ID])
							//(h(n) = g(n)
							paths.push({ path: temp, cost: getDistCellID(ID, goal) + temp.length })
						}
					}

					appendPaths(up)
					appendPaths(down)
					if (left > 0 && left < numCells && document.getElementById(left).getAttribute('x') != numCols - 1) {
						appendPaths(left)
					}
					if (right > 0 && right < numCells && document.getElementById(right).getAttribute('x') != 0) {
						appendPaths(right)
					}
					if (hueristicMode == 0) {
						if (upRight > 0 && upRight < numCells && document.getElementById(upRight).getAttribute('x') != 0) {
							appendPaths(upRight)
						}
						if (upLeft > 0 && upLeft < numCells && document.getElementById(upLeft).getAttribute('x') != numCols - 1) {
							appendPaths(upLeft)
						}
						if (downRight > 0 && downRight < numCells && document.getElementById(downRight).getAttribute('x') != 0) {
							appendPaths(downRight)
						}
						if (downLeft > 0 && downLeft < numCells && document.getElementById(downLeft).getAttribute('x') != numCols - 1) {
							appendPaths(downLeft)
						}
					}

					visited.push(curNode)
				}
				else if (visited.includes(curNode) && curNode != goal) {
					continue
				}
				else {
					found = true
					setPath(curPath.path)
					setCost(curPath.cost)

					setExploredPath(explored)
				}
			}
		}
	}

	function uniformSearch(e) {
		if (start == -1) return
		let numCells = numCols * numRows
		let visited = []
		let explored = []
		let paths = [
			{
				path: [start],
				cost: 0,
				index: 0,
			},
		]

		if (start != -1 && goal != -1) {
			let found = false
			while (!found && paths.length != 0) {
				let curPath = getMinCost(paths)
				let curNode = curPath.path[curPath.path.length - 1]
				// console.log(paths)
				paths.forEach(({ path }) => {
					path.forEach((cell) => {
						explored.push(cell)
					})
				})
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
					// console.log('Current Node: ', curNode)
					// // console.log('up:', up)
					// // console.log('down: ', down)
					// // console.log('left: ', left)
					// // console.log('right: ', right)
					// console.log('upRight: ', upRight)
					// console.log('upLeft: ', upLeft)
					// console.log('downRight: ', downRight)
					// console.log('downLeft: ', downLeft)
					const appendPaths = (ID) => {

						if (ID > 0 && ID < numCells && !document.getElementById(ID).classList.contains('blocker') && !visited.includes(ID)) {
							let temp = curPath.path.concat([ID])

							//(h(n) = 0, f(n) = g(n)
							paths.push({ path: temp, cost: temp.length })
						}
					}
					appendPaths(up)
					appendPaths(down)
					if (left > 0 && left < numCells && document.getElementById(left).getAttribute('x') != numCols - 1) {
						appendPaths(left)
					}
					if (right > 0 && right < numCells && document.getElementById(right).getAttribute('x') != 0) {
						appendPaths(right)
					}
					if (hueristicMode == 0) {
						if (upRight > 0 && upRight < numCells && document.getElementById(upRight).getAttribute('x') != 0) {
							appendPaths(upRight)
						} 
						if (upLeft > 0 && upLeft < numCells && document.getElementById(upLeft).getAttribute('x') != numCols - 1) {
							appendPaths(upLeft)
						}
						if (downRight > 0 && downRight < numCells && document.getElementById(downRight).getAttribute('x') != 0) {
							appendPaths(downRight)
						}
						if (downLeft > 0 && downLeft < numCells && document.getElementById(downLeft).getAttribute('x') != numCols - 1) {
							appendPaths(downLeft)
						}
					}

					visited.push(curNode)
				}
				else if (visited.includes(curNode) && curNode != goal) {
					continue
				}
				else {
					found = true
					setPath(curPath.path)
					setCost(curPath.cost)
					setExploredPath(explored)
					console.log(curPath.path)
				}
			}
		}
	}

	useEffect(() => {
		animatePath2()
	}, [finalCost, path, exploredPath])

	async function animatePath2() {
		selectAll('.subpath').classed('subpath', false).classed('animate-scale', false)
		selectAll('.exploredpath').classed('exploredpath', false).classed('animate-scale', false)
		let cell = 0
		let visited = []

		for (let i = 0; i < exploredPath.length; i++) {

			cell = exploredPath[i]
			if (!visited.includes(cell)) {
				document.getElementById(cell).classList.add('animate-scale')
				document.getElementById(cell).classList.add('exploredpath')
				visited.push(cell)
				await delay(20)
			}
			// setStart(prev => {
			// 	if (prev == -1)
			// 		i = 10000
			// })
		}
		visited = []
		selectAll('.exploredpath').classed('animate-scale', false)
		for (let i = 0; i < path.length; i++) {
			cell = path[i]
			if (!visited.includes(cell)) {
				document.getElementById(cell).classList.add('animate-scale')
				document.getElementById(cell).classList.remove('exploredpath')
				document.getElementById(cell).classList.add('subpath')

				await delay(20)
				visited.push(cell)
			}
		}
	}

	function randomizeGrid(e) {
		e.preventDefault()
		selectAll('.blocker').classed('animate-scale', false).classed('blocker', false)
		const cells = document.querySelectorAll('[data-cell]')
		cells.forEach((cell) => {
			let rand = Math.floor(Math.random() * 10)
			// cell.classList.remove('blocker')
			if (
				(!cell.classList.contains('start') && !cell.classList.contains('goal') && rand >= 7) ||
				cell.getAttribute('x') == 0 ||
				cell.getAttribute('y') == 0 ||
				cell.getAttribute('x') == numCols - 1 ||
				cell.getAttribute('y') == numRows - 2
			) {
				setTimeout(() => {
					cell.classList.add('animate-scale')

				}, 100)
				cell.classList.remove('animate-scale')

				cell.classList.add('blocker')

			}
		})
		filter == 'aStar' ? aStarSearch(e) : filter == 'greedy' ? greedySearch(e) : uniformSearch(e)
		// selectAll('.blocker').transition().duration(100).classed('animate-scale', true)

	}

	function getMinCost(paths) {
		let minPath = paths[0].path
		let minCost = paths[0].cost
		let index = 0
		let count = 0

		paths.forEach((subPath) => {
			if (subPath.cost < minCost) {
				minCost = subPath.cost
				minPath = subPath.path
				index = count
			}
			count++
		})

		return {
			path: minPath,
			cost: minCost,
			index: index,
		}
	}

	function getDistCellID(cell1, cell2) {
		let pos1 = {
			x: document.getElementById(cell1).getAttribute('x'),
			y: document.getElementById(cell1).getAttribute('y'),
		}

		let pos2 = {
			x: document.getElementById(cell2).getAttribute('x'),
			y: document.getElementById(cell2).getAttribute('y'),
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
		if (!cell.classList.contains('start') && !cell.classList.contains('goal') && start == -1) {
			cell.classList.add('start')
			setStart(+cell.getAttribute('id'))
		}
		else if (!cell.classList.contains('goal') && !cell.classList.contains('start') && goal == -1) {
			cell.classList.add('goal')
			setGoal(+cell.getAttribute('id'))
		}
		else if (cell.classList.contains('blocker')) {
			cell.classList.remove('animate-scale')
			cell.classList.remove('blocker')
			cell.classList.remove('subpath')
		}
		else if (!cell.classList.contains('blocker') && !cell.classList.contains('start') && !cell.classList.contains('goal')) {
			setTimeout(() => {
				cell.classList.add('animate-scale')
			}, 100)
			cell.classList.remove('animate-scale')

			cell.classList.add('blocker')
			cell.classList.remove('subpath')
			cell.classList.remove('exploredpath')
		}
	}

	function handleCellDrag(e) {
		e.preventDefault()
		const cell = e.target

		if (mouseDown && buildMode) {
			if (!cell.classList.contains('goal') && !cell.classList.contains('start') && !cell.classList.contains('blocker')) {
				cell.classList.remove('subpath')
				cell.classList.remove('exploredpath')
				cell.classList.add('blocker')
				setBuildMode(true)
			}
			else {
				// setTimeout(() => {
				// 	cell.classList.add('animate-scale')
				// }, 200)
				// cell.classList.remove('animate-scale')
				cell.classList.remove('blocker')
			}
		}
		else if (mouseDown && !buildMode) {
			if (!cell.classList.contains('goal') && !cell.classList.contains('start') && !cell.classList.contains('blocker')) {
				setTimeout(() => {
					cell.classList.add('animate-scale')
				}, 100)
				cell.classList.remove('animate-scale')
				cell.classList.remove('subpath')
				cell.classList.remove('exploredpath')
				cell.classList.add('blocker')
			}
			else {
				cell.classList.remove('blocker')
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
				y: yIndex,
			}

			divs.push(
				<div
					key={count}
					id={count}
					x={pos.x}
					y={pos.y - 1}
					className='cell w-[40px] h-[40px] border-[0.1px] border-gray-900 m-0 p-0'
					data-cell
					onMouseEnter={handleCellDrag}
					onMouseDown={handleCellClick}
				>{count}</div>
			)

			count += 1
		}
		return <>{divs.map((d) => d)}</>
	}

	function clearGrid(e) {
		e.preventDefault()
		const cells = document.querySelectorAll('[data-cell]')
		cells.forEach((cell) => {
			cell.classList.remove('goal')
			cell.classList.remove('start')
			cell.classList.remove('blocker')
			cell.classList.remove('subpath')
			cell.classList.remove('exploredpath')
		})
		setStart(-1)
		setGoal(-1)
		setPath([])
		setExploredPath([])
	}

	function clearWalls(e) {
		e.preventDefault()
		const cells = document.querySelectorAll('[data-cell]')
		cells.forEach((cell) => {
			cell.classList.remove('blocker')
		})

		filter == 'aStar' ? aStarSearch(e) : filter == 'greedy' ? greedySearch(e) : uniformSearch(e)
	}

	function clearPath(e) {
		e.preventDefault()
		const cells = document.querySelectorAll('[data-cell]')
		cells.forEach((cell) => {
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
		<div className='flex w-screen h-screen overflow-hidden'>
			<div>
				<Head>
					<title>A Star Algorithm</title>
				</Head>
				<div id='navbar' className='z-10 right-11 top-11 p-6 fixed flex-col bg-opacity-50 rounded-lg hover:bg-opacity-90 transition-all ease-in-out flex justify-items-start items-center gap-4 bg-blue-900 w-[10%] h-auto overflow-hidden'>
					<select
						name='Filter'
						id='Filter'
						defaultValue='aStar'
						required
						className='h-[50%] bg-blue-900 ml-3 pl-2 pr-2 bg-opacity-0 text-white hover:bg-opacity-90 hover:underline'
						onChange={() => {
							setFilter(document.getElementById('Filter').value)
						}}
					>
						<option value='aStar'>A * Search</option>
						<option value='greedy'>Greedy Search</option>
						<option value='uniform'>Uniform Search</option>
					</select>
					<button className='h-[50%]  ml-3 pl-2 pr-2 text-white hover:underline' onClick={filter == 'aStar' ? aStarSearch : filter == 'greedy' ? greedySearch : uniformSearch}>
						Search
					</button>
					<button className='h-[50%] ml-3 pl-2 pr-2 text-white hover:underline' onClick={clearGrid}>
						Clear All
					</button>
					<button className='h-[50%]  ml-3 pl-2 pr-2 text-white hover:underline' onClick={clearWalls}>
						Clear Walls
					</button>
					<button className='h-[50%]  ml-3 pl-2 pr-2 text-white hover:underline' onClick={clearPath}>
						Clear Path
					</button>
					<button className='h-[50%]  ml-3 pl-2 pr-2 text-white hover:underline' onClick={randomizeGrid}>
						Randomize Grid
					</button>
					<button className=' ml-3 pl-2 pr-2 text-white hover:underline' onClick={toggleHueristic}>
						{hueristicMode == 0 ? 'Euclidean' : 'Manhattan'}
					</button>
					<h1 className='ml-3 pl-2 pr-2 text-white'>Cost: {finalCost}</h1>
				</div>
				<div
					className='board flex w-screen h-screen gap-0 justify-start items-start flex-wrap m-0 p-0 overflow-hidden'
					onMouseDown={() => setMouseDown(true)}
					onMouseUp={() => setMouseDown(false)}
					id='board'
				>
					{isLoaded ? generateGrid() : null}
				</div>
			</div>
		</div>
	)
}
