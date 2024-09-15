const productCategory = require("../models/Products-category")

module.exports.getSubCategory = async (ParentId) =>{
    const getSubCategory = async (ParentId) =>{
        const subs = await productCategory.find({
            parent_id : ParentId,
            status: "active",
            deleted : false
        })
    
        let allSub = [...subs]
    
        for (const sub in subs){
            const childs = await getSubCategory(sub.id)
            allSub=allSub.concat(childs)
        }
    
        return allSub
    }

    const result = await getSubCategory(ParentId)

    return result
}