
class index{
    async index(req,res){
        //SocketIO//
        _io.on('connection', (socket) => {
            console.log('a user connected')
        })

        res.render('client/pages/chat/index'),{
            titlePage:"Chat"
        }
    }
}


module.exports= new index