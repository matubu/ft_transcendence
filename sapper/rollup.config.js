import resolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import svelte from 'rollup-plugin-svelte'
import { terser } from 'rollup-plugin-terser'
import typescript from '@rollup/plugin-typescript'
import config from 'sapper/config/rollup.js'
import pkg from './package.json'
import alias from '@rollup/plugin-alias'
import path from 'path'
import sveltePreprocess from 'svelte-preprocess'

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const preprocess = sveltePreprocess({
	sourceMap: dev,
	defaults: {
		script: "typescript"
	}
})

const onwarn = (warning, onwarn) =>
	(warning.code === 'MISSING_EXPORT' && /'preload'/.test(warning.message)) ||
	(warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) ||
	(warning.code === 'THIS_IS_UNDEFINED') ||
	onwarn(warning);

export default {
	client: {
		input: config.client.input().replace(/\.js$/, '.ts'),
		output: config.client.output(),
		plugins: [
			alias({
				resolve: ['.ts', '.svelte'],
				entries: [
					{ find: '@components', replacement: path.resolve(__dirname, 'src/components') },
					{ find: '@lib', replacement: path.resolve(__dirname, 'src') },
				]
			}),
			replace({
				preventAssignment: true,
				values:{
					'process.browser': true,
					'process.env.NODE_ENV': JSON.stringify(mode)
				},
			}),
			svelte({
				preprocess,
				compilerOptions: {
					dev,
					hydratable: true
				}
			}),
			resolve({
				browser: true,
				dedupe: ['svelte']
			}),
			commonjs(),
			typescript({ sourceMap: dev }),

			!dev && terser({
				module: true
			})
		],
		preserveEntrySignatures: false,
		onwarn
	},

	server: {
		input: { server: config.server.input().server.replace(/\.js$/, ".ts") },
		output: config.server.output(),
		plugins: [
			alias({
				resolve: ['.ts', '.svelte'],
				entries: [
					{ find: '@components', replacement: path.resolve(__dirname, 'src/components') },
					{ find: '@lib', replacement: path.resolve(__dirname, 'src') },
				]
			}),
			replace({
				preventAssignment: true,
				values:{
					'process.browser': false,
					'process.env.NODE_ENV': JSON.stringify(mode)
				},
			}),
			svelte({
				preprocess,
				compilerOptions: {
					dev,
					generate: 'ssr',
					hydratable: true
				},
				emitCss: false
			}),
			resolve({
				dedupe: ['svelte']
			}),
			typescript({ sourceMap: dev })
		],
		external: Object.keys(pkg.dependencies).concat(require('module').builtinModules),
		onwarn
	}
};