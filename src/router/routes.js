/*
 * @Author: caopeng
 * @Date: 2025-03-20 17:04:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-03-29 09:55:37
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
            title: '环形图',
        }
    },
    {
        path: '/pie_chart',
        name: 'pie_chart',
        component: () => import('@/views/pie_chart/index.vue'),
        meta: {
            title: '饼形图',
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
        path: '/histogram_sort_chart',
        name: 'histogram_sort_chart',
        component: () => import('@/views/histogram_sort_chart/index.vue'),
        meta: {
            title: '动态排序柱状图',
        }
    },
    {
        path: '/histogram_polar_chart',
        name: 'histogram_polar_chart',
        component: () => import('@/views/histogram_polar_chart/index.vue'),
        meta: {
            title: '极坐标柱状图',
        }
    },
    {
        path: '/radar_chart',
        name: 'radar_chart',
        component: () => import('@/views/radar_chart/index.vue'),
        meta: {
            title: '雷达图',
        }
    },
    {
        path: '/scatter_chart',
        name: 'scatter_chart',
        component: () => import('@/views/scatter_chart/index.vue'),
        meta: {
            title: '散点图',
        }
    }
    ,
    {
        path: '/solid_chart',
        name: 'solid_chart',
        component: () => import('@/views/solid_chart/index.vue'),
        meta: {
            title: '漏斗图',
        }
    }
]