import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

/* Upload_Image_Chat */
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image',{
    multiple: true,
    maxFileCount: 6
});
/* End Upload_Image_Chat */

// Client Send Message
const formSendData=document.querySelector(".chat .inner-form")
if(formSendData){
    formSendData.addEventListener("submit",(e)=>{
        e.preventDefault()
        const content=e.target.elements.content.value
        const image =upload.cachedFileArray || []

        if(content || image.lengt > 0){
            socket.emit("Client_Send_Message",{content: content , image: image })
            e.target.elements.content.value=""
            upload.resetPreviewPanel()
            socket.emit("Client_Send_Typing","hidden")
        }
    })
}
// End Client Send Message

// Server Return Message
socket.on("Sever_Return_Message",(data)=>{
    const my_id=document.querySelector("[my-id]").getAttribute("my-id")
    const body=document.querySelector(".chat .inner-body")
    const boxTyping=document.querySelector(".inner-list-typing")

    const div=document.createElement("div")
    
    let htmlFullName=""

    if(my_id==data.userId){
        div.classList.add("inner-outgoing")

    }else{
        div.classList.add("inner-incoming")
        htmlFullName=`<div class="inner-name">${data.fullName}</div>`
    }
    div.innerHTML=`
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `
    body.insertBefore(div,boxTyping)

    body.scrollTop= body.scrollHeight

})
// End Server Return Message

//Scroll Chat//
const bodyChat=document.querySelector(".chat .inner-body")
if(bodyChat){
    bodyChat.scrollTop= bodyChat.scrollHeight
}
// End Scroll Chat//

// Show Typing//
var timeOut
const showTyping=() =>{
    socket.emit("Client_Send_Typing", "show")

        clearTimeout(timeOut)

        timeOut = setTimeout(()=>{
            socket.emit("Client_Send_Typing","hidden")
        },3000)
}

// End Show Typing//


// emoji-picker //
//Show icon
const buttonIcon=document.querySelector(".button-icon")
if(buttonIcon){
    const tooltip = document.querySelector(".tooltip")
    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')}
}

//Inser icon
const emojiPpicker = document.querySelector("emoji-picker")
if(emojiPpicker){

    var timeOut

    const inputChat = document.querySelector(".chat .inner-form input[name='content']")

    emojiPpicker.addEventListener("emoji-click",(event)=>{
        const icon = event.detail.unicode
        inputChat.value= inputChat.value + icon
        const end =inputChat.value.length
        inputChat.setSelectionRange(end,end)
        inputChat.focus()
        showTyping()
    })

    inputChat.addEventListener("keyup",()=>{
        showTyping()
    })
}
// End emoji-picker //

/* Server_Return_Typing */
const elementTyping=document.querySelector(".chat .inner-list-typing")
if(elementTyping){
    
    socket.on("Server_Return_Typing",(data)=>{
        if(data.type=="show"){

            const exitsTyping=elementTyping.querySelector(`[user_id="${data.userId}"]`)

            if(!exitsTyping){
                const boxTyping=document.createElement("div")
                boxTyping.classList.add("box-typing")
                boxTyping.setAttribute("user_id", data.userId)
        
                boxTyping.innerHTML=`
                    <div class="inner-name">${data.fullName}</div>
                    <div class="inner-dots">
                        <span> </span>
                        <span> </span>
                        <span> </span>
                    </div>
                `
                elementTyping.appendChild(boxTyping)
                bodyChat.scrollTop= bodyChat.scrollHeight
            }
        }else{
            const boxTypingRemove=elementTyping.querySelector(`[user_id="${data.userId}"]`)

            if(boxTypingRemove){
                elementTyping.removeChild(boxTypingRemove)
            }
        }
       
    })
}
/* End Server_Return_Typing */

