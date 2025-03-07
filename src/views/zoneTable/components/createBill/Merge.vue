
import type createBill from '@/scripts/zoneTable/components/createBill';


import type createBill from '@/scripts/zoneTable/components/mergeBill.js';


import { payTypeEnum } from '@/until/constant';

<script
    lang="ts"
    src="@/scripts/zoneTable/components/createBill/merge.ts"></script>
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
                <div class="d-flex justify-content-between align-items-center w-100">
                    <h5 class="px-3">{{ t("Order of table:") }} {{ tableOrder.zoneTable }}</h5>
                    <div class="px-2">
                        <el-button type="primary" @click="showSelection()">{{ t("Add Order") }}</el-button>
                    </div>
                </div>
            </div>

            <div class="card-body">
                <div class="table-responsive rounded card-table">
                    <table class="table table-striped table-head-fixed table-borderless w-100">
                        <thead>
                            <tr>
                                <th class="pl-2 py-2 align-middle" style="width:2%">
                                    <div>{{ t("Index") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle" style="width:3%">
                                    <div>{{ t("Image") }}</div>
                                </th>
                                <th class="pl-2 py-2 text-left align-middle w-15" style="width:25%">
                                    <div>{{ t("Name") }}</div>
                                </th>
                                <th class="pl-2 py-2 text-left align-middle w-15" style="width:25%">
                                    <div>{{ t("Zone/Table") }}</div>
                                </th>
                                <th class="pl-2 py-2 text-center align-middle w-15" style="width:15%">
                                    <div>{{ t("State") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center text-nowrap align-middle" style="width:10%">
                                    <div>{{ t("Quantity") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle" style="width:10%">
                                    <div>{{ t("Price") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle" style="width:10%">
                                    <div>{{ t("Cost") }}</div>
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
                                <td class="pl-2">
                                    {{ itemData.zoneTable }}
                                </td>

                                <td class="pl-2 text-center text-nowrap">
                                    <el-button class="w-100" disabled
                                        :type="itemData.state === statusEnum.DONE ? 'success' : (
                                            itemData.state === statusEnum.NOTORDER ? 'primary' : (
                                                itemData.state === statusEnum.PENDING ? 'default' : (
                                                    itemData.state === statusEnum.CANCELLED ? 'info' : (
                                                        itemData.state === statusEnum.FINISHED ? 'danger' : (
                                                            itemData.state === statusEnum.REJECTED ? 'info' : (
                                                                itemData.state === statusEnum.ACCEPTED ? 'warning' : 'dark'))))))">
                                        {{ t(itemData.state) }}
                                    </el-button>
                                </td>
                                <td class="pl-2 text-center align-middle">
                                    <div class="w-100 d-flex justify-content-around">
                                        {{ itemData.quantity }}
                                    </div>
                                </td>
                                <td class="pl-2 text-center text-nowrap">
                                    <span v-if="moneyType === '$'">{{ moneyType }}{{ itemData.price
                                    }}</span>
                                    <span v-else>{{ itemData.price }}{{ moneyType }}</span>
                                </td>
                                <td class="pl-2 text-center text-nowrap">
                                    <span v-if="moneyType === '$'">{{ moneyType }}{{ itemData.costStr }}</span>
                                    <span v-else>{{ itemData.costStr }}{{ moneyType }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td colspan="4"></td>
                                <td class="text-center">
                                    <el-button @click="groupItems(true)" type="primary" class="px-2">
                                        <el-icon style="vertical-align: middle">
                                            <CaretTop />
                                        </el-icon>
                                    </el-button>
                                    <el-button @click="groupItems(false)" type="warning" class="px-2">
                                        <el-icon style="vertical-align: middle">
                                            <SetUp />
                                        </el-icon>
                                    </el-button>
                                </td>
                                <td colspan="2" class="text-nowrap text-end">
                                    <div class="d-flex justifty-content-end pt-3">
                                        <h5 class="px-2">{{ t("Total Cost:") }}
                                            <span v-if="moneyType === '$'">{{ moneyType }}{{
                                                baseOrderItems.totalCostStr
                                            }}</span>
                                            <span v-else>{{ baseOrderItems.totalCostStr }}{{ moneyType }}</span>
                                        </h5>
                                    </div>
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
                    <el-button @click="createBill" size="large" type="primary" style="width:120px">
                        <span class="mr-1">{{ t("Next") }}</span>
                    </el-button>
                </div>
            </div>
        </div>
    </div>

    <!--dialog-->
    <div>
        <el-dialog v-model="isShowSelection" :title="t('Select order')" width="50%" draggable>
            <el-tabs type="border-card" v-if="isShowSelection">
                <el-tab-pane :label="t('Select Order')">
                    <div class="d-flex justify-content-between pb-2 h-100 align-items-center">
                        <strong>{{ t("Zone Select") }}</strong>
                        <el-select v-model="zoneSelectedId" filterable class="w-50" :placeholder="t('Select a zone ...')">
                            <el-option v-for="(zone, index) in zonesList" :key="index" :label="zone.name"
                                :value="zone.id" />
                        </el-select>
                        <el-button @click="loadZonesList(true)" class="pb-2" type="primary">{{ t("Check") }}</el-button>
                    </div>

                    <div v-for="(zone, zoneIndex) in zonesList" :key="zoneIndex" class="py-1">
                        <div class="w-100">
                            <div v-if="zone.isList" class="w-100 px-3">
                                <div v-for="(table, tableIndex) in currentZone.tables" :key="tableIndex">
                                    <div v-if="table.id === tableOrder.id" class="py-2 row">
                                        <a class="col-3"><strong>{{ table.name }}</strong></a>
                                        <el-button class="col-5" type="success" disabled>{{
                                            t("This is current order") }}
                                        </el-button>
                                    </div>
                                    <div v-else-if="table.isAdded" class="py-2 d-flex  h-100 align-items-center row">
                                        <a class="col-3"><strong>{{ table.name }}</strong></a>
                                        <el-button class="col-5" type="danger"
                                            @click="removeOrder(table.myOrder.id, table)">{{
                                                t("Remove Order") }}
                                        </el-button>
                                        <el-button class="col-3" v-if="table.status === statusEnum.OCCUPIED"
                                            @click="showReview(table)">{{
                                                t("Review Order") }}
                                        </el-button>
                                    </div>
                                    <div v-else class="py-2 d-flex  h-100 align-items-center row">
                                        <a class="col-3"><strong>{{ table.name }}</strong></a>
                                        <el-button class="col-5 w-100" :disabled="table.status !== statusEnum.OCCUPIED"
                                            :type="table.status === statusEnum.AVAILABLE ? 'default' : (
                                                table.status === statusEnum.OCCUPIED ? 'warning' : ' primary')"
                                            @click="addOrder(table)">
                                            <a v-if="table.status === statusEnum.OCCUPIED">{{ t('Add Order') }}</a>
                                            <a v-else>{{ t('There are no order') }}</a>
                                        </el-button>
                                        <el-button class="col-3" v-if="table.status === statusEnum.OCCUPIED"
                                            @click="showReview(table)">{{
                                                t("Review Order") }}
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </el-tab-pane>
                <el-tab-pane :label="t('Added Order')">
                    <div class="bg-default py-2 px-2">
                        <div v-if="listOrderToMerge.length === 1" class="d-flex justify-content-center">
                            <a><strong>{{ t("There are no added order") }}</strong></a>
                        </div>
                        <div v-else>
                            <div v-for="(order, index) in listOrderToMerge" :key="index">
                                <div v-if="index !== 0" class="row h-100 d-flex align-items-center">
                                    <a class="col-3 py-2">{{ order.zoneTable }}</a>
                                    <div class="col-9 py-2">
                                        <!-- <el-button type="warning" @click="showReview(order)">{{ t("Review Order")
                                            }}</el-button> -->
                                        <el-button type="success" @click="showConfirm(order)">{{ t("Confirm Order")
                                        }}</el-button>
                                        <el-button v-if="index !== 0" type="danger" @click="removeOrder(order.orderId)">
                                            {{ t("Remove Order") }}
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isShowSelection = false">{{ t("Close") }}</el-button>
                </span>
            </template>
        </el-dialog>

        <!--Confirm-->
        <el-dialog v-model="isShowConfirm" :title="t('Final order of table')" width="80%" align-center>
            <!-- use v-if to unmount Confirm component-->
            <div v-if="isShowConfirm">
                <Confirm @updateOrder="updateOrder" :viewSettings="confirmSettings" />
            </div>
        </el-dialog>


        <!--Review-->
        <el-dialog v-model="isShowReview" :title="t('Review order berfor merge')" width="80%" align-center>
            <!-- use v-if to unmount Confirm component-->
            <div v-if="isShowReview">
                <Review @onChangeView="{ }" :viewSettings="reviewSettings" />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isShowReview = false">{{ t("Close") }}</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>