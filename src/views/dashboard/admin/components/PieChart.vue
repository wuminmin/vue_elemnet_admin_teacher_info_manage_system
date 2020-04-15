<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['东至县分公司', '青阳县分公司', '石台县分公司', '九华山风景区分公司', '城市销售中心',
          '贵池区销售服务中心','政企客户部','校园客户部','渠道与公众客户部','池州未知'
          
          ]
        },
        series: [
          {
            name: 'ITV 到达数',
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '38%'],
            data: [
              { value: 52163, name: '东至县分公司' },
              { value: 43478, name: '青阳县分公司' },
              { value: 20335, name: '石台县分公司' },
              { value: 8045, name: '九华山风景区分公司' },
              { value: 45709, name: '城市销售中心' },
              {value:23949,name:'贵池区销售服务中心'},
              {value:15865,name:'政企客户部'},
              {value:1046,name:'校园客户部'},
               {value:0,name:'渠道与公众客户部'},
               {value:2,name:'池州未知'},
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
