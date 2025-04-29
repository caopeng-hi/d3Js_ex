/*
 * @Author: caopeng
 * @Date: 2025-03-20 17:04:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2025-04-29 14:08:04
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
        path: '/pie_rose_chart',
        name: 'pie_rose_chart',
        component: () => import('@/views/pie_rose_chart/index.vue'),
        meta: {
            title: '南丁格尔玫瑰图',
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
    },
    {
        path: '/solid_chart',
        name: 'solid_chart',
        component: () => import('@/views/solid_chart/index.vue'),
        meta: {
            title: '漏斗图',
        }
    },
    {
        path: '/tree_chart',
        name: 'tree_chart',
        component: () => import('@/views/tree_chart/index.vue'),
        meta: {
            title: '树状图',
        }
    },
    {
        path: '/gauge_chart',
        name: 'gauge_chart',
        component: () => import('@/views/gauge_chart/index.vue'),
        meta: {
            title: '仪表盘',
        }
    },
    {
        path: '/polo_chart',
        name: 'polo_chart',
        component: () => import('@/views/polo_chart/index.vue'),
        meta: {
            title: '水球图',
        }
    },
    {
        path: '/date_chart',
        name: 'date_chart',
        component: () => import('@/views/date_chart/index.vue'),
        meta: {
            title: '日期图',
        }
    },
    {
        path: '/attribute_chart',
        name: 'attribute_chart',
        component: () => import('@/views/attribute_chart/index.vue'),
        meta: {
            title: '属性图',
        }
    }
]