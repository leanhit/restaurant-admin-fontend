
import { statusEnum } from '@/until/constant';


import { Plus } from '@element-plus/icons-vue';

<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<script lang="ts" src="@/scripts/order/all/components/list.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 p-2" v-loading="isLoading">
        <!--header-->
        <div class="d-flex align-items-center justify-content-between">
            <div class="page-titles">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">{{ viewSettings.title }}</a></li>
                </ol>
            </div>
            <div class="d-flex align-items-center">
                <div class="px-2 w-100">
                    <el-button size="default" type="primary" @click="refreshDataFn()">
                        <div>{{ t("Check") }}</div>
                    </el-button>
                </div>
            </div>
        </div>

        <!--body-->
        <div class="card">
            <div class="row">
                <div class="col-lg-12">
                    <!-- <div class="card-header border-0">
                        <el-input v-model="filterData" filterable :placeholder='t("Search Item...")'
                            style="min-width: 16rem" size="large">
                            <template #prepend>
                                <el-icon style="vertical-align: middle">
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                    </div> -->

                    <div class="card-body pt-0">
                        <div class="table-responsive rounded card-table">
                            <table class="table table-striped table-head-fixed table-borderless w-100 py-3">
                                <thead>
                                    <tr>
                                        <th class="pl-2 py-2 text-left align-middle" style="width:5%">
                                            <div>{{ t("Index") }}</div>
                                        </th>
                                        <th class="pl-0 py-2  text-center align-middle " style="width:35%">
                                            <div>{{ t("Zone/Table") }}</div>
                                        </th>
                                        <th class="pl-0 py-2   text-center align-middle" style="width:20%">
                                            <div>{{ t("Created") }}</div>
                                        </th>
                                        <th class="pl-0 py-2 text-center align-middle" style="width:20%">
                                            <div>{{ t("Last Modified") }}</div>
                                        </th>
                                        <th class="pl-0 py-2 text-center text-nowrap align-middle" style="width:15%">
                                            <div>{{ t("State") }}</div>
                                        </th>
                                        <th class="pl-0 py-2 text-right align-middle  text-nowrap" style="width:5%">
                                            <div>{{ t("Action") }}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="listItems && listItems.length > 0">
                                    <tr v-for="(itemData, itemIndex) in listItems" :key="itemIndex">
                                        <td class="pl-2 text-center">
                                            {{ itemIndex + 1 }}
                                        </td>
                                        <td class="pl-2  text-center">
                                            {{ itemData.zoneTable }}
                                        </td>
                                        <td class="pl-2  text-center">
                                            {{ formatDateTime(itemData.createdDate) }}
                                        </td>
                                        <td class="pl-2 text-center">
                                            {{ formatDateTime(itemData.lastModifiedDate) }}
                                        </td>
                                        <td class="pl-2 text-center">
                                            {{ t(itemData.state) }}
                                        </td>

                                        <td class="pr-0 text-right ">
                                            <el-dropdown trigger="click">
                                                <el-button class="my-1" type="primary" size="small">
                                                    <el-icon :size="15" style=" vertical-align: middle; ">
                                                        <More />
                                                    </el-icon>
                                                </el-button>
                                                <!-- <template #dropdown>
                                                    <el-dropdown-menu>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <el-button class="border-0 mx-1 my-1" size="small"
                                                                            @click="showOrderDetail(itemData)">
                                                                            <el-icon :size="15"
                                                                                style=" vertical-align: middle; ">
                                                                                <InfoFilled />
                                                                            </el-icon>
                                                                            <span class="ml-1">{{ t("Order Detail")
                                                                            }}</span>
                                                                        </el-button>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <el-button class="border-0 mx-1 my-1" size="small"
                                                                            @click="showBillOfOrder(itemData)">
                                                                            <el-icon :size="15"
                                                                                style=" vertical-align: middle; ">
                                                                                <List />
                                                                            </el-icon>
                                                                            <span class="ml-1">{{ t("Bill Of Order")
                                                                            }}</span>
                                                                        </el-button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </el-dropdown-menu>
                                                </template> -->
                                            </el-dropdown>
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr>
                                        <td class="text-center py-5" colspan="7">
                                            <strong>{{ t("There are no item") }}</strong>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- pagination -->
    <div class="mt-2 d-flex justify-content-end">
        <el-pagination v-model:current-page="pageStatus.currentPage" v-model:page-size="pageStatus.pageSize"
            :page-sizes="[10, 15, 25, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
            :total="pageStatus.totalItems" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

    <el-dialog v-model="isShowBillOfOrder" :title="t('Bill Of Order')"  width="80%" >
        <div v-if="isShowBillOfOrder">

        </div>
    </el-dialog>

    <el-dialog v-model="isShowOrderDetail" :title="t('Order Detail')"  width="80%" >
        <div v-if="isShowOrderDetail">
            <Review :viewSettings="reviewSettings" />
        </div>
    </el-dialog>
</template>
