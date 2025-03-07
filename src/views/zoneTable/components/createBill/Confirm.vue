
import type createBill from '@/scripts/zoneTable/components/createBill.js';


import { payTypeEnum } from '@/until/constant';

<script
    lang="ts"
    src="@/scripts/zoneTable/components/createBill/confirm.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 pt-2" v-loading="isLoading">
        <!--head-->
        <div v-if="reviewType === 0" class="d-flex align-items-center justify-content-between ">
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
        <div v-else>
            <h4 class="py-2">
                <a>{{ t("Order of table: ") }}</a><a class="px-1"> {{ baseOrderItems.zoneTable }}</a>
            </h4>
        </div>

        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center w-100">
                    <h5 class="px-3">{{ t("Order of table:") }} {{ tableOrder.zoneTable }}</h5>
                    <div class="px-2 d-flex flex-row  align-items-center">
                        <h6 class="px-0">{{ t("Options:") }}</h6>
                        <el-select v-model="payType" filterable :placeholder="t('Filter by ...')" class="px-2">
                            <el-option v-for="(type, itemIndex) in payTypeEnum" :key="itemIndex" :label="t(type)"
                                :value="type" 
                                @click="createBill()"/>
                        </el-select>
                    </div>
                </div>
            </div>
            
            <div class="card-body">
                <div class="table-responsive rounded card-table">
                    <table class="table table-striped table-head-fixed table-borderless w-100">
                        <thead>
                            <tr>
                                <th class="pl-2 pb-2 align-middle text-nowrap" style="width:2%">
                                    <div>{{ t("Index") }}</div>
                                </th>
                                <th class="pl-0 pb-2  text-nowrap text-center align-middle" style="width:3%">
                                    <div>{{ t("Image") }}</div>
                                </th>
                                <th class="pl-2 pb-2 text-center align-middle w-15" style="width:35%">
                                    <div>{{ t("Name") }}</div>
                                </th>
                                <th class="pl-2 pb-2 text-center align-middle w-15" style="width:15%">
                                    <div>{{ t("State") }}</div>
                                </th>
                                <th class="pl-0 pb-2 text-center text-nowrap align-middle" style="width:15%">
                                    <div>{{ t("Quantity") }}</div>
                                </th>
                                <th class="pl-0 pb-2 text-center align-middle" style="width:15%">
                                    <div>{{ t("Price") }}</div>
                                </th>
                                <th class="pl-0 pb-2 text-center align-middle" style="width:15%">
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
                                <td class="pl-2 text-center text-nowrap">
                                    <el-button class="w-100" :disabled="true || itemData.state !== statusEnum.FINISHED"
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
                                        <div v-if="itemData.state !== statusEnum.DONE" class="d-flex align-items-center"
                                            style="width:100px">
                                            <el-button @click="countItem(false, itemData)" type="primary" class="px-2">
                                                <el-icon style="vertical-align: middle">
                                                    <Minus />
                                                </el-icon>
                                            </el-button>

                                            <input type="text" class="text-dark px-1" v-model="itemData.quantity" disabled
                                                style="font-size:18px; width:30px">

                                            <el-button @click="countItem(true, itemData)" type="primary" class="px-2">
                                                <el-icon style="vertical-align: middle">
                                                    <Plus />
                                                </el-icon>
                                            </el-button>
                                        </div>
                                        <div v-else>
                                            {{ itemData.quantity }}
                                        </div>
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
                                    <div v-if="reviewType!==1">
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
                                </div>
                                </td>
                                <td colspan="2" class="text-nowrap text-end">
                                    <div class="d-flex justifty-content-end pt-3">
                                        <h5 class="px-2">{{ t("Total Cost:") }}</h5>
                                        <h5 class="px-0">
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
                                    <strong>{{ t("This order is no item")
                                    }}</strong>
                                </td>
                            </tr>
                            <tr v-if="reviewType !== 0">
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
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card-footer">
                <div class="text-center py-3">
                    <div v-if="reviewType === 0" class="text-center">
                        <el-button @click="createBill()" size="large" type="primary" >
                            <span class="mr-1">{{ t("Next") }}</span>
                        </el-button>
                    </div>
                    <div v-if="reviewType === 2" class="text-center">
                        <el-button @click="updateOrder(true)" size="large" type="primary" >
                            <span class="mr-1">{{ t("Update") }}</span>
                        </el-button>
                        <el-button @click="updateOrder(false)" size="large" >
                            <span class="mr-1">{{ t("Cancel") }}</span>
                        </el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>