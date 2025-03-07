
import type createBill from '@/scripts/zoneTable/components/createBill.js';


import { payTypeEnum } from '@/until/constant';

<script
    lang="ts"
    src="@/scripts/zoneTable/components/createBill/info.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 pt-2" v-loading="isLoading">
        <!--head-->
        <div class="d-flex align-items-center justify-content-between ">
            <div class="page-titles">
                <ol class="breadcrumb ">
                    <li class="breadcrumb-item" v-for="viewName in tableOrder.preStep" :key="viewName.value"><a
                            href="javascript:void(0)">{{ t(viewName.label) }}</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">{{ viewSettings.title }}</a></li>
                </ol>
            </div>
            <div class="d-flex align-items-center">
                <div class="ml-1 mr-4 w-100">
                    <el-button size="default" link type="danger" class="d-block d-md-none" @click="backFn()">
                        <div>
                            <i class="fas fa-times"></i>
                        </div>
                    </el-button>

                    <el-button size="default" type="danger" class="d-none d-md-block" @click="backFn()">
                        <div>{{ t("Back") }}</div>
                    </el-button>
                </div>
            </div>
        </div>

        <!--body-->
        <div>
            <div class="card">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-4 order-lg-2 mb-4">
                            <div v-if="listConfirmedOrder.length > 1" class="d-flex flex-row pb-2">
                                <div v-for="(baseOrderItems, dataIndex ) in listConfirmedOrder" :key="dataIndex"
                                    class="pr-1">
                                    <el-button :type="dataIndex === currentBill ? 'success' : ''"
                                        @click="selectBill(dataIndex)">{{ t('Order ') }}{{ dataIndex + 1
                                        }}</el-button>
                                </div>
                            </div>
                            <div v-for="(baseOrderItems, dataIndex ) in listConfirmedOrder" :key="dataIndex">
                                <div v-if="dataIndex === currentBill">
                                    <h4 class="d-flex justify-content-between align-items-center mb-3">
                                        <span class="text-black">{{ t("Your Order") }}</span>
                                        <span class="badge badge-success badge-pill">{{ baseOrderItems.list.length
                                        }}</span>
                                    </h4>

                                    <div v-if="dataIndex > 0">
                                        <el-checkbox v-model="isTheSameInfo">{{ t("The same info")
                                        }}</el-checkbox>
                                    </div>

                                    <ul class="list-group mb-3">
                                        <li v-for="(itemData, itemIndex) in baseOrderItems.list" :key="itemIndex"
                                            class="list-group-item d-flex justify-content-between lh-condensed">
                                            <div>
                                                <a class="my-0">{{ itemData.name }}</a>
                                                <small class="text-muted">{{ itemData.description }}</small>
                                            </div>
                                            <span class="text-muted">
                                                <span v-if="moneyType === '$'">{{ moneyType }}{{ itemData.costStr
                                                }}</span>
                                                <span v-else>{{ itemData.costStr }}{{ moneyType }}</span></span>
                                        </li>

                                        <li class="list-group-item d-flex justify-content-between">
                                            <span>{{ t("Total") }}</span>
                                            <strong class="text-black"><span v-if="moneyType === '$'">{{ moneyType }}{{
                                                baseOrderItems.totalCostStr }}</span>
                                                <span v-else>{{ baseOrderItems.totalCostStr }}{{ moneyType
                                                }}</span></strong>
                                        </li>
                                    </ul>

                                    <form>
                                        <div class="d-flex lex-row">
                                            <el-input v-model="itemModel.lastName" :placeholder="t(`Promo Code`)"
                                                v-on:keydown.enter.prevent />
                                            <el-button type="primary" class="">{{ t("Redeem") }}</el-button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-8 order-lg-1">
                            <div class="d-flex ">
                                <h4 class="mb-3 text-black">{{ t("Billing Info") }}</h4>
                                <h4 class="pl-2 text-warning" v-if="currentBill !== 0 && !isTheSameInfo">({{ t("Bill 2") }})
                                </h4>
                                <h4 class="pl-2 text-warning" v-if="currentBill === 0 && !isTheSameInfo">({{ t("Bill 1") }})
                                </h4>
                            </div>
                            <!--info bill 1-->
                            <div v-if="currentBill === 0 && !isTheSameInfo">
                                <el-form v-if="itemModel" ref="formRef" :model="itemModel" :rules="rules" label-width="0"
                                    v-on:keydown.enter='onSubmit(formRef)' class="ruleForm">

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div>
                                                <strong>{{ t("First Name") }}</strong><span
                                                    class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="firstName">
                                                    <el-input v-model="itemModel.firstName" size="large"
                                                        :placeholder="t('First Name')" v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div>
                                                <strong>{{ t("Last Name") }}</strong><span class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="lastName">
                                                    <el-input v-model="itemModel.lastName" size="large"
                                                        :placeholder="t('Last Name')" v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div>
                                                <strong>{{ t("Birth Day") }}</strong><span class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="birthDay">
                                                    <el-input v-model="itemModel.birthDay" size="large"
                                                        placeholder="MM/DD/YYYY" v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div>
                                                <strong>{{ t("Email") }}</strong>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="email">
                                                    <el-input v-model="itemModel.email" size="large"
                                                        :placeholder="t(`Customer's Email`)" v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div>
                                            <strong>{{ t("Address") }}</strong>
                                        </div>
                                        <div class="mt-2">
                                            <el-form-item label="" prop="address">
                                                <el-input v-model="itemModel.address" size="large"
                                                    :placeholder="t(`Customer's Address`)" v-on:keydown.enter.prevent />
                                            </el-form-item>
                                        </div>
                                    </div>

                                    <!-- <div class="row">
                                    <div class="col-md-5 mb-3">
                                        <label class="form-label">Country</label>
                                        <select class="default-select form-control wide w-100">
                                            <option selected>Choose...</option>
                                            <option value="1">United States</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select a valid country.
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">State</label>
                                        <select class="default-select form-control wide w-100">
                                            <option selected>Choose...</option>
                                            <option>California</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please provide a valid state.
                                        </div>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label for="zip" class="form-label">Zip</label>
                                        <input type="text" class="form-control" id="zip" placeholder="" required="">
                                        <div class="invalid-feedback">
                                            Zip code required.
                                        </div>
                                    </div>
                                </div> -->
                                    <hr class="mb-4">

                                    <h4 class="mb-3">{{ t("Payment") }}</h4>

                                    <el-radio-group v-model="itemModel.cardType" class="ml-1 pb-3">
                                        <el-radio v-for="payment in paymentEnum" :key="payment" :label="t(payment)"
                                            size="large" />
                                    </el-radio-group>
                                    <div v-if="itemModel.cardType !== paymentEnum.OTHER">
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="mb-3">
                                                    <div>
                                                        <strong>{{ t("Name On Card") }}</strong><span
                                                            class="ml-1 text-danger">*</span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <el-form-item label="" prop="cardName">
                                                            <el-input v-model="itemModel.cardName" size="large"
                                                                :placeholder="t(`Name On Card`)"
                                                                v-on:keydown.enter.prevent />
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="mb-3">
                                                    <div>
                                                        <strong>{{ t("Credit Card Number") }}</strong><span
                                                            class="ml-1 text-danger">*</span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <el-form-item label="" prop="cardName">
                                                            <el-input v-model="itemModel.cardNumber" size="large"
                                                                :placeholder="t(`Credit Card Number`)"
                                                                v-on:keydown.enter.prevent />
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3 mb-3">
                                                <div class="mb-3">
                                                    <div>
                                                        <strong>{{ t("Expiration") }}</strong><span
                                                            class="ml-1 text-danger">*</span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <el-form-item label="" prop="cardName">
                                                            <el-input v-model="itemModel.expiration" size="large"
                                                                :placeholder="t(`Expiration`)" v-on:keydown.enter.prevent />
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-3 mb-3">
                                                <div class="mb-3">
                                                    <div>
                                                        <strong>{{ t("CVV") }}</strong><span
                                                            class="ml-1 text-danger">*</span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <el-form-item label="" prop="cvv">
                                                            <el-input v-model="itemModel.cvv" size="large"
                                                                :placeholder="t(`CVV`)" v-on:keydown.enter.prevent />
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-form>
                            </div>

                            <!--info bill 2-->
                            <div v-else>
                                <el-form v-if="itemModel2" ref="formRef" :model="itemModel2" :rules="rules" label-width="0"
                                    v-on:keydown.enter='onSubmit(formRef)' class="ruleForm">

                                    <div class="row">
                                        <div class="col-md-6">
                                            <div>
                                                <strong>{{ t("First Name") }}</strong><span
                                                    class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="firstName">
                                                    <el-input v-model="itemModel2.firstName" size="large"
                                                        :placeholder="t('First Name')" v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div>
                                                <strong>{{ t("Last Name") }}</strong><span class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="lastName">
                                                    <el-input v-model="itemModel2.lastName" size="large"
                                                        :placeholder="t('Last Name')" v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6">
                                            <div>
                                                <strong>{{ t("Birth Day") }}</strong><span class="ml-1 text-danger">*</span>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="birthDay">
                                                    <el-input v-model="itemModel2.birthDay" size="large"
                                                        placeholder="MM/DD/YYYY" v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div>
                                                <strong>{{ t("Email") }}</strong>
                                            </div>
                                            <div class="mt-2">
                                                <el-form-item label="" prop="email">
                                                    <el-input v-model="itemModel2.email" size="large"
                                                        :placeholder="t(`Customer's Email`)" v-on:keydown.enter.prevent />
                                                </el-form-item>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div>
                                            <strong>{{ t("Address") }}</strong>
                                        </div>
                                        <div class="mt-2">
                                            <el-form-item label="" prop="address">
                                                <el-input v-model="itemModel2.address" size="large"
                                                    :placeholder="t(`Customer's Address`)" v-on:keydown.enter.prevent />
                                            </el-form-item>
                                        </div>
                                    </div>

                                    <!-- <div class="row">
                                    <div class="col-md-5 mb-3">
                                        <label class="form-label">Country</label>
                                        <select class="default-select form-control wide w-100">
                                            <option selected>Choose...</option>
                                            <option value="1">United States</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please select a valid country.
                                        </div>
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">State</label>
                                        <select class="default-select form-control wide w-100">
                                            <option selected>Choose...</option>
                                            <option>California</option>
                                        </select>
                                        <div class="invalid-feedback">
                                            Please provide a valid state.
                                        </div>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label for="zip" class="form-label">Zip</label>
                                        <input type="text" class="form-control" id="zip" placeholder="" required="">
                                        <div class="invalid-feedback">
                                            Zip code required.
                                        </div>
                                    </div>
                                </div> -->
                                    <hr class="mb-4">

                                    <h4 class="mb-3">{{ t("Payment") }}</h4>

                                    <el-radio-group v-model="itemModel2.cardType" class="ml-1 pb-3">
                                        <el-radio v-for="payment in paymentEnum" :key="payment" :label="t(payment)"
                                            size="large" />
                                    </el-radio-group>
                                    <div v-if="itemModel2.cardType !== paymentEnum.OTHER">
                                        <div class="row">
                                            <div class="col-md-6 mb-3">
                                                <div class="mb-3">
                                                    <div>
                                                        <strong>{{ t("Name On Card") }}</strong><span
                                                            class="ml-1 text-danger">*</span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <el-form-item label="" prop="cardName">
                                                            <el-input v-model="itemModel2.cardName" size="large"
                                                                :placeholder="t(`Name On Card`)"
                                                                v-on:keydown.enter.prevent />
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-6 mb-3">
                                                <div class="mb-3">
                                                    <div>
                                                        <strong>{{ t("Credit Card Number") }}</strong><span
                                                            class="ml-1 text-danger">*</span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <el-form-item label="" prop="cardName">
                                                            <el-input v-model="itemModel2.cardNumber" size="large"
                                                                :placeholder="t(`Credit Card Number`)"
                                                                v-on:keydown.enter.prevent />
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3 mb-3">
                                                <div class="mb-3">
                                                    <div>
                                                        <strong>{{ t("Expiration") }}</strong><span
                                                            class="ml-1 text-danger">*</span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <el-form-item label="" prop="cardName">
                                                            <el-input v-model="itemModel2.expiration" size="large"
                                                                :placeholder="t(`Expiration`)" v-on:keydown.enter.prevent />
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-md-3 mb-3">
                                                <div class="mb-3">
                                                    <div>
                                                        <strong>{{ t("CVV") }}</strong><span
                                                            class="ml-1 text-danger">*</span>
                                                    </div>
                                                    <div class="mt-2">
                                                        <el-form-item label="" prop="cvv">
                                                            <el-input v-model="itemModel2.cvv" size="large"
                                                                :placeholder="t(`CVV`)" v-on:keydown.enter.prevent />
                                                        </el-form-item>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card-footer">
                    <div class="text-center py-3">
                        <el-button @click="showPreview()" size="large" type="primary">
                            <span class="mr-1">{{ t("Preview") }}</span>
                        </el-button>
                        <el-button @click="createBill()" size="large" type="primary">
                            <span class="mr-1">{{ createBillLabel }}</span>
                        </el-button>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog v-model="isShowPreview" :title="t('Bill Preview')" width="40%" align-center>
            <div v-if="isShowPreview">
                <div v-if="listConfirmedOrder.length > 1" class="d-flex flex-row pb-3">
                    <div v-for="(baseOrderItems, dataIndex ) in listConfirmedOrder" :key="dataIndex" class="pr-1">
                        <el-button :type="dataIndex === currentBill ? 'success' : ''" @click="selectBill(dataIndex)">
                            {{ t('Bill ') }}{{ dataIndex + 1 }}
                        </el-button>
                    </div>
                </div>

                <!--use v-if to unmounted component-->
                <div v-if="currentBill === 0" class="border py-3">
                    <BillPreview :viewSettings="previewSettings" />
                </div>
                <div v-else class="border py-3">
                    <BillPreview :viewSettings="previewSettings" />
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isShowPreview = false">{{ t("Close") }}</el-button>
                </span>
            </template>
        </el-dialog>

    </div>
</template>