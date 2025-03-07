<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<script lang="ts" src="@/scripts/zoneTable/components/list.ts"></script>
<template>
    <div class="flex-fill d-flex flex-column w-100" v-loading="isLoading">
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


        <div class="content-body">
            <div class="">
                <div class="row">
                    <div class="col-xl-3">
                        <div class="row">
                            <div class="col-xl-12">
                                <div class="card">
                                    <ul class="list-group">
                                        <li class="list-group-item d-flex justify-content-between lh-condensed">
                                            <el-button class="w-100" type="primary"
                                                @click="$emit('onChangeView', { viewName: 'AddZone', data: null, })">
                                                <el-icon class="el-icon--right">
                                                    <Plus />
                                                </el-icon>
                                                <span class="mr-1">{{ t("Add Zone") }}</span>
                                            </el-button>
                                        </li>

                                        <li v-for="(item, itemIndex) in zoneTable" :key="itemIndex"
                                            class="list-group-item d-flex justify-content-between lh-condensed">
                                            <el-button class="border border-white w-100 d-flex justify-content-between"
                                                @click="handleClick(item.id)"
                                                :type="item.id === currentZoneId ? 'success' : 'info'">
                                                {{ item.name }}
                                            </el-button>
                                        </li>

                                    </ul>
                                    <!-- <div class="card-body profile-accordion pb-0">
                                        <div class="accordion" id="accordionExample1">
                                            <div class="accordion-item">
                                                <div class="pb-1">
                                                <el-button class="w-100" type="primary"
                                                    @click="$emit('onChangeView', { viewName: 'AddZone', data: null, })">
                                                    <el-icon class="el-icon--right">
                                                        <Plus />
                                                    </el-icon>
                                                    <span class="mr-1">{{ t("Add Zone") }}</span>
                                                </el-button>
                                            </div>

                                                <div v-for="item in zoneTable" :key="item.id" class="py-1">
                                                    <el-button
                                                        class="border border-white w-100 d-flex justify-content-between"
                                                        @click="handleClick(item.id)"
                                                        :type="item.id === currentZoneId ? 'success' : 'info'">
                                                        {{ item.name }}
                                                    </el-button>
                                                </div>

                                            </div>
                                        </div>
                                    </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-9">
                        <div class="row">
                            <div class="col-lg-5 order-lg-2 py-1">
                                <div class="card">
                                    <div class="card-header">
                                        <h6>{{ t("Table Control") }}</h6>
                                    </div>
                                    <div class="card-body">
                                        <div v-if=" zoneDetail.id.toString().length > 0">
                                            <div class="py-2 px-1 h-50">
                                                <el-select v-model="filter" filterable placeholder="Filter by ..."
                                                    class=" w-100">
                                                    <el-option v-for="item in filterTableStatusOptions" :key="item.value"
                                                        :label="item.label" :value="item.value" />
                                                </el-select>
                                                <div class="mt-3 d-flex justify-content-center">
                                                    <el-button type="warning" v-if="false"
                                                        @click="$emit('onChangeView', { viewName: 'EditZone', data: zoneDetail, })">
                                                        <span class="mr-1">{{ t("Edit Zone") }}</span>
                                                    </el-button>
                                                    <el-button type="danger"  v-if="false"
                                                        @click="deleteZone(zoneDetail)">
                                                        <span class="mr-1">{{ t("Delete Zone") }}</span>
                                                    </el-button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-7 order-lg-1 py-1">
                                <div class="card">
                                    <div class="card-header">
                                        <h6>{{ t("Zone Info") }}</h6>
                                    </div>
                                    <div class="card-body">
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td class="py-1"><strong>{{ t("Zone Name") }}</strong></td>
                                                    <td class="px-3"><strong>{{ zoneDetail.name }}</strong></td>
                                                </tr>
                                                <tr>
                                                    <td class="py-1"><strong>{{ t("Description") }}</strong></td>
                                                    <td class="px-3"><strong>{{ zoneDetail.description }}</strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td class="py-1"><strong>{{ t("Avaiable table") }}</strong></td>
                                                    <td class="px-3"><strong>{{ zoneDetail.tableNumberAvaiable }}/{{
                                                        zoneDetail.maxTable }}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div class="pt-2" v-if=" zoneDetail.id.toString().length > 0">
                                            <el-button type="primary"
                                                @click="$emit('onChangeView', { viewName: 'AddTable', data: zoneDetail })">
                                                <el-icon class="el-icon--right">
                                                    <Plus />
                                                </el-icon>
                                                <span class="mr-1">{{ t("Add Table") }}</span>
                                            </el-button>
                                            <el-button type="warning"
                                                @click="$emit('onChangeView', { viewName: 'EditZone', data: zoneDetail, })">
                                                <span class="mr-1">{{ t("Edit Zone") }}</span>
                                            </el-button>
                                            <el-button type="danger"
                                                @click="deleteZone(zoneDetail)">
                                                <span class="mr-1">{{ t("Delete Zone") }}</span>
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-12  order-lg-3">
                                <div class="card">
                                    <div class="card-body pt-0">
                                        <div class="table-responsive rounded card-table">
                                            <table
                                                class="table table-striped table-head-fixed text-nowrap table-borderless w-100">
                                                <thead>
                                                    <tr>
                                                        <th class="pl-2 pt-2 pb-2 text-nowrap align-middle"
                                                            style="width:15%">
                                                            <div>{{ t("Name") }}</div>
                                                        </th>
                                                        <th class="pl-0 pt-2 pb-2 align-middle" style="width:20%">
                                                            <div>{{ t("Description") }}</div>
                                                        </th>
                                                        <th class="pl-0 pt-2 pb-2 text-center align-middle"
                                                            style="width:15%">
                                                            <div>{{ t("Max Seat") }}</div>
                                                        </th>
                                                        <th class="pl-0 pt-2 pb-2 text-center align-middle"
                                                            style="width:40%">
                                                            <div>{{ t("Status") }}</div>
                                                        </th>
                                                        <th class="pl-0 pt-2 pb-2 text-center align-middle"
                                                            style="width:15%">
                                                            <div>{{ t("Action") }}</div>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody class=" ">
                                                    <tr v-for="(itemData, itemIndex) in listItems" :key="itemIndex">
                                                        <td class="pl-2">
                                                            {{ itemData.name }}
                                                        </td>
                                                        <td class="pl-2">
                                                            {{ itemData.description }}
                                                        </td>
                                                        <td class="pl-2 text-center align-middle">
                                                            {{ itemData.maxSeat }}
                                                        </td>
                                                        <td class="pl-2 text-center text-nowrap">
                                                            <el-button
                                                                :type="itemData.status === 'AVAILABLE' ? 'success' : (
                                                                    itemData.status === 'UNAVAILABLE' ? 'info' : 'warning')"
                                                                style="width:100%" @click="gotoCreateOrder(itemData)"
                                                                :disabled="itemData.status === 'UNAVAILABLE'">
                                                                {{ t(itemData.status) }}
                                                                <a class="ml-1" v-if="itemData.status === 'AVAILABLE'"> -
                                                                    {{ t("Create Order") }}</a>
                                                                <a class="ml-1" v-if="itemData.status === 'OCCUPIED'"> -
                                                                    {{ t("Show Detail") }}</a>
                                                            </el-button>

                                                        </td>
                                                        <td class="pl-2 text-center">
                                                            <el-dropdown trigger="click">
                                                                <el-button class="my-1" type="primary">
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
                                                                                        <el-button
                                                                                            class="border-0 mx-1 my-1"
                                                                                            size="small"
                                                                                            @click="$emit('onChangeView', { viewName: viewNameEnum.CLONETABLE, data: itemData, })">
                                                                                            <el-icon :size="15"
                                                                                                style=" vertical-align: middle; ">
                                                                                                <CopyDocument />
                                                                                            </el-icon>
                                                                                            <span class="ml-1">
                                                                                                {{ t("Clone Table") }}
                                                                                            </span>
                                                                                        </el-button>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <el-button
                                                                                            class="border-0 mx-1 my-1"
                                                                                            size="small"
                                                                                            @click="$emit('onChangeView', { viewName: viewNameEnum.EDITTABLE, data: itemData, })">
                                                                                            <el-icon :size="15"
                                                                                                style=" vertical-align: middle; ">
                                                                                                <Edit />
                                                                                            </el-icon>
                                                                                            <span class="ml-1">
                                                                                                {{ t("Edit Table") }}
                                                                                            </span>
                                                                                        </el-button>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td>
                                                                                        <el-button
                                                                                            class="border-0 mx-1 my-1"
                                                                                            size="small"
                                                                                            @click="deleteTable(itemData)">
                                                                                            <el-icon :size="15"
                                                                                                class="text-danger"
                                                                                                style=" vertical-align: middle; ">
                                                                                                <Delete />
                                                                                            </el-icon>
                                                                                            <span class="ml-1">
                                                                                                {{ t("Delete Table") }}
                                                                                            </span>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
