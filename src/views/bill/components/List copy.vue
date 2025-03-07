
import { Plus } from '@element-plus/icons-vue';

<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<script lang="ts" src="@/scripts/bill/components/list.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100" v-loading="isLoading">
        <div class="d-flex align-items-center pb-3">
            <div class="flex-fill">
                <h4 class="mb-0 d-none d-md-block">
                    <i class="fas fa-plus text-lightblue mr-2"></i>
                    <strong> {{ t("Bill") }}</strong>
                </h4>
            </div>
            <div class="d-flex align-items-center">
                <div class="ml-1 mr-4 w-100 row">
                    <el-button size="large" type="primary" class="d-none d-md-block" @click="refreshDataFn()">
                        <div>{{ t("Check") }}</div>
                    </el-button>
                    <el-button size="large" type="primary" class="d-none d-md-block" @click="isShowFilter = !isShowFilter">
                        <div>{{ t("Filt") }}</div>
                    </el-button>
                </div>
            </div>
        </div>

        <!--filter-->
        <div v-if="isShowFilter" :style="{ 'backgroundColor': allColorEnum.bgHead }"
        class="flex-fill d-flex flex-column w-100">
            <table class="table  table-head-fixed text-nowrap table-borderless w-100">
                <thead>
                    <tr>
                        <th class="text-nowrap align-middle" style="width:30%">
                        </th>
                        <th class="pl-0 pt-2 pb-2 align-middle" style="width:60%">
                        </th>
                    </tr>
                </thead>
                <tbody class=" ">
                    <tr>
                        <td class="pl-2">
                            <el-button class="w-100" type="primary" @click="changeSelectDateMode()">
                                <span class="mr-1">{{ pageStatus.selectDateMode }}</span>
                            </el-button>
                        </td>
                        <td class="pl-2">
                            <el-date-picker v-if="pageStatus.selectDateMode === selectDateEnum.aDay" v-model="currentDate"
                                type="date" :placeholder="t('Select a day')" size="large" />

                            <el-date-picker v-if="pageStatus.selectDateMode === selectDateEnum.days" v-model="currentDate"
                                type="daterange" :range-separator="To" start-placeholder="Start date"
                                end-placeholder="End date" size="large" />
                        </td>
                    </tr>
                    <tr>
                        <td class="pl-2">
                            {{ t("Show bill in a day by") }}
                        </td>
                        <td class="pl-2">
                            <el-button class="w-100" type="primary" @click="changeViewMode()">
                                <span class="mr-1">{{ pageStatus.viewMode }}</span>
                            </el-button>
                        </td>
                    </tr>
                    <tr v-if="pageStatus.viewMode !== viewModeEnum.allBill">
                        <td class="pl-2">
                            {{ t("Zone Select") }}
                        </td>
                        <td class="pl-2">
                            <el-select v-model="currentZoneId" filterable class="w-100" size="large"
                                :placeholder="t('Select a zone ...')">
                                <el-option v-for="zone in zonesList" :key="zone.id" :label="zone.name" :value="zone.id" />
                            </el-select>
                        </td>
                    </tr>
                    <tr v-if="pageStatus.viewMode === viewModeEnum.tableBill">
                        <td class="pl-2">
                            {{ t("Table Select") }}
                        </td>
                        <td class="pl-2">
                            <el-select v-model="currentTableId" filterable class="w-100" size="large"
                                :placeholder="t('Select a table ...')">
                                <el-option v-for="table in tablesList" :key="table.id" :label="table.name"
                                    :value="table.id" />
                            </el-select>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!--billsList view-->
        <el-scrollbar height="75vh" class="pr-3" style="margin-right: -15px">
            <table class="table  table-head-fixed text-nowrap table-borderless w-100">
                <thead>
                    <tr>
                        <th class="pl-0 pt-2 pb-2 text-nowrap align-middle" style="width:30%">
                        <td>{{ t("Bill code") }}</td>
                        </th>
                        <th class="pl-0 pt-2 pb-2 align-middle" style="width:1%">
                        <td>{{ t("Total cost") }}</td>
                        </th>
                        <th class="pl-0 pt-2 pb-2 align-middle" style="width:1%">
                        <td>{{ t("Zone") }}</td>
                        </th>
                        <th class="pl-0 pt-2 pb-2 align-middle" style="width:1%">
                        <td>{{ t("Table") }}</td>
                        </th>
                        <th class="pl-0 pt-2 pb-2 align-middle" style="width:1%">
                        <td>{{ t("Created date") }}</td>
                        </th>
                        <th class="pl-0 pt-2 pb-2 align-middle" style="width:1%">
                        <td>{{ t("Action") }}</td>
                        </th>
                    </tr>
                </thead>
                <tbody class=" ">
                    <tr v-for="itemData in listItems" :key="itemData.id">
                        <td class="pl-2">
                            {{ itemData.id }}
                        </td>
                        <td class="pl-2">
                            {{ itemData.totalCost }}
                        </td>
                        <td class="pl-2">
                            {{ itemData.zoneId }}
                        </td>
                        <td class="pl-2">
                            {{ itemData.tableId }}
                        </td>
                        <td class="pl-2">
                            {{ itemData.created }}
                        </td>
                        <td class="pl-2">
                            <el-button class="border-0 mx-1 my-1" size="small" type="primary"
                            @click="showBillDetail(itemData)">
                                <el-icon :size="15" style=" vertical-align: middle; ">
                                    <InfoFilled />
                                </el-icon>
                                <span class="ml-1">{{ t("Detail") }}</span>
                            </el-button>
                        </td>
                    </tr>
                    <tr v-if="!(listItems && listItems.length > 0)">
                        <td class="text-center" colspan="10">
                            <h5>{{ t("There are no bill") }}</h5>
                        </td>
                    </tr>
                </tbody>
            </table>
        </el-scrollbar>
        <!--view bill-->
        <el-dialog v-model="isShowBillDetail" title="Tips" width="40%" draggable>
            <el-scrollbar class="flex-fill mt-0 mt-md-3 pr-0">
                <table class="table table-head-fixed text-nowrap table-borderless w-100 ml-2">
                    <thead>
                        <tr>
                            <th class="pl-0 pt-2 pb-2 text-wrap  align-middle" style="width:45%">
                            </th>
                            <th class="pl-0 pt-2 pb-2  " style="width:15%">
                            </th>
                            <th class="pl-0 pt-2 pb-2  " style="width:20%">
                            </th>
                            <th class="pl-0 pt-2 pb-2  " style="width:20%">
                            </th>
                        </tr>
                    </thead>
                    <tbody style="font-size: 20px">
                        <tr>
                            <td class="pl-2 text-center  align-middle " colspan="4">
                                <h3>RESTAURANT NAME</h3>
                            </td>
                        </tr>
                        <tr>
                            <td class="pl-2 text-center  align-middle " colspan="4">
                                <h5>RESTAURANT ADDRESS</h5>
                            </td>
                        </tr>
                        <tr>
                            <td class="pl-2 text-center  align-middle " colspan="2">
                                <h4> {{ ("Bill") }}</h4>
                            </td>
                            <td class="pl-2 text-center  align-middle " colspan="2">
                                Billcode
                            </td>
                        </tr>
                        <tr>
                            <td class="">
                                <p class="my-0"><strong>{{ t("Zone") }}: 2</strong></p>
                                <p class="my-0"><strong>{{ t("Table") }}: 2</strong></p>
                            </td>
                            <td class="text-right text-wrap ">
                                <p class="my-0">{{ t("In time") }}: </p>
                                <p class="my-0">{{ t("Out time") }}: </p>
                            </td>
                            <td class="" colspan="2">
                                <p class="my-0">11/26/2023 18:16:19</p>
                                <p class="my-0">11/26/2023 17:16:19</p>
                            </td>
                        </tr>
                        <tr class="border-bottom pt-2">
                            <td class="pl-3">
                                {{ t("Pabulum") }}
                            </td>
                            <td>
                                {{ t("Count") }}
                            </td>
                            <td>
                                {{ t("Price") }}
                            </td>
                            <td>
                                {{ t("Cost") }}
                            </td>
                        </tr>
                        sssssssss
                        <tr v-for="itemData in itemsList" :key="itemData.id">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr class="border-top">
                            <td colspan="2">
                                {{ t("Total") }}
                            </td>
                            <td>9999999</td>
                        </tr>
                        <tr>
                            <td class="pt-2 pb-5 text-center  align-middle " colspan="4">
                                {{ ("Have nice a time") }}
                            </td>
                        </tr>

                    </tbody>
                </table>

            </el-scrollbar>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="isShowBillDetail = false">Cancel</el-button>
                    <el-button type="primary" @click="isShowBillDetail = false">
                        {{ t("Print") }}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped></style>>