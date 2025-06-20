import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import AntProvider from "./AntProvider";
import StyledComponentsRegistry from "./StyledComponentsRegistry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <StyledComponentsRegistry>
            <AntProvider>{children}</AntProvider>
          </StyledComponentsRegistry>
        </AntdRegistry>
      </body>
    </html>
  );
}
