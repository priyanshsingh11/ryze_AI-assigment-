export const metadata = {
    title: 'Ryze AI UI Generator',
    description: 'Deterministic AI-powered UI Generator',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif' }}>
                {children}
            </body>
        </html>
    )
}
