<template>
    <div class="view">
        <el-form size="small" :inline="true" :model="searchForm"  label-width="100px">
            <el-form-item label="酒店类型">
                <el-select v-model="searchForm.HotelsType" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in hotelTypeList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售状态">
                <el-select v-model="searchForm.Status" placeholder="请选择" clearable>
                    <el-option
                    v-for="item in statusList"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属城市">
                <el-input v-model="searchForm.CityName" ></el-input>
            </el-form-item>
            <el-form-item label="酒店名称">
                <el-input v-model="searchForm.HotelName" ></el-input>
            </el-form-item>
            <el-form-item label="商品编号">
                <el-input v-model="searchForm.ProductNo" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" icon="el-icon-search" @click='queryData'>搜索</el-button>
            </el-form-item>
        </el-form>
        <el-row class="margin_bottom">
            <el-button size="small" type="primary"  @click="handleReleaseProduct('')" >发布商品</el-button>
            <el-button size="small" type="primary" :disabled="checkHotelList.length==0"  @click="handleBatchMaintenance" >批量维护</el-button>
            <el-button size="small" type="primary" :disabled="checkHotelList.length==0"  @click="handleBatchPriceSetting" >批量改价/库存</el-button>
            <el-button size="small" type="primary" :disabled="checkHotelList.length==0||!canBatchDownSales" @click="handleBatchSetSaleStatus(4)" >批量下架</el-button>
            <el-button size="small" type="primary" :disabled="checkHotelList.length==0||!canBatchOnSales" @click="handleBatchSetSaleStatus(3)" >批量上架</el-button>
            <el-button size="small" type="primary" :disabled="checkHotelList.length==0||!canBatchDelete" @click="handleBatchDelProducts" >批量删除</el-button>
            <el-button size="small" type="primary"  @click="handleChangeViewModel" >{{viewModel=='info'?'切换至日历信息':'切换至商品信息'}}</el-button>
        </el-row>
        <el-row class="margin_bottom" v-show="viewModel=='week'">
            <el-checkbox v-model="showStock">库存</el-checkbox>
            <el-checkbox v-model="showCostPrice">同行结算价</el-checkbox>
            <el-checkbox v-model="showRetailSalesPrice">直客销售价</el-checkbox>
            <el-checkbox v-model="showCustomerPrice">媒体外卖价</el-checkbox>
            <div class="inline-block">
                <el-button size="small" :disabled="!ablePrevWeek" @click="handlePrevWeek">上一周</el-button>
                <el-date-picker type="date" @change="handleChangeDate" v-model="searchForm.Date" size="small" class="input_comm" :picker-options="pickerOptions1"></el-date-picker>
                <el-button size="small" @click="handleNextWeek">下一周</el-button>
            </div>
        </el-row>
        <el-row v-loading ='tableLoading'>
            <el-row class="no-product" v-if="tableList.length<=0">
                没有酒店商品，去发布吧~
            </el-row>   
            <el-row v-else class="margin_bottom" v-for="(item,index) in tableList" :key="'m'+index">
                <el-row >
                    <div class="right-hotel">
                        <div class="p1">
                            <span class="title">{{item.hotelName}} </span>
                            <span class="title margin_left_10" v-if="item.englishHotelName">{{item.englishHotelName}} </span>
                            <span class="margin_left_10">
                                <el-rate
                                style="display:inline"
                                v-model="item.starRated"
                                disabled>
                                </el-rate>
                            </span>
                            <span class="margin_left_10" v-bind:class="item.status==2?'ylt-notinfo':'ylt-notinfo1'">{{item.statusStr}}</span>
                        </div>
                        <div class="p2">
                            <i class="icon iconfont icon-dingwei"></i>{{item.address}}
                        </div>
                        <div class="hotel-operation">
                            <el-button size="small" type="primary"  @click="handleViewHotelDetail(item.hotelId)" >查看酒店详情</el-button>
                            <el-button size="small" type="primary"  @click="handleReleaseProduct(item.hotelId)" >发布本酒店商品</el-button>
                        </div>
                    </div>
                </el-row>
                <el-row class="margin_top">
                    <el-table key="table1" v-show="viewModel=='info'" :data="item.minProudcts" @selection-change="handleSelectionChange" @select="handleSelectionChange2(index)" @select-all="handleSelectionChange2(index)">
                        <el-table-column type="selection" width="35"></el-table-column>
                        <el-table-column  prop="productNO" label="商品编号" > </el-table-column>
                        <el-table-column  prop="productName" label="商品名称" > </el-table-column>
                        <el-table-column  prop="roomName" label="房型" > </el-table-column>
                        <el-table-column  label="同行结算价" >
                            <template slot-scope="scope">
                                {{'￥'+(scope.row.costPrice||0)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="直客销售价" > 
                            <template slot-scope="scope">
                                {{'￥'+(scope.row.retailSalesPrice||0)}}
                            </template>
                        </el-table-column>
                        <el-table-column label="推广费" > 
                            <template slot-scope="scope">
                                {{'￥'+scope.row.promotionValue+scope.row.promotionTypeStr}}
                            </template>
                        </el-table-column>
                        <el-table-column label="销售激励" > 
                            <template slot-scope="scope">
                                {{'￥'+scope.row.incentiveValue+scope.row.incentiveTypeStr}}
                            </template>
                        </el-table-column>
                        <el-table-column  prop="statusStr" label="销售状态" width="80">
                        </el-table-column>
                        <el-table-column  label="操作" fixed="right" width='120'>
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="handleViewHotelRoomDetail(scope.row)" >查看</el-button>
                                <el-button type="text" size="mini" @click="handleEditProduct(scope.row)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-table key="table2" v-show="viewModel=='week'" :data="item.minProudcts" @selection-change="handleSelectionChange" @select="handleSelectionChange2(index)" @select-all="handleSelectionChange2(index)">
                        <el-table-column type="selection" width="35"></el-table-column>
                        <el-table-column prop="productName" label="商品名称" > </el-table-column>
                        <el-table-column label="周一" >
                            <template slot-scope="scope">
                                <div class="week-box" v-if="scope.row.Monday">
                                    <div>{{scope.row.Monday.date}}</div>
                                    <div v-show="showCostPrice">同￥{{scope.row.Monday.costPrice}}</div>
                                    <div v-show="showRetailSalesPrice">直￥{{scope.row.Monday.retailSalesPrice}}</div>
                                    <div v-show="showCustomerPrice">媒￥{{scope.row.Monday.customerPrice}}</div>
                                    <div v-show="showStock">库{{`${scope.row.Monday.stockBalance-scope.row.Monday.soldQuantity}/${scope.row.Monday.stockBalance}`}}</div>
                                </div>
                                <div v-else>暂无价格</div>
                            </template>
                        </el-table-column>
                        <el-table-column  label="周二" > 
                            <template slot-scope="scope">
                                <div class="week-box" v-if="scope.row.Tuesday">
                                    <div>{{scope.row.Tuesday.date}}</div>
                                    <div v-show="showCostPrice">同￥{{scope.row.Tuesday.costPrice}}</div>
                                    <div v-show="showRetailSalesPrice">直￥{{scope.row.Tuesday.retailSalesPrice}}</div>
                                    <div v-show="showCustomerPrice">媒￥{{scope.row.Tuesday.customerPrice}}</div>
                                    <div v-show="showStock">库{{`${scope.row.Tuesday.stockBalance-scope.row.Tuesday.soldQuantity}/${scope.row.Tuesday.stockBalance}`}}</div>
                                </div>
                                <div v-else>暂无价格</div>
                            </template>
                        </el-table-column>
                        <el-table-column  label="周三" >
                            <template slot-scope="scope">
                                <div class="week-box" v-if="scope.row.Wednesday">
                                    <div>{{scope.row.Wednesday.date}}</div>
                                    <div v-show="showCostPrice">同￥{{scope.row.Wednesday.costPrice}}</div>
                                    <div v-show="showRetailSalesPrice">直￥{{scope.row.Wednesday.retailSalesPrice}}</div>
                                    <div v-show="showCustomerPrice">媒￥{{scope.row.Wednesday.customerPrice}}</div>
                                    <div v-show="showStock">库{{`${scope.row.Wednesday.stockBalance-scope.row.Wednesday.soldQuantity}/${scope.row.Wednesday.stockBalance}`}}</div>
                                </div>
                                <div v-else>暂无价格</div>
                            </template>
                        </el-table-column>
                         <el-table-column label="周四" > 
                            <template slot-scope="scope">
                                <div class="week-box" v-if="scope.row.Thursday">
                                    <div>{{scope.row.Thursday.date}}</div>
                                    <div v-show="showCostPrice">同￥{{scope.row.Thursday.costPrice}}</div>
                                    <div v-show="showRetailSalesPrice">直￥{{scope.row.Thursday.retailSalesPrice}}</div>
                                    <div v-show="showCustomerPrice">媒￥{{scope.row.Thursday.customerPrice}}</div>
                                    <div v-show="showStock">库{{`${scope.row.Thursday.stockBalance-scope.row.Thursday.soldQuantity}/${scope.row.Thursday.stockBalance}`}}</div>
                                </div>
                                <div v-else>暂无价格</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="周五" > 
                            <template slot-scope="scope">
                                <div class="week-box" v-if="scope.row.Friday">
                                    <div>{{scope.row.Friday.date}}</div>
                                    <div v-show="showCostPrice">同￥{{scope.row.Friday.costPrice}}</div>
                                    <div v-show="showRetailSalesPrice">直￥{{scope.row.Friday.retailSalesPrice}}</div>
                                    <div v-show="showCustomerPrice">媒￥{{scope.row.Friday.customerPrice}}</div>
                                    <div v-show="showStock">库{{`${scope.row.Friday.stockBalance-scope.row.Friday.soldQuantity}/${scope.row.Friday.stockBalance}`}}</div>
                                </div>
                                <div v-else>暂无价格</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="周六" > 
                            <template slot-scope="scope">
                                <div class="week-box" v-if="scope.row.Saturday">
                                    <div>{{scope.row.Saturday.date}}</div>
                                    <div v-show="showCostPrice">同￥{{scope.row.Saturday.costPrice}}</div>
                                    <div v-show="showRetailSalesPrice">直￥{{scope.row.Saturday.retailSalesPrice}}</div>
                                    <div v-show="showCustomerPrice">媒￥{{scope.row.Saturday.customerPrice}}</div>
                                    <div v-show="showStock">库{{`${scope.row.Saturday.stockBalance-scope.row.Saturday.soldQuantity}/${scope.row.Saturday.stockBalance}`}}</div>
                                </div>
                                <div v-else>暂无价格</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="周日" > 
                            <template slot-scope="scope">
                                <div class="week-box" v-if="scope.row.Sunday">
                                    <div>{{scope.row.Sunday.date}}</div>
                                    <div v-show="showCostPrice">同￥{{scope.row.Sunday.costPrice}}</div>
                                    <div v-show="showRetailSalesPrice">直￥{{scope.row.Sunday.retailSalesPrice}}</div>
                                    <div v-show="showCustomerPrice">媒￥{{scope.row.Sunday.customerPrice}}</div>
                                    <div v-show="showStock">库{{`${scope.row.Sunday.stockBalance-scope.row.Sunday.soldQuantity}/${scope.row.Sunday.stockBalance}`}}</div>
                                </div>
                                <div v-else>暂无价格</div>
                            </template>
                        </el-table-column>
                        <el-table-column  prop="statusStr" label="销售状态" width="80">
                        </el-table-column>
                        <el-table-column  label="操作" fixed="right" width='120'>
                            <template slot-scope="scope">
                                <el-button type="text" size="mini" @click="handleViewHotelRoomDetail(scope.row)" >查看</el-button>
                                <el-button type="text" size="mini" @click="handleEditProduct(scope.row)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
                <div class="text-center margin_top view-room"  @click="handleShowHideRooms(index)">{{item.showMore?'收起':'显示全部'}}</div>
            </el-row>
        </el-row>
        <el-pagination
            class="pagination"
            fixed="right"
            :data = 'pagination'
            @size-change="sizeChange"
            @current-change="currentPageChange"
            :current-page="pagination.currentPage"
            :page-sizes="pagination.sizes"
            :page-size="pagination.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
        <!-- 批量维护 -->
        <el-dialog title="批量维护" :visible.sync="dialogMaintenanceVisible" width="800px" @close="handleCloseMaintenance">
			<el-form size="small" :model="maintenanceForm" :rules="maintenanceRules" ref="maintenanceForm" label-width="120px">
                <h4>选择的商品名称</h4>
                <el-checkbox-group v-model="productIds">
                    <el-checkbox v-for="hotel in checkHotelList" :label="hotel.id" :key="hotel.id">{{hotel.productName}}</el-checkbox>
                </el-checkbox-group>
                <h4>产品设置</h4>
                <el-checkbox-group class="maintenance-group" v-model="checkList" @change="handleCheckedChange">
                    <!-- <el-checkbox :label="1" >
                        <el-form-item label="资源确认" :prop="checkList.indexOf(1)>-1?'ConfirmResource':''">
                            <el-radio-group v-model="maintenanceForm.ConfirmResource" :disabled="checkList.indexOf(1)==-1">
                                <el-radio :label="false">无需确认</el-radio>
                                <el-radio :label="true">需确认</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-checkbox> -->
                    <el-checkbox :label="2" >
                        <el-row type="flex">
                            <el-form-item label="退款规则" :prop="checkList.indexOf(2)>-1?'CanRefund':''">
                                <el-radio-group v-model="maintenanceForm.CanRefund" :disabled="checkList.indexOf(2)==-1">
                                    <el-radio :label="false">不可退</el-radio>
                                    <el-radio :label="true">可退</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="" label-width="20px" prop="RefundLeadDay" v-if="maintenanceForm.CanRefund">
                                请在入住前 <el-input-number :controls="false" :min="0" v-model="maintenanceForm.RefundLeadDay" style="width:60px;"  :disabled="checkList.indexOf(2)==-1"/> 天申请退款
                            </el-form-item>
                        </el-row>
                    </el-checkbox>
                    <el-checkbox :label="3" >
                        <el-form-item label="资源确认" :prop="checkList.indexOf(3)>-1?'PaymentType':''">
                            <el-radio-group v-model="maintenanceForm.PaymentType" :disabled="checkList.indexOf(3)==-1">
                                <el-radio :label="0">无需确认</el-radio>
                                <el-radio :label="1">需确认</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="资源方联系人" prop="LinkMan" v-if="maintenanceForm.PaymentType==1">
                            <el-input v-model="maintenanceForm.LinkMan" class="input_comm" :disabled="checkList.indexOf(3)==-1"/>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="LinkMobile" v-if="maintenanceForm.PaymentType==1">
                            <el-input v-model="maintenanceForm.LinkMobile" class="input_comm" :disabled="checkList.indexOf(3)==-1"/>
                        </el-form-item>
                    </el-checkbox>
                    <el-checkbox :label="4" >
                        <el-form-item label="推广费" :prop="checkList.indexOf(4)>-1?'PromotionType':''">
                            <el-radio-group v-model="maintenanceForm.PromotionType" @change="handleChangePromotionType" :disabled="checkList.indexOf(4)==-1">
                                <el-radio :label="0">固定金额 <el-input-number :disabled="maintenanceForm.PromotionType!=0||checkList.indexOf(4)==-1" :controls="false" :min="0" v-model="promotionValue1" style="width:80px;" /> 元/间</el-radio>
                                <el-radio :label="1">百分比 <el-input-number :disabled="maintenanceForm.PromotionType!=1||checkList.indexOf(4)==-1" :controls="false" :min="0" v-model="promotionValue2" style="width:60px;" /> %/间</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-checkbox>
                    <el-checkbox :label="5" >
                        <el-form-item label="销售激励" :prop="checkList.indexOf(5)>-1?'IncentiveType':''">
                            <el-radio-group v-model="maintenanceForm.IncentiveType" @change="handleChangeIncentiveType" :disabled="checkList.indexOf(5)==-1">
                                <el-radio :label="0">固定金额 <el-input-number :disabled="maintenanceForm.IncentiveType!=0||checkList.indexOf(5)==-1" :controls="false" :min="0" v-model="incentiveValue1" style="width:80px;" /> 元/间</el-radio>
                                <el-radio :label="1">百分比 <el-input-number :disabled="maintenanceForm.IncentiveType!=1||checkList.indexOf(5)==-1" :controls="false" :min="0" v-model="incentiveValue2" style="width:60px;" /> %/间</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-checkbox>
                    <el-checkbox :label="6" >
                        <el-form-item label="早餐配置" :prop="checkList.indexOf(6)>-1?'BreakfastTypeId':''">
                            <el-select v-model="maintenanceForm.BreakfastTypeId" placeholder="请选择" clearable :disabled="checkList.indexOf(6)==-1">
                                <el-option
                                v-for="item in breakfastTypeList"
                                :key="item.key"
                                :label="item.name"
                                :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-checkbox>
                    <el-checkbox :label="7" >
                        <el-row type="flex">
                            <el-form-item label="是否加床" :prop="checkList.indexOf(7)>-1?'CanExtraBed':''">
                                <el-radio-group v-model="maintenanceForm.CanExtraBed" :disabled="checkList.indexOf(7)==-1">
                                    <el-radio :label="false">不可</el-radio>
                                    <el-radio :label="true">可加</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="" label-width="20px" prop="ExtraBedPrice" v-if="maintenanceForm.CanExtraBed">
                                <el-input-number :controls="false" :min="0" v-model="maintenanceForm.ExtraBedPrice" style="width:80px;" :disabled="checkList.indexOf(7)==-1"/> 元/张，最多可以加
                            </el-form-item>
                            <el-form-item label="" label-width="20px" prop="ExtraBedNumber" v-if="maintenanceForm.CanExtraBed">
                                <el-input-number :controls="false" :min="0" v-model="maintenanceForm.ExtraBedNumber" style="width:80px;" :disabled="checkList.indexOf(7)==-1"/> 张
                            </el-form-item>
                        </el-row>
                    </el-checkbox>
                    <el-checkbox :label="8" >
                        <el-row type="flex">
                            <el-form-item label="是否加早" :prop="checkList.indexOf(8)>-1?'CanExtraBreakfast':''">
                                <el-radio-group v-model="maintenanceForm.CanExtraBreakfast" :disabled="checkList.indexOf(8)==-1">
                                    <el-radio :label="false">不可</el-radio>
                                    <el-radio :label="true">可加</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="" label-width="20px" prop="ExtraBreakfaskPrice" v-if="maintenanceForm.CanExtraBreakfast">
                                <el-input-number :controls="false" :min="0" v-model="maintenanceForm.ExtraBreakfaskPrice" style="width:80px;" :disabled="checkList.indexOf(8)==-1"/> 元/人，最多可以加
                            </el-form-item>
                            <el-form-item label="" label-width="20px" prop="ExtraBreakfaskNumber" v-if="maintenanceForm.CanExtraBreakfast">
                                <el-input-number :controls="false" :min="0" v-model="maintenanceForm.ExtraBreakfaskNumber" style="width:80px;" :disabled="checkList.indexOf(8)==-1"/> 人
                            </el-form-item>
                        </el-row>
                    </el-checkbox>
                    <el-checkbox :label="9" >
                        <el-form-item label="商品名称" :prop="checkList.indexOf(9)>-1?'ProductName':''">
                            <el-input v-model="maintenanceForm.ProductName" class="input_comm" :maxlength="12" placeholder="12汉字以内" :disabled="checkList.indexOf(9)==-1"/>
                        </el-form-item>
                    </el-checkbox>
                    <el-checkbox :label="10" >
                        <el-form-item label="上架管理" :prop="checkList.indexOf(10)>-1?'OnSales':''">
                            <el-radio-group v-model="maintenanceForm.OnSales" :disabled="checkList.indexOf(10)==-1">
                                <el-radio :label="true">上架</el-radio>
                                <el-radio :label="false">下架</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-checkbox>
                    <el-checkbox :label="11" >
                        <el-form-item label="补充说明" >
                            <el-input type='textarea' :rows="2" v-model="maintenanceForm.AdditionalRemarks" style="width:400px;" :disabled="checkList.indexOf(11)==-1"/>
                        </el-form-item>
                    </el-checkbox>
                </el-checkbox-group>
            </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogMaintenanceVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="submitMaintenance('maintenanceForm')" :loading="btnLoading">确 定</el-button>
			</span>
		</el-dialog>
        <!-- 批量改价/库存 -->
        <el-dialog title="批量改价/库存" :visible.sync="dialogPriceSettingVisible" width="800px" @close="handleCloseEditPrice">
			<el-form size="small" :model="setPriceForm" :rules="setPriceRules" ref="setPriceForm" label-width="100px">
                <h4>选择的商品名称</h4>
                <el-checkbox-group v-model="productIds">
                    <el-checkbox v-for="hotel in checkHotelList" :label="hotel.id" :key="hotel.id">{{hotel.productName}}</el-checkbox>
                </el-checkbox-group>
                <h4>产品设置</h4>
                <el-form-item label="设置日期" prop="date">
                    <el-date-picker
                        v-model="setPriceForm.date"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="星期" >
                    <el-checkbox  v-model="isAllWeek" class="inline-block margin_right" key="all" @change="handleChangeAllWeek">全部</el-checkbox>
                    <el-checkbox-group v-model="setPriceForm.activeDayOfWeeks" class="inline-block" @change="handleChangeWeek">
                        <el-checkbox v-for="item in weekList" :label="item.key" :key="item.key">{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="同行结算价" prop="costPrice">
                    <el-input-number :controls="false" :min="0" v-model="setPriceForm.costPrice" class="input_comm text-left" /> 元
                </el-form-item>
                <el-form-item label="直客销售价" prop="retailSalesPrice">
                    <el-input-number :controls="false" :min="0" v-model="setPriceForm.retailSalesPrice" class="input_comm text-left" /> 元
                </el-form-item>
                <el-form-item label="媒体外卖价">
                    <el-input-number :controls="false" :min="0" v-model="setPriceForm.customerPrice" class="input_comm text-left" /> 元
                </el-form-item>
                <el-form-item label="库存" prop="stockBalance">
                    <el-input-number :controls="false" :min="0" v-model="setPriceForm.stockBalance" class="input_comm text-left" /> 间
                </el-form-item>
            </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click="dialogPriceSettingVisible = false">取 消</el-button>
				<el-button size="small" type="primary" @click="submitPriceSetting('setPriceForm')">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showStock:true,
            showCostPrice:true,
            showRetailSalesPrice:true,
            showCustomerPrice:true,
            searchForm:{
                HotelsType:'',
                Status:'',
                CityName:'',
                HotelName:'',
                ProductNo:'',
                Date:new Date(),
                PageSize:10,
                PageIndex:1,
            },
            viewModel:'info',
            checkList:[],
            hotelTypeList:[],
            statusList:[{key:3,value:'已上架'},{key:4,value:'未上架'},{key:1,value:'待审核'},{key:5,value:'已拒绝'},{key:0,value:'草稿'}],
            tableList:[],
            tableLoading:true,
            dialogMaintenanceVisible:false,
            dialogPriceSettingVisible:false,
            btnLoading:false,
            ablePrevWeek:false,

            //批量维护
            productIds:[],
            checkHotelList:[],
            promotionValue1:'',
            promotionValue2:'',
            incentiveValue1:'',
            incentiveValue2:'',
            breakfastTypeList:[],
            maintenanceForm: {
                RoomID:'',
                // ConfirmResource:false,
                LinkMan:'',
                LinkMobile:'',
                CanRefund:false,
                RefundLeadDay:'',
                PaymentType:0,
                PromotionType:0,
                PromotionValue:'',
                IncentiveType:0,
                IncentiveValue:'',
                BreakfastTypeId:'',
                CanExtraBed:false,
                ExtraBedPrice:'',
                ExtraBedNumber:'',
                CanExtraBreakfast:false,
                ExtraBreakfaskPrice:'',
                ExtraBreakfaskNumber:'',
                ProductName:'',
                OnSales:true,
                AdditionalRemarks:'',
            },
            maintenanceFormTemp:{},
            maintenanceRules: {
                // ConfirmResource: [{required: true, message: '请选择确认类别', trigger: 'change'}],
                LinkMobile: [{required: true, message: '请输入联系电话', trigger: 'blur'}],
                LinkMan: [{required: true, message: '请输入资源方联系人', trigger: 'blur'}],
                CanRefund:[{required: true, message: '请输入退款规则', trigger: 'change'}],
                RefundLeadDay:[{required: true, message: '请输入退款时长', trigger: 'blur'}],
                PaymentType:[{ type:'number',required: true, message: '请选择资源确认', trigger: 'change'}],
                PromotionType:[{ type:'number',required: true, message: '请选择推广费类型', trigger: 'change'}],
                IncentiveType:[{  type:'number',required: true, message: '请选择推激励类型', trigger: 'change'}],
                BreakfastTypeId:[{required: true, message: '请选择早餐类型', trigger: 'change'}],
                CanExtraBed:[{ required: true, message: '请选择是否加床', trigger: 'change'}],
                ExtraBedPrice:[{required: true, message: '请输入加床价格', trigger: 'blur'}],
                ExtraBedNumber:[{required: true, message: '请输入最多加人数', trigger: 'blur'}],
                CanExtraBreakfast:[{ required: true, message: '请选择是否加早', trigger: 'change'}],
                ExtraBreakfaskPrice:[{required: true, message: '请输入加早价格', trigger: 'blur'}],
                ExtraBreakfaskNumber:[{required: true, message: '请输入最多加人数', trigger: 'blur'}],
                ProductName:[{required: true, message: '请输入产品名称', trigger: 'blur'}],
                OnSales:[{required: true, message: '请选择上架状态', trigger: 'change'}],
            },
            
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() < Date.now()-24*60*60*1000;
                },
            },
            pickerOptions1:{
                disabledDate(time) {
                    return time.getTime() < Date.now()-24*60*60*1000;
                },
            },
			isAllWeek:false,
            weekList:[{
                key:'Monday',value:'周一'
            },{
                key:'Tuesday',value:'周二'
            },{
                key:'Wednesday',value:'周三'
            },{
                key:'Thursday',value:'周四'
            },{
                key:'Friday',value:'周五'
            },{
                key:'Saturday',value:'周六'
            },{
                key:'Sunday',value:'周日'
            },],
            weeks:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            setPriceForm: {
                productIds:[],
                startDate:'',
                endDate:'',
                costPrice:'',
                retailSalesPrice:'',
                customerPrice:'',
                date:'',
                stockBalance:'',
                activeDayOfWeeks:[]
            },
            setPriceRules: {
                costPrice: [{required: true, message: '请输入同行结算价', trigger: 'blur'}],
                retailSalesPrice: [{required: true, message: '请输入直客销售价', trigger: 'blur'}],
                date:[{required: true, message: '请选择日期', trigger: 'change'}],
                stockBalance:[{required: true, message: '请输入库存', trigger: 'blur'}],
            },
            selection:[],
            selectionList:[],
            canBatchOnSales:false,
            canBatchDownSales:false,
            canBatchDelete:false,
            //分页
            pagination: {
                sizes: [5, 10, 20, 50],
                size: 10,
                currentPage: 1,
                total: 0
            }
        };
    },
    mounted(){
        this.maintenanceFormTemp=JSON.parse(JSON.stringify(this.maintenanceForm))
        this.getHotelType();
        this.queryData();
        this.getBreakfastType();
    },
    methods: {
        //改变日期
        handleChangeDate(){
            if((this.searchForm.Date.getTime()-6*24*60*60*1000)<=(new Date()).getTime()){
                this.ablePrevWeek=false;
            }else{
                this.ablePrevWeek=true;
            }
            this.queryData();
        },
        //上一周
        handlePrevWeek(){
            let date=this.searchForm.Date;
            this.searchForm.Date=new Date(date.getFullYear(),date.getMonth(),date.getDate()-7)
            if((this.searchForm.Date.getTime()-7*24*60*60*1000)<=(new Date()).getTime()){
                this.ablePrevWeek=false;
            }
            this.queryData()
        },
        //下一周
        handleNextWeek(){
            let date=this.searchForm.Date;
            this.searchForm.Date=new Date(date.getFullYear(),date.getMonth(),date.getDate()+7)
            this.ablePrevWeek=true;
            this.queryData()
        },
        //查看酒店详情
        handleViewHotelDetail(id){
            this.$router.push('/hotel/hotelProductDetail/'+id)
        },
        handleViewHotelRoomDetail(row){
            this.$router.push('/hotel/hotelProductRoomDetail/'+row.id)
        },
        //改变列表查看模式
        handleChangeViewModel(){
            this.viewModel=this.viewModel=='info'?'week':'info';
            this.pagination.currentPage = 1;
            this.searchForm.PageIndex = 1;
            this.queryData();
        },
        //选择商品
        handleSelectionChange2(index){
            this.selectionList[index]=this.selection;
            this.productIds=[];
            this.checkHotelList=[];
            this.canBatchOnSales=true;
            this.canBatchDownSales=true;
            this.canBatchDelete=true;
            this.selectionList.forEach(item=>{
                item.forEach(item1=>{
                    let obj={
                        id:item1.id,
                        productName:item1.productName,
                        roomName:item1.roomName
                    }
                    this.checkHotelList.push(obj)
                    this.productIds.push(item1.id)
                    if(item1.status!=4){
                        this.canBatchOnSales=false;
                    }
                    if(item1.status!=3){
                        this.canBatchDownSales=false;
                    }
                    if(item1.status!=4&&item1.status!=0){
                        this.canBatchDelete=false;
                    }
                })
            })
        },
        handleSelectionChange(val){
            this.selection=val;
        },
        //批量上下架
        handleBatchSetSaleStatus(status){
            let operationTips,successTips;
            if(status==3){
                operationTips='批量上架所选商品?';
                successTips='批量上架成功!'
            }else{
                operationTips='批量下架所选商品?';
                successTips='批量下架成功!'
            }
            
            this.$confirm(operationTips, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.groupHttp.post('HotelProduct/BatchSetSaleStatus',{
                    ProductIds:this.productIds,
                    Status:status
                }).then(res=>{
                    if(res.data.isSuccess){
                        this.$message({
                            type: 'success',
                            message: successTips
                        });
                        this.queryData();
                    }else{
                        this.$message.error(res.data.message);
                    }
                })
                
            }).catch(() => {
                    
            });
        },
        //批量删除
        handleBatchDelProducts(){
            this.$confirm('批量删除所选商品?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.groupHttp.post('HotelProduct/BatchDelProducts',{
                    ProductIds:this.productIds
                }).then(res=>{
                    if(res.data.isSuccess){
                        this.$message({
                            type: 'success',
                            message: '批量删除成功!'
                        });
                        this.queryData();
                    }else{
                        this.$message.error(res.data.message);
                    }
                })
                
            }).catch(() => {
                    
            });
        },
        handleCheckedChange(val){
            this.$refs['maintenanceForm'].clearValidate();
            // if(val.indexOf(1)==-1){
            //     this.maintenanceForm.ConfirmResource=false;
            // }
            if(val.indexOf(2)==-1){
                this.maintenanceForm.CanRefund=false;
            }
            if(val.indexOf(7)==-1){
                this.maintenanceForm.CanExtraBed=false;
            }
            if(val.indexOf(8)==-1){
                this.maintenanceForm.CanExtraBreakfast=false;
            }
        },
        //发布商品
        handleReleaseProduct(id){
            if(id){
                this.$router.push({name:'chooseRoomType',query:{hotelId:id}})
            }else{
                this.$router.push({name:'chooseHotel'})
            }
        },
        //批量维护
        handleBatchMaintenance(){
            this.dialogMaintenanceVisible=true;
        },
        //批量改价
        handleBatchPriceSetting(){
            this.dialogPriceSettingVisible=true;
        },
        //查询数据
        queryData(){
            this.checkHotelList = [];
            this.productIds=[];
            this.selectionList=[];
            this.tableLoading=true;
            let url="/HotelProduct/GetHotelProductList";
            if(this.viewModel=='week'){
                url='/HotelProduct/GetHotelProductWeekList'
            }
            this.groupHttp.get(url,{params:this.searchForm})
            .then(res => {
                if (res.data.isSuccess == true) {
                    this.tableList = res.data.objects;
                    this.pagination.total=res.data.total;

                    this.tableList.forEach(item=>{
                        if(this.viewModel=='week'){
                            item.proudcts.forEach(proudct=>{
                                let obj={};
                                proudct.hotelProductPriceWeek.forEach(day=>{
                                    day.date=day.date.substr(5,5);
                                    obj[this.weeks[day.week]]=day
                                })
                                proudct=Object.assign(proudct,obj)
                            })
                        }
                        item.minProudcts=item.proudcts.slice(0,5)
                        item.showMore=false;
                    })

                } else {
                    this.$message.error(res.data.message);
                }
                this.tableLoading=false;
            });
        },
        //显示和收起
        handleShowHideRooms(index){
            let item=this.tableList[index]
            if(item.showMore){
                item.minProudcts=item.proudcts.slice(0,5)
            }else{
                item.minProudcts=item.proudcts;
            }
            this.$set(this.tableList,index, item)
            item.showMore=!item.showMore;
        },
        //修改商品
        handleEditProduct(row){
            this.$router.push({name:'productSetting',query:{productId:row.id,isEdit:true}})
        },  


        //获取酒店类型
        getHotelType(){
            this.groupHttp.get("/HotelProduct/GetHotelType")
            .then(res => {
                if (res.data.isSuccess == true) {
                    this.hotelTypeList = res.data.objects;
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        //关闭弹窗
        handleCloseMaintenance(){
            this.$refs['maintenanceForm'].resetFields();
            this.maintenanceForm=JSON.parse(JSON.stringify(this.maintenanceFormTemp));
            this.checkList=[];
            this.promotionValue1='';
            this.promotionValue2='';
            this.incentiveValue1='';
            this.incentiveValue2='';
        },
        handleCloseEditPrice(){
            this.$refs['setPriceForm'].resetFields();
            this.setPriceForm.activeDayOfWeeks=[];
            this.setPriceForm.customerPrice='';
        },
        //改变推广费
        handleChangePromotionType(val){
            if(val==0){
                this.promotionValue2='';
            }else{
                this.promotionValue1='';
            }
        },
        //改变销售激励
        handleChangeIncentiveType(val){
            if(val==0){
                this.incentiveValue2='';
            }else{
                this.incentiveValue1='';
            }
        },
        //提交产品设置
        submitMaintenance(formName){
            if(this.checkList.length>0){
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let submitObj={};
                        submitObj['ProductIds']=this.productIds;
                        this.checkList.forEach(item=>{
                            // if(item==1){
                            //     submitObj['ConfirmResource']=this.maintenanceForm.ConfirmResource;
                            //     if(submitObj['ConfirmResource']){
                            //         submitObj['LinkMan']=this.maintenanceForm.LinkMan;
                            //         submitObj['LinkMobile']=this.maintenanceForm.LinkMobile;
                            //     }
                            // }else 
                            if(item==2){
                                submitObj['CanRefund']=this.maintenanceForm.CanRefund;
                                if(submitObj['CanRefund']){
                                    submitObj['RefundLeadDay']=this.maintenanceForm.RefundLeadDay;
                                }
                            }else if(item==3){
                                submitObj['PaymentType']=this.maintenanceForm.PaymentType;
                                if(submitObj['PaymentType']==1){
                                    submitObj['LinkMan']=this.maintenanceForm.LinkMan;
                                    submitObj['LinkMobile']=this.maintenanceForm.LinkMobile;
                                }
                            }else if(item==4){
                                submitObj['PromotionType']=this.maintenanceForm.PromotionType;
                                if(this.maintenanceForm.PromotionType==0){
                                    submitObj['PromotionValue']=this.promotionValue1;
                                }else{
                                    submitObj['PromotionValue']=this.promotionValue2;
                                }
                            }else if(item==5){
                                submitObj['IncentiveType']=this.maintenanceForm.IncentiveType;
                                if(this.maintenanceForm.IncentiveType==0){
                                    submitObj['IncentiveValue']=this.incentiveValue1;
                                }else{
                                    submitObj['IncentiveValue']=this.incentiveValue2;
                                }
                            }else if(item==6){
                                submitObj['BreakfastTypeId']=this.maintenanceForm.BreakfastTypeId;
                                this.breakfastTypeList.forEach(item=>{
                                    if(item.key==this.maintenanceForm.BreakfastTypeId){
                                        submitObj['BreakfastType']=item.name;
                                    }
                                })
                            }else if(item==7){
                                submitObj['CanExtraBed']=this.maintenanceForm.CanExtraBed;
                                if(submitObj['CanExtraBed']){
                                    submitObj['ExtraBedPrice']=this.maintenanceForm.ExtraBedPrice;
                                    submitObj['ExtraBedNumber']=this.maintenanceForm.ExtraBedNumber;
                                }
                            }else if(item==8){
                                submitObj['CanExtraBreakfast']=this.maintenanceForm.CanExtraBreakfast;
                                if(submitObj['CanExtraBreakfast']){
                                    submitObj['ExtraBreakfaskPrice']=this.maintenanceForm.ExtraBreakfaskPrice;
                                    submitObj['ExtraBreakfaskNumber']=this.maintenanceForm.ExtraBreakfaskNumber;
                                }
                            }else if(item==9){
                                submitObj['ProductName']=this.maintenanceForm.ProductName;
                            }else if(item==10){
                                submitObj['OnSales']=this.maintenanceForm.OnSales;
                            }else if(item==11){
                                submitObj['AdditionalRemarks']=this.maintenanceForm.AdditionalRemarks;
                            }
                        })
                        this.btnLoading=true;
                        this.groupHttp.post('/HotelProduct/BatchProductSetting',submitObj)
                        .then((res) => {
                            if(res.data.isSuccess){
                                this.$message({
                                    type:'success',
                                    message:'批量维护产品信息成功！'
                                });
                                this.queryData();
                                this.dialogMaintenanceVisible=false;
                            }else{
                                this.$message.error(res.data.message);
                            }
                            this.btnLoading=false;
                        }).catch((e) => {
                            console.log(e)
                        })
                    }
                })
            }else{
                this.$message.error('未修改');
                this.dialogMaintenanceVisible=false;
            }
        },
        //获取早餐类型
        getBreakfastType(){
            this.groupHttp.get('/HotelProduct/GetHotelOnlySetSelect')
            .then((res) => {
                if(res.data.isSuccess){
                    this.breakfastTypeList = res.data.keyValueList;
                }else{
                    this.$message.error(res.data.message);
                }
            }).catch((e) => {
                console.log(e)
            })
        },
        //全选星期
        handleChangeAllWeek(val){
            if(val==true){
                this.setPriceForm.activeDayOfWeeks=['Saturday','Friday','Thursday','Wednesday','Tuesday','Monday','Sunday']
            }else{
                this.setPriceForm.activeDayOfWeeks=[]
            }
        },
        //星期变化
        handleChangeWeek(val){
            if(val.length<7){
                this.isAllWeek=false;
            }else{
                this.isAllWeek=true;
            }
        },
        //提交价格设置
        submitPriceSetting(formName){
            this.$refs[formName].validate(valid => {
                if (valid) {
                    this.setPriceForm.productIds=this.productIds;
                    this.setPriceForm.startDate=this.setPriceForm.date[0];
                    this.setPriceForm.endDate=this.setPriceForm.date[1];
                    this.btnLoading=true;
                    this.groupHttp.post('/HotelProduct/BatchProductsPriceSetting',this.setPriceForm)
                    .then((res) => {
                        if(res.data.isSuccess){
                            this.$message({
                                type:'success',
                                message:'批量价格设置成功！'
                            });
                            this.dialogPriceSettingVisible=false;
                            this.queryData();
                        }else{
                            this.$message.error(res.data.message);
                        }
                        this.btnLoading=false;
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            })
                
            
        },
        
        //分页
        sizeChange(val) {
            this.pagination.size = val;
            this.pagination.currentPage = 1;
            this.searchForm.PageSize = val;
            this.searchForm.PageIndex = 1;
            this.queryData();
        },
        currentPageChange(val) {
            this.pagination.currentPage = val;
            this.searchForm.PageIndex = val;
            this.queryData();
        }
    }
};
</script>
<style scoped>
    .view-room{
        padding: 5px;
        border: 1px solid #e5e5e5;
        overflow: hidden;
        cursor: pointer;
    }
    .right-hotel{
        position: relative;
    }
    .hotel-operation{
        position: absolute;
        right: 0;
        bottom: 0;
        white-space: nowrap;
    }
    .main-img{
        width: 205px;
        height: 115px;
    }
    .el-icon-star-on {
        color: #e5e5e5;
    }
    .el-icon-star-on.active {
        color: #f0ae4e;
    }
    .p1 .title{
        font-size: 16px;
        color: #3bb4f2;
    }
    .p2{
        margin-top: 5px;
        color: #999;
    }
    .p2 .iconfont{
        color: #3bb4f2;
    }
    .ylt-notinfo {
        border-radius: 30px;
        background-color: #e9f8f3;
        color: #40dba1;
        padding: 2px 10px;
    }

    .ylt-notinfo1 {
        border-radius: 30px;
        background-color: #FFFAF4;
        color: #F37B1D;
        padding: 2px 10px;
    }
    .no-product{
        font-size: 18px;
        text-align: center;
        padding:15px;
    }

    .maintenance-group .el-checkbox{
        display: block;
    }
    .maintenance-group .el-row--flex{
        display: -ms-flexbox;
        display: flex;
        display: -webkit-box;
    }
    .el-checkbox+.el-checkbox{
        margin-left: 0!important;
    }
    .el-checkbox{
        margin-right:30px!important;
    }
    .week-box{
        font-size: 12px;
        line-height: normal;
    }
</style>
