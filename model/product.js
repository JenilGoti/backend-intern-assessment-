const {
    Decimal128
} = require("mongodb");
const {
    Schema,
    default: mongoose,
    model
} = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
    },
    price: {
        type: Number,
        required: true,
        min: [0, "Price can't be nagative"]
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        type: mongoose.Types.Decimal128,
        required: true,
        min: [new Decimal128('0'), 'rating must be greatter then or equal to 0'],
        max: [new Decimal128('10'), 'rating must be less then or equal to 10']
    },
    company: {
        type: String,
        required: true,
        minLength: 3
    }
}, {
    timestamps: true
})

module.exports = model('Product', productSchema);