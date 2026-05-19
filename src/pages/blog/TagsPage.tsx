import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { tagsApi } from '../../api/tags';

export default function TagsPage() {
  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsApi.getAll,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">🏷️ 所有标签</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tags?.map(tag => (
            <Link
              key={tag.id}
              to={`/tag/${tag.slug}`}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                <span className="font-semibold text-gray-800">{tag.name}</span>
              </div>
              {tag.description && (
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">{tag.description}</p>
              )}
              <span className="text-xs text-gray-400">{tag.postCount} 篇文章</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
