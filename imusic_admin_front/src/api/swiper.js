import request from '@/utils/request'
const baseURL = 'http://localhost:3000/swiper'
export function getList(params) {
  return request({
    url: `${baseURL}/list`,
    method: 'get',
    params
  })
}

export function del(params) {
  return request({
      params,
      url: `${baseURL}/del`,
      method: 'get',
  })
}
