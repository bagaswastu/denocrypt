import { useEffect, useRef, useState } from "preact/hooks";

const letters = "!@#$%^&*_";

interface Props {
  text: string;
}

export default function Text({ text: title }: Props) {
  // deno-lint-ignore no-explicit-any
  const intervalRef = useRef<any>(null);
  const [currentTitle, setCurrentTitle] = useState("_");

  useEffect(() => {
    let iteration = 0;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentTitle(() => {
        let newTitle = "";

        for (let i = 0; i < title.length; i++) {
          if (i < iteration) {
            newTitle += title[i];
          } else if (i < Math.min(iteration + 5, title.length)) {
            const randomChar =
              letters[Math.floor(Math.random() * letters.length)];
            newTitle += `<span>${randomChar}</span>`;
          } else {
            newTitle += " ";
          }
        }

        return newTitle;
      });

      iteration += 1 / 2;

      if (iteration >= title.length) {
        clearInterval(intervalRef.current);
      }
    }, 5);

    return () => clearInterval(intervalRef.current);
  }, [title]);

  return <p className="font-mono text-center" dangerouslySetInnerHTML={{ __html: currentTitle }} />;
}
