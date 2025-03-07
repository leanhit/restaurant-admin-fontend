
import type createBill from '@/scripts/zoneTable/components/createBill.js';


import { payTypeEnum } from '@/until/constant';

<script
    lang="ts"
    src="@/scripts/zoneTable/components/createBill/split.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 pt-2" v-loading="isLoading">
        <!--head-->
        <div class="d-flex align-items-center justify-content-between">
            <div class="page-titles">
                <ol class="breadcrumb ">
                    <li class="breadcrumb-item" v-for="viewName in tableOrder.preStep" :key="viewName.value"><a
                            href="javascript:void(0)">{{ t(viewName.label) }}</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">{{ viewSettings.title }}</a></li>
                </ol>
            </div>
            <div class="d-flex align-items-center">
                <div class="ml-1 mr-4 w-100">
                    <el-button size="default" type="danger" @click="backFn()">
                        <div>{{ t("Back") }}</div>
                    </el-button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between w-100">
                    <h5 class="px-3">{{ t("Order of table:") }} {{ tableOrder.zoneTable }}</h5>
                    <div class="px-2">
                        <el-button @click="reviewOrder()" type="primary" style="width:120px">
                        <span class="mr-1">{{ t("Review") }}</span>
                    </el-button>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="table-responsive rounded card-table">
                    <table class="table table-striped table-head-fixed table-borderless w-100">
                        <thead>
                            <tr>
                                <th class="pl-2 py-2 text-center align-middle" style="width:1%">
                                    <div>{{ t("Index") }}</div>
                                </th>
                                <th class=" py-2 text-center align-middle" style="width:9%">
                                    <div>{{ t("Image") }}</div>
                                </th>
                                <th class="pl-2 py-2 text-nowrap align-middle w-15" style="width:15%">
                                    <div>{{ t("Name") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center text-nowrap align-middle" style="width:5%">
                                    <div>{{ t("Quantity") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle" style="width:10%">
                                    <div>{{ t("Price") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle" style="width:12%">
                                    <div>{{ t("Order 1") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle" style="width:16%">
                                    <div>{{ t("Split") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle" style="width:12%">
                                    <div>{{ t("Order 2") }}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="baseOrderItems.list.length > 0">
                            <tr v-for="(itemData, itemIndex) in baseOrderItems.list" :key="itemIndex">
                                <td class="pl-2 text-center">
                                    {{ itemIndex + 1 }}
                                </td>
                                <td class="pl-2">
                                    <el-image v-if="itemData.photos" style="width: 60px; height: 60px"
                                        :src="itemData?.photos[0]" fit="fill" />
                                    <el-image v-else style="width: 60px; height: 60px" src="" fit="fill" />
                                </td>
                                <td class="pl-2">
                                    {{ itemData.name }}
                                </td>
                                <td class="pl-2 text-center align-middle">
                                    {{ itemData.quantity }}
                                </td>
                                <td class="pl-2 text-center text-nowrap">
                                    <span v-if="moneyType === '$'">{{ moneyType }}{{ itemData.price
                                    }}</span>
                                    <span v-else>{{ itemData.price }}{{ moneyType }}</span>
                                </td>
                                <td class="text-center">{{ newOrderItems_1.list[itemIndex].quantity }}</td>
                                <td class="text-center">
                                    <el-button @click="splitItem(true, itemIndex)" type="primary" class="px-2">
                                        <el-icon style="vertical-align: middle">
                                            <ArrowLeftBold />
                                        </el-icon>
                                    </el-button>
                                    <el-button @click="splitItem(false, itemIndex)" type="primary" class="px-2">
                                        <el-icon style="vertical-align: middle">
                                            <ArrowRightBold />
                                        </el-icon>
                                    </el-button>
                                </td>
                                <td class="text-center">{{ newOrderItems_2.list[itemIndex].quantity }}</td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <strong>{{ t("Total cost:") }}</strong>
                                </td>
                                <td>
                                </td>
                                <td colspan="2" class="text-center"><strong>
                                        <span v-if="moneyType === '$'">{{ moneyType }}{{ baseOrderItems.totalCostStr
                                        }}</span>
                                        <span v-else>{{ baseOrderItems.totalCostStr }}{{ moneyType
                                        }}</span></strong>
                                </td>
                                <td class="text-center">
                                    <strong>{{ t("Bill 1: ") }}
                                        <span v-if="moneyType === '$'">{{ moneyType }}{{
                                            newOrderItems_1.totalCostStr
                                        }}</span>
                                        <span v-else>{{ newOrderItems_1.totalCostStr }}{{ moneyType
                                        }}</span></strong>
                                </td>
                                <td class="text-center">
                                    <el-button @click="autoSplit()" type="primary" class="px-2">
                                        <el-icon style="vertical-align: middle">
                                            <MagicStick />
                                        </el-icon>
                                    </el-button>
                                    <el-button @click="resetSplit()" type="warning" class="px-2">
                                        <el-icon style="vertical-align: middle">
                                            <SetUp />
                                        </el-icon>
                                    </el-button>
                                </td>
                                <td class="text-center">
                                    <strong>{{ t("Bill 2: ") }}
                                        <span v-if="moneyType === '$'">{{ moneyType }}{{
                                            newOrderItems_2.totalCostStr
                                        }}</span>
                                        <span v-else>{{ newOrderItems_2.totalCostStr }}{{ moneyType
                                        }}</span></strong>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="10" class="text-center py-5">
                                    <strong>{{ t("This order is no item to pay")
                                    }}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card-footer">
                <div class="text-center py-3">                    
                    <el-button @click="createBill()" size="large" type="primary" style="width:120px">
                        <span class="mr-1">{{ t("Next") }}</span>
                    </el-button>
                </div>
            </div>
        </div>

        <!--Confirm-->
        <el-dialog v-model="isShowConfirm" :title="t('Review order after split')" width="80%" align-center>
            <!-- use v-if to unmount Confirm component-->
            <el-tabs type="border-card" v-if="isShowConfirm">
                <el-tab-pane :label="t('Bill 1')">
                    <Confirm @onChangeView="{ }" :viewSettings="reviewSettings[0]" />
                </el-tab-pane>
                <el-tab-pane :label="t('Bill 2')">
                    <Confirm @onChangeView="{ }" :viewSettings="reviewSettings[1]" />
                </el-tab-pane>
            </el-tabs>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isShowConfirm = false">{{ t("Close") }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>