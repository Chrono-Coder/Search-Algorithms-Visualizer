import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useState } from 'react'
import { selectAll, select } from 'd3'

export default function Home() {
	const [start, setStart] = useState(-1)
	const [goal, setGoal] = useState(-1)
	
	const [mouseDown, setMouseDown] = useState(false)
	const [isAnimating, setAnimating] = useState(0)
	const [isAnimating2, setAnimating2] = useState(1)
	const [animatingState, setAnimatingState] = useState(0)
	const [buildMode, setBuildMode] = useState(false)
	const [path, setPath] = useState([])
	const [exploredPath, setExploredPath] = useState([])
	const [finalCost, setCost] = useState(0)
	const [hueristicMode, setHueristicMode] = useState(0)
	const [isLoaded, setLoaded] = useState(false)
	const [numCols, setNumCols] = useState(0)
	const [numRows, setNumRows] = useState(0)
	const [filter, setFilter] = useState('aStar')

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

	useEffect(() => {
		if (path.length != 0) {
			if (isAnimating == 1)
				animatePathExplored()
			if (isAnimating == 2)
				animatePathExplored(1)
		}

	}, [isAnimating, path])


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
					let canDiagRight = false
					let canDiagLeft = false
					const appendPaths = (ID, position = '') => {
						let c = document.getElementById(ID)
						if (ID > 0 && ID < numCells && !c.classList.contains('blocker') && !visited.includes(ID)) {
							let temp = curPath.path.concat([ID])
							//(h(n) = g(n)
							if (position.includes('right') && c.getAttribute('x') != 0) {
								canDiagRight = true
								paths.push({ path: temp, cost: getDistCellID(ID, goal) })

							}
							else if (position.includes('left') && c.getAttribute('x') != numCols - 1) {
								canDiagLeft = true
								paths.push({ path: temp, cost: getDistCellID(ID, goal) })

							}
							else if (position == '')
								paths.push({ path: temp, cost: getDistCellID(ID, goal) })


						}
					}


					appendPaths(up)
					appendPaths(right, 'right')
					appendPaths(down)
					appendPaths(left, 'left')
					if (canDiagLeft) {
						appendPaths(upLeft)
						appendPaths(downLeft)
					}
					if (canDiagRight) {
						appendPaths(upRight)
						appendPaths(downRight)
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
					let canDiagRight = false
					let canDiagLeft = false
					const appendPaths = (ID, position = '') => {
						let c = document.getElementById(ID)
						if (ID > 0 && ID < numCells && !c.classList.contains('blocker') && !visited.includes(ID)) {
							let temp = curPath.path.concat([ID])
							//(h(n) = g(n)
							if (position.includes('right') && c.getAttribute('x') != 0) {
								canDiagRight = true
								paths.push({ path: temp, cost: getDistCellID(ID, goal) + temp.length })
							}
							else if (position.includes('left') && c.getAttribute('x') != numCols - 1) {
								canDiagLeft = true
								paths.push({ path: temp, cost: getDistCellID(ID, goal) + temp.length })
							}
							else if (position == '')
								paths.push({ path: temp, cost: getDistCellID(ID, goal) + temp.length })

						}
					}

					appendPaths(up)
					appendPaths(right, 'right')
					appendPaths(down)
					appendPaths(left, 'left')
					if (canDiagLeft) {
						appendPaths(upLeft)
						appendPaths(downLeft)
					}
					if (canDiagRight) {
						appendPaths(upRight)
						appendPaths(downRight)
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

					let canDiagRight = false
					let canDiagLeft = false
					const appendPaths = (ID, position = '') => {
						let c = document.getElementById(ID)
						if (ID > 0 && ID < numCells && !c.classList.contains('blocker') && !visited.includes(ID)) {
							let temp = curPath.path.concat([ID])
							//(h(n) = g(n)
							if (position.includes('right') && c.getAttribute('x') != 0) {
								canDiagRight = true
								paths.push({ path: temp, cost: temp.length })

							}
							else if (position.includes('left') && c.getAttribute('x') != numCols - 1) {
								canDiagLeft = true
								paths.push({ path: temp, cost: temp.length })

							}
							else if (position == '')
								paths.push({ path: temp, cost: temp.length })


						}
					}

					appendPaths(up)
					appendPaths(right, 'right')
					appendPaths(down)
					appendPaths(left, 'left')
					if (canDiagLeft) {
						appendPaths(upLeft)
						appendPaths(downLeft)
					}
					if (canDiagRight) {
						appendPaths(upRight)
						appendPaths(downRight)
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
					// console.log(curPath.path)
				}
			}
		}
	}

	function depthFirstSearch(e) {
		if (start == -1) return
		let numCells = numCols * numRows
		let visited = []
		let explored = []
		let nodeStack = [start]
		let pathStack = [{
			path: [start]
		}
		]

		let found = false
		while (!found && nodeStack.length != 0) {
			pathStack.forEach(({ path }) => {
				path?.forEach(node => {
					explored.push(node)
				})
			})

			let curPath = pathStack.pop().path
			let curNode = nodeStack.pop()//curPath[curPath.length - 1]
			// console.log("popped")
			// console.log(pathStack)
			// console.log(curNode)
			if (!visited.includes(curNode)) {
				visited.push(curNode)

				if (curNode == goal) {
					found = true
					setPath(curPath)
					setCost(curPath.length)
					setExploredPath(explored)
				}
				// else {//(curNode != goal && !visited.includes(curNode))
				let up = curNode - numCols
				let down = curNode + numCols
				let left = curNode - 1
				let right = curNode + 1
				let upRight = curNode - numCols + 1
				let upLeft = curNode - numCols - 1
				let downRight = curNode + numCols + 1
				let downLeft = curNode + numCols - 1
				let canDiagRight = false
				let canDiagLeft = false

				const appendPaths = (ID, position = '') => {
					let c = document.getElementById(ID)
					if (ID > 0 && ID < numCells && !c.classList.contains('blocker')) { //&& !visited.includes(ID)
						let temp = [...curPath]
						temp.push(ID)

						if (position.includes('right') && c.getAttribute('x') != 0) {
							canDiagRight = true
							pathStack.push({ path: temp })
							nodeStack.push(ID)
						}
						else if (position.includes('left') && c.getAttribute('x') != numCols - 1) {
							canDiagLeft = true
							pathStack.push({ path: temp })
							nodeStack.push(ID)

						}
						else if (position == '') {
							pathStack.push({ path: temp })
							nodeStack.push(ID)
						}

						// console.log(pathStack)

					}
				}
				// if (hueristicMode == 1) {
					appendPaths(up)
					appendPaths(right, 'right')
					appendPaths(down)
					appendPaths(left, 'left')
				// }

				// else {
				// 	if (canDiagRight) {
				// 		appendPaths(up)
				// 		appendPaths(right, 'right')
				// 		appendPaths(upRight)
				// 		appendPaths(downRight)
				// 		appendPaths(down)
				// 		appendPaths(left, 'left')

				// 		if (canDiagLeft) {
				// 			appendPaths(upLeft)
				// 			appendPaths(downLeft)
				// 		}
				// 		appendPaths(left, 'left')
				// 	}

				// }
				// console.log("Paths")
				// console.log(pathStack)
				// console.log("Nodes")
				// console.log(nodeStack)


			}
		}
	}

	let counter = animatingState
	function animatePathExplored(animation = 0) {
		let cell = 0
		// console.log(isAnimating)
		if (isAnimating == 1 && animation == 0) {


			if (isAnimating == 1 && counter == 0) {
				selectAll('.subpath').classed('subpath', false).classed('animate-scale', false)
				selectAll('.exploredpath').classed('exploredpath', false).classed('animate-scale', false)
			}
			let newExplored = new Set(exploredPath)
			newExplored = [...newExplored]

			const timer1 = setInterval(() => {
				setAnimating(prev => {
					if (prev <= 0) {
						setAnimatingState(counter)
						clearInterval(timer1)
						// if (animation == 0 || prev == 1)
						// 	return 0
						// else
						return 0
					}

					if (prev == 1) {
						cell = newExplored[counter]
						let element = document.getElementById(cell)

						if (!element.classList.contains('exploredpath')) {
							element.classList.add('animate-scale')
							element.classList.add('exploredpath')

						}
						counter += 1

						if (counter == newExplored.length - 1) {
							setAnimatingState(0)
							selectAll('.exploredpath').classed('animate-scale', false)
							counter = 0
							setAnimating(2)
							animatePathExplored(1)
							return 2
						}

					}

					return prev
				})


			}, 40)
		}
		else if (isAnimating == 2 && animation == 1) {
			const timer2 = setInterval(() => {
				setAnimating(prev => {
					if (prev <= 0) { //pause state
						setAnimatingState(counter)
						clearInterval(timer2)
						return -2
					}

					if (prev == 2) {
						cell = path[counter]
						let element = document.getElementById(cell)

						if (!element.classList.contains('subpath')) {
							element.classList.remove('exploredpath')
							element.classList.add('animate-scale')
							element.classList.add('subpath')

						}
						counter += 1

						if (counter == path.length - 1) {
							setAnimating(0)
							setAnimatingState(0)
							counter = 0
							clearInterval(timer2)
							return 0
						}


					}

					return prev
				})


			}, 80)
		}
		/*					else {
					cell = path[counter]
					let element = document.getElementById(cell)
	
					if (!element.classList.contains('subpath')) {
						element.classList.remove('exploredpath')
						element.classList.add('animate-scale')
						element.classList.add('subpath')
	
					}
					counter += 1
	
					if (counter == path.length - 1) {
						setAnimating(0)
						setAnimatingState(0)
						counter = 0
						animation = 0
						clearInterval(timer1)
					}
	
				}*/


	}

	// function animatePathExplored(animation = 0) {
	// 	let cell = 0
	// 	if (isAnimating == 1 && animation == 0) {

	// 		if (isAnimating == 1 && counter == 0) {
	// 			selectAll('.subpath').classed('subpath', false).classed('animate-scale', false)
	// 			selectAll('.exploredpath').classed('exploredpath', false).classed('animate-scale', false)
	// 		}
	// 		let newExplored = new Set(exploredPath)
	// 		newExplored = [...newExplored]

	// 		const timer1 = setInterval(() => {
	// 			setAnimating(prev => {
	// 				if (prev <= 0) {
	// 					setAnimatingState(counter)
	// 					clearInterval(timer1)
	// 					return 0
	// 				}

	// 				if (prev == 1) {
	// 					cell = newExplored[counter]
	// 					let element = document.getElementById(cell)

	// 					if (!element.classList.contains('exploredpath')) {
	// 						element.classList.add('animate-scale')
	// 						element.classList.add('exploredpath')

	// 					}
	// 					counter += 1

	// 					if (counter == newExplored.length - 1) {
	// 						setAnimatingState(0)
	// 						selectAll('.exploredpath').classed('animate-scale', false)
	// 						counter = 0
	// 						setAnimating(2)
	// 						animatePathExplored(1)
	// 						return 2
	// 					}

	// 				}

	// 				return prev
	// 			})


	// 		}, 30)
	// 	}
	// 	else if (isAnimating == 2 && animation == 1) {
	// 		const timer2 = setInterval(() => {
	// 			setAnimating(prev => {
	// 				if (prev <= 0) { //pause state
	// 					setAnimatingState(counter)
	// 					clearInterval(timer2)
	// 					return -2
	// 				}

	// 				if (prev == 2) {
	// 					cell = path[counter]
	// 					let element = document.getElementById(cell)

	// 					if (!element.classList.contains('subpath')) {
	// 						element.classList.remove('exploredpath')
	// 						element.classList.add('animate-scale')
	// 						element.classList.add('subpath')

	// 					}
	// 					counter += 1

	// 					if (counter == path.length - 1) {
	// 						setAnimating(0)
	// 						setAnimatingState(0)
	// 						counter = 0
	// 						clearInterval(timer2)
	// 						return 0
	// 					}

	// 				}

	// 				return prev
	// 			})

	// 		}, 50)
	// 	}
	// }

	function animateFinalPath() {
		let cell = 0
		let counter = animatingState
		if (animatingState > path.length - 1)
			counter = 0
		// if (isAnimating == 2 && counter == 0)
		selectAll('.exploredpath').classed('animate-scale', false)
		const timer2 = setInterval(() => {
			cell = path[counter]

			document.getElementById(cell).classList.remove('exploredpath')
			document.getElementById(cell).classList.add('animate-scale')
			document.getElementById(cell).classList.add('subpath')
			if (counter == path.length - 1) {
				setAnimating(0)
				setAnimating2(0)
				setAnimatingState(0)
				clearInterval(timer2)
			}
			setAnimating2(prev => {
				if (prev == 0) {
					setAnimatingState(counter)
					clearInterval(timer2)
					return 2
				}
				// else if (prev == -1) {
				// 	selectAll('.subpath').classed('subpath', false).classed('animate-scale', false)
				// 	selectAll('.exploredpath').classed('exploredpath', false).classed('animate-scale', false)
				// 	clearInterval(timer2)
				// 	return 0
				// }
				return prev
			})
			counter += 1
		}, 60)
	}

	function randomizeGrid(e) {
		e.preventDefault()
		selectAll('.blocker').classed('animate-scale', false).classed('blocker', false)
		const cells = document.querySelectorAll('[data-cell]')
		cells.forEach((cell) => {
			let rand = Math.floor(Math.random() * 10)
			// cell.classList.remove('blocker')
			if (
				(!cell.classList.contains('start') && !cell.classList.contains('goal') && rand >= 7) //||
				// cell.getAttribute('x') == 0 ||
				// cell.getAttribute('y') == 0 ||
				// cell.getAttribute('x') == numCols - 1 ||
				// cell.getAttribute('y') == numRows - 2
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
				>{ }</div>
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
			// cell.classList.remove('blocker')
			// cell.classList.remove('subpath')
			// cell.classList.remove('exploredpath')
		})
		setStart(-1)
		setGoal(-1)
		setPath([])
		setExploredPath([])
		selectAll('.subpath').classed('subpath', false).classed('animate-scale', false)
		selectAll('.exploredpath').classed('exploredpath', false).classed('animate-scale', false)
		selectAll('.blocker').classed('blocker', false).classed('animate-scale', false)
		setAnimating(0)
		setAnimatingState(0)
	}

	function clearWalls(e) {
		e.preventDefault()
		let blockers = selectAll('.blocker')
		if (blockers.node()) {
			blockers.classed('blocker', false).classed('animate-scale', false)
			if (isAnimating != 1) {
				filter == 'aStar' ? aStarSearch(e) : filter == 'greedy' ? greedySearch(e) : uniformSearch(e)
				setAnimating(1)
			}

		}

	}

	function clearPath(e = false) {
		e ? e.preventDefault() : e

		//select('.goal').classed('goal', false).classed('animate-scale', false)
		//select('.start').classed('start', false).classed('animate-scale', false)

		// setStart(-1)
		// setGoal(-1)
		setPath([])
		setAnimating(0)
		setAnimatingState(0)
		setExploredPath([])
		selectAll('.subpath').classed('subpath', false).classed('animate-scale', false)
		selectAll('.exploredpath').classed('exploredpath', false).classed('animate-scale', false)
		// selectAll('.blocker').classed('blocker', false).classed('animate-scale', false)

	}

	function toggleHueristic(e) {
		e.preventDefault()
		hueristicMode == 0 ? setHueristicMode(1) : setHueristicMode(0)
		// aStarSearch(e)
	}

	function beginSearch(e) {
		e.preventDefault()

		if (isAnimating <= 0 && isAnimating > -2) {
			filter == 'aStar' ? aStarSearch(e) : filter == 'greedy' ? greedySearch() : filter == 'uniform' ? uniformSearch() : depthFirstSearch()
			setAnimating(1)
		}
		else if (isAnimating == -2) {
			setAnimating(2)

		}
		else if (isAnimating == 1 || isAnimating == -1) {
			setAnimating(0)
		}
		else if (isAnimating == 2) {
			setAnimating(-2)
		}

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
						className='h-[50%] bg-blue-900 w-[98%] bg-opacity-0 text-white hover:bg-opacity-90 hover:underline'
						onChange={() => {
							setFilter(document.getElementById('Filter').value)
						}}
					>
						<option value='aStar'>A * Search</option>
						<option value='greedy'>Greedy Search</option>
						<option value='uniform'>Uniform Search</option>
						<option value='dfs'>Depth First Search</option>
					</select>

					<button className='h-[50%]  ml-3 pl-2 pr-2 text-white hover:underline' onClick={beginSearch}>
						{isAnimating == 0 || isAnimating2 == 1 ? 'Start Search' : 'Pause Search'}
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
