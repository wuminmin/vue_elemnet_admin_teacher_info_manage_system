/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/table',
  component: Layout,
  redirect: '/table/base_table',
  name: 'Table',
  meta: {
    title: '查询信息',
    icon: 'table'
  },
  children: [
    // {
    //   path: 'dynamic-table',
    //   component: () => import('@/views/table/dynamic-table/index'),
    //   name: 'DynamicTable',
    //   meta: { title: 'Dynamic Table' }
    // },
    // {
    //   path: 'drag-table',
    //   component: () => import('@/views/table/drag-table'),
    //   name: 'DragTable',
    //   meta: { title: 'Drag Table' }
    // },
    // {
    //   path: 'inline-edit-table',
    //   component: () => import('@/views/table/inline-edit-table'),
    //   name: 'InlineEditTable',
    //   meta: { title: 'Inline Edit' }
    // },
    // {
    //   path: 'complex-table',
    //   component: () => import('@/views/table/complex-table'),
    //   name: 'ComplexTable',
    //   meta: { title: 'Complex Table' }
    // },
    {
      path: 'base_table',
      component: () => import('@/views/table/base_table'),
      name: 'base_table',
      meta: { title: '基本信息' }
    },

     
    {
      path: 'work_table',
      component: () => import('@/views/table/work_table'),
      name: 'work_table',
      meta: { title: '工作信息' }
    },
    {
      path: 'edu_table',
      component: () => import('@/views/table/edu_table'),
      name: 'edu_table',
      meta: { title: '学历信息' }
    },
    {
      path: 'exp_table',
      component: () => import('@/views/table/exp_table'),
      name: 'exp_table',
      meta: { title: '工作履历' }
    },
    {
      path: 'exa_table',
      component: () => import('@/views/table/exa_table'),
      name: 'exa_table',
      meta: { title: '考核信息' }
    },
    {
      path: 'family_table',
      component: () => import('@/views/table/family_table'),
      name: 'famliy_table',
      meta: { title: '家庭信息' }
    }, {
      path: 'profession_table',
      component: () => import('@/views/table/profession_table'),
      name: 'profession_table',
      meta: { title: '专业技术职务' }
    },
    {
      path: 'occupion_table',
      component: () => import('@/views/table/occupion_table'),
      name: 'occupion_table',
      meta: { title: '职业资格名称' }
    },
    {
      path: 'adward_table',
      component: () => import('@/views/table/adward_table'),
      name: 'adward_table',
      meta: { title: '奖励情况' }
    }
  ]
}
export default tableRouter
