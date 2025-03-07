<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<script lang="ts" src="@/scripts/user/components/list.ts"></script>
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
                                                @click="$emit('onChangeView', { viewName: 'AddUser', data: null, })">
                                                <el-icon class="el-icon--right">
                                                    <Plus />
                                                </el-icon>
                                                <span class="mr-1">{{ t("Add User") }}</span>
                                            </el-button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-9">
                        <div class="row">
                            <div class="col-xl-12  order-lg-3">
                                <div class="card">
                                    <div class="card-body pt-0">
                                        <div class="table-responsive rounded card-table">
                                            <table
                                                class="table table-striped table-head-fixed text-nowrap table-borderless w-100">
                                                <thead>
                                                    <tr>
                                                        <th class="pl-2 pt-2 pb-2 text-nowrap align-middle"
                                                            style="width:5%">
                                                            <div>{{ t("Id") }}</div>
                                                        </th>
                                                        <th class="pl-0 pt-2 pb-2 align-middle" style="width:20%">
                                                            <div>{{ t("Email") }}</div>
                                                        </th>
                                                        <th class="pl-0 pt-2 pb-2 text-center align-middle"
                                                            style="width:30%">
                                                            <div>{{ t("Password") }}</div>
                                                        </th>
                                                        <th class="pl-0 pt-2 pb-2 text-center align-middle"
                                                            style="width:15%">
                                                            <div>{{ t("Created") }}</div>
                                                        </th>
                                                        <th class="pl-0 pt-2 pb-2 text-center align-middle"
                                                            style="width:15%">
                                                            <div>{{ t("Edited") }}</div>
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
                                                            {{ itemData.id }}
                                                        </td>
                                                        <td class="pl-2">
                                                            {{ itemData.email }}
                                                        </td>
                                                        <td class="pl-2 text-center align-middle">
                                                            {{ itemData.password }}
                                                        </td>
                                                        <td class="pl-2">
                                                            {{ new Date(itemData.createdDate).toLocaleDateString("vi-VN") }}
                                                        </td>
                                                        <td class="pl-2 text-center align-middle">
                                                            {{ new Date(itemData.editedDate).toLocaleDateString("vi-VN") }}
                                                        </td>
                                                        
                                                        <td>
                                                            <el-button
                                                                class="border-0 mx-1 my-1"
                                                                size="small"
                                                                @click="$emit('onChangeView', { viewName: 'EditUser', data: itemData, })">
                                                                <el-icon :size="15"
                                                                    style=" vertical-align: middle; ">
                                                                    <Edit />
                                                                </el-icon>
                                                            </el-button>
                                                            
                                                            <el-button class="border-0 ml-1" size="small"
                                                                @click="deleteUser(itemData)">
                                                                <el-icon :size="15" class="text-danger"
                                                                    style=" vertical-align: middle; ">
                                                                    <Delete />
                                                                </el-icon>
                                                            </el-button>
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
