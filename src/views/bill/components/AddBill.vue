<script
    lang="ts"
    src="@/scripts/bill/components/addBill.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 p-2" v-loading="isLoading">
        <div class="d-flex align-items-center">
            <div class="flex-fill">
                <h4 class="mb-0 d-none d-md-block">
                    <i class="fas fa-plus text-lightblue mr-2"></i>
                    <strong> {{ viewSettings.title }}</strong>
                </h4>
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
                        <div>Back</div>
                    </el-button>
                </div>
            </div>
        </div>
        <el-scrollbar class="flex-fill mt-0 mt-md-3 pr-0">
            <div class="w-100">
                <div class="d-flex flex-column w-100 pb-0 pt-2 mr-4">
                    <!--items with 2 feild-->
                    <el-form v-if="itemModel" ref="formRef" :model="itemModel" :rules="rules" label-width="0"
                        v-on:keydown.enter='onSubmit(formRef)' class="ruleForm">
                        <div class="mb-3">
                            <div class="mb-3">
                                <div>
                                    <strong>{{t("Zone Name")}}</strong><span class="ml-1 text-danger">*</span>
                                </div>
                                <div class="mt-2">
                                    <el-form-item label="" prop="name">
                                        <el-input v-model="itemModel.name" size="large" placeholder=""
                                            v-on:keydown.enter.prevent />
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div>
                                    <strong>{{t("Zone Description")}}</strong><span class="ml-1 text-danger">*</span>
                                </div>
                                <div class="mt-2">
                                    <el-form-item label="" prop="description">
                                        <el-input v-model="itemModel.description" size="large" placeholder=""
                                            v-on:keydown.enter.prevent />
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                        <!--end-->
                    </el-form>
                    <!--end-->

                    <div class="text-center mt-3 pt-3 pb-3" style="background-color: #f5f7fa">
                        <el-button size="large" type="primary" class="mr-1 ml-1" @click="onSubmit(formRef)">
                            <el-icon>
                                <Plus />
                            </el-icon>
                            <span>{{ viewSettings.title }} </span>
                        </el-button>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<style scoped lang="scss">
.upload-dropzone-wrap {
    --border-opacity: 1;
    border-color: #cbd5e0;
    border-color: rgba(203, 213, 224, var(--border-opacity));
    border-radius: 0.5rem;
    border-style: dashed;
    border-width: 4px;
}

.radio-selection {
    visibility: hidden;
    display: none;
}

.organization-item {
    label {
        cursor: pointer;
    }

    .radio-selection {
        &:checked+.el-card {
            background-color: #5ca6e5;
            color: #fff;

            .item--name {
                font-weight: 600;
            }

            .organization-item--icon-selected {
                display: block !important;
            }
        }
    }
}
</style>
