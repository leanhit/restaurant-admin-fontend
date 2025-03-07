<script
    lang="ts"
    src="@/scripts/menu/components/addCategory.ts"></script>
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
                                    v-on:keydown.enter='onSubmit(formRef)' class="ruleForm">
                                    <div class="mt-4">
                                        <div class=" px-2">
                                            <div>
                                                <strong>{{ t("Category Name") }}</strong><span
                                                    class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="name">
                                                    <el-input v-model="itemModel.name" size="large" placeholder=""
                                                        v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class="mb-3 px-2">
                                            <div>
                                                <strong>{{ t("Status") }}</strong><span class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="availableStatus">
                                                    <el-select class="w-100" placeholder="" size="large"
                                                        v-model="itemModel.availableStatus">
                                                        <el-option v-for="categoryStatus in categoryStatusOptions"
                                                            :key="categoryStatus.value" :label="categoryStatus.label"
                                                            :value="categoryStatus.value" />
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <!--end-->
                                </el-form>
                            </div>
                        </div>
                    </div>

                    <div class="col-lg-5 order-lg-5">
                        <div class="h-100 d-flex align-items-center justify-content-center  py-2">
                            <img :src="defaultImg" alt="" width="1000" height="300">
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
</template>

<style scoped lang="scss">
img {
    max-width: 80%;
    height: auto;
}
</style>
