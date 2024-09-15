const SettingsGeneral=require('../../models/setting-general')

class index{
    async general(req,res){
        const settingsGeneral = await SettingsGeneral.findOne({})

        
        res.render('admin/pages/settings/general',{
            title: "Cài đặt chung",
            settingsGeneral: settingsGeneral
        })
    }   

    async generalPatch(req,res){
        const settingsGeneral = await SettingsGeneral.findOne({})

        if(settingsGeneral){
            if(req.file){
                req.body.logo=`/uploads/${req.file.filename}`
            }
            await SettingsGeneral.updateOne({_id:settingsGeneral.id},req.body)
        }else{

            if(req.file){
                req.body.logo=`/uploads/${req.file.filename}`
            }
    
            const record= new SettingsGeneral(req.body)
            await record.save()
        }

        req.flash("success","Cập nhật thành công")
        res.redirect('back')
    }
}


module.exports= new index