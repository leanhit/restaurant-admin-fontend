<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<script lang="ts" src="@/scripts/settings/components/list.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100" v-loading="isLoading">
        <!--header-->
        <div class="d-flex align-items-center justify-content-between">
            <div class="page-titles">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">{{ viewSettings.title }}</a></li>
                </ol>
            </div>
            <div class="d-flex align-items-center">
                <div class="px-2 w-100">
                    <!-- <el-button size="default" type="primary" @click="refreshDataFn()">
                        <div>{{ t("Check") }}</div>
                    </el-button> -->
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-4 col-lg-5">
                <div class="clearfix">
                    <div class="card card-bx profile-card author-profile m-b30">
                        <div class="card-body">
                            <div class="d-flex justify-content-center ">
                                <Logo />
                            </div>

                            <div class="pb-3 d-flex justify-content-center ">
                                <h4>Logo</h4>
                            </div>
                        </div>
                    </div>
                    <div class="card profile-card card-bx m-b30">
                        <!-- <div class="card-header">
                        <h3 class="h-title">{{ t("Local setting") }}</h3>
                    </div> -->
                        <div class="card-body">
                            <div class="w-100" :style="{ 'backgroundColor': allColorEnum.bgBody }">
                                <div class="py-2">
                                    <div class="pt-2 pb-3 px-2">
                                        <div>
                                            <strong>{{ t("Language") }}</strong><span class="ml-1 text-info">
                                                ({{ t("Auto Save") }})</span>
                                        </div>
                                        <div class="mt-2">
                                            <el-select class="w-100" placeholder="" size="large" v-model="selectLanguage">
                                                <el-option v-for="language in supportedLocales" :key="language.value"
                                                    :label="language.label" :value="language.value" />
                                            </el-select>
                                        </div>
                                    </div>
                                    <div class=" px-2 ">
                                        <div>
                                            <strong>{{ t("Currency Unit") }}</strong><span class="ml-1 text-info">({{
                                                t("Auto Save") }})</span>
                                        </div>
                                        <div class="mt-2">
                                            <el-select class="w-100" placeholder="" size="large" v-model="selectCurrency">
                                                <el-option v-for="currency in currencyEnum" :key="currency.value"
                                                    :label="currency.label" :value="currency.value" />
                                            </el-select>
                                        </div>
                                    </div>
                                </div>
                                <!--end-->

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-8 col-lg-7">
                <div class="card profile-card card-bx m-b30">
                    <div class="card-header">
                        <h3 class="h-title">{{ t("Restaurant Info") }}</h3>
                    </div>
                    <div class="profile-form">
                        <div class="card-body">
                            <div class="" :style="{ 'backgroundColor': allColorEnum.bgBody }">
                                <el-form ref="formRef" :model="itemModel" :rules="rules" label-width="0"
                                    v-on:keydown.enter='onSubmit(formRef)' class="ruleForm">
                                    <div class="mt-4">
                                        <div class="pt-4 px-2">
                                            <div>
                                                <strong>{{ t("Name") }}</strong><span
                                                    class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="name">
                                                    <el-input v-model="itemModel.name" size="large"
                                                        :placeholder="t(`Your restaurant's name`)" class="w-100"
                                                        v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class=" px-2">
                                            <div>
                                                <strong>{{ t("Sologan") }}</strong><span
                                                    class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="sologan">
                                                    <el-input v-model="itemModel.sologan" size="large"
                                                        :placeholder="t(`Your restaurant's sologan`)" class="w-100"
                                                        v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class=" px-2">
                                            <div>
                                                <strong>{{ t("Address") }}</strong><span class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="address">
                                                    <el-input v-model="itemModel.address" size="large"
                                                        :placeholder="t(`Your restaurant's address`)" class="w-100"
                                                        v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class="row px-2">
                                            <div class="col-lg-6 col-md-12">
                                                <div>
                                                    <strong>{{ t("Email") }}</strong><span class="ml-1 text-danger">*</span>
                                                </div>
                                                <div class="mt-2">
                                                    <el-form-item label="" prop="email">
                                                        <el-input v-model="itemModel.email" size="large"
                                                            :placeholder="t(`Your restauran's email`)" class="w-100"
                                                            v-on:keydown.enter.prevent />
                                                    </el-form-item>
                                                </div>
                                            </div>
                                            <div class="col-lg-6 col-md-12">
                                                <div>
                                                    <strong>{{ t("Phone Number") }}</strong><span class="ml-1 text-danger">*</span>
                                                </div>
                                                <div class="mt-2">
                                                    <el-form-item label="" prop="phone">
                                                        <el-input v-model="itemModel.phone" size="large"
                                                            :placeholder="t(`Your restaurant's phone number`)" class="w-100"
                                                            v-on:keydown.enter.prevent />
                                                    </el-form-item>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!--end-->
                                </el-form>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="text-center py-3">
                                <el-button size="large" type="primary" class="mr-1 ml-1" @click="onSubmit(formRef)">
                                    <el-icon>
                                        <Plus />
                                    </el-icon>
                                    <span>{{ t("Update") }} </span>
                                </el-button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

    </div>
</div></template>
