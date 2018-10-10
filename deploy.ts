import * as execa from "execa"
import * as waitOn from "wait-on"
import { unlink, } from "fs-extra"
import chalk from 'chalk'
const start = async () => {
	const args = process.argv.slice(2)
	const force = args[0] && /(-f|--force)/.test(args[0])

	const deploy = execa('./node_modules/.bin/prisma',
	['deploy', force?'--force':null],
	 {stdio: 'inherit'}
	 )
	try{
		await deploy
		// await new Promise(res=>{
		// 	process.stdout.on('data', (data)=>{
		// 		data.toString().includes('endpoint is live') && res()
		// 	})
		// })
	} catch(e) {
		console.log(
			chalk.red('To force deploy, use ') +
			chalk.bold.red('npm run deploy:force')
		)
		process.env
		process.exit(1)
	}
	console.time('took')
	try{
		await Promise.all([
			// unlink('./generated/prisma.graphql'),
			unlink('./generated/prisma.ts')
		])
	} catch(e) {
		console.log('no existing generated/prisma.graphql')
	}
	const generate = execa('./node_modules/.bin/graphql', ['get-schema', '-p', 'database'], {stdio:'pipe'})
	generate.stdout.on('data', (data)=>{
		console.log('\n' + data.toString())
		if (data.toString().includes('No changes')) {
			generate.kill('SIGKILL')
		}
	})
	// await generate
	const codegen = execa('./node_modules/.bin/graphql', ['codegen', '-p', 'database'], {stdio:'inherit'})
	await waitOn({resources: [
		'./generated/prisma.ts'
	]})
	codegen.kill('SIGKILL')
	// await new Promise(res=>setTimeout(res, 500))
	// await codegen
	console.timeEnd('took')
}

start()