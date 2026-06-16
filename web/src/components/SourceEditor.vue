<script setup>
import { defineProps, defineEmits } from 'vue'

const prop = defineProps({
    show: {
        type: Boolean,
        required: true
    },
    data: {
        type: Object,
        required: true
    },
    loading: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['save', 'close'])

const handleClose = done => {
    done()
    emit('close')
}
</script>

<template>
    <el-dialog :model-value="prop.show" title="源编辑器" width="90%" :before-close="handleClose" align-center></el-dialog>
</template>

<style scoped></style>
