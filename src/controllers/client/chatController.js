
class index{
    async index(req,res){
        res.render('client/pages/chat/index'),{
            titlePage:"Chat"
        }
    }
}


module.exports= new index