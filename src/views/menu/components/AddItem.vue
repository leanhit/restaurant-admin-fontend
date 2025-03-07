
import { viewNameEnum } from '@/until/constant';

<script
    lang="ts"
    src="@/scripts/menu/components/addItem.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 p-2" v-loading="isLoading">
        <div class="d-flex align-items-center justify-content-between pb-3">
            <div class="page-titles">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="javascript:void(0)">{{ t("Menu") }}</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">{{ viewSettings.title }}</a></li>
                </ol>
            </div>
            <div class="d-flex align-items-center">
                <div class="ml-1 mr-4 w-100">
                    <el-button size="default" link type="danger" class="d-block d-md-none"
                        @click="$emit('onChangeView', { viewName: 'ListData', data: null, })">
                        <div>
                            <i class="fas fa-times"></i>
                        </div>
                    </el-button>

                    <el-button size="default" type="danger" class="d-none d-md-block"
                        @click="$emit('onChangeView', { viewName: 'ListData', data: null, })">
                        <div>{{ t("Back") }}</div>
                    </el-button>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-lg-7 order-lg-7">
                        <div class=" h-100 d-flex align-items-center justify-content-center">
                            <div class="w-100" :style="{ 'backgroundColor': allColorEnum.bgBody }">
                                <el-form v-if="itemModel" ref="formRef" :model="itemModel" :rules="rules" label-width="0"
                                    v-on:keydown.enter='onSubmit(formRef)' class="ruleForm pt-4">
                                    <div class="px-2">
                                        <div>
                                            <div class="px-2">
                                                <strong>{{ t("Category Name") }}</strong><span
                                                    class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2 px-2">
                                                <el-form-item label="" prop="categoryId">
                                                    <el-select v-model="itemModel.categoryId" filterable size="large"
                                                        class="w-100" :placeholder="t('Select a category ...')"
                                                        :disabled="(viewName === viewNameEnum.EDITITEM)">
                                                        <el-option v-for="category in menu" :key="category.id"
                                                            :label="category.name" :value="category.id" />
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class="row px-2">
                                            <div class="col-sm-12  col-md-12 col-lg-6 col-xl-6">
                                                <div>
                                                    <strong>{{ t("Item Name") }}</strong><span
                                                        class="ml-1 text-danger">*</span>
                                                </div>
                                                <div class="mt-2">
                                                    <el-form-item label="" prop="name">
                                                        <el-input v-model="itemModel.name" size="large" placeholder=""
                                                            v-on:keydown.enter.prevent />
                                                    </el-form-item>
                                                </div>
                                            </div>

                                            <div class="col-sm-12  col-md-12 col-lg-6 col-xl-6">
                                                <div>
                                                    <strong>{{ t("Status") }}</strong><span
                                                        class="ml-1 text-danger">*</span>
                                                </div>
                                                <div class="mt-2">
                                                    <el-form-item label="" prop="availableStatus">
                                                        <el-select class="w-100" placeholder="" size="large"
                                                            v-model="itemModel.availableStatus">
                                                            <el-option v-for="itemStatus in itemStatusOptions"
                                                                :key="itemStatus.value" :label="itemStatus.label"
                                                                :value="itemStatus.value" />
                                                        </el-select>
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mb-3 px-2">
                                            <div>
                                                <strong>{{ t("Item Description") }}</strong><span
                                                    class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="description">
                                                    <el-input v-model="itemModel.description" size="large" placeholder=""
                                                        v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class="row px-2">
                                            <div class="col-sm-12  col-md-12 col-lg-6 col-xl-6">
                                                <div>
                                                    <strong>{{ t("Max Stock") }}</strong><span
                                                        class="ml-1 text-danger">*</span>
                                                </div>
                                                <div class="mt-2">
                                                    <el-form-item label="" prop="maxStock">
                                                        <el-input v-model="itemModel.maxStock" size="large" placeholder=""
                                                            v-on:keydown.enter.prevent />
                                                    </el-form-item>
                                                </div>
                                            </div>

                                            <div class="col-sm-12  col-md-12 col-lg-6 col-xl-6">
                                                <div>
                                                    <strong>{{ t("Price") }}</strong><span class="ml-1 text-danger">*</span>
                                                </div>
                                                <div class="mt-2">
                                                    <el-form-item label="" prop="price">
                                                        <el-input v-model="itemModel.price" size="large" placeholder=""
                                                            v-on:keydown.enter.prevent />
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row px-2 d-flex justify-content-between">
                                            <div class="pl-2 w-50">
                                                <div>
                                                    <strong>{{ t("Photo Url") }}</strong><span
                                                        class="ml-1 text-danger">*</span>
                                                </div>
                                                <div class="mt-2">
                                                    <el-form-item label="" prop="photos">
                                                        <el-input v-model="itemModel.photos[0]" size="large" placeholder=""
                                                            v-on:keydown.enter.prevent />
                                                    </el-form-item>
                                                </div>
                                            </div>
                                            <div class="pr-2">
                                                <div>
                                                    <span class="ml-1 text-danger"></span>
                                                </div>
                                                <div class="mt-2">
                                                    <el-button size="large" type="primary" class="px-1"
                                                        @click="isShowModal = !isShowModal">
                                                        <el-icon>
                                                            <More />
                                                        </el-icon>
                                                    </el-button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--end-->
                                </el-form>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-5 order-lg-5 py-2">
                        <div class="h-100 d-flex align-items-center justify-content-center pl-2">
                            <div v-if="(itemModel.photos[0].length === 0)" class="row d-flex justify-content-center">
                                <img :src="defaultImg" alt="" width="1000" height="300">
                            </div>
                            <div v-else>
                                <div v-if="(itemModel.photos.length === 1)" class="pl-2">
                                    <img :src="itemModel.photos[0]" alt="" width="1000" height="300">
                                </div>
                                <div v-else class="">
                                    <a
                                        :style="{ 'color': allColorEnum.bgBody }">--------------------------------------------------</a>
                                    <el-carousel :interval="5000" arrow="always">
                                        <el-carousel-item v-for="(img, index) in itemModel.photos" :key="index">
                                            <el-image style="width: 300px; height: 300px" :src="img" fit="fill" />
                                        </el-carousel-item>
                                    </el-carousel>
                                    <a
                                        :style="{ 'color': allColorEnum.bgBody }">--------------------------------------------------</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <div class="text-center py-3">
                    <el-button size="large" type="primary" class="mr-1 ml-1" @click="onSubmit(formRef)">
                        <el-icon>
                            <Plus />
                        </el-icon>
                        <span>{{ viewSettings.title }} </span>
                    </el-button>
                </div>
            </div>
        </div>
    </div>

    <!--add more img-->
    <div>
        <el-dialog v-model="isShowModal" :title="t('Add More Image')" width="40%" :before-close="handleClose">
            <el-form ref="formRefAddMore" :model="itemPhotos" label-width="120px" class="demo-dynamic">
                <el-radio-group v-model="photoIndex" class="mr-0">
                    <div v-for="(domain, index) in itemPhotos" :key="index" class="row pb-3">
                        <div class="col-10 row">
                            <div class="col-3">
                                <el-image style="width: 60px; height: 60px" v-if="domain" :src="domain" fit="fill" />
                                <el-image style="width: 60px; height: 60px" v-else src="" fit="fill" />
                            </div>
                            <div class="col-9">
                                <el-input v-model="itemPhotos[index]" />
                                <el-button class="mt-2" :disabled="(itemPhotos.length > 0 && index === 0)"
                                    @click.prevent="removeImg(index)">{{
                                        t("Delete") }}</el-button>
                            </div>
                        </div>
                        <div class="col-2">
                            <el-radio class="" :label="index">{{ t("Use") }}</el-radio>
                        </div>
                    </div>
                </el-radio-group>
                <el-form-item class="pt-0">
                    <div>
                        <el-button @click="addImg">{{ t("New Image") }}</el-button>
                        <el-button @click="resetForm()">{{ t("Default") }}</el-button>
                    </div>
                    <div class="w-100 pt-5 d-flex justify-content-end">
                        <el-button @click="isShowModal = false">{{ t("Cancel") }}</el-button>
                        <el-button type="primary" @click="addImages(formRef)">{{ t("Update") }}</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<style scoped>
img {
    max-width: 100%;
    height: auto;
}
</style>