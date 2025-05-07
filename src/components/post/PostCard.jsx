
export const PostCard = ({ post }) => {
  return (
    <div className="space-y-2 rounded-lg outline outline-slate-300 p-4 shadow-sm dark:outline-slate-600 dark:bg-slate-800 relative mb-8">
      <div className="flex justify-between">
        <span className="font-medium">ID: {post.id}</span>
      </div>
      <p><strong>Titulo:</strong> {post.title}</p>
      <p><strong>Contenido:</strong> {post.content}</p>
    </div>
  )
}
