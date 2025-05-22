<script setup>
import { onMounted } from 'vue'
import { useTemplateRef } from '#imports'
import * as d3 from 'd3'

const wheel = useTemplateRef('wheel')

const data = [
  { label: 'Alex', value: 40 },
  { label: 'Bob', value: 25 },
  { label: 'Charlie', value: 35 }
]

const size = 400
const pie = d3.pie().value(d => d.value)
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
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.label))

  const texts = g.selectAll('text')
    .data(pie(data))
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
  }, 5000)
})
</script>

<template>
  <UPageSection>
    <UPageCTA title="D3 Wheel" orientation="horizontal">
      <div ref="wheel" />
    </UPageCTA>
  </UPageSection>
</template>
