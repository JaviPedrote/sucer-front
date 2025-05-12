import { memo, useContext } from 'react';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { isCancelledError } from '@tanstack/react-query';
import { AuthContext } from '../../context/AuthContext';


export const PostCard = memo(({ post, askEditPost, askDeletePost }) => {
  const { user } = useContext(AuthContext);

  if (!post) return null;
  const isCardAdmin = post?.user?.id===1;
  


  return (
    <div className="space-y-2 rounded-lg outline outline-slate-300 p-4 shadow-sm dark:outline-slate-600 dark:bg-slate-800 relative mb-8">
      <div className="flex justify-between">
         {(!isCardAdmin || user.id==1) &&  <button onClick={() => askEditPost(post)} disabled={isCardAdmin} className="absolute right-1 top-1 rounded-tr-lg rounded  bg-blue-600 px-1.5 py-0.5 text-xs font-semibold text-white hover:bg-blue-700">
          <AiFillEdit className="h-7 w-5" />
        </button>}
       
      <span><strong>Escrito por</strong> {post?.user?.email}</span>
      </div>
      <p><strong>Titulo:</strong> {post.title}</p>
      <p><strong>Contenido:</strong> {post.content}</p>
      {(!isCardAdmin || user.id==1) &&
        <button onClick={() => askDeletePost(post)} className="absolute right-1 bottom-1 rounded-br-lg rounded bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white hover:bg-red-700">
        <RiDeleteBin2Fill className="h-7 w-5" />
      </button>
      }
    </div>
  );
})
