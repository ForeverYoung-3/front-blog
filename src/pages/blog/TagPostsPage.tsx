import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../../api/posts';
import { tagsApi } from '../../api/tags';
import PostCard from '../../components/common/PostCard';
import Pagination from '../../components/common/Pagination';

export default function TagPostsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(0);

  const { data: tag } = useQuery({
    queryKey: ['tag', slug],
    queryFn: () => tagsApi.getBySlug(slug!),
    enabled: !!slug,
  });

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['posts', 'tag', slug, page],
    queryFn: () => postsApi.getByTag(slug!, page, 10),
    enabled: !!slug,
  });

  return (
    <div>
      <div className="mb-6">
        <Link to="/tags" className="text-sm text-indigo-600 hover:underline">← 所有标签</Link>
        {tag && (
          <div className="flex items-center gap-3 mt-3">
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: tag.color }}
            />
            <h1 className="text-2xl font-bold text-gray-900">{tag.name}</h1>
            <span className="text-gray-400 text-sm">({tag.postCount} 篇)</span>
          </div>
        )}
        {tag?.description && (
          <p className="text-gray-500 mt-2 text-sm">{tag.description}</p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : postsData?.content.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">📭</p>
          <p>该标签下暂无文章</p>
        </div>
      ) : (
        <div className="space-y-6">
          {postsData?.content.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {postsData && (
        <Pagination
          current={page}
          total={postsData.totalElements}
          pageSize={10}
          onChange={setPage}
        />
      )}
    </div>
  );
}
