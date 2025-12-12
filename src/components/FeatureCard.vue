<template>
  <div class="mini-card" :style="{ backgroundColor: color + '20', borderLeftColor: color }">
    <p class="card-title">{{ title }}</p>
    <p class="card-value" :style="{ color: color }">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    default: 0
  },
  color: {
    type: String,
    default: '#42b883'
  }
});
</script>

<style scoped>
.mini-card {
  padding: 10px 15px;
  border-left: 4px solid;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-weight: 500;
  color: #2c3e50;
}
.card-value {
  font-size: 1.2em;
  font-weight: 700;
}
</style>
