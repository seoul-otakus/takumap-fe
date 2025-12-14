import api from "@/lib/api";

/**
 * S3에 파일 업로드 (단일 파일)
 * @param file 업로드할 파일
 * @returns S3 objectKey
 */
export async function uploadFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<string>('/api/s3/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data; // objectKey 반환
}

/**
 * S3에서 파일 삭제
 * @param objectKey S3 objectKey
 */
export async function deleteFile(objectKey: string): Promise<void> {
  await api.delete('/api/s3/delete', {
    params: { key: objectKey }
  });
}

/**
 * 여러 파일을 S3에 업로드
 * @param files 업로드할 파일 배열
 * @returns S3 objectKey 배열
 */
export async function uploadFiles(files: File[]): Promise<string[]> {
  const uploadPromises = files.map(file => uploadFile(file));
  return Promise.all(uploadPromises);
}

/**
 * base64 이미지를 File 객체로 변환
 * @param base64 base64 인코딩된 이미지 문자열
 * @param filename 파일명
 * @returns File 객체
 */
export function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
}
