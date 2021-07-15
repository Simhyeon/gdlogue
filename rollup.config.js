import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

export default {
    input: 'template/tree.js',
    output: {
        file: 'template/bundle.js',
        format: 'iife',
        name: 'bundle'
    },
	watch: {
		skipWrite: false,
		clearScreen: false,
		include: 'template/**/*',
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
