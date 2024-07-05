import * as Popper from 'https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js'

// Client Send Message
const formSendData=document.querySelector(".chat .inner-form")
if(formSendData){
    formSendData.addEventListener("submit",(e)=>{
        e.preventDefault()
        const content=e.target.elements.content.value
        
        if(content){
            socket.emit("Client_Send_Message",(content))
            e.target.elements.content.value=""
        }
    })
}
// End Client Send Message

// Server Return Message
socket.on("Sever_Return_Message",(data)=>{
    const my_id=document.querySelector("[my-id]").getAttribute("my-id")
    const body=document.querySelector(".chat .inner-body")

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
    body.appendChild(div)

    body.scrollTop= body.scrollHeight

})
// End Server Return Message

//Scroll Chat//
const bodyChat=document.querySelector(".chat .inner-body")
if(bodyChat){
    bodyChat.scrollTop= bodyChat.scrollHeight
}
// End Scroll Chat//

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
    const inputChat = document.querySelector(".chat .inner-form input[name='content']")

    emojiPpicker.addEventListener("emoji-click",(event)=>{
        const icon = event.detail.unicode
    
        inputChat.value= inputChat.value + icon
    })
}
// End emoji-picker //