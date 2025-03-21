

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
    }
]