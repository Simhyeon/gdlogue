import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

export default {
    input: 'src/app.js',
    output: {
        file: 'bundle.js',
        format: 'iife',
        name: 'bundle'
    },
	watch: {
		skipWrite: false,
		clearScreen: false,
		include: 'src/**/*',
		//exclude: 'node_modules/**',
		// chokidar: {
		//     paths: 'src/**/*',
		//     usePolling: false
		// }
	},
	plugins: [
		replace({
			'process.env.NODE_ENV': JSON.stringify( 'development' )
		}),
		babel({
			presets: ["@babel/preset-react"],
		}),
		resolve(),
		commonjs()
    ]
}
