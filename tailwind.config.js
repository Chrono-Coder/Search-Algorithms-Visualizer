/** @type {import('tailwindcss').Config} */
// import module from 'module'

module.exports = {
	content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			gridTemplateColumns: {
				'tic-tac': 'repeat(60, auto)',
			},
			keyframes: {
				quickScale: { 
					'0%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(1.1)' },
					'50%': { transform: 'scale(1.2)' },
					'75%': { transform: 'scale(1.1)' },
					// '20%': { transform: 'scale(1.5)' },
					// '30%': { transform: 'scale(1.5)' },
					// '35%': { transform: 'scale(1.5)' },
					// '40%': { transform: 'scale(1.5)' },
					// '50%': { transform: 'scale(1.5)' },
					// '60%': { transform: 'scale(1.5)' },
					'100%': { transform: 'scale(1)' }
				}
			},
			animation: {
				'scale': 'quickScale 0.3s linear',
			}
		},
	},
	plugins: [],
}
