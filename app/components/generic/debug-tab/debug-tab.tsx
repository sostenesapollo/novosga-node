import { env } from "@/root";
import { useState } from "react";
import { order } from "../../orders/order";
import { useSignals } from "@preact/signals-react/runtime";

export default function DebugTab() {
  const [open, setOpen] = useState(true);
  useSignals();

  return (
    <>
      {open ? (
        <span
          className="cursor-pointer absolute bottom-0 z-50 bg-yellow-200 text-black min-h-[300px] max-w-[300px] overflow-auto max-h-[500px]"
          style={{ zIndex: 1000 }}
        >
          <span onClick={() => setOpen(false)}>Close</span>

          {/* <pre>{JSON.stringify(env.value, null, 2)}</pre> */}
          <pre>{JSON.stringify(order.value, null, 2)}</pre>
        </span>
      ) : (
        <span className="cursor-pointer absolute bottom-0 z-50 bg-yellow-200 text-black min-h-[10px] min-w-[10px]">
          <span onClick={() => setOpen(true)}>Open dev tools</span>
        </span>
      )}
    </>
  );
}
