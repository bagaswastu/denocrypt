import { useEffect } from "preact/hooks";

export default function Identifier() {
  useEffect(() => {
    fetch("/api/register", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, []);

  return <></>;
}
