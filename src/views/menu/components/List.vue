<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<script lang="ts" src="@/scripts/menu/components/list.ts"></script>

<template>
    <div class="flex-fill d-flex flex-column w-100 " v-loading="isLoading">
        <div class="d-flex align-items-center justify-content-between ">
            <div class="page-titles">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item active"><a href="javascript:void(0)">{{ viewSettings.title }}</a></li>
                </ol>
            </div>
            <div class="d-flex align-items-center">
                <div class="ml-1 mr-4 w-100">
                    <el-button size="default" type="primary" class="d-none d-md-block" @click="refreshDataFn()">
                        <div>{{ t("Check") }}</div>
                    </el-button>
                </div>
            </div>
        </div>


        <div class="row">
            <div class="col-lg-5 order-lg-2 py-1">
                <div class="card">
                    <div class="card-header">
                        <h6>{{ t("Category Control") }}</h6>
                    </div>
                    <div class="card-body">
                        <div class="">
                            <el-select v-model="selectedCategoryId" filterable size="large" class="col-7"
                                :placeholder="t('Select a category ...')"
                                @change="selectCategory({ id: selectedCategoryId })">
                                <el-option v-for="category in menu" :key="category.id" :label="category.name"
                                    :value="category.id" />
                            </el-select>
                            <el-select v-model="categoryDetail.availableStatus" size="large" class="col-5"
                                :placeholder="t('Change category status ...')" disabled
                                @change="changeCategoryStatus(categoryDetail)">
                                <el-option v-for="category in categoryStatusOptions" :key="category.id"
                                    :label="category.label" :value="category.value" />
                            </el-select>
                        </div>
                        <div class="d-flex justify-content-center pt-3">
                            <el-button class="" type="primary"
                                @click="$emit('onChangeView', { viewName: viewNameEnum.ADDCATEGORY, data: null, })">
                                <el-icon class="el-icon--right">
                                    <Plus />
                                </el-icon>
                                <span class="mr-1">{{ t("Add Category") }}</span>
                            </el-button>

                            <el-dropdown trigger="click" class="px-1">
                                <el-button type="primary">
                                    <el-icon :size="15" style=" vertical-align: middle; ">
                                        <More />
                                    </el-icon>
                                </el-button>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <el-button class="border-0 mx-1 my-1" size="small"
                                                            :disabled="!(categoryDetail.id.length > 0)"
                                                            @click="$emit('onChangeView', { viewName: viewNameEnum.EDITCATEGORY, data: categoryDetail, })">
                                                            <el-icon :size="15" style=" vertical-align: middle; ">
                                                                <Edit />
                                                            </el-icon>
                                                            <span class="ml-1">{{ t("Edit Category") }}</span>
                                                        </el-button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <el-button class="border-0 ml-1" size="small"
                                                            :disabled="!(categoryDetail.id.length > 0)"
                                                            @click="deleteCategory(categoryDetail)">
                                                            <el-icon :size="15" class="text-danger"
                                                                style=" vertical-align: middle; ">
                                                                <Delete />
                                                            </el-icon>
                                                            <span class="ml-1 mr-1">{{ t("Delete Category")
                                                            }}</span>
                                                        </el-button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-7 order-lg-1 py-1">
                <div class="card">
                    <div class="card-header">
                        <h6>{{ t("Item Control") }}</h6>
                    </div>
                    <div class="card-body">
                        <el-input v-model="filterData" filterable :placeholder='t("Search Item...")'
                            style="min-width: 16rem" size="large">
                            <template #prepend>
                                <el-icon style="vertical-align: middle">
                                    <Search />
                                </el-icon>
                            </template>
                        </el-input>
                        <div class="d-flex justify-content-center pt-3">
                            <el-button type="primary"
                                @click="$emit('onChangeView', { viewName: viewNameEnum.ADDITEM, data: categoryDetail })">
                                <el-icon class="el-icon--right">
                                    <Plus />
                                </el-icon>
                                {{ t("Add Item") }}
                            </el-button>
                            <el-button type="primary" @click="changeViewMode(pageStatus.viewMode)">
                                {{ t(pageStatus.viewMode) }}
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-body pt-0">
                <!--Card mode -->
                <div class="row" v-if="pageStatus.viewMode !== viewModeEnum.TABLEMODE">
                    <div class="col-md-6 col-xl-4 px-1" v-for="(itemData, itemIndex) in listItems"
                        :key="itemIndex">
                        <div class="d-flex align-items-center flex-column mt-2 ">
                            <el-card class="w-100">
                                <template #header>
                                    <div class="card-header">
                                        <div class="row">
                                            <span class="pb-2"><strong>{{ itemData.name }}</strong></span>
                                            <div class="row">
                                                <el-select v-model="itemData.availableStatus" filterable class="col-9"
                                                    size="small" :placeholder="t('Change item status ...')"
                                                    @change="changeItemStatus(itemData)">
                                                    <el-option v-for="item in itemStatusOptions" :key="item.id"
                                                        :label="item.label" :value="item.value" />
                                                </el-select>
                                                <el-dropdown trigger="click" class="col-3">
                                                    <el-button type="primary" size="small">
                                                        <el-icon :size="15" style=" vertical-align: middle; ">
                                                            <More />
                                                        </el-icon>
                                                    </el-button>
                                                    <template #dropdown>
                                                        <el-dropdown-menu>
                                                            <table>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <el-button class="border-0 mx-1 my-1"
                                                                                size="small"
                                                                                @click="$emit('onChangeView', { viewName: viewNameEnum.CLONEITEM, data: itemData, })">
                                                                                <el-icon :size="15"
                                                                                    style=" vertical-align: middle; ">
                                                                                    <CopyDocument />
                                                                                </el-icon>
                                                                                <span class="ml-1">{{ t("Clone Item")
                                                                                }}</span>
                                                                            </el-button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <el-button class="border-0 mx-1 my-1"
                                                                                size="small"
                                                                                @click="$emit('onChangeView', { viewName: viewNameEnum.EDITITEM, data: itemData, })">
                                                                                <el-icon :size="15"
                                                                                    style=" vertical-align: middle; ">
                                                                                    <Edit />
                                                                                </el-icon>
                                                                                <span class="ml-1">{{ t("Edit Item")
                                                                                }}</span>
                                                                            </el-button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <el-button class="border-0 mx-1 my-1"
                                                                                size="small" @click="deleteItem(itemData)">
                                                                                <el-icon :size="15" class="text-danger"
                                                                                    style=" vertical-align: middle; ">
                                                                                    <Delete />
                                                                                </el-icon>
                                                                                <span class="ml-1">{{ t("Delete Item")
                                                                                }}</span>
                                                                            </el-button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </el-dropdown-menu>
                                                    </template>
                                                </el-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                                <table class="table table-head-fixed table-borderless w-100">
                                    <thead>
                                        <tr>
                                            <th class="pl-0 pt-2 pb-2" style="width:20%">
                                            </th>
                                            <th class="pl-0 pt-2 pb-2" style="width:80%">
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="px-0 ">{{ t("Description") }}</td>
                                            <td class="px-2 ">{{ itemData.description }}</td>
                                        </tr>
                                        <tr>
                                            <td class="px-0 ">{{ t("Max Stock") }}</td>
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
                <!-- table mode -->
                <div v-else class="card">
                    <div class="row ">
                        <div class="col-lg-12 ">
                            <div class="table-responsive rounded card-table">
                                <table class="table table-striped table-head-fixed table-borderless w-100">
                                    <thead>
                                        <tr>
                                            <th class="pl-0 pt-2 pb-2 text-left align-middle">
                                                <div>{{ t("Index") }}</div>
                                            </th>
                                            <th class="pl-0 pt-2 pb-2 text-center align-middle">
                                                <div>{{ t("Image") }}</div>
                                            </th>
                                            <th class="pl-2 pt-2 pb-2 text-nowrap align-middle w-15">
                                                <div>{{ t("Name") }}</div>
                                            </th>
                                            <th class="pl-0 pt-2 pb-2 align-middle w-30">
                                                <div>{{ t("Description") }}</div>
                                            </th>
                                            <th class="pl-0 pt-2 pb-2 text-center align-middle">
                                                <div>{{ t("Price") }}</div>
                                            </th>
                                            <th class="pl-0 pt-2 pb-2 text-center text-nowrap align-middle">
                                                <div>{{ t("Max Stock") }}</div>
                                            </th>
                                            <th class="pl-0 pt-2 pb-2 text-center align-middle">
                                                <div>{{ t("Status") }}</div>
                                            </th>
                                            <th class="pl-0 pt-2 pb-2 text-center align-middle  text-nowrap">
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
                                                <el-image style="width: 60px; height: 60px"
                                                    v-if="itemData && itemData.photos" :src="itemData.photos[0]"
                                                    fit="fill" />
                                                <el-image style="width: 60px; height: 60px" v-else src="" fit="fill" />
                                            </td>
                                            <td class="pl-2">
                                                {{ itemData.name }}
                                            </td>
                                            <td class="pl-2">
                                                {{ itemData.description }}
                                            </td>
                                            <td class="pl-2 text-center align-middle text-nowrap">
                                                <span v-if="moneyType === '$'">{{ moneyType }}{{ itemData.price
                                                }}</span>
                                                <span v-else>{{ itemData.price }}{{ moneyType }}</span>
                                            </td>
                                            <td class="pl-2 text-center align-middle">
                                                {{ itemData.maxStock }}
                                            </td>
                                            <td class="pl-2 text-center text-nowrap">
                                                <el-select v-model="itemData.availableStatus" filterable :disabled="false"
                                                    :placeholder="t('Change Item status ...')"
                                                    @change="changeItemStatus(itemData)">
                                                    <el-option v-for="item in itemStatusOptions" :key="item.id"
                                                        :label="item.availableStatus" :value="item.value" />
                                                </el-select>
                                            </td>
                                            <td class="pl-2 text-center">
                                                <el-dropdown trigger="click">
                                                    <el-button class="w-100" type="primary" size="small">
                                                        <el-icon :size="15" style=" vertical-align: middle; ">
                                                            <More />
                                                        </el-icon>
                                                    </el-button>
                                                    <template #dropdown>
                                                        <el-dropdown-menu>
                                                            <table>
                                                                <tbody>
                                                                    <tr>
                                                                        <td>
                                                                            <el-button class="border-0 mx-1 my-1"
                                                                                size="small"
                                                                                @click="$emit('onChangeView', { viewName: viewNameEnum.CLONEITEM, data: itemData, })">
                                                                                <el-icon :size="15"
                                                                                    style=" vertical-align: middle; ">
                                                                                    <CopyDocument />
                                                                                </el-icon>
                                                                                <span class="ml-1">{{ t("Clone Item")
                                                                                }}</span>
                                                                            </el-button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <el-button class="border-0 mx-1 my-1"
                                                                                size="small"
                                                                                @click="$emit('onChangeView', { viewName: viewNameEnum.EDITITEM, data: itemData, })">
                                                                                <el-icon :size="15"
                                                                                    style=" vertical-align: middle; ">
                                                                                    <Edit />
                                                                                </el-icon>
                                                                                <span class="ml-1">{{ t("Edit Item")
                                                                                }}</span>
                                                                            </el-button>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>
                                                                            <el-button class="border-0 mx-1 my-1"
                                                                                size="small" @click="deleteItem(itemData)">
                                                                                <el-icon :size="15" class="text-danger"
                                                                                    style=" vertical-align: middle; ">
                                                                                    <Delete />
                                                                                </el-icon>
                                                                                <span class="ml-1">{{ t("Delete Item")
                                                                                }}</span>
                                                                            </el-button>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </el-dropdown-menu>
                                                    </template>
                                                </el-dropdown>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="!(listItems && listItems.length > 0)" class="mt-5 d-flex justify-content-center">
                    <h5>{{ t("There are no item.") }}</h5>
                </div>

                <!-- phan trang -->
                <div class="mx-2 d-flex justify-content-end">
                    <el-pagination v-if="listItems && listItems.length > 0" class=""
                        v-model:current-page="pageStatus.currentPage" v-model:page-size="pageStatus.pageSize"
                        :page-sizes="[10, 15, 25, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                        :total="pageStatus.totalItems" @size-change="handleSizeChange"
                        @current-change="handleCurrentChange" />
                </div>
            </div>
        </div>


    </div>
</template>
