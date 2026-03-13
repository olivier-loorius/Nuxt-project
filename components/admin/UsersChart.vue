<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
} from 'chart.js'

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler, Tooltip)

const props = defineProps<{
  profiles: { created_at: string }[]
}>()

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']
const MONTHS_FR_FULL = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']

const months = computed(() => {
  const now = new Date()
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
    return { year: d.getFullYear(), month: d.getMonth(), label: MONTHS_FR[d.getMonth()] }
  })
})

const chartData = computed(() => {
  const counts = months.value.map(({ year, month }) =>
    props.profiles.filter(p => {
      const d = new Date(p.created_at)
      return d.getFullYear() === year && d.getMonth() === month
    }).length
  )

  return {
    labels: months.value.map(m => m.label),
    datasets: [
      {
        data: counts,
        borderColor: '#F59E0B',
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart
          if (!chartArea) return 'transparent'
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, 'rgba(245,158,11,0.3)')
          gradient.addColorStop(1, 'rgba(245,158,11,0)')
          return gradient
        },
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      enabled: true,
      mode: 'index' as const,
      intersect: false,
      callbacks: {
        title: (items: any[]) => {
          const m = months.value[items[0]?.dataIndex]
          if (!m) return ''
          return `${MONTHS_FR_FULL[m.month]} ${m.year}`
        },
        label: (item: any) => `${item.raw} inscription(s)`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { display: false },
      grid: { display: false },
      border: { display: false },
    },
    x: {
      ticks: {
        display: true,
        color: 'rgba(0,0,0,0.3)',
        font: { size: 9 },
        maxRotation: 0,
      },
      grid: { display: false },
      border: { display: false },
    },
  },
}
</script>
