<script
    lang="ts"
    src="@/scripts/zoneTable/components/createOrder/create.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 p-2" v-loading="isLoading">
        <div class="d-flex align-items-center justify-content-between">
            <div class="page-titles">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item" v-for="viewName in tableOrder.preStep" :key="viewName.value"><a
                            href="javascript:void(0)">{{ t(viewName.label) }}</a></li>
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">{{ viewSettings.title }}</a></li>
                </ol>
            </div>
            <div class="d-flex align-items-center">
                <div class="px-2 w-100">
                    <el-button size="default" type="primary" :disabled="!isReloadData" @click="reloadData()">
                        <div>{{ t("Check") }}</div>
                    </el-button>

                    <el-button size="default" type="danger"
                        @click="$emit('onChangeView', { viewName: 'ListData', data: null, })">
                        <div>{{ t("Back") }}</div>
                    </el-button>
                </div>
            </div>
        </div>

        <!--view listItemsSelect-->
        <div class="card">
            <div class="card-header">
                <div class="d-flex justify-content-between w-100">
                    <h5 class="px-3">{{ t("Order of table:") }} {{ tableOrder.zoneTable }}</h5>
                    <div class="px-2">
                        <el-button class=" my-2" type="primary" @click="isShowOrderItemModal = true">
                            <el-icon class="el-icon--right">
                                <Plus />
                            </el-icon>
                            <span class="mr-1">{{ t("Add pabulum") }}</span>
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
                                <th class="pl-0 py-2 text-center align-middle" style="width:4%">
                                    <div>{{ t("Image") }}</div>
                                </th>
                                <th class="pl-2 py-2 text-nowrap align-middle" style="width:15%">
                                    <div>{{ t("Name") }}</div>
                                </th>
                                <th class="pl-0 py-2 align-middle " style="width:20%">
                                    <div>{{ t("Specifications") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center text-nowrap align-middle" style="width:5%">
                                    <div>{{ t("Quantity") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle" style="width:20%">
                                    <div>{{ t("State") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle  text-nowrap" style="width:15%">
                                    <div>{{ t("Created") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-center align-middle  text-nowrap" style="width:15%">
                                    <div>{{ t("Last Modified") }}</div>
                                </th>
                                <th class="pl-0 py-2 text-right align-middle  text-nowrap" style="width:5%">
                                    <div>{{ t("Action") }}</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="listItemsOrder && listItemsOrder.length > 0 && listItemsOrder[0].photos">
                            <tr class="alert alert-dismissible border-0" v-for="(itemData, itemIndex) in listItemsOrder"
                                :key="itemIndex">
                                <td class="pl-2 text-center">
                                    {{ itemIndex + 1 }}
                                </td>
                                <td class="pl-2">
                                    <el-image v-if="itemData.photos" style="width: 60px; height: 60px"
                                        :src="itemData.photos[0]" fit="fill" />
                                    <el-image v-else style="width: 60px; height: 60px" src="" fit="fill" />
                                </td>
                                <td class="pl-2">
                                    {{ itemData.name }}
                                </td>
                                <td class="pl-2">
                                    {{ itemData.specifications }}
                                </td>
                                <td class="pl-2 text-center align-middle">
                                    {{ itemData.quantity }}
                                </td>
                                <td class="pl-2 text-center text-nowrap">
                                    <el-button class="w-100" :disabled="itemData.state !== statusEnum.FINISHED"
                                        @click="finishItemOrder(itemData, statusEnum.DONE)"
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
                                <td class="pl-2 text-center text-wrap">
                                    {{ formatDateTime(itemData.createdDate) }}
                                </td>
                                <td class="pl-2 text-center text-wrap">
                                    {{ formatDateTime(itemData.lastModifiedDate) }}
                                </td>
                                <td class="pl-2 text-right">
                                    <div
                                        v-if="itemData.state === statusEnum.PENDING || itemData.state === statusEnum.NOTORDER">
                                        <el-button class="border-1 border-danger ml-1 my-1"
                                            @click="cancelItemOrder(itemData)">
                                            <el-icon :size="15" class="text-danger" style=" vertical-align: middle; ">
                                                <Delete />
                                            </el-icon>
                                        </el-button>
                                    </div>
                                    <div v-if="itemData.state === statusEnum.FINISHED">
                                        <el-dropdown trigger="click">
                                            <el-button class="border-1 border-warning ml-1 my-1">
                                                <el-icon :size="15" class="text-warning" style=" vertical-align: middle; ">
                                                    <More />
                                                </el-icon>
                                            </el-button>
                                            <template #dropdown>
                                                <el-dropdown-menu>
                                                    <el-button class="border-0 mx-1 my-1" size="small"
                                                        @click="finishItemOrder(itemData, statusEnum.FAILED)">
                                                        <el-icon :size="15" style=" vertical-align: middle; ">
                                                            <Failed />
                                                        </el-icon>
                                                        <span class="ml-1">{{ t("Order Faild")
                                                        }}</span>
                                                    </el-button>
                                                </el-dropdown-menu>
                                            </template>
                                        </el-dropdown>
                                    </div>
                                    <div v-else>
                                    </div>

                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="10" class="text-center py-5">
                                    <strong>{{ t("Please order your first item")
                                    }}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card-footer">
                <div class="text-center py-3">
                    <el-button v-if="!isMustPay" size="large" type="warning"  @click="cancelOrder()">
                        <span class="mr-1">{{ t("Cancel") }}</span>
                    </el-button>
                    <el-button v-if="isMustPay" size="large" type="success"  @click="checkOut()">
                        <span class="mr-1">{{ t("Check Out") }}</span>
                    </el-button>
                    <el-button @click="submitItemsOrderList()" size="large" type="primary" >
                        <span class="mr-1">{{ t("Order") }}</span>
                    </el-button>
                </div>
            </div>
        </div>

        <!--Add item to order list  modal-->
        <el-dialog v-model="isShowOrderItemModal" :title="t('Select Items To Order')" width="90%">
            <div v-if="isShowOrderItemModal">
                <plus @selectItems="selectItems" :itemOrderList="listItemsOrder" />
            </div>
        </el-dialog>
    </div>
</template>
