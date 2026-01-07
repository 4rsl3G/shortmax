import "./globals.css"

export const metadata = {
  title: "DraShort",
  description: "Short drama app",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        {/* Remix Icon CDN */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css"
        />
        {/* optional perf */}
        <link rel="preconnect" href="https://akamai-static.shorttv.live" />
        <link rel="dns-prefetch" href="https://akamai-static.shorttv.live" />
      </head>
      <body>{children}</body>
    </html>
  )
}