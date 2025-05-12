import { memo, useContext } from 'react';
import { RiDeleteBin2Fill } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { AuthContext } from '../../context/AuthContext';

export const PostCard = memo(({ post, askEditPost, askDeletePost }) => {
  const { user } = useContext(AuthContext);
  if (!post) return null;

  // Determinamos permisos
  const isAuthor = user.id === post?.user?.id;
  const isSuperAdmin = user.id === 1;
  const canEdit = isAuthor || isSuperAdmin;
  const canDelete = isAuthor || isSuperAdmin;

  return (
    <article className="relative mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Header: autor y fecha */}
      <header className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center space-x-2 place-content-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {post?.user?.name || 'Usuario Anónimo'}
          </h2>
        </div>

        <div className="mt-2 flex space-x-2 sm:mt-0">
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Escrito por:</span> {post?.user?.email}
          </p>
          {post.createdAt && (
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString('es-ES', {
                day: '2-digit', month: 'long', year: 'numeric'
              })}
            </p>
          )}
        </div>

      </header>

      {/* Body: título y contenido */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {post.title}
        </h3>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {post.content}
        </p>
          <div className='ml-2 flex items-center space-x-2 place-content-end'>

            {canEdit && (
              <button
                onClick={() => askEditPost(post)}
                aria-label="Editar anuncio"
                className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className="ml-1 align-middle">Editar</span>
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => askDeletePost(post)}
                aria-label="Eliminar anuncio"
                className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                 <span className="ml-1 align-middle">Eliminar</span>
              </button>
            )}
          </div>
      </div>
    </article>
  );
});
