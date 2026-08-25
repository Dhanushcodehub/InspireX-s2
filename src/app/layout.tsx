import '../index.css';
import '../style.css';
import ClientLayout from '../components/Layout';

export const metadata = {
  title: 'InspireX Season 2',
  description: 'Illuminating Minds, Building Bridges.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
