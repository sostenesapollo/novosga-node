import React from 'react';
import { Plus } from "lucide-react";

export const AddButtonCircle = React.forwardRef((props: any, ref) => (
    <button
        ref={ref}
        type="button"
        className="text-white bg-green-600 border border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
        {...props}
    >
      <Plus className="h-5 w-5" />
      <span className="sr-only">Icon description</span>
    </button>
));
