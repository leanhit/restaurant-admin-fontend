<script
    lang="ts"
    src="@/scripts/bill/components/billDetail.ts"></script>
<template>
    <div class="row text-center px-0">
        <h4 class="col-12 ">{{ itemModel.restaurantInfo.name }}</h4>
        <h5 class=" col-12">{{ itemModel.restaurantInfo.address }}</h5>
        <div class="col-12  row">
            <div class="col-3"></div>
            <div class="col-6 d-flex justify-content-between h-100 align-items-center">
                <h5 class="pl-0">{{ t("Bill") }}</h5>
                <a class="pr-0">{{ itemModel.billInfo.code }}</a>
            </div>
            <div class="col-3"></div>
        </div>
        <div class="col-12 d-flex justify-content-between px-3 pb-3">
            <div class="">
                <div class="d-flex flex-row">
                    <strong> <a>{{ t("Zone") }}:</a>
                        <a class="pl-1">{{ itemModel.billInfo.zone }}</a></strong>
                </div>
                <div class="d-flex flex-row">
                    <strong> <a>{{ t("Table") }}:</a>
                        <a class="pl-1">{{ itemModel.billInfo.table }}</a></strong>
                </div>
            </div>

            <div class="">
                <div class="d-flex flex-row">
                    <a>{{ t("In Time") }}:</a>
                    <a class="pl-1">{{ formatDateTime(itemModel.billInfo.timeIn) }}</a>
                </div>
                <div class="d-flex flex-row">
                    <a>{{ t("Out Time") }}:</a>
                    <a class="pl-1">{{ formatDateTime(itemModel.billInfo.timeOut) }}</a>
                </div>
            </div>
        </div>
        <div class="px-2 col-12">
            <table class="table table-head-fixed table-borderless w-100">
                <thead>
                    <tr>
                        <th class="text-left align-middle w-15 border-bottom" style="width:50%">
                            <div>{{ t("Name") }}</div>
                        </th>
                        <th class="text-center text-nowrap align-middle border-bottom" style="width:10%">
                            <div>{{ t("Quantity") }}</div>
                        </th>
                        <th class=" text-center align-middle border-bottom" style="width:20%">
                            <div>{{ t("Price") }}</div>
                        </th>
                        <th class="text-right align-middle border-bottom" style="width:20%">
                            <div>{{ t("Cost") }}</div>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="itemModel.billInfo.itemList">
                    <tr v-for="(itemData, itemIndex) in itemModel.billInfo.itemList" :key="itemIndex">
                        <td class="text-left ">
                            {{ itemData.name }}
                        </td>
                        <td>
                            {{ itemData.quantity }}
                        </td>
                        <td>
                            <span v-if="moneyType === '$'">
                                {{ moneyType }}{{ itemData.price }}
                            </span>
                            <span v-else>
                                {{ itemData.price }}{{ moneyType }}
                            </span>
                        </td>
                        <td class="text-right text-nowrap">
                            <span v-if="moneyType === '$'">
                                {{ moneyType }}{{ itemData.costStr }}
                            </span>
                            <span v-else>
                                {{ itemData.costStr }}{{ moneyType }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" class="border-top"></td>
                        <td class="text-right border-top text-nowrap">{{ t("Sub Total") }}</td>
                        <td class="text-right border-top  text-nowrap">
                            <span v-if="moneyType === '$'">
                                {{ moneyType }}{{ itemModel.billInfo.subTotal }}
                            </span>
                            <span v-else>
                                {{ itemModel.billInfo.subTotal }}{{ moneyType }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td class="text-right">{{ t("Tax") }}({{ taxPercent }}%)</td>
                        <td class="text-right  text-nowrap">
                            <span v-if="moneyType === '$'">
                                {{ moneyType }}{{ itemModel.billInfo.tax }}
                            </span>
                            <span v-else>
                                {{ itemModel.billInfo.tax }}{{ moneyType }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2"></td>
                        <td class="text-right border-top  text-nowrap" colspan="2">
                            <div class="d-flex justify-content-between">
                            <h5>{{ t("Total") }}</h5>

                            <h5>
                            <span v-if="moneyType === '$'">
                                {{ moneyType }}{{ itemModel.billInfo.total }}
                            </span>
                            <span v-else>
                                {{ itemModel.billInfo.total }}{{ moneyType }}
                            </span></h5>
                        </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="itemModel.paymentInfo.cardNumber !== 0" class="py-3">
            <div class="col-6 text-left px-5">
                <a><strong>{{ t("Payment") }}</strong></a>
                <div>
                    <a class="pr-2">{{ t("Card:") }}</a>
                    <a>{{ itemModel.paymentInfo.card }}</a>
                </div>
                <div>
                    <a class="pr-2">{{ t("Card Number:") }}</a>
                    <a>{{ itemModel.paymentInfo.cardNumber }}</a>
                </div>
            </div>
            <div class="col-6">
                <div class=" d-flex h-100 align-items-center justify-content-center">
                    <a><strong>{{ itemModel.restaurantInfo.sologan }}</strong></a>
                </div>
            </div>
        </div>
        <div class="col-12 py-3" v-else>
            <div class=" d-flex h-100 align-items-center justify-content-center">
                <a><strong>{{ itemModel.restaurantInfo.sologan }}</strong></a>
            </div>
        </div>

    </div>
</template>

<style scoped>
body {
    font-size: 18px;
}
</style>