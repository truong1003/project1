const Chats=require("../../models/chat")
const Users=require("../../models/user")

class index{
    async index(req,res){
        const user_id=res.locals.user.id

        //SocketIO//
        _io.once('connection', (socket) => {
            socket.on("Client_Send_Message",async (content)=>{
                const chat = new Chats({user_id:user_id,content:content})
                await chat.save()
            })
        })
        //End SocketIO//
        
        const chats = await Chats.find({deleted:false})

        for (const chat of chats) {
            const infoUser= await Users.findOne({_id:chat.user_id}).select('id fullName')

            chat.infoUser=infoUser
        } 

        res.render('client/pages/chat/index',{
            titlePage:"Chat",
            chats : chats
        })
    }
}


module.exports= new index