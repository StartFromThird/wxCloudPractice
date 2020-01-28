import request from '@/utils/request'
const baseURL = 'http://localhost:3000/playlist'
export function getList(params) {
  return request({
    url: `${baseURL}/list`,
    method: 'get',
    params
  })
}
export function del(params) {
  return request({
    url: `${baseURL}/del`,
    method: 'get',
    params
  })
}
export function update(params) {
  return request({
    url: `${baseURL}/update`,
    method: 'post',
    data: params
  })
}
