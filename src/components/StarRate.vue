<template>
    <div class="rate-content">
        <input
            v-for="index in arr"
            :key="`${id}${index}`"
            :class="className"
            :disabled="disabled"
            type="radio"
            :name="'rate' + id"
            :value="index"
            :checked="value === index"
            @click="() => changeStar(index)"
            @mouseenter="className = ''"
        >
    </div>
</template>
<script setup lang="ts">
    const arr = Array.from({ length: 10 }).map((_, index) => 10 - index);
    const props = defineProps({
        value: {
            type: Number,
            default: 0
        },
        size: {
            type: String,
            default: 'default'
        },
        id: {
            type: Number,
            default: 0
        },
        disabled: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        }
    })
    const { value, size, disabled, id, clearable } = toRefs(props)
    const className = ref<string>('')
    const fontStyle = computed(() => {
        return {
            size: size.value === 'small' ? '20px' : '30px',
            width: size.value === 'small' ? '10px' : '15px'
        }
    })
    const emits = defineEmits(['update:value'])
    const changeStar = (star: number) => {
        console.log('====', clearable.value, value.value, star)
        if (clearable.value && value.value === star) {
            emits('update:value', 0);
            // hover不显示星星，不然看起来还像是有打星
            className.value = 'hide-hover'
        } else {
            emits('update:value', star);
        }
    }
</script>
<style scoped lang="scss">
* {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    list-style: none;
}

    // 样式重置
    input {
        font-family: "iconfont" !important;
        appearance: none;
        -webkit-appearance: none;
        border: none;
        outline: none;
        cursor: pointer;
    }

    .rate-content {
        width: fit-content;
        $main: $green;
        $basic: #999;

        display: flex;
        flex-flow: row-reverse;

        // 评分
        input[name^="rate"] {
            font-family: "iconfont";
            font-size: v-bind('fontStyle.size');
            width: v-bind('fontStyle.width');
            overflow: hidden;
            transition: transform .2s ease;

            &:nth-child(odd) {
                direction: rtl;
            }

            // 默认星星
            &::after {
                content: "\e645";
                color: $basic;
                transition: color .4s ease;
            }

            // 高亮星星
            &:checked,
            &:hover:not([disabled]):not(.hide-hover) {
                &::after {
                    content: "\e77e";
                    color: $main;
                }

                // 兄弟元素一起高亮
                &~input[name^="rate"] {
                    &::after {
                        content: "\e77e";
                        color: $main;
                    }
                }
            }
        }
    }
</style>