<script setup lang="ts">
import * as d3 from 'd3'

const spinning = ref(false)
const wheel = useTemplateRef('wheel')
const emit = defineEmits(['result'])
const props = defineProps({
  data: { type: Array as () => { label: string; value: number, color: string }[], required: true },
  angle: { type: Number, required: true },
  size: { type: Number, default: 400 },
  time: { type: Number, default: 3000 }
})

const pie = d3.pie().sort(null).value(d => d.value)
const arc = d3.arc().innerRadius(0).outerRadius(props.size / 2)

let g: d3.Selection<SVGGElement, unknown, null, undefined>, texts: d3.Selection<SVGTextElement, d3.PieArcDatum<any>, SVGGElement, unknown>

onMounted(() => {
  const svg = d3.select(wheel.value).append('svg')
      .attr('width', props.size)
      .attr('height', props.size)

  g = svg.append('g')
      .attr('transform', `translate(${props.size / 2},${props.size / 2})`)

  svg.append('path')
      .attr('d', d3.line()([
        [props.size / 2 - 10, 0],
        [props.size / 2 + 10, 0],
        [props.size / 2, 20]
      ])!)

  const arcs = pie(props.data)

  g.selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)

  texts = g.selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(d => d.data.label)
})

watch(() => props.angle, (newAngle, oldAngle) => {
  if (spinning.value) return
  spinning.value = true

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
    const rad = finalAngle * Math.PI / 180
    const result = pie(props.data).find(d => rad >= d.startAngle && rad < d.endAngle)
    emit('result', {...result.data, index: result.index})
    spinning.value = false
  }, props.time)
})
</script>

<template>
  <div ref="wheel" />
</template>
