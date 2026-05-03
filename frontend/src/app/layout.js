import './globals.css';
import styles from './layout.module.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Tasker - Premium Task Manager',
  description: 'A beautifully designed, full-stack task manager application.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.appContainer}>
          <nav className={`${styles.navbar} glass-panel`}>
            <div className={styles.navBrand}>
              <div className={styles.logoMark}></div>
              <h1>Tasker</h1>
            </div>
            <div className={styles.navLinks}>
              <span>Premium Workspace</span>
            </div>
          </nav>
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
