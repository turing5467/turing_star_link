<template lang="">
    <div>
        <!-- <form action="xx" ></form> -->
        <input type="file" name="file" @change="changeFile">
        <button @click="submit">提交</button>
    </div>
</template>
<script setup lang="ts">
    const changeFile = (e: any) => {
        const file: File = e.target.files[0]
        const sliceBlob: Blob = new Blob([file]).slice(0, file.size / 2)
        const sliceFile: File = new File([sliceBlob], file.name)
        console.log(sliceFile);
        const fileReader = new FileReader()
        fileReader.readAsDataURL(sliceFile)
        fileReader.onload = (e: ProgressEvent<FileReader>) => {
            console.log('===文件一半的base64：', e, e.target?.result, fileReader.result);
        }
    }

    const submit = () => {

    }
</script>
<style lang="scss" scoped>
    
</style>