import { useMemo, useState } from "react";

function expensive() {
  console.log("some expensive tasks");
  return "data";
}

export default function SampleHook() {
  const [count, setCount] = useState(0);

  // const data = expensive();
  const data = useMemo(() => {
    return expensive();
  }, []);

  return (
    <div>
      <h1>SampleHook {count}</h1>
      <button onClick={() => setCount(count + 1)}>Button {data}</button>
    </div>
  );
}
