import '@/app/ui/global.css'
import { inter } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   <html lang="en">
  <body className={`${inter.className} antialiased min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 text-gray-100`}>
    {children}
  </body>
</html>
  );
}
