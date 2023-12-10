import * as fs from 'fs/promises'
import { rollup } from 'rollup'
import typescript from '@rollup/plugin-typescript'

await build('src','dist')

async function build(srcDir,dstDir) {
	await cleanupDirectory(dstDir)
	await buildJs(srcDir,dstDir)
	await fs.copyFile(`${srcDir}/index.html`,`${dstDir}/index.html`)
}

async function cleanupDirectory(dir) {
	await fs.mkdir(dir,{recursive:true})
	for (const filename of await fs.readdir(dir)) { // delete contents instead of the whole dir because live server doesn't like the dir disappearing
			await fs.rm(`${dir}/${filename}`,{recursive:true,force:true})
	}
}

async function buildJs(srcDir,dstDir) {
	const plugins=[typescript()]
	const bundle=await rollup({
			input: `${srcDir}/index.ts`,
			plugins
	})
	bundle.write({
			file: `${dstDir}/index.js`,
	})
	bundle.close()
}
