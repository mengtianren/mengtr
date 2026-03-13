<template>
  <GTablePage ref="pageRef" :options="pageOptions" />
</template>

<script setup>
import { useData } from './data'

const { pageOptions } = useData()

</script>

<style lang="less" scoped></style>
