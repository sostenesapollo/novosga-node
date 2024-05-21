import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Snackbar() {
  return (
    <div>
      <ToastContainer position="bottom-right" stacked />
    </div>
  );
}

export const notify = toast;
