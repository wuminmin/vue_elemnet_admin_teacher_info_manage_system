import request from '@/utils/request'
import module from '@/settings'
export function upload_canteen_list(data) {
  return request({
    url: module.teacher_base_url+'upload_canteen_list',
    method: 'post',
    data
  })
}

export function upload_excel_data(data) {
  return request({
    url: module.teacher_base_url+'upload_excel_data',
    method: 'post',
    data
  })
}
