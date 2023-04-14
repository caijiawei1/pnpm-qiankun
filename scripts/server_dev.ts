import { readdirSync } from 'fs'
import { join } from 'path'
import { runCommand, step, args } from './utils'

const mainAppName = 'main'
const rootDir = join(__dirname, '../packages/')

async function dev(appName: string) {
  step(`[${appName}] Starting`)
  const runArgs = ['run', 'server:dev']
  await runCommand('pnpm', runArgs, join(rootDir, appName))
}

async function main() {
  const apps = readdirSync(rootDir)
  const { app } = args
  if (args.app) {
    if (apps.includes(app)) {
      await dev(args.app)
    }
  } else {
    await dev(mainAppName)
  }
}

main()

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
