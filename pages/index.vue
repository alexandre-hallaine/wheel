<script setup>
import * as d3 from 'd3'

const wheel = useTemplateRef('wheel')
const prize = ref('No prize')
const angle = ref(0)
const data = [
  { label: 'Alex', value: 40 },
  { label: 'Bob', value: 25 },
  { label: 'Charlie', value: 35 }
]

const size = 400
const time = 3000
const arcs = d3.pie().value(d => d.value)(data)
const arc = d3.arc().innerRadius(0).outerRadius(size / 2)
const color = d3.scaleOrdinal(d3.schemeSet2)

onMounted(() => {
  const svg = d3.select(wheel.value).append('svg').attr('width', size).attr('height', size)
  const outer = svg.append('g').attr('transform', `translate(${size / 2},${size / 2})`)
  const g = outer.append('g').attr('id', 'wheel')

  g.selectAll('path')
    .data(arcs)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.label))

  const textGroups = g.selectAll('g.label')
    .data(arcs)
    .enter()
    .append('g')
    .attr('class', 'label')
    .attr('transform', d => `translate(${arc.centroid(d)})`)

  textGroups.append('text')
    .text(d => d.data.label)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')

  watch(angle, (newAngle, oldAngle) => {
    const i = d3.interpolate(oldAngle, newAngle)

    g.transition()
      .duration(time)
      .ease(d3.easeCubicOut)
      .attrTween("transform", () => t => `rotate(${i(t)})`)

    textGroups.select('text')
      .transition()
      .duration(time)
      .ease(d3.easeCubicOut)
      .attrTween('transform', () => t => `rotate(${-i(t)})`)
  })
})

function spin() {
    angle.value += Math.random() * 10 * 360

    setTimeout(() => {
      const finalAngle = angle.value % 360
      const segmentAngle = 360 / data.length
      const index = Math.floor((360 - finalAngle + 90) % 360 / segmentAngle)

      prize.value = data[index]?.label ?? 'No prize'
    }, time)
}

setInterval(() => spin(), 5000)
</script>


<template>
  <UPageSection>
    <UPageCTA title="D3 Wheel" orientation="horizontal" :description="`Prize: ${ prize }`">
      <div ref="wheel" />
    </UPageCTA>
  </UPageSection>
</template>
