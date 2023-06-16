import { UnknownPageProps } from "$fresh/server.ts";

export default function NotFoundPage({ url }: UnknownPageProps) {
  return (
    <p className="px-4 h-screen flex items-center justify-center">
      There's nothing here.
    </p>
  );
}
