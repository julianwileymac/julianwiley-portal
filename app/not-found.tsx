import Link from "next/link";
import { Button, Result } from "antd";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <Result
        status="404"
        title="404"
        subTitle="That page isn't here."
        extra={
          <Link href="/">
            <Button type="primary">Back to home</Button>
          </Link>
        }
      />
    </main>
  );
}
