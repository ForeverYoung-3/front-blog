import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { postsApi } from '../../api/posts';
import PostCard from '../../components/common/PostCard';
import Pagination from '../../components/common/Pagination';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('q') || '';
  const [page, setPage] = useState(0);

  useEffect(() => { setPage(0); }, [keyword]);

  const { data: postsData, isLoading } = useQuery({
    queryKey: ['search', keyword, page],
    queryFn: () => postsApi.search(keyword, page, 10),
    enabled: !!keyword,
  });

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
        搜索结果：<span className="text-indigo-600 break-all">"{keyword}"</span>
      </h1>
      {postsData && (
        <p className="text-gray-500 text-sm mb-6">共找到 {postsData.totalElements} 篇文章</p>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      ) : !keyword ? (
        <div className="text-center py-16 text-gray-400">请输入搜索关键词</div>
      ) : postsData?.content.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p>没有找到相关文章</p>
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
