<template>
  <div class="quillEditor">
    <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" class="toolbar-style" />
    <Editor :defaultConfig="editorConfig" v-model="value" class="editor-style" @onCreated="handleCreated" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, shallowRef } from 'vue'
// @ts-ignore
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const value = defineModel('value', { default: '' })

const props = withDefaults(defineProps<{ disabled?: boolean, maxLength?: number }>(), {
  disabled: false,
  maxLength: 5000
})






// 编辑器
const editorRef = shallowRef()

const toolbarConfig = {
  showFullScreen: false,
  excludeKeys: ['downloadAttachment', 'uploadImage', 'uploadVideo']
}
const editorConfig = computed(() => ({
  maxLength: props.maxLength,
  placeholder: '请输入详情描述...',
  readOnly: props.disabled
}))

// 编辑器回调函数
const handleCreated = (editor: string) => {
  editorRef.value = editor
}
</script>

<style lang="less" scoped>
.quillEditor {
  border: 1px solid #ccc !important;
  border-radius: 4px;
  overflow: hidden;

  .toolbar-style {
    border-bottom: 1px solid #ccc !important;
  }

  .editor-style {
    height: 400px !important;
    overflow-y: hidden !important;
  }
}
</style>
