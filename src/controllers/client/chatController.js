const Chats=require("../../models/chat")
const Users=require("../../models/user")

class index{
    async index(req,res){
        const user_id=res.locals.user.id
        const fullName=res.locals.user.fullName

        //SocketIO//
        _io.once('connection', (socket) => {
            socket.on("Client_Send_Message",async (data)=>{
                const chat = new Chats({user_id:user_id,content:data.content,images:data.image})
                await chat.save()

                _io.emit("Sever_Return_Message",({
                    userId:user_id,
                    fullName: fullName,
                    content:data.content,
                    images:data.image
                }))
            })

            socket.on("Client_Send_Typing", (type)=>{
                socket.broadcast.emit("Server_Return_Typing",({
                    userId:user_id,
                    fullName: fullName,
                    type: type
                }))
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