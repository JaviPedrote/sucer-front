import React, { memo } from 'react';
import { MdPostAdd } from "react-icons/md";


const ButtonAdd = memo(({ newPost }) => (
  <button onClick={newPost} className="cursor-pointer flex items-center justify-center rounded-lg bg-gradient-to-b from-amber-500 to-amber-600  dark:from-amber-200 dark:to-amber-400  dark:text-black text-white font-medium h-8 w-8 hover:bg-gradient-to-t transition-colors">
    <MdPostAdd />
  </button>
));

export default ButtonAdd;