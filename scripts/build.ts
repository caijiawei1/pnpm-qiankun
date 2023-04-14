import { join } from 'path'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import fse from 'fs-extra'
import { runCommand, step, args } from './utils'

const mainAppName = 'main'
const deployDist = join(__dirname, '../dist')
const rootDir = join(__dirname, '../packages/')

fse.mkdirSync(deployDist, {
  recursive: true,
})

function getSubApps(appsList: string[]) {
  return appsList.filter((item: any) => ['sub'].includes(item))
}

function copyDist(dir: string, dest: string) {
  fse.copySync(dir, dest, {
    overwrite: true,
  })
}

async function build(appName: string) {
  step(`[${appName}] Building`)
  const runArgs = ['run', 'build']
  const cwd = join(rootDir, appName)
  await runCommand('pnpm', runArgs, join(rootDir, appName))
  copyDist(`${cwd}/dist`, `${deployDist}/${appName}`)
}

async function main() {
  const apps = fse.readdirSync(rootDir)
  const { app } = args
  if (args.app) {
    if (apps.includes(app)) {
      fse.removeSync(`${deployDist}/${args.app}`)
      await build(args.app)
    } else {
      // app not exist
    }
  } else {
    const subApps = getSubApps(apps)
    subApps.forEach(async (item) => {
      fse.removeSync(`${deployDist}/${item}`)
      await build(item)
    })
    fse.removeSync(`${deployDist}/${mainAppName}`)
    await build(mainAppName)
  }
}

main()

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})
