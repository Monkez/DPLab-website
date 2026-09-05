const site = String(process.argv[2] || 'https://www.dtpt.shop').replace(/\/$/, '')
const paths = ['/', '/san-pham', '/tin-tuc']
let failed = false

for (const path of paths) {
  const response = await fetch(`${site}${path}`, { redirect: 'follow' })
  const html = await response.text()
  const checks = {
    status: response.ok,
    title: /<title>[^<]{10,}<\/title>/i.test(html),
    description: /<meta name="description" content="[^"]{40,}"/i.test(html),
    canonical: /<link rel="canonical" href="https?:\/\/[^\"]+"/i.test(html),
    jsonLd: /application\/ld\+json/i.test(html),
  }
  const errors = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name)
  console.log(`${errors.length ? 'FAIL' : 'PASS'} ${path}${errors.length ? `: ${errors.join(', ')}` : ''}`)
  if (errors.length) failed = true
}

for (const path of ['/robots.txt', '/sitemap.xml']) {
  const response = await fetch(`${site}${path}`)
  const body = await response.text()
  const valid = response.ok && (path.endsWith('robots.txt') ? /Sitemap:/i.test(body) : /<urlset/i.test(body))
  console.log(`${valid ? 'PASS' : 'FAIL'} ${path}`)
  if (!valid) failed = true
}

if (failed) process.exitCode = 1
