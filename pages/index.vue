<script setup>
import * as d3 from 'd3'

const wheel = useTemplateRef('wheel')
const prize = ref('No prize')

const data = [
  { label: 'Alex', value: 40 },
  { label: 'Bob', value: 25 },
  { label: 'Charlie', value: 35 }
]

const size = 400
const arcs = d3.pie().value(d => d.value)(data)
const arc = d3.arc().innerRadius(0).outerRadius(size / 2)
const color = d3.scaleOrdinal(d3.schemeSet2)

onMounted(() => {
  const svg = d3.select(wheel.value)
    .append('svg')
    .attr('width', size)
    .attr('height', size)

  const g = svg.append('g')
    .attr('transform', `translate(${size/2},${size/2})`)

  g.selectAll('path')
    .data(arcs)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.label))

  const texts = g.selectAll('text')
    .data(arcs)
    .enter()
    .append('text')
    .text(d => d.data.label)
    .attr('transform', d => `translate(${arc.centroid(d)})`)

  let angle = 0
  setInterval(() => {
    angle += Math.random() * 360

    g.transition()
      .duration(3000)
      .attr('transform', `translate(${size/2},${size/2}) rotate(${angle})`)

    texts.transition()
      .duration(3000)
      .attr('transform', d => {
        const [x, y] = arc.centroid(d)
        return `translate(${x},${y}) rotate(${-angle})`
      })

    setTimeout(() => {
      const normalizedAngle = (360 - (angle % 360)) % 360
      const found = arcs.find(d => {
        const start = (d.startAngle * 180 / Math.PI) % 360
        const end = (d.endAngle * 180 / Math.PI) % 360

        if (start < end) {
          return normalizedAngle >= start && normalizedAngle < end
        } else {
          return normalizedAngle >= start || normalizedAngle < end
        }
      })

      prize.value = found ? found.data.label : 'No prize'
    }, 3100)
  }, 5000)
})
</script>

<template>
  <UPageSection>
    <UPageCTA title="D3 Wheel" orientation="horizontal" :description="`Prize: ${ prize }`">
      <div ref="wheel" />
    </UPageCTA>
  </UPageSection>
</template>
