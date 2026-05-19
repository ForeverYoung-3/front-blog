import request from './request';

/**
 * 上传图片到后端，返回可访问的 URL
 * 后端接口：POST /upload/image，multipart/form-data，字段名 file
 * 返回：{ code: 200, data: { url: "https://..." } }
 */
export async function uploadImage(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const res = await request.post<{ data: { url: string } }>('/files/upload/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data.url;
}
