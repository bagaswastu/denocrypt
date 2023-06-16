import { Head } from "$fresh/runtime.ts";
import Identifier from "../islands/identifier.tsx";
import Text from "../islands/text.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>denocrypt</title>
      </Head>
      <Identifier />
      <main class="p-4 mx-auto h-screen max-w-screen-md flex flex-col gap-2 justify-center items-center">
        <img src="puzzle.jpg" alt="scanme" className="h-52 object-contain" />
        <Text text="Embrace the puzzle's path, and may fortune favor you." />
      </main>
      <p hidden>/decrypt.js</p>
    </>
  );
}
