const moment = require("moment/moment");
const asyncHandler = require("../middlewares/asyncHandler");
const Sale = require("../models/saleModel");


const createSale = asyncHandler(async (req, res) => {
    await Sale.create(req.body);
    res.status(200).json({message: "sale created successfully."});
})

const getTotalSalesAmount = asyncHandler(async (req, res) => {
    if(new Date(req.query.startDate).toString()==="Invalid Date" || new Date(req.query.endDate).toString()==="Invalid Date"){
        throw new Error("Invalid date !");
    } 
    const sale = await Sale.aggregate([
    {
        $match: {
            createdAt: { 
                $gte: new Date(req.query.startDate), 
                $lte: new Date(req.query.endDate)
            }
        }
    },
        
    {$lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product"
    }},
    {
        $group: {
            _id: null,
            total: { $sum: {$first: "$product.price"}}
        }
    }
    ])
    res.status(200).json({totalSalesAmount: sale[0]?.total});
})

const getSalesCountAndRevenue = asyncHandler(async (req, res) => {
    const totalSalesCountAndRevenue = await Sale.aggregate([{$lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product"
    }},
    {
        $group: {
            _id: "$productId",
            total: { $sum: {$first : "$product.price"} },
            count: { $sum: 1 },
            product: { $first: {$first: "$product"}}
        }
    },
    ])

    res.status(200).json({totalSalesCountAndRevenue});
})

const getMonthlySalesTrend = asyncHandler(async (req, res) => {
    let monthlyData = await Sale.aggregate([
    {
        $match: {
            createdAt: {
                $gte: moment().startOf('year').toDate(),
                $lte: moment().endOf('year').toDate()
            }
        }
    },
    {$lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product"
    }},
    {
        $group: {
            _id:  { $month: "$createdAt" },
            totalSales: { $sum: {$first : "$product.price"} },
        }
    }
    ]);

    monthlyData = monthlyData.map(data=>{
        data.month = moment().month(data._id-1).format('MMM');
        delete data._id;
        return data;
    })

    res.status(200).json({monthlyData});
})

const getTopCustomersBySaleVolume = asyncHandler(async (req, res) => {
    const topCustomers = await Sale.aggregate([{$lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product"
    }},
    {
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        }
    },
    {
        $group: {
            _id: "$userId",
            total: { $sum: {$first: "$product.price"} },
            user: {$first: {$first : "$user"}}
        }
    },
    {
        $sort: { total: -1 },
    },      
    ])

    res.status(200).json({topCustomers});
})

const getAOV = asyncHandler(async (req, res) => {
    const AOVData = await Sale.aggregate([{$lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "product"
    }},
    {
        $group: {
            _id: null,
            AOV: { $avg: {$first: "$product.price"} },
        }
    },
    {
        $project: {
            _id: 0,
            AOV: 1
        }
    }
    ])

    res.status(200).json({AOV: Math.round(AOVData[0]?.AOV)});
})



module.exports = {createSale, getTotalSalesAmount, getSalesCountAndRevenue, getTopCustomersBySaleVolume, getAOV, getMonthlySalesTrend};