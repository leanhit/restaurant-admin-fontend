
import { statusEnum } from '@/until/constant';


import { Plus } from '@element-plus/icons-vue';

<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<script lang="ts" src="@/scripts/order/activate/components/list.ts"></script>
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
                    <el-button size="default" type="primary" @click="reloadData()">
                        <div>{{ t("Check") }}</div>
                    </el-button>
                </div>
            </div>
        </div>

        <!--body-->
        <div class="card">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card-header border-0">
                        <div class="d-flex justify-content-between py-0">
                            <div class="w-60 row pl-2">
                                <el-button type="primary" size="large" @click="switchState()">
                                    {{ t("Switch State") }}
                                </el-button>
                                <el-select v-model="selectedStatus" filterable class="pl-2 col-6" size="large"
                                    :placeholder="t('Select a status ...')">
                                    <el-option v-for="status in statusOptions" :key="status" :label=t(status)
                                        :value="status" />
                                </el-select>
                            </div>
                            <div> </div>
                        </div>
                    </div>

                    <div class="card-body pt-0">
                        <div class="table-responsive rounded card-table">

                            <table class="table table-striped table-head-fixed table-borderless w-100 py-3">
                                <thead>
                                    <tr>
                                        <th class="pl-2 py-2 text-left align-middle" style="width:1%">
                                            <div>{{ t("Index") }}</div>
                                        </th>
                                        <th class="py-2  align-middle" style="width:1%">
                                            <div>{{ t("Image") }}</div>
                                        </th>
                                        <th class="py-2 text-wrap  align-middle" style="width:10%">
                                            <div>{{ t("Name") }}</div>
                                        </th>
                                        <th class="pl-0 py-2 text-wrap  align-middle " style="width:20%">
                                            <div>{{ t("Specifications") }}</div>
                                        </th>
                                        <th class="pl-0 py-2  text-center align-middle " style="width:10%">
                                            <div>{{ t("Zone/Table") }}</div>
                                        </th>
                                        <th class="pl-0 py-2  text-nowrap align-middle" style="width:1%">
                                            <div>{{ t("Quantity") }}</div>
                                        </th>
                                        <th class="pl-0 py-2 text-center align-middle" style="width:10%">
                                            <div>{{ t("State") }}</div>
                                        </th>
                                        <th class="pl-0 py-2 text-right align-middle  text-nowrap " style="width:1%">
                                            <div>{{ t("Action") }}</div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody v-if="listItems && listItems.length > 0">
                                    <tr v-if="selectedStatus === statusEnum.PENDING">
                                        <td colspan="6"></td>
                                        <td colspan="2" class="text-center">
                                            <div class="d-flex justify-content-end w-100">
                                                <el-button class="border-0 my-1 ml-1" size="small" type="primary"
                                                    style="width:100px" @click="acceptAllItem()">
                                                    <span class="ml-1">{{ t("Accept All") }}</span>
                                                </el-button>

                                                <el-button class="border-0 my-1" size="small" type="warning"
                                                    style="width:100px" @click="rejectAllItem()">
                                                    <span class="ml-1">{{ t("Reject All") }}</span>
                                                </el-button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="selectedStatus === statusEnum.ACCEPTED">
                                        <td colspan="7"></td>
                                        <td class="text-right">
                                            <div class="d-flex justify-content-end w-100">
                                                <el-button class="border-0 my-1 ml-1" size="small" type="success"
                                                    style="width:100px" @click="finishAllItem()">
                                                    <span class="ml-1">{{ t("All Finish") }}</span>
                                                </el-button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-for="(itemData, itemIndex) in listItems" :key="itemIndex">
                                        <td class="pl-2 text-center">
                                            {{ itemIndex + 1 }}
                                        </td>
                                        <td class="pl-2">
                                            <el-image style="width: 60px; height: 60px" :src="itemData?.photos[0]"
                                                fit="fill" v-if="itemData?.photos" />
                                            <el-image style="width: 60px; height: 60px" src="" fit="fill" v-else />
                                        </td>
                                        <td class="pl-2">
                                            {{ itemData.name }}
                                        </td>
                                        <td class="pl-2">
                                            {{ itemData.specifications }}
                                        </td>
                                        <td class="pl-2">
                                            {{ itemData.zoneTable }}
                                        </td>
                                        <td class="pl-2 text-center">
                                            {{ itemData.quantity }}
                                        </td>
                                        <td class="pl-2 text-center">
                                            {{ t(itemData.state) }}
                                        </td>

                                        <td class="pr-0 text-right ">
                                            <div class="" style="width:140px" v-if="selectedStatus === statusEnum.PENDING">
                                                <el-button class="border-0 my-1 ml-1" size="small" type="primary"
                                                    style="width:60px" @click="acceptItem(itemData)">
                                                    <span class="ml-1">{{ t("Accept") }}</span>
                                                </el-button>

                                                <el-button class="border-0 mx-1 my-1" size="small" type="warning"
                                                    style="width:60px" @click="rejectItem(itemData)">
                                                    <span class="ml-1">{{ t("Reject") }}</span>
                                                </el-button>
                                            </div>
                                            <div class="" v-if="selectedStatus === statusEnum.ACCEPTED">
                                                <el-button class="border-0 my-1 ml-1" size="small" type="success"
                                                    style="width:60px" @click="finishItem(itemData)">
                                                    <span class="ml-1">{{ t("Finish") }}</span>
                                                </el-button>
                                            </div>
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

    <!--popup-->
    <el-dialog v-model="isShowConfirmModal" title="" width="30%" destroy-on-close center>
        <div class="w-60 pl-2">
            <h5 class="">{{ t("Select an reason below") }}</h5>
            <el-select v-model="rejectReason" filterable class="w-100  px-0" size="large"
                :placeholder="t('Select a reason ...')">
                <el-option v-for="rejectReason in rejectReasonOptions" :key="rejectReason" :label=t(rejectReason)
                    :value="rejectReason" />
            </el-select>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="isShowConfirmModal = false">Cancel</el-button>
                <el-button type="primary" @click="confirmFunction()">
                    {{ t("Confirm") }}
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
