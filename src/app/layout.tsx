import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntProvider from "./AntProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <AntProvider>{children}</AntProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
