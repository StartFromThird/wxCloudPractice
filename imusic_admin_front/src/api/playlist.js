import request from '@/utils/request'
const baseURL = 'http://localhost:3000/playlist'
export function getList(params) {
  return request({
    url: `${baseURL}/list`,
    method: 'get',
    params
  })
}