// //{
// product_id: 2,
// name: name2,
// slogan: slogan2,
// description: description2,
// category: category2,
// default_price: price2
// styles: [
//    {
//     id: 1
//     productID: 2
//     name: namestyle1
//     sale_price: saleprice1
//     original_price: price1
//     default_style: style_1
//     skus: [
//        {
//         id:3
//         styleId: 1
//         size: m
//         qty: 100
//        },
//         ...

//        ]
//    },
//     ....
//    ]

// features: [
//      {
//       id:6
//       product_id: 2
//       feature_1
//       feature_2
//      }
//      ]
// related: [
//     related products:
//     ]

// }

const product = {
    main: async (params) => {

    },

    // create the intended relatedProduct object
    createRelatedObj: (csvObj) => {
        const arr = []
        arr.push(csvObj.relatedId)
        return {
            id: csvObj.productId,
            relatedProducts: arr
        }
    },

    // check if relatedProducts array of a relatedProduct object contains newID
    // returns accurate array to update relateProduct object
    addRelatedProduct: (arr, newID) => {
        const newArr = arr.slice()
        if (!arr.includes(newID)) {
            newArr.push(newID)
            return newArr;
        }
        return arr;
    },

    // given any array of objects, check if the input ID name exists in an object in the array of objects
    checkIfObjExist: (csvObj, typeArray, id) => {
        const checkArray = Object.values(typeArray)
        return checkArray.includes(csvObj[id]) ? true : false;
    },






}