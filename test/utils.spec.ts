import { extensionsToGlob, slash, isDynamicRoute, isCatchAllRoute, pathToName } from '../src/utils'

describe('Utils', () => {
  test('Extensions to glob', () => {
    expect(extensionsToGlob(['vue', 'ts', 'js'])).toBe('{vue,ts,js}')
  })
  test('Normalize path', () => {
    expect(slash('C:\\project\\from\\someone')).toBe('C:/project/from/someone')
  })
  test('Dynamic route', () => {
    expect(isDynamicRoute('[id]')).toBe(true)
    expect(isDynamicRoute('_id', true)).toBe(true)
    expect(isDynamicRoute('me')).toBe(false)
  })
  test('Catch all route', () => {
      expect(isCatchAllRoute('_', true)).toBe(true)
      expect(isCatchAllRoute('_id', true)).toBe(false)
      expect(isCatchAllRoute('[id]')).toBe(false)
      expect(isCatchAllRoute('[...all]')).toBe(true)
  })
  test('Path to name', () => {
    expect(pathToName('user-[route]-current')).toBe('user_$route$_current')
  })
})
