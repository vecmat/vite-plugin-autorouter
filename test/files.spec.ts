import { join } from 'path'
import { slash } from '../src/utils'
import { resolveOptions } from '../src/options'
import { getPageFiles, getPageDirs } from '../src/files'

const options = resolveOptions({})
const testPagesDir = 'test/assets/pages'
const testDeepPagesDir = 'test/assets/deep-pages'

describe('Get files', () => {
  test('Pages file', async() => {
    const files = getPageFiles(testPagesDir, options)
    expect(files.sort()).toMatchSnapshot('page files')
  })
})

describe('Get page dirs', () => {
  test('With glob', async() => {
    const dir = slash(join(testDeepPagesDir, '**', 'pages'))
    const dirs = getPageDirs(dir, options.root, options.exclude)
    expect(dirs.sort()).toMatchSnapshot('glob dirs')
  })
})
