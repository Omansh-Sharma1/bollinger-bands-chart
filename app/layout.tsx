import "./globals.css";

export const metadata = {
  title: "FindScan",
  description: "Frontend Intern Assignment - Bollinger Bands with KLineCharts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">{children}</body>
    </html>
  );
}
