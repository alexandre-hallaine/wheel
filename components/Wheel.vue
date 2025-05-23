<script lang="ts" setup>
import * as d3 from 'd3'

const wheel = useTemplateRef('wheel')
const emit = defineEmits(['result'])
const props = defineProps({
  data: {
    type: Array as () => { label: string, value: number }[],
    required: true
  },
  angle: {
    type: Number,
    required: true
  },
  size: {
    type: Number,
    default: 400
  },
  time: {
    type: Number,
    default: 3000
  }
})

const arcs = d3.pie().sort(null).value(d => d.value)(props.data)
const arc = d3.arc().innerRadius(0).outerRadius(props.size / 2)
const color = d3.scaleOrdinal(d3.schemeSet3)

let g, texts
onMounted(() => {
  const svg = d3.select(wheel.value)
      .append('svg')
      .attr('width', props.size)
      .attr('height', props.size)

  g = svg.append('g')
      .attr('transform', `translate(${props.size / 2},${props.size / 2})`)
      .attr('id', 'wheel')

  svg.append('path')
      .attr('d', d3.line()([
        [props.size / 2 - 10, 0],
        [props.size / 2 + 10, 0],
        [props.size / 2, 20],
      ])!)

  g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.label))

  texts = g.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', d => {
        const [x, y] = arc.centroid(d)
        return `translate(${x},${y})`
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(d => d.data.label)
})

watch(toRef(props, 'angle'), (newAngle, oldAngle) => {
  const i = d3.interpolate(oldAngle, newAngle)

  g.transition()
      .duration(props.time)
      .ease(d3.easeCubicOut)
      .attrTween('transform', () => t => `translate(${props.size / 2},${props.size / 2}) rotate(${i(t)})`)

  texts.transition()
      .duration(props.time)
      .ease(d3.easeCubicOut)
      .attrTween('transform', d => {
        const [x, y] = arc.centroid(d)
        return t => `translate(${x},${y}) rotate(${-i(t)})`
      })

  setTimeout(() => {
    const finalAngle = (360 - (newAngle % 360)) % 360
    const angleRad = finalAngle * Math.PI / 180
    const found = arcs.find(arc => angleRad >= arc.startAngle && angleRad < arc.endAngle)
    emit('result', found?.data.label)
  }, props.time)
})
</script>

<template>
  <div ref="wheel"/>
</template>
