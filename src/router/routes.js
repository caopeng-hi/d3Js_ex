/*
 * @Author: caopeng
 * @Date: 2025-03-20 17:04:56
 * @LastEditors: 
 * @LastEditTime: 2025-03-24 09:03:41
 * @Description: 请填写简介
 */


export default [
    {
        path: '/line_chart',
        name: 'line_chart',
        component: () => import('@/views/line_chart/index.vue'),
        meta: {
            title: '折线图',
        }
    },
    {
        path: '/lines_chart',
        name: 'lines_chart',
        component: () => import('@/views/lines_chart/index.vue'),
        meta: {
            title: '多折线图',
        }
    },
    {
        path: '/lines_area_chart',
        name: 'lines_area_chart',
        component: () => import('@/views/lines_area_chart/index.vue'),
        meta: {
            title: '折线面积图',
        }
    },
    {
        path: '/pai_chart',
        name: 'pai_chart',
        component: () => import('@/views/pai_chart/index.vue'),
        meta: {
            title: '饼图',
        }
    },
    {
        path: '/chain_chart',
        name: 'chain_chart',
        component: () => import('@/views/chain_chart/index.vue'),
        meta: {
            title: '全国地图',
        }
    },
    {
        path: '/histogram_chart',
        name: 'histogram_chart',
        component: () => import('@/views/histogram_chart/index.vue'),
        meta: {
            title: '柱状图',
        }
    },
    {
        path: '/radar_chart',
        name: 'radar_chart',
        component: () => import('@/views/radar_chart/index.vue'),
        meta: {
            title: '雷达图',
        }
    }
]