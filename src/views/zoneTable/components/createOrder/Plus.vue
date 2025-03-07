<script
    lang="ts"
    src="@/scripts/zoneTable/components/createOrder/plus.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100 p-2" v-loading="isLoading">
        <el-scrollbar class="w-100 flex-fill">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <div class="d-flex align-items-center">
                            <strong class="text-center pr-2">{{ t("Select Category:") }}</strong>
                            <el-select v-model="selectedCategoryId" filterable class=""
                                :placeholder="t('Select a category ...')"
                                @change="selectCategory({ id: selectedCategoryId })">
                                <el-option v-for="category in menu" :key="category.id" :label="category.name"
                                    :value="category.id" />
                            </el-select>
                        </div>

                        <el-button  type="primary" style="width:110px"
                            @click="changeViewMode(pageStatus.viewMode)">
                            {{ t(pageStatus.viewMode) }}
                        </el-button>
                    </div>
                    <div class="d-flex justify-content-between pt-3">
                        <el-input v-model="filterData" filterable :placeholder='t("Search Item...")'
                            style="min-width: 16rem" class="w-50">
                            <template #prepend>
                                <el-icon style="vertical-align: middle">
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                        <div class="d-flex align-items-center">
                            <el-button type="primary"  @click="itemOrderPlus(true)">
                                {{ t("Confirm") }}
                            </el-button>
                            <el-button  @click="itemOrderPlus(false)">{{ t("Cancel")
                            }}</el-button>
                        </div>

                    </div>
                </div>

                <!-- View listItems -->
                <div class="card-body">
                    <!-- Card mode-->
                    <div class="row" v-if="pageStatus.viewMode === viewModeEnum.CARDMODE">
                        <div class="col-md-6 col-lg-4 col-xl-4 px-1" v-for="(itemData, itemIndex) in listItems"
                            :key="itemIndex">
                            <div class="d-flex align-items-center flex-column mt-2 ">
                                <el-card class="w-100">
                                    <template #header>
                                        <div class="card-header">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div class="row">
                                                    <span class="pl-2 col-12"><strong>{{ itemData.name
                                                    }}</strong></span>
                                                    <div class="col-12 d-flex align-items-center py-2"
                                                        v-if="itemData.availableStatus === statusEnum.AVAILABLE">
                                                        <el-button @click="countItem(false, itemData)" size="large"
                                                            class="px-3" type="primary">
                                                            <el-icon style="vertical-align: middle">
                                                                <Minus />
                                                            </el-icon>
                                                        </el-button>
                                                        <a class="pl-3"
                                                            style="font-size: 30px; width: 55px; justify-content: center;"><strong>{{
                                                                itemData.quantity }}</strong></a>
                                                        <el-button @click="countItem(true, itemData)" size="large"
                                                            class="px-3" type="primary">
                                                            <el-icon style="vertical-align: middle">
                                                                <Plus />
                                                            </el-icon>
                                                        </el-button>
                                                        <el-button :disabled="itemData.quantity === 0"
                                                            @click="itemData.showSpecifications = !itemData.showSpecifications"
                                                            type="warning" size="large">{{
                                                                t("Require") }}</el-button>
                                                    </div>
                                                    <div v-else class="pl-2 py-3">
                                                        {{ t(itemData.availableStatus) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                    <table class="table table-head-fixed table-borderless w-100">
                                        <thead>
                                            <tr>
                                                <th class="pl-0 py-2" style="width:20%">
                                                </th>
                                                <th class="pl-0 py-2" style="width:80%">
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-if="itemData.showSpecifications || (itemData?.specifications.length > 0 && itemData?.quantity > 0)">
                                                <td class="px-0 ">{{ t("Customer require") }}</td>
                                                <td class="px-2 "><el-input v-model="itemData.specifications"
                                                        @change="addSpecifications(itemData)"
                                                        :placeholder="t('Add require here ...')" /></td>
                                            </tr>
                                            <tr>
                                                <td class="px-0 ">{{ t("Description") }}</td>
                                                <td class="px-2 ">{{ itemData.description }}</td>
                                            </tr>
                                            <tr>
                                                <td class="px-0 ">{{ t("Count") }}</td>
                                                <td class="px-2 ">{{ itemData.maxStock }}</td>
                                            </tr>
                                            <tr>
                                                <td class="px-0 ">{{ t("Price") }}</td>
                                                <td class="px-2 "><span v-if="moneyType === '$'">{{ moneyType }}{{
                                                    itemData.price
                                                }}</span>
                                                    <span v-else>{{ itemData.price }}{{ moneyType }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <el-carousel indicator-position="outside">
                                        <el-carousel-item v-for="(img, index) in itemData.photos" :key="index">
                                            <el-image style="width: 200px; height: auto" :src="img" fit="fill" />
                                        </el-carousel-item>
                                    </el-carousel>
                                </el-card>

                            </div>
                        </div>
                    </div>
                    <!-- Table Mode -->
                    <div v-if="pageStatus.viewMode === viewModeEnum.TABLEMODE">
                        <table class="table table-striped table-head-fixed table-borderless w-100">
                            <thead>
                                <tr>
                                    <th class="pl-2  text-nowrap py-2 text-center align-middle" style="width:1%">
                                        <div>{{ t("Index") }}</div>
                                    </th>
                                    <th class="pl-0 py-2 text-center align-middle">
                                        <div>{{ t("Image") }}</div>
                                    </th>
                                    <th class="pl-2 py-2 text-nowrap align-middle w-15">
                                        <div>{{ t("Name") }}</div>
                                    </th>
                                    <th class="pl-0 py-2 text-nowrap align-middle w-30">
                                        <div>{{ t("Description") }}</div>
                                    </th>
                                    <th class="pl-0 py-2 text-center align-middle">
                                        <div>{{ t("Price") }}</div>
                                    </th>
                                    <th class="pl-0 py-2 text-center text-nowrap align-middle">
                                        <div>{{ t("Max Stock") }}</div>
                                    </th>
                                    <th class="pl-0 py-2 text-center align-middle  text-nowrap">
                                        <div>{{ t("Action") }}</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class=" ">
                                <tr v-for="(itemData, itemIndex) in listItems" :key="itemIndex">
                                    <td class="pl-2 text-center">
                                        {{ itemIndex + 1 }}
                                    </td>
                                    <td class="pl-2">
                                        <el-image style="width: 60px; height: 60px" v-if="itemData.photos"
                                            :src="itemData?.photos[0]" fit="fill" />
                                        <el-image style="width: 60px; height: 60px" v-else src="" fit="fill" />
                                    </td>
                                    <td class="pl-2">
                                        {{ itemData.name }}
                                    </td>
                                    <td class="pl-2">
                                        {{ itemData.description }}
                                        <div
                                            v-if="itemData.showSpecifications || (itemData?.specifications.length > 0 && itemData?.quantity > 0)">
                                            <a class="px-0 "><strong>{{ t("Customer require") }}:</strong></a>
                                            <el-input v-model="itemData.specifications" class="px-0"
                                                @change="addSpecifications(itemData)"
                                                :placeholder="t('Add require here ...')" />
                                        </div>
                                    </td>
                                    <td class="pl-2 text-center align-middle text-nowrap">
                                        <span v-if="moneyType === '$'">{{ moneyType }}{{ itemData.price
                                        }}</span>
                                        <span v-else>{{ itemData.price }}{{ moneyType }}</span>
                                    </td>
                                    <td class="pl-2 text-center align-middle">
                                        {{ itemData.maxStock }}
                                    </td>
                                    <td class="pl-2 text-center">
                                        <!--pc view -->
                                        <div class="d-none d-md-block">
                                            <div class="d-flex align-items-center justify-content-end"
                                                v-if="itemData.availableStatus === statusEnum.AVAILABLE">
                                                <el-button @click="countItem(false, itemData)" size="large" class="px-3"
                                                    type="primary">
                                                    <el-icon style="vertical-align: middle">
                                                        <Minus />
                                                    </el-icon>
                                                </el-button>
                                                <a class="pl-1"
                                                    style="font-size: 30px; width: 55px; justify-content: center;"><strong>{{
                                                        itemData.quantity }}</strong></a>
                                                <el-button @click="countItem(true, itemData)" size="large" class="px-3"
                                                    type="primary">
                                                    <el-icon style="vertical-align: middle">
                                                        <Plus />
                                                    </el-icon>
                                                </el-button>
                                                <el-button :disabled="itemData.quantity === 0"
                                                    @click="itemData.showSpecifications = !itemData.showSpecifications"
                                                    type="warning" size="large">{{
                                                        t("Require") }}</el-button>
                                            </div>
                                            <div v-else class="">
                                                {{ t(itemData.availableStatus) }}
                                            </div>
                                        </div>
                                        <!--mobie view-->
                                        <div class="d-md-none w-100">
                                            <div class="col-12 d-flex align-items-center py-2"
                                                v-if="itemData.availableStatus === statusEnum.AVAILABLE">
                                                <el-button @click="countItem(false, itemData)" size="large" class="px-3"
                                                    type="primary">
                                                    <el-icon style="vertical-align: middle">
                                                        <Minus />
                                                    </el-icon>
                                                </el-button>
                                                <a class="pl-3"
                                                    style="font-size: 30px; width: 55px; justify-content: center;"><strong>{{
                                                        itemData.quantity }}</strong></a>
                                                <el-button @click="countItem(true, itemData)" size="large" class="px-3"
                                                    type="primary">
                                                    <el-icon style="vertical-align: middle">
                                                        <Plus />
                                                    </el-icon>
                                                </el-button>
                                                <el-button :disabled="itemData.quantity === 0"
                                                    @click="itemData.showSpecifications = !itemData.showSpecifications"
                                                    type="warning" size="large">{{
                                                        t("Require") }}</el-button>
                                            </div>
                                            <div v-else class="d-flex align-items-center px-4">
                                                <el-icon style="vertical-align: middle">
                                                    <Lock />
                                                </el-icon>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--No item-->
                    <div v-if="!(listItems && listItems.length > 0)" class="mt-5 d-flex justify-content-center">
                        <h5>{{ t("There are no item.") }}</h5>
                    </div>
                    <!-- pagination -->
                    <div class="mt-3 d-flex justify-content-end">
                        <el-pagination v-model:current-page="pageStatus.currentPage" v-model:page-size="pageStatus.pageSize"
                            :page-sizes="[10, 15, 25, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                            :total="pageStatus.totalItems" @size-change="handleSizeChange"
                            @current-change="handleCurrentChange" />
                    </div>
                </div>
                <div class="card-footer">
                    <div class="text-center py-3">
                        <el-button size="large" type="primary" @click="itemOrderPlus(true)">
                            {{ t("Confirm") }}
                        </el-button>
                        <el-button size="large" @click="itemOrderPlus(false)">{{ t("Cancel") }}</el-button>
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<style scoped lang="scss"></style>
