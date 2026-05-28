import { chromium } from 'playwright'

const base = 'http://localhost:3000'

;(async () => {
  const browser = await chromium.launch({ headless: true })

  // Mobile view
  const mobile = await browser.newPage()
  await mobile.setViewportSize({ width: 390, height: 844 })
  await mobile.goto(`${base}/game`)
  await mobile.waitForTimeout(800)
  await mobile.screenshot({ path: 'artifacts/poop-dodge/evidence/mobile-start.png' })

  await mobile.click('button:has-text("시 작")')
  await mobile.waitForTimeout(2000)
  await mobile.screenshot({ path: 'artifacts/poop-dodge/evidence/mobile-playing.png' })
  await mobile.close()

  // Desktop view
  const desktop = await browser.newPage()
  await desktop.setViewportSize({ width: 1440, height: 900 })
  await desktop.goto(`${base}/game`)
  await desktop.waitForTimeout(800)
  await desktop.screenshot({ path: 'artifacts/poop-dodge/evidence/desktop-start.png' })

  await desktop.click('button:has-text("시 작")')
  await desktop.waitForTimeout(2500)
  await desktop.screenshot({ path: 'artifacts/poop-dodge/evidence/desktop-playing.png' })
  await desktop.close()

  await browser.close()
  console.log('done')
})()
