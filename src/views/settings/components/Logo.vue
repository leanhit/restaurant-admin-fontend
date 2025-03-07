<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<script lang="ts" src="@/scripts/settings/components/logo.ts"></script>

<template>
    <div class="author-media pt-3">

            <el-image class="logo-img" 
            :src="previewImage"
            fit="cover" />

        <div class="upload-link" title="" data-toggle="tooltip" data-placement="right" data-original-title="update">
            <input type="file" class="update-flie"  accept="image/png, image/gif, image/jpeg" @change=uploadImage>
            <div class="h-100 d-flex justify-content-center align-items-center">
                <i class="fa fa-camera"></i>
            </div>
        </div>
    </div>
</template>

<style scoped>
.author-media {
    position: relative;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 10px;
    display: inline-block;
}

.upload-link {
    position: absolute;
    width: 35px;
    height: 35px;
    line-height: 32px;
    background: #395ee2;
    bottom: 0;
    right: 0px;
    box-shadow: 0 0 10px 0 rgba(0, 24, 128, 0.1);
    border-radius: 100%;
    color: #fff;
    overflow: hidden;
    border: 2px solid #fff;
}

.upload-link .update-flie {
    position: absolute;
    opacity: 0;
    z-index: 0;
    width: 100%;
    cursor: pointer;
    left: 0;
    height: 100%;
}

.upload-link .logo-img {
    max-width: 80%;
    height: auto;
}
</style>