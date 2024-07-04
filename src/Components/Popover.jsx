import React from "react";

function Popover() {
  return (
    <React.Fragment>
      <div
        data-popover
        id="popover-hover"
        role="tooltip"
        className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
      >
        <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Field Instruction
          </h3>
        </div>
        <div className="px-3 py-2">
          <p>
            Double-check your spelling for accuracy before typing to ensure
            error-free input.
          </p>
        </div>
        <div data-popper-arrow></div>
      </div>
    </React.Fragment>
  );
}

export default Popover;
