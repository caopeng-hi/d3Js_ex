

export default [
    {
        path: '/line_chart',
        name: 'line_chart',
        component: () => import('@/views/line_chart/index.vue'),
        meta: {
            title: '折线图',
        }
    }
]